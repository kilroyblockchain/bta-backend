#!/bin/sh

. ./.env
echo "Build new docker image"
docker compose -f docker-compose.yml -f ./docker-compose/docker-compose.${ENVIRONMENT}.yml build --no-cache
