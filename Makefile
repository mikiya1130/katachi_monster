build:
	docker compose -f docker-compose.yml -f docker-compose.develop.yml build

up:
	docker compose -f docker-compose.yml -f docker-compose.develop.yml up -d

upb:
	docker compose -f docker-compose.yml -f docker-compose.develop.yml up -d --build

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

logs:
	docker compose logs

front:
	docker compose exec frontend bash

front-lint:
	docker compose exec frontend yarn lint

front-format:
	docker compose exec frontend yarn format

back:
	docker compose exec backend bash

back-lint:
	docker compose exec backend bash lint.sh

back-format:
	docker compose exec backend bash format.sh
