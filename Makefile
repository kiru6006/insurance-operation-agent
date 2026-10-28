.PHONY: help up down logs build test-backend test-frontend migrate

help:
	@echo "Available commands:"
	@echo "  make up            - Start all docker containers"
	@echo "  make down          - Stop all docker containers"
	@echo "  make logs          - Tail docker logs"
	@echo "  make build         - Build docker images"
	@echo "  make test-backend  - Run pytest in backend"
	@echo "  make test-frontend - Run frontend build/tests"
	@echo "  make migrate       - Run alembic migrations"

up:
	docker compose up -d

down:
	docker compose down

logs:
	docker compose logs -f

build:
	docker compose build

test-backend:
	cd backend && pytest tests/ -v

test-frontend:
	cd frontend && npm run build

migrate:
	cd backend && alembic upgrade head
