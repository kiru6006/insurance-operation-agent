.PHONY: help install up down logs test lint migrate clean seed dev dev-backend dev-frontend

help:
	@grep -E '^[a-zA-Z_-]+:' Makefile | sed 's/:.*//' | column

install:
	cd backend && pip install -r requirements.txt
	cd frontend && npm install

up:
	docker compose up -d
	sleep 5
	@echo "✓ Services running"
	@echo "Backend: http://localhost:8000/docs"
	@echo "Frontend: http://localhost:5173"

down:
	docker compose down

logs:
	docker compose logs -f

test:
	cd backend && pytest tests/ -v --tb=short

lint:
	cd backend && pylint app/ --exit-zero
	cd backend && mypy app/ --ignore-missing-imports

migrate:
	cd backend && alembic upgrade head

seed:
	cd backend && python scripts/seed_db.py

dev-backend:
	cd backend && uvicorn app.main:app --reload

dev-frontend:
	cd frontend && npm run dev

clean:
	find . -type d -name __pycache__ -exec rm -rf {} +
	find . -type f -name "*.pyc" -delete
	rm -rf backend/.pytest_cache frontend/dist
