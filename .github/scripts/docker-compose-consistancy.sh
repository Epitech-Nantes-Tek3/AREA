###
# Epitech Project 2023
# 
# File: docker-compose-consistancy.sh
# Project: area
# Created Date: Fri Jan 27 2023
# Author: Thomas
###

function findElement {
    yq e $1 docker-compose.yml > /dev/null
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
exitCode=0

echo "| Files | Results |"
echo "|-------|---------|"

elementToFind=(".services.server"
".services.client_web"
".services.client_mobile"
".services.client_web.depends_on"
".services.client_web.depends_on.server"
".services.client_mobile.depends_on"
".services.client_mobile.depends_on.server"
".services.client_web.depends_on.client_mobile")

for element in "${elementToFind[@]}"
do
    findElement $element
    nbSuccess=$(( $nbSuccess + $?))
    nbTests=$(( $nbTests + 1 ))
done

echo ""

if (( $nbSuccess == $nbTests ))
then
    echo "All files are found ($nbTests)."
else
    echo "Some files are missing ($(( $nbTests - $nbSuccess )))"
    exitCode=1
fi

diff <(yq e '.services.client_web.volumes' docker-compose.yml) <(yq e '.services.client_mobile.volumes' docker-compose.yml) > /dev/null
if (( $? != 0 ))
then
    echo "Client_web and Client_mobile volumes are not the same"
    exitCode=1
else
    echo "Client_web and Client_mobile volumes are the same"
fi

diff <(yq e '.services.server.ports' docker-compose.yml) <(echo "- \"8080:8080\"") > /dev/null
if (( $? != 0 ))
then
    echo "Server ports are not the same"
    exitCode=1
else
    echo "Server ports are the same"
fi
diff <(yq e '.services.client_web.ports' docker-compose.yml) <(echo "- \"8081:3000\"") > /dev/null
if (( $? != 0 ))
then
    echo "Client_web ports are not the same"
    exitCode=1
else
    echo "Client_web ports are the same"
fi
exit $exitCode