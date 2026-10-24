.PHONY: help up down restart logs dev build clean db-shell

help:
	@echo "Available commands:"
	@echo "  make up         - Start all production containers in background"
	@echo "  make down       - Stop all containers"
	@echo "  make restart    - Restart all containers"
	@echo "  make logs       - Tail logs from all containers"
	@echo "  make dev        - Start development environment with hot-reloading"
	@echo "  make build      - Build or rebuild Docker images"
	@echo "  make clean      - Remove containers, networks, and unused volumes"
	@echo "  make db-shell   - Connect to PostgreSQL shell inside container"

up:
	docker compose up -d

down:
	docker compose down

restart:
	docker compose down && docker compose up -d

logs:
	docker compose logs -f

dev:
	docker compose -f docker-compose.yml -f docker-compose.dev.yml up --build

build:
	docker compose build

clean:
	docker compose down -v --remove-orphans

db-shell:
	docker compose exec postgres psql -U postgres -d matching_team_db
