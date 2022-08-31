#!/bin/bash

printHelp() {
    echo 'HELP:'
    echo 'Example to run script'
    echo './pretict.sh -imagePath PATH_TO_IMAGE'
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

