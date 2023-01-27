###
# Epitech Project 2023
# 
# File: docker-compose-consistancy.sh
# Project: area
# Created Date: Fri Jan 27 2023
# Author: Thomas
###

function lineExists {
    echo "$file" | grep $1 > /dev/null
    if (( $? != 0 ))
    then
        echo "| $1 | NOT FOUND |"
        return 0
    else
        echo "| $1 | FOUND |"
        return 1
    fi
}

file=`cat docker-compose.yml`
nbTests=5
nbSuccess=0

echo "| Files | Results |"
echo "|-------|---------|"

lineExists "services:"
nbSuccess=$(( $nbSuccess + $?))
lineExists "server:"
nbSuccess=$(( $nbSuccess + $?))
lineExists "client_web:"
nbSuccess=$(( $nbSuccess + $?))
lineExists "client_mobile:"
nbSuccess=$(( $nbSuccess + $?))
lineExists "depends_on:"
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