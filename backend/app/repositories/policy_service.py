from uuid import UUID
from datetime import datetime
from typing import List, Optional
from sqlalchemy.orm import Session
from sqlalchemy import desc
from app.models import PolicyServiceRequest
from app.repositories.base import BaseRepository

class PolicyServiceRepository(BaseRepository):
    def __init__(self, db: Session):
        super().__init__(PolicyServiceRequest, db)

    def create_request(
        self,
        tenant_id: UUID,
        policy_id: str,
        request_type: str,
        customer_id: str = "CUST-001",
        description: Optional[str] = None,
        requested_changes: Optional[str] = None,
        status: str = "pending"
    ) -> PolicyServiceRequest:
        return self.create(
            tenant_id=tenant_id,
            policy_id=policy_id,
            customer_id=customer_id,
            request_type=request_type,
            description=description,
            requested_changes=requested_changes,
            status=status
        )

    def list_requests(
        self,
        tenant_id: UUID,
        status: Optional[str] = None,
        limit: int = 50,
        offset: int = 0
    ) -> List[PolicyServiceRequest]:
        query = self.db.query(PolicyServiceRequest).filter(PolicyServiceRequest.tenant_id == tenant_id)
        if status:
            query = query.filter(PolicyServiceRequest.status == status)
        return query.order_by(desc(PolicyServiceRequest.created_at)).limit(limit).offset(offset).all()
