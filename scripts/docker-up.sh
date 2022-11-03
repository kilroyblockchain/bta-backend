. ./.env

echo "Spinning new docker container and volumes"
docker compose -f docker-compose.yml -f ./docker-compose/docker-compose.${ENVIRONMENT}.yml up -d
