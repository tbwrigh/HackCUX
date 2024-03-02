from fastapi import FastAPI, Request, Body, HTTPException, status, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBasic, HTTPBasicCredentials

from pymemcache.client import base

from dotenv import load_dotenv
from os import getenv

import random

from .db import DB
from .models.user import User
from .models.whiteboard import Whiteboard
from .models.whiteboard_object import WhiteboardObject

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

@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.post("/signup")
def sign_up(username: str = Body(...), email: str = Body(...), password: str = Body(...)):
    with app.state.db.session() as session:
        user = session.query(User).filter(User.username == username).first()
        if user:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Username already exists",
            )
        new_user = User(username=username, email=email, password=password)
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
        whiteboards = session.query(Whiteboard).filter(Whiteboard.user_id == user.id).all()
        return whiteboards

@app.post("/new_whiteboard/{name}")
def create_whiteboard(name: str, user: dict = Depends(get_authenticated_user_from_session_id)):
    with app.state.db.session() as session:
        whiteboard = Whiteboard(name=name, user_id=user.id)
        session.add(whiteboard)
        session.commit()

    return {"message": "Whiteboard created successfully"}

@app.delete("/delete_whiteboard/{whiteboard_id}")
def delete_whiteboard(whiteboard_id: int, user: dict = Depends(get_authenticated_user_from_session_id)):
    with app.state.db.session() as session:
        whiteboard = session.query(Whiteboard).filter(Whiteboard.id == whiteboard_id).first()
        if whiteboard is None or whiteboard.user_id != user.id:
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
        if whiteboard is None or whiteboard.user_id != user.id:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Whiteboard not found",
            )
        whiteboard_objects = session.query(WhiteboardObject).filter(WhiteboardObject.whiteboard_id == whiteboard_id).all()
        return whiteboard_objects
    
@app.post("/new_whiteboard_object/{whiteboard_id}")
def create_whiteboard_object(whiteboard_id: int, data: dict = Body(...), user: dict = Depends(get_authenticated_user_from_session_id)):
    with app.state.db.session() as session:
        whiteboard = session.query(Whiteboard).filter(Whiteboard.id == whiteboard_id).first()
        if whiteboard is None or whiteboard.user_id != user.id:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Whiteboard not found",
            )
        whiteboard_object = WhiteboardObject(whiteboard_id=whiteboard_id, creator_id=user.id, data=data)
        session.add(whiteboard_object)
        session.commit()

    return {"message": "Whiteboard object created successfully"}

@app.delete("/delete_whiteboard_object/{whiteboard_id}/{object_id}")
def delete_whiteboard_object(whiteboard_id: int, object_id: int, user: dict = Depends(get_authenticated_user_from_session_id)):
    with app.state.db.session() as session:
        whiteboard = session.query(Whiteboard).filter(Whiteboard.id == whiteboard_id).first()
        if whiteboard is None or whiteboard.user_id != user.id:
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
        session.delete(whiteboard_object)
        session.commit()

    return {"message": "Whiteboard object deleted successfully"}
