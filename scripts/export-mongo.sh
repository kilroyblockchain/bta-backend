#!/bin/sh

. ./.env
echo "Exporting data from mongo inside docker starting...."
timestamp=$(date +%s)
a="mongodump -d=$DATABASE_NAME -u=$MONGO_USERNAME -p=$MONGO_PASSWORD --authenticationDatabase=admin --archive"
read -p "Please Enter Path : " r1
docker exec ${MONGODB_CONTAINER_NAME} sh -c "exec $a" > ${r1}wc-${timestamp}.archive
echo "Exporting data from mongo inside docker finished"
exit 0