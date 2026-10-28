.PHONY: help install test build-frontend dev-backend dev-frontend run-local clean

help:
	@grep -E '^[a-zA-Z_-]+:' Makefile | sed 's/:.*//' | column

install:
	cd backend && python3.11 -m venv venv && venv/bin/pip install -r requirements.txt
	cd frontend && npm install

test:
	cd backend && PYTHONPATH=. venv/bin/pytest tests/ -v

build-frontend:
	cd frontend && npm run build

dev-backend:
	cd backend && PYTHONPATH=. venv/bin/uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload

dev-frontend:
	cd frontend && npm run dev -- --host 127.0.0.1 --port 6006

run-local:
	@echo "Starting InsureOps AI Backend & Frontend locally..."
	@echo "Backend will run at http://localhost:8000"
	@echo "Frontend will run at http://localhost:6006"
	(trap 'kill 0' SIGINT; make dev-backend & make dev-frontend)

clean:
	find . -type d -name __pycache__ -exec rm -rf {} +
	find . -type f -name "*.pyc" -delete
	rm -rf backend/.pytest_cache frontend/dist
