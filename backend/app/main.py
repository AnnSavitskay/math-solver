from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import engine
from app.models.history import Base
from app.api.matrix import router

app = FastAPI()

app.include_router(router)

Base.metadata.create_all(bind=engine)

@app.get("/")
def home():
    return {"message": "Math Solver API"}
