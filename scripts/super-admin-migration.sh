#!/bin/sh

. ./.env

echo "Super Admin Migration Starting"
docker exec -it ${APP_CONTAINER_NAME} /bin/bash -c "npm run start:migrate:prefill;"
