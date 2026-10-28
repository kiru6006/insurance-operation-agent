import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from fastapi.testclient import TestClient

from app.core.db import Base
from app.models import Tenant, User
from app.core.security import hash_password
from app.main import app

SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"

engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base.metadata.create_all(bind=engine)

@pytest.fixture
def db():
    connection = engine.connect()
    transaction = connection.begin()
    session = TestingSessionLocal(bind=connection)
    
    # Create test tenant
    tenant = Tenant(name="test-tenant")
    session.add(tenant)
    session.commit()
    session.refresh(tenant)
    
    # Create test user
    user = User(
        tenant_id=tenant.id,
        username="testuser",
        email="test@test.com",
        hashed_password=hash_password("testpass"),
        role="admin",
        is_active=True
    )
    session.add(user)
    session.commit()
    
    yield session
    
    session.close()
    transaction.rollback()
    connection.close()

@pytest.fixture
def client(db):
    def override_get_db():
        yield db
    
    from app.core.db import get_db
    app.dependency_overrides[get_db] = override_get_db
    
    yield TestClient(app)
    app.dependency_overrides.clear()
