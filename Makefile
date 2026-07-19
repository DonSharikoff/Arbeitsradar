include .env

SHELL := /bin/bash

up:
	@docker compose -f ${DOCKER_CONFIG} up -d

down: # stop and destroy containers
	@docker compose -f ${DOCKER_CONFIG} down

down-volume: #  WARNING: stop and destroy containers with volumes
	@docker compose -f ${DOCKER_CONFIG} down -v

start: # start already created containers
	@docker compose -f ${DOCKER_CONFIG} start

stop: # stop containers, but not destroy
	@docker compose -f ${DOCKER_CONFIG} stop

ps: # show started containers and their status
	@docker compose -f ${DOCKER_CONFIG} ps

build: # build all dockerfile, if not built yet
	@docker compose -f ${DOCKER_CONFIG} build

connect_back:
	@docker compose -f ${DOCKER_CONFIG} exec -w /www back sh


connect_nginx:
	@docker compose -f ${DOCKER_CONFIG} exec -w /www nginx sh
