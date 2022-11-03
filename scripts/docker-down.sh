. ./.env

echo "Deleting previous docker container and volumes"
docker-compose -f docker-compose.yml -f ./docker-compose/docker-compose.${ENVIRONMENT}.yml down -v

echo "Deleting previous docker image"
docker rmi bta-api-${ENVIRONMENT}:1.0.0
