from uuid import UUID
from datetime import timedelta
from sqlalchemy.orm import Session
from app.repositories.user import UserRepository
from app.core.security import verify_password, create_access_token
from app.schemas.auth import LoginRequest, TokenResponse
from fastapi import HTTPException

class AuthService:
    def __init__(self, db: Session):
        self.user_repo = UserRepository(db)
    
    async def login(self, tenant_id: UUID, request: LoginRequest) -> TokenResponse:
        user = self.user_repo.get_by_username(tenant_id, request.username)
        if not user or not verify_password(request.password, user.hashed_password):
            raise HTTPException(status_code=401, detail="Invalid credentials")
        
        access_token = create_access_token(
            data={"sub": str(user.id), "tenant_id": str(tenant_id)},
            expires_delta=timedelta(hours=24)
        )
        return TokenResponse(access_token=access_token)
