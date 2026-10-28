from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from uuid import UUID

from app.core.db import get_db
from app.core.deps import get_current_tenant
from app.schemas.auth import LoginRequest, TokenResponse
from app.services.auth import AuthService

router = APIRouter()

@router.post("/login", response_model=TokenResponse)
async def login(request: LoginRequest, db: Session = Depends(get_db)):
    # For demo: accept demo/demo credentials
    # Production: validate against database
    if request.username == "demo" and request.password == "demo":
        from app.core.security import create_access_token
        access_token = create_access_token(
            data={"sub": "1234567890", "tenant_id": "demo"}
        )
        return TokenResponse(access_token=access_token)
    raise HTTPException(status_code=401, detail="Invalid credentials")

@router.post("/logout")
async def logout(current_user = Depends(get_current_tenant)):
    return {"message": "Logged out successfully"}
