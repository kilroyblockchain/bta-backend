#!/bin/sh

. ./.env
echo "Importing data into mongo inside docker starting...."
a="mongorestore --nsInclude=$DATABASE_NAME.* -u=$MONGO_USERNAME -p=$MONGO_PASSWORD --authenticationDatabase=admin --archive="
read -p "Please Enter Path : " r1
docker cp $r1 ${MONGODB_CONTAINER_NAME}:/foo.archive
docker exec ${MONGODB_CONTAINER_NAME} sh -c "exec $a""foo.archive"
echo "Importing data from mongo inside docker finished"
exit 0