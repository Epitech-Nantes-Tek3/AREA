#!/bin/bash

# count the number of file in ${GITHUB_WORKSPACE}/Server/Services/description except template.json
nbServices=$(ls ${GITHUB_WORKSPACE}/Server/Services/description | grep -v template.json | wc -l)

echo "Total number of services: $nbServices"

if (( $nbServices < 6 )); then
    echo "Not enought services: $nbServices < 6"
    exit 1
else
    echo "Enought services: $nbServices >= 6"
    exit 0
fi
