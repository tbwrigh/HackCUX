from fastapi import FastAPI, Request, Body, HTTPException, status, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBasic, HTTPBasicCredentials

from pymemcache.client import base
from qdrant_client import QdrantClient
from qdrant_client.http import models

import cohere

from dotenv import load_dotenv
from os import getenv

import asyncio
import random

from db import DB
from models.user import User
from models.whiteboard import Whiteboard
from models.whiteboard_object import WhiteboardObject
from models.vector import Vector

load_dotenv()

app = FastAPI()

security = HTTPBasic()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def startup_event():
    app.state.db = DB()
    app.state.cache = base.Client((getenv("MEMCACHE_HOST"), int(getenv("MEMCACHE_PORT"))))
    app.state.session_count = 1
    app.state.qdrant = QdrantClient(host=getenv("QDRANT_HOST"), port=int(getenv("QDRANT_PORT")), prefer_grpc=True)
    app.state.cohere = cohere.Client(getenv("COHERE_API_KEY"))


@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.post("/signup")
def sign_up(username: str = Body(...), password: str = Body(...)):
    with app.state.db.session() as session:
        user = session.query(User).filter(User.username == username).first()
        if user:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Username already exists",
            )
        new_user = User(username=username, password=password)
        session.add(new_user)
        session.commit()

    return {"message": "User registered successfully"}

def authenticate_user(credentials: HTTPBasicCredentials = Depends(security)):
    with app.state.db.session() as session:
        user = session.query(User).filter(User.username == credentials.username).first()
        if user is None or user.password != credentials.password:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid credentials",
                headers={"WWW-Authenticate": "Basic"},
            )
        return user

def create_session(user_id: int):
    session_id = random.randint(100000000 * app.state.session_count, 100000000 * (app.state.session_count + 1)-1)
    app.state.session_count += 1
    app.state.cache.set(f"session-{session_id}", user_id)
    return session_id

@app.post("/login")
def login(user: User = Depends(authenticate_user)):
    session_id = create_session(user.id)
    return {"message": "Logged in successfully", "session_id": session_id}

def get_authenticated_user_from_session_id(request: Request):
    session_id = request.cookies.get("session_id")
    if session_id is None or app.state.cache.get(f"session-{session_id}") is None:
        raise HTTPException(
            status_code=401,
            detail="Invalid session ID",
        )
    # Get the user from the session
    user = get_user_from_session(int(session_id))
    return user

# Use the valid session id to get the corresponding user from the users dictionary
def get_user_from_session(session_id: int):
    user_id = app.state.cache.get(f"session-{session_id}")
    if user_id is None:
        return None
    user_id = int(user_id)
    with app.state.db.session() as session:
        user = session.query(User).filter(User.id == user_id).first()
        return user

@app.post("/logout")
def logout(request: Request):
    session_id = request.cookies.get("session_id")
    if session_id is None:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authenticated")
    app.state.cache.delete(f"session-{session_id}")
    return {"message": "Logged out successfully"}

@app.get("/whiteboards/")
def read_whiteboards(user: dict = Depends(get_authenticated_user_from_session_id)):
    with app.state.db.session() as session:
        whiteboards = session.query(Whiteboard).filter(Whiteboard.owner_id == user.id).all()
        return whiteboards

@app.post("/new_whiteboard/{name}")
def create_whiteboard(name: str, user: dict = Depends(get_authenticated_user_from_session_id)):
    with app.state.db.session() as session:
        whiteboard = Whiteboard(name=name, owner_id=user.id)
        session.add(whiteboard)
        session.commit()

        app.state.qdrant.create_collection(
            collection_name=f"{whiteboard.name}-{whiteboard.id}",
            vectors_config=models.VectorParams(
                size=1024,
                distance=models.Distance.EUCLID,
            )
        )

        return {"id": whiteboard.id}

@app.put("/update_whiteboard/{whiteboard_id}/{name}")
def update_whiteboard(whiteboard_id: int, name: str, user: dict = Depends(get_authenticated_user_from_session_id)):
    with app.state.db.session() as session:
        whiteboard = session.query(Whiteboard).filter(Whiteboard.id == whiteboard_id).first()
        if whiteboard is None or whiteboard.owner_id != user.id:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Whiteboard not found",
            )
        
        if whiteboard.name == name:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="New name is the same as the current name",
            )

        app.state.qdrant.create_collection(
            collection_name=f"{name}-{whiteboard.id}",
            vectors_config=models.VectorParams(
                size=1024,
                distance=models.Distance.EUCLID,
            ),
            init_from=models.InitFrom(collection=f"{whiteboard.name}-{whiteboard.id}")
        )

        app.state.qdrant.delete_collection(f"{whiteboard.name}-{whiteboard.id}")

        whiteboard.name = name
        session.commit()

    return {"message": "Whiteboard updated successfully"}

