#!/bin/bash
set -eu -o pipefail

triple_split="150 1237 2325"
triple_height=825

extract() {
    local page=$1
    local crop=$2
    local outfile=$3
    if ! [ -f "$outfile" ]; then
        if ! convert -density 300 "$file[$page]" -crop "$crop" -rotate "$rotation" "$outfile"; then
            echo 'Failed command:' convert -density 300 "'$file[$page]'" -crop "$crop" -rotate "$rotation" "'$outfile'" >&2
            exit
        fi
    fi
}

extract_faces() {
    cardsize=2100x$triple_height

    local page="$1"
    local path="$2"
    local count="$3"
    local i=0
    while true; do
        for offset in $triple_split; do
            if [ "$count" -eq 1 ]; then
                local suffix=".png"
            else
                local suffix="-$i.png"
            fi

            extract "$page" "$cardsize+150+$offset" "$path$suffix"
            i=$((i+1))
            if [ "$i" -eq "$count" ]; then
                break 2
            fi
        done
        page=$((page+2))
    done
}

packet_index=0
extract_packet() {
    mkdir -p cards/$packet/{suspect,investigator}
    echo -e '\t"'"$packet"'": {'
    echo -e '\t\t"index": '"$((packet_index++))"','
    echo -e '\t\t"description": "'"$packetname"'",'
    echo -e '\t\t"humans": 6,'
    echo -e '\t\t"robots": '"$count,"
    echo -e '\t\t"primary": 3,'
    echo -e '\t\t"secondary": 3'
    echo -en '\t}'

    rotation="90"
    extract "$((start+1))" "200x200+1769+464" "cards/$packet/icon.png"
    extract_faces "$((start+1))" "cards/$packet/suspect/back" 1
    extract_faces "$start" "cards/$packet/suspect/human" 1
    extract_faces "$((start+4))" "cards/$packet/suspect/robot" $count

    rotation="0"
    extract_faces "$((questionstart+1))" "cards/$packet/investigator/secondary-back" 1
    extract_faces "$((questionstart+3))" "cards/$packet/investigator/primary-back" 1
    extract_faces "$((questionstart))" "cards/$packet/investigator/secondary" 3
    extract_faces "$((questionstart+2))" "cards/$packet/investigator/primary" 3
}

mkdir -p 'cards/'

file="pdfs/Inhuman Conditions Print & Play (Updated Public File).pdf"

exec 1>"cards/packets.json"
echo '{'
trap "echo -e '\n}'" EXIT
packet=chair
packetname="Process Your Day"
start=2
count=6
questionstart=36
extract_packet
echo ','

packet=dragon
packetname="Demonstrate Imagination"
start=10
count=6
questionstart=40
extract_packet
echo ','

packet=rose
packetname="Experience and Process Grief"
start=18
count=6
questionstart=44
extract_packet
echo ','

packet=coffeepot
packetname="Apply Creative Problem Solving"
start=26
count=7
questionstart=48
extract_packet
echo ','

rotation=0

cardsize=806x$triple_height
page=62
mkdir -p "cards/notes/"
extract "$((page+1))" "$cardsize+150+150" "cards/notes/back.png"

i=0
count=26
while true; do
    for offset_y in $triple_split; do
        for offset_x in 150 1592; do
            extract "$page" "$cardsize+$offset_x+$offset_y" "cards/notes/$i.png"
            i=$((i+1))
            if [ "$i" -eq "$count" ]; then
                break 3
            fi
        done
    done
    page=$((page+2))
done
echo "{ \"notes\": $count," > 'cards/other.json'

cardsize=825x1275
page=52
mkdir -p "cards/penalties/"
extract "$((page+1))" "$cardsize+150+150" "cards/penalties/back.png"

i=0
count=17
while true; do
    for offset_y in 150 1873; do
        for offset_x in 150 1573; do
            extract "$page" "$cardsize+$offset_x+$offset_y" "cards/penalties/$i.png"
            i=$((i+1))
            if [ "$i" -eq "$count" ]; then
                break 3
            fi
        done
    done
    page=$((page+2))
done
echo "  \"penalties\": $count }" >> 'cards/other.json'

file="pdfs/Hope And Dreams Cards (Updated Public File).pdf"
packet=hourglass
packetname="Hopes and Dreams"
start=0
count=6
questionstart=8
extract_packet
echo ','

file="pdfs/Bodily Connection Cards (Public File).pdf"
packet=hand
packetname="Think of Your Body as Part of Yourself"
start=0
count=6
questionstart=8
extract_packet
echo ','

file="pdfs/Recognize Your Moral Failings Cards (Public File).pdf"
packet=skull
packetname="Recognize Your Moral Failings"
start=0
count=6
questionstart=8
extract_packet
echo ','

file="pdfs/Threat Response Cards (Public File).pdf"
packet=caterpillar
packetname="Respond to threats appropriately"
start=0
count=6
questionstart=8
extract_packet
