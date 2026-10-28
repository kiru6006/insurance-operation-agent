from fastapi import APIRouter

router = APIRouter()

@router.get("/health", tags=["health"])
async def health_check():
    return {
        "status": "healthy",
        "service": "Insurance Operation Agent",
        "version": "0.1.0"
    }
