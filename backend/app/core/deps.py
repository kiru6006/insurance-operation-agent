from fastapi import Depends, HTTPException, Header
from sqlalchemy.orm import Session
from uuid import UUID
from app.core.db import get_db
from app.core.security import decode_access_token

async def get_current_user(authorization: str = Header(None)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing token")
    
    token = authorization.replace("Bearer ", "")
    payload = decode_access_token(token)
    
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    def safe_uuid(val):
        if not val:
            return None
        try:
            return UUID(str(val))
        except (ValueError, TypeError, AttributeError):
            return str(val)

    return {
        "user_id": safe_uuid(payload.get("sub")),
        "tenant_id": safe_uuid(payload.get("tenant_id"))
    }

async def get_current_tenant(current_user = Depends(get_current_user)):
    return current_user["tenant_id"]
