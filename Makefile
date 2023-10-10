build:
	docker compose build

up:
	docker compose up -d

upb:
	docker compose up -d --build

upb-prod:
	docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build

down:
	docker compose down

start:
	docker compose start

stop:
	docker compose stop

ps:
	docker compose ps

front:
	docker compose exec frontend bash

back:
	docker compose exec backend bash
