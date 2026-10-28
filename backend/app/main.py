from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import health, auth
from app.core.config import settings
from app.core.db import engine, Base

# Attempt table creation safely on boot
def init_db():
    try:
        Base.metadata.create_all(bind=engine)
    except Exception as e:
        print(f"Notice: Database connection not ready on startup ({e}). Continuing...")

init_db()

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("Insurance Operation Agent starting...")
    yield
    print("Insurance Operation Agent shutting down...")

app = FastAPI(
    title="Insurance Operation Agent",
    description="Agentic Insurance Workflow Operating Layer",
    version="0.1.0",
    lifespan=lifespan
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routes
app.include_router(health.router, prefix="/api/v1", tags=["health"])
app.include_router(health.router, tags=["health-root"])
app.include_router(auth.router, prefix="/api/v1/auth", tags=["auth"])

@app.get("/")
async def root():
    return {"message": "Insurance Operation Agent API"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
