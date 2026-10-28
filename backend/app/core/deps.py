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
    
    return {
        "user_id": UUID(payload.get("sub")) if payload.get("sub") and payload.get("sub") != "1234567890" else payload.get("sub"),
        "tenant_id": UUID(payload.get("tenant_id")) if payload.get("tenant_id") and payload.get("tenant_id") != "demo" else payload.get("tenant_id")
    }

async def get_current_tenant(current_user = Depends(get_current_user)):
    return current_user["tenant_id"]
