#!/bin/sh
GREEN='\033[0;32m'
COLOR_OFF='\033[0m'
RED='\033[0;31m'

MAC_OS="darwin-amd64"
LINUX_OS="linux-amd64"
ARCH=$(echo "$(uname -s|tr '[:upper:]' '[:lower:]'|sed 's/mingw64_nt.*/windows/')-$(uname -m |sed 's/x86_64/amd64/g')" |sed 's/darwin-arm64/darwin-amd64/g')

which ifconfig
if [ "$?" -ne 0 ]; then
    if [ "$ARCH" = "$LINUX_OS" ]; then
        sudo apt-get update && sudo apt-get install net-tools
    else
        echo
        echo -e "${RED}"
        echo "-----------------------------------------------------------------------------------------"
        echo "-----------------------------------------------------------------------------------------"
        echo "OS Not Found. Please install ifconfig manually on your device and re-run the script"
        echo "-----------------------------------------------------------------------------------------"
        echo "-----------------------------------------------------------------------------------------"
        echo -e "${COLOR_OFF}"
        exit 1
    fi
fi

which ifconfig
if [ "$?" -ne 0 ]; then
    echo
    echo -e "${RED}"
    echo "-----------------------------------------------------------------------------------------"
    echo "-----------------------------------------------------------------------------------------"
    echo "Failed to install ifconfig. Please install ifconfig manually on your device and re-run the script"
    echo "-----------------------------------------------------------------------------------------"
    echo "-----------------------------------------------------------------------------------------"
    echo -e "${COLOR_OFF}"
    exit 1
fi

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

. ./scripts/create-default-directories.sh

echo "Pulling latest code"
git pull


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

# Run App Migrations
. ./scripts/app-migration.sh

# Run Super Admin Migrations
. ./scripts/super-admin-migration.sh

echo -e "${GREEN}"
echo "----------------------------------------------------------"
echo "----------------------------------------------------------"
echo "Successfully created and run BTA backend application"
echo "----------------------------------------------------------"
echo "----------------------------------------------------------"
echo -e "${COLOR_OFF}"
