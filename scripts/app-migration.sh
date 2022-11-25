#!/bin/sh

. ./.env

echo "Application Migration Starting"
docker exec -it ${APP_CONTAINER_NAME} /bin/bash -c "npm run start:migrate;"
