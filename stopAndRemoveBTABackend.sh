#!/bin/sh
GREEN='\033[0;32m'
Red='\033[0;31m'
COLOR_OFF='\033[0m'

. ./.env

# Funtion for Remov BTA app
revomeBTAApp () {
echo "${GREEN}"
echo "----------------------------------------------------------"
echo "Deleting previous docker container, volumes and images"
echo "----------------------------------------------------------"
echo "${COLOR_OFF}"
# echo "Deleting previous docker container and volumes"
docker compose -f docker-compose.yml -f ./docker-compose/docker-compose.${ENVIRONMENT}.yml down -v

# echo "Deleting previous docker image"
docker rmi bta-api-${ENVIRONMENT}:1.0.0

echo "${GREEN}"
echo "----------------------------------------------------------"
echo "Successfully deleted previous docker container, volumes and images"
echo "----------------------------------------------------------"
echo "${COLOR_OFF}"
}

removeDBDataAndBTAApp () {
echo "${GREEN}"
echo "----------------------------------------------------------"
echo "Deleting database of BTA app"
echo "----------------------------------------------------------"
echo "${COLOR_OFF}"

# Removing the database of bta app
sudo rm -r psvolumes

echo "${GREEN}"
echo "----------------------------------------------------------"
echo "Successfully deleted database of BTA app"
echo "----------------------------------------------------------"
echo "${COLOR_OFF}"


# Removing BTA App
revomeBTAApp
}

invalidResponse () {
echo "${Red}"
echo "----------------------------------------------------------"
echo "Invalid Response. Please enter the correct value (y/n)."
echo "----------------------------------------------------------"
echo "${COLOR_OFF}"


}

while true; do

read -p "Do you also want to remove all the BTA backend data from the database? (y/n) " yn

case $yn in
	[yY] ) removeDBDataAndBTAApp;
		break;;
	[nN] ) revomeBTAApp;
		break;;
	* ) invalidResponse;
esac

done

echo "${GREEN}"
echo "----------------------------------------------------------"
echo "----------------------------------------------------------"
echo "Successfully stopped and removed BTA backend application"
echo "----------------------------------------------------------"
echo "----------------------------------------------------------"
echo "${COLOR_OFF}"
