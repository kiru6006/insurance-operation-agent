from uuid import UUID
from typing import List, Optional
from sqlalchemy.orm import Session
from app.models import SubmissionDocument
from app.repositories.base import BaseRepository

class SubmissionDocumentRepository(BaseRepository):
    def __init__(self, db: Session):
        super().__init__(SubmissionDocument, db)

    def add_document(self, submission_id: UUID, file_name: str,
                     file_path: str, document_type: str) -> SubmissionDocument:
        doc = SubmissionDocument(
            submission_id=submission_id,
            file_name=file_name,
            file_path=file_path,
            document_type=document_type
        )
        self.db.add(doc)
        self.db.commit()
        self.db.refresh(doc)
        return doc

    def list_by_submission(self, submission_id: UUID) -> List[SubmissionDocument]:
        return self.db.query(SubmissionDocument).filter(
            SubmissionDocument.submission_id == submission_id
        ).all()
