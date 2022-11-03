#!/bin/sh
. ./.env
if [ -d "$DATABASE_VOLUME_MOUNT" ]; then
    echo "Directory already exists"
    echo "Changing ownership to current user"
    sudo chown -R $USER:$USER $DATABASE_VOLUME_MOUNT
else
    echo "Creating Directory and Changing ownership to current user"
    mkdir -p $DATABASE_VOLUME_MOUNT && chown -R $USER:$USER $DATABASE_VOLUME_MOUNT
fi
. ./scripts/docker-down.sh
. ./scripts/docker-up.sh
echo "Application Log Started:"
docker-compose logs -f app
