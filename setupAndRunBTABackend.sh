#!/bin/sh
GREEN='\033[0;32m'
COLOR_OFF='\033[0m'
RED='\033[0;31m'

MAC_OS="darwin-amd64"
LINUX_OS="linux-amd64"
ARCH=$(echo "$(uname -s|tr '[:upper:]' '[:lower:]'|sed 's/mingw64_nt.*/windows/')-$(uname -m |sed 's/x86_64/amd64/g')" |sed 's/darwin-arm64/darwin-amd64/g')

# Getting IP Address For Blockchain Network
export PRIVATE_NETWORK_IP_ADDRESS=$(ifconfig | grep -E "([0-9]{1,3}\.){3}[0-9]{1,3}" | grep -v 127.0.0.1 | tail -1 | awk '{ print $2 }')

if [[ ! -f ".env" ||  ! -s ".env" ]];
then
echo -e "${GREEN}"
echo -e "------------------------------------------------------------------------------------------------------"
echo -e "Creating .env file"

# Copy the env sample and create new .env file and paste all the contents there.
cp -r env-samples/.env.local.sample .env

echo -e ""
echo -e "Successfully created .env file"
echo "------------------------------------------------------------------------------------------------------"
echo -e "${Color_Off}"
fi


if [ "$ARCH" = "$MAC_OS" ];
then
    sed -i "" "s/BC_CONNECTOR_IP_ADDRESS/${PRIVATE_NETWORK_IP_ADDRESS}/g" "./.env"
    sed -i "" "s/OC_CONNECTOR_IP_ADDRESS/${PRIVATE_NETWORK_IP_ADDRESS}/g" "./.env"
else
    sed -i "s/BC_CONNECTOR_IP_ADDRESS/${PRIVATE_NETWORK_IP_ADDRESS}/g" "./.env"
    sed -i "s/OC_CONNECTOR_IP_ADDRESS/${PRIVATE_NETWORK_IP_ADDRESS}/g" "./.env"
fi

. ./.env

export APP_RUNNED_SUCCESS_RESPONSE="APP IS LISTENING TO PORT ${PORT}"

echo "Pulling latest code"

git pull

if [ -d "$DATABASE_VOLUME_MOUNT" ]; then
    echo "Database Directory already exists"
    echo "Changing ownership to current user"
    sudo chown -R $USER:$USER $DATABASE_VOLUME_MOUNT
else
    echo "Creating Database Directory and Changing ownership to current user"
    mkdir -p $DATABASE_VOLUME_MOUNT && chown -R $USER:$USER $DATABASE_VOLUME_MOUNT
fi

LOGS_DIR=./logs

if [ -d "$LOGS_DIR" ]; then
    echo "Logs Directory already exists"
    echo "Changing ownership to current user"
    sudo chown -R $USER:$USER $LOGS_DIR
else
    echo "Creating Logs Directory and Changing ownership to current user"
    mkdir -p $LOGS_DIR && chown -R $USER:$USER $LOGS_DIR
fi

UPLOADS_DIR=./uploads

if [ -d $UPLOADS_DIR ]; then
    echo "Uploads Directory already exists"
    echo "Changing ownership to current user"
    sudo chown -R $USER:$USER $UPLOADS_DIR
else
    echo "Creating Uploads Directory and Changing ownership to current user"
    mkdir -p $UPLOADS_DIR && chown -R $USER:$USER $UPLOADS_DIR
fi

. ./scripts/docker-down.sh

. ./scripts/docker-up.sh

# Remove development stage image or unused image
REMOVE_DANGLING_IMAGES="docker rmi $(docker images -q -f dangling=true)"
eval $REMOVE_DANGLING_IMAGES

sleep 5

# CHECK IF THE APPLICATION RUNNING STATUS
GET_APP_RUNNING_STATUS=$(docker logs bta_api_local 2>&1 | grep "$APP_RUNNED_SUCCESS_RESPONSE")
COUNTER=0

while [ "$GET_APP_RUNNING_STATUS" != "$APP_RUNNED_SUCCESS_RESPONSE" ];
do
if [ $COUNTER -eq 12 ]
    then
    echo -e "${RED}"
    echo "--------------------------------------------------------------------"
    echo "Failed to run bta-backend application."
    echo "Please check your configuration and try removing the backend with script ./stopAndRemoveBTABackend.sh and re-run the script again ./setupAndRunBTABackend.sh"
    echo "--------------------------------------------------------------------"
    echo -e "${COLOR_OFF}"

    exit 0;
fi

echo -e "${GREEN}"
echo "--------------------------------------------------------------------"
echo "Please wait while bta-backend application is completely started retrying($[$COUNTER +1])..."
echo "--------------------------------------------------------------------"
echo -e "${COLOR_OFF}"

sleep 5
COUNTER=$[$COUNTER +1]

GET_APP_RUNNING_STATUS=$(docker logs bta_api_local 2>&1 | grep "$APP_RUNNED_SUCCESS_RESPONSE")

done

echo -e "${GREEN}"
echo "----------------------------------------------------------"
echo "Starting Migrating App Migration"
echo "----------------------------------------------------------"
echo -e "${COLOR_OFF}"

# Run App Migrations
. ./scripts/app-migration.sh

echo -e "${GREEN}"
echo "----------------------------------------------------------"
echo "Successfully Migrated App Migration"
echo "----------------------------------------------------------"
echo -e "${COLOR_OFF}"

echo -e "${GREEN}"
echo "----------------------------------------------------------"
echo "Starting Migrating Super Admin Migration"
echo "----------------------------------------------------------"
echo -e "${COLOR_OFF}"

# Run Super Admin Migrations
. ./scripts/super-admin-migration.sh

echo -e "${GREEN}"
echo "----------------------------------------------------------"

echo "Successfully Migrated Super Admin Migration"
echo "----------------------------------------------------------"
echo -e "${COLOR_OFF}"

echo -e "${GREEN}"
echo "----------------------------------------------------------"
echo "----------------------------------------------------------"
echo "Successfully created and run BTA backend application"
echo "----------------------------------------------------------"
echo "----------------------------------------------------------"
echo -e "${COLOR_OFF}"
