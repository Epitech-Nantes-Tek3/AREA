###
# Epitech Project 2023
# 
# File: docker-compose-consistancy.sh
# Project: area
# Created Date: Fri Jan 27 2023
# Author: Thomas
###

function lineExists {
    find $1 > /dev/null
    if (( $? != 0 ))
    then
        echo "| $1 | NOT FOUND |"
        return 0
    else
        echo "| $1 | FOUND |"
        return 1
    fi
}

file='cat docker-compose.yml'

echo "| Files | Results |"
echo "|-------|---------|"

lineExists "services:"
lineExists "server:"
lineExists "client_web:"
lineExists "client_mobile:"
lineExists "depends_on:"
lineExists "\nvolumes:"