###
# Epitech Project 2023
# 
# File: docker-compose-consistancy.sh
# Project: area
# Created Date: Fri Jan 27 2023
# Author: Thomas
###

function lineExists {
    grep $1 docker-compose.yml > /dev/null
    if (( $? != 0 ))
    then
        echo "| $1 | NOT FOUND |"
        return 0
    else
        echo "| $1 | FOUND |"
        return 1
    fi
}

nbTests=0
nbSuccess=0

echo "| Files | Results |"
echo "|-------|---------|"

lineExists "services:"
nbSuccess=$(( $nbSuccess + $?))
nbTests=$(( $nbTests + 1 ))
lineExists "server:"
nbSuccess=$(( $nbSuccess + $?))
nbTests=$(( $nbTests + 1 ))
lineExists "client_web:"
nbSuccess=$(( $nbSuccess + $?))
nbTests=$(( $nbTests + 1 ))
lineExists "client_mobile:"
nbSuccess=$(( $nbSuccess + $?))
nbTests=$(( $nbTests + 1 ))
lineExists "depends_on:"
nbSuccess=$(( $nbSuccess + $?))
nbTests=$(( $nbTests + 1 ))

echo ""

if (( $nbSuccess == $nbTests ))
then
    echo "All files are found ($nbTests)."
    exit 0
else
    echo "Some files are missing ($(( $nbTests - $nbSuccess )))"
    exit 1
fi