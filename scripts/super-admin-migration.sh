#!/bin/sh

COLOR_OFF='\033[0m'
GREEN='\033[0;32m'
RED='\033[0;31m'

export ERROR_MESSAGE='Request failed with status code'

. ./.env

echo -e "${GREEN}"
echo "----------------------------------------------------------"
echo "Starting Migrating Super Admin Migration"
echo "----------------------------------------------------------"
echo -e "${COLOR_OFF}"

MIGRATION_RESPONSE=$(docker exec -it ${APP_CONTAINER_NAME} /bin/bash -c "npm run start:migrate:prefill | grep '$ERROR_MESSAGE'")

if [[ $MIGRATION_RESPONSE == *"$ERROR_MESSAGE"* ]]; then
    echo -e "${RED}"
    echo "--------------------------------------------------------------------"
    echo "Failed to run bta-backend application."
    echo "Please check your configuration and try removing the backend with script ./stopAndRemoveBTABackend.sh and re-run the script again ./setupAndRunBTABackend.sh"
    echo "--------------------------------------------------------------------"
    echo -e "${COLOR_OFF}"

    exit 0;
fi

echo -e "${GREEN}"
echo "----------------------------------------------------------"
echo "Successfully Migrated Super Admin Migration"
echo "----------------------------------------------------------"
echo -e "${COLOR_OFF}"
