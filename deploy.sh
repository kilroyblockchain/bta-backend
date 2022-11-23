#!/bin/sh

# Copy the env sample and create new .env file and paste all the contents there.
cp -r env-samples/.env.local.sample .env

. ./.env

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

echo "Application Log Started:"
docker compose logs -f app
