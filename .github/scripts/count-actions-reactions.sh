#!/bin/bash

function a() {
    echo "| Services | Number of actions | Number of reactions |"
    echo "|----------|-------------------|---------------------|"
    while read file; do
        if [[ $file == "template.json" ]]; then
            continue
        fi
        a=$(jq -e ".actions | length" ${GITHUB_WORKSPACE}/Server/Services/description/$file)
        b=$(jq -e ".reactions | length" ${GITHUB_WORKSPACE}/Server/Services/description/$file)
        nbActions=$(($nbActions + $a))
        nbReactions=$(($nbReactions + $b))
        echo "| $file | $a | $b |"
    done
    echo "| | | |"
    echo "| Total | $nbActions | $nbReactions |"
    echo ""
    echo "Total actions-reactions: $(($nbActions + $nbReactions))"
    if (( $nbActions + $nbReactions < 15 )); then
        echo "Not enought actions-reactions: $(($nbActions + $nbReactions)) < 15"
        exit 1
    else
        echo "Enought actions-reactions: $(($nbActions + $nbReactions)) >= 15"
        exit 0
    fi
}

ls ${GITHUB_WORKSPACE}/Server/Services/description | a