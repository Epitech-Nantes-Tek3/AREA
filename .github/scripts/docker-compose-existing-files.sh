###
# Epitech Project 2023
# 
# File: docker-compose-existing-files.sh
# Project: area
# Created Date: Thu Jan 26 2023
# Author: Thomas
###

#!/bin/bash

function fileExist {
    find $1 > /dev/null
    if (( $? != 0 ))
    then
        echo "| $1 | FAIL |"
        return 0
    else
        echo "| $1 | PASS |"
        return 1
    fi
}

nbTests=4
nbSuccess=0

echo "| Files | Results |"
echo "|-------|---------|"

fileExist "./docker-compose.yml"
nbSuccess=$(( $nbSuccess + $?))
fileExist "Server/Dockerfile"
nbSuccess=$(( $nbSuccess + $?))
fileExist "Application/Dockerfile"
nbSuccess=$(( $nbSuccess + $?))
fileExist "Web/Dockerfile"
nbSuccess=$(( $nbSuccess + $?))

echo ""

if (( $nbSuccess == $nbTests ))
then
    echo "All files are found ($nbTests)."
    exit 0
else
    echo "Some files are missing ($(( $nbTests - $nbSuccess )))"
    exit 1
fi