@app.delete("/delete_whiteboard/{whiteboard_id}")
def delete_whiteboard(whiteboard_id: int, user: dict = Depends(get_authenticated_user_from_session_id)):
    with app.state.db.session() as session:
        whiteboard = session.query(Whiteboard).filter(Whiteboard.id == whiteboard_id).first()

        app.state.qdrant.delete_collection(f"{whiteboard.name}-{whiteboard.id}")

        if whiteboard is None or whiteboard.owner_id != user.id:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Whiteboard not found",
            )

        session.delete(whiteboard)
        session.commit()

    return {"message": "Whiteboard deleted successfully"}

@app.get("/whiteboard_objects/{whiteboard_id}")
def read_whiteboard_objects(whiteboard_id: int, user: dict = Depends(get_authenticated_user_from_session_id)):
    with app.state.db.session() as session:
        whiteboard = session.query(Whiteboard).filter(Whiteboard.id == whiteboard_id).first()
        if whiteboard is None or whiteboard.owner_id != user.id:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Whiteboard not found",
            )
        whiteboard_objects = session.query(WhiteboardObject).filter(WhiteboardObject.whiteboard_id == whiteboard_id).all()
        return whiteboard_objects

def get_embeddings(text: str):
    resp = app.state.cohere.tokenize(text)
    tokens = resp.token_strings
    
    chunks = ["".join(tokens[i:min(i + 512, len(tokens))]) for i in range(0, len(tokens), 512)]
    embed_pairs = []
    if len(chunks) > 90:
        for i in range(0, len(chunks), 90):
            embedding = app.state.cohere.embed(texts=chunks[i:min(i+90, len(chunks))],model="embed-english-v3.0",input_type="search_document")
            for vector, text in zip(embedding.embeddings, chunks[i:min(i+90, len(chunks))]):
                embed_pairs.append((vector, text))
    else:
        embedding = app.state.cohere.embed(texts=chunks,model="embed-english-v3.0",input_type="search_document")
        for vector, text in zip(embedding.embeddings, chunks):
                embed_pairs.append((vector, text))

    return embed_pairs

async def create_vectors(wbname, wbid, wboid, text):
    embeddings = get_embeddings(text)
    points = []
    with app.state.db.session() as session:
        for embedding in embeddings:
            vector = Vector(whiteboard_object_id=wboid)
            session.add(vector)
            session.flush()
            points.append(
                models.PointStruct(
                    id=vector.id,
                    vector=embedding[0],
                    payload={"text": embedding[1]}
                )
            )
        session.commit()
    app.state.qdrant.upsert(
        collection_name=f"{wbname}-{wbid}",
        points=points
    )


@app.post("/new_whiteboard_object/{whiteboard_id}")
async def create_whiteboard_object(whiteboard_id: int, data: dict = Body(...), user: dict = Depends(get_authenticated_user_from_session_id)):
    data = data["data"]
    with app.state.db.session() as session:
        whiteboard = session.query(Whiteboard).filter(Whiteboard.id == whiteboard_id).first()
        if whiteboard is None or whiteboard.owner_id != user.id:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Whiteboard not found",
            )
        whiteboard_object = WhiteboardObject(whiteboard_id=whiteboard_id, creator_id=user.id, data=data)
        session.add(whiteboard_object)
        session.commit()

        if "customData" in data and data["customData"] != "":
            task = asyncio.create_task(create_vectors(whiteboard.name, whiteboard.id, whiteboard_object.id, data["customData"]))

        return {"id": whiteboard_object.id}

async def remove_vectors(wbname, wbid, ids):
    app.state.qdrant.delete(
        collection_name=f"{wbname}-{wbid}",
        points_selector=models.PointIdsList(
            points=ids,
        ),
    )

@app.put("/update_whiteboard_object/{whiteboard_id}/{object_id}")
async def update_whiteboard_object(whiteboard_id: int, object_id: int, data: dict = Body(...), user: dict = Depends(get_authenticated_user_from_session_id)):
    data = data["data"]

    print(data)

    with app.state.db.session() as session:
        whiteboard = session.query(Whiteboard).filter(Whiteboard.id == whiteboard_id).first()
        if whiteboard is None or whiteboard.owner_id != user.id:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Whiteboard not found",
            )
        whiteboard_object = session.query(WhiteboardObject).filter(WhiteboardObject.id == object_id).first()
        if whiteboard_object is None or whiteboard_object.whiteboard_id != whiteboard_id:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Whiteboard object not found",
            )
        whiteboard_object.data = data
        session.commit()

        vectors = session.query(Vector).filter(Vector.whiteboard_object_id == object_id).all()
        ids = [vector.id for vector in vectors]
        if len(ids) > 0:
            task = asyncio.create_task(remove_vectors(whiteboard.name, whiteboard.id, ids))

        if "customData" in data and data["customData"] != "":
            task = asyncio.create_task(create_vectors(whiteboard.name, whiteboard.id, whiteboard_object.id, data["customData"]))
        
    return {"message": "Whiteboard object updated successfully"}

