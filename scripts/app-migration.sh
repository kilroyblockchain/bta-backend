#!/bin/sh
GREEN='\033[0;32m'
COLOR_OFF='\033[0m'

. ./.env

echo -e "${GREEN}"
echo "----------------------------------------------------------"
echo "Starting Migrating App Migration"
echo "----------------------------------------------------------"
echo -e "${COLOR_OFF}"

docker exec -it ${APP_CONTAINER_NAME} /bin/bash -c "npm run start:migrate;"


echo -e "${GREEN}"
echo "----------------------------------------------------------"
echo "Successfully Migrated App Migration"
echo "----------------------------------------------------------"
echo -e "${COLOR_OFF}"
