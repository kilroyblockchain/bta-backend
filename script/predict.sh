#!/bin/bash

printHelp() {
    echo 'HELP:'
    echo 'Please follow the syntx below:'
    echo './pretict.sh -imagePath PATH_TO_IMAGE'
    echo 'Exmaple:'
    echo './pretict.sh -imagePath ../stop.png'
    echo 'Above code snippet has /preict rest api which takes traffic sign image file and returns the traffic sign class name and accuracy probability'
}

if [[ $# -lt 1 ]] ; then
  printHelp
  exit 0
fi

while [[ $# -ge 1 ]] ; do
  key="$1"
  case $key in
  -h )
    printHelp
    exit 0
    ;;
  -imagePath )
    IMAGE_PATH="$2"
    shift
    ;;
  * )
    echo
    echo "Unknown flag: $key"
    echo
    printHelp
    exit 1
    ;;
  esac
  shift
done

curl -F file=@$IMAGE_PATH  -X POST http://129.146.47.47/predict