@app.delete("/delete_whiteboard_object/{whiteboard_id}/{object_id}")
def delete_whiteboard_object(whiteboard_id: int, object_id: int, user: dict = Depends(get_authenticated_user_from_session_id)):

    with app.state.db.session() as session:
        whiteboard = session.query(Whiteboard).filter(Whiteboard.id == whiteboard_id).first()
        if whiteboard is None or whiteboard.owner_id != user.id:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Whiteboard not found",
            )
        whiteboard_object = session.query(WhiteboardObject).filter(WhiteboardObject.id == object_id).first()
        if whiteboard_object is None or whiteboard_object.whiteboard_id != whiteboard_id:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Whiteboard object not found",
            )
        
        vectors = session.query(Vector).filter(Vector.whiteboard_object_id == object_id).all()
        ids = [vector.id for vector in vectors]
        if len(ids) > 0:
            task = asyncio.create_task(remove_vectors(whiteboard.name, whiteboard.id, ids))

        session.delete(whiteboard_object)
        session.commit()
    
    return {"message": "Whiteboard object deleted successfully"}

@app.post("/search/{whiteboard_id}")
def search(whiteboard_id: int, data: dict = Body(...), user: dict = Depends(get_authenticated_user_from_session_id)):
    if "query" not in data:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Query not found",
        )
    query = data["query"]
    with app.state.db.session() as session:
        whiteboard = session.query(Whiteboard).filter(Whiteboard.id == whiteboard_id).first()
        if whiteboard is None or whiteboard.owner_id != user.id:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Whiteboard not found",
            )
        
        embeddings = get_embeddings(query)
        
        vectors = []

        for embedding in embeddings:
            vectors += app.state.qdrant.search(
                collection_name=f"{whiteboard.name}-{whiteboard.id}",
                query_vector=embedding[0],
                limit=10
            )
    
        return vectors
    

@app.post("/chat/{whiteboard_id}")
def chat_recieve_message(whiteboard_id: int, data: dict = Body(...), user: dict = Depends(get_authenticated_user_from_session_id)):
    if "text" not in data:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Text not found",
        )
    
    with app.state.db.session() as session:
        whiteboard = session.query(Whiteboard).filter(Whiteboard.id == whiteboard_id).first()
        if whiteboard is None or whiteboard.owner_id != user.id:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Whiteboard not found",
            )

        embeddings = get_embeddings(data["text"])
        vectors = []

        for embedding in embeddings:
            vectors += app.state.qdrant.search(
                collection_name=f"{whiteboard.name}-{whiteboard.id}",
                query_vector=embedding[0],
                limit=2
            )
        
        vectors = sorted(vectors, key=lambda x: x.score, reverse=True)

        vectors = vectors[:3]

        documents = [{"type": "document", "text": vector.payload["text"]} for vector in vectors]

        if "message_history" in data:
            documents += [{"type": "message", "text": message} for message in data["message_history"]]

        resp = app.state.cohere.chat(
            model="command",
            message=data["text"],
            documents=documents
        )

        return {"response": resp.text}
    
@app.post("/global_search")
def execute_global_search(data: dict = Body(...), user: dict = Depends(get_authenticated_user_from_session_id)):
    if "query" not in data:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Query not found",
        )
    query = data["query"]
    with app.state.db.session() as session:
        whiteboards = session.query(Whiteboard).filter(Whiteboard.owner_id == user.id).all()
        pairs = []
        embeddings = get_embeddings(query)
        for whiteboard in whiteboards:
            wb_score_min = 999999
            for embedding in embeddings:
                results = app.state.qdrant.search(
                    collection_name=f"{whiteboard.name}-{whiteboard.id}",
                    query_vector=embedding[0],
                    limit=10
                )
                print(results)
                if len(results) == 0:
                    continue
                min_score = min(results, key=lambda x: x.score).score
                if min_score < wb_score_min:
                    wb_score_min = min_score
                
            pairs.append({whiteboard.id: wb_score_min})
      
        pairs = sorted(pairs, key=lambda x: list(x.values())[0])

        return pairs
