from uuid import UUID
from typing import Any, List, Optional
from sqlalchemy.orm import Session
from sqlalchemy import desc

class BaseRepository:
    def __init__(self, model, db: Session):
        self.model = model
        self.db = db
    
    def create(self, **kwargs) -> Any:
        obj = self.model(**kwargs)
        self.db.add(obj)
        self.db.commit()
        self.db.refresh(obj)
        return obj
    
    def get_by_id(self, id: UUID) -> Optional[Any]:
        return self.db.query(self.model).filter(self.model.id == id).first()
    
    def list_by_tenant(self, tenant_id: UUID, limit: int = 100, offset: int = 0) -> List[Any]:
        return self.db.query(self.model)\
            .filter(self.model.tenant_id == tenant_id)\
            .order_by(desc(self.model.created_at))\
            .limit(limit)\
            .offset(offset)\
            .all()
    
    def update(self, id: UUID, **kwargs) -> Optional[Any]:
        self.db.query(self.model).filter(self.model.id == id).update(kwargs)
        self.db.commit()
        return self.get_by_id(id)
    
    def delete(self, id: UUID) -> None:
        self.db.query(self.model).filter(self.model.id == id).delete()
        self.db.commit()
