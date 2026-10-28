from uuid import UUID
from typing import Optional
from sqlalchemy.orm import Session
from app.models import User
from app.repositories.base import BaseRepository
from app.core.security import hash_password

class UserRepository(BaseRepository):
    def __init__(self, db: Session):
        super().__init__(User, db)
    
    def get_by_username(self, tenant_id: UUID, username: str) -> Optional[User]:
        return self.db.query(User)\
            .filter(User.tenant_id == tenant_id, User.username == username)\
            .first()
    
    def create_user(self, tenant_id: UUID, username: str, email: str, 
                   password: str, role: str = "user") -> User:
        user = User(
            tenant_id=tenant_id,
            username=username,
            email=email,
            hashed_password=hash_password(password),
            role=role,
            is_active=True
        )
        self.db.add(user)
        self.db.commit()
        self.db.refresh(user)
        return user
