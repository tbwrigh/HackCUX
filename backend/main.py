from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from dotenv import load_dotenv

from .db import DB

load_dotenv()

app = FastAPI()

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


@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.get("/whiteboards/")
def read_whiteboards():
    return [{"id": 1, "name": "test", "user_id": 1}]
    