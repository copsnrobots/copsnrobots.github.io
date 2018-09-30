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

extract_set() {
    mkdir -p cards/$cardset/{suspect,investigator}
    echo -e '\t"'"$cardset"'": {'
    echo -e '\t\t"description": '"$setname"'",'
    echo -e '\t\t"humans": 6,'
    echo -e '\t\t"robots": '"$count"
    echo -e '\t}'

    rotation="90"
    extract "$((start+1))" "200x200+1769+464" "cards/$cardset/icon.png"
    extract_faces "$((start+1))" "cards/$cardset/suspect/back" 1
    extract_faces "$start" "cards/$cardset/suspect/human" 1
    extract_faces "$((start+4))" "cards/$cardset/suspect/robot" $count

    rotation="0"
    extract_faces "$((questionstart+1))" "cards/$cardset/investigator/back" 1
    extract_faces "$((questionstart))" "cards/$cardset/investigator/secondary" 3
    extract_faces "$((questionstart+2))" "cards/$cardset/investigator/primary" 3
}

file="pdfs/Inhuman Conditions Print & Play (Updated Public File).pdf"

exec 1>"cards/sets.json"
echo '{'
trap "echo '}'" EXIT
cardset=chair
setname="Process Your Day"
start=2
count=6
questionstart=36
extract_set

cardset=dragon
setname="Demonstrate Imagination"
start=10
count=6
questionstart=40
extract_set

cardset=rose
setname="Experience and Process Grief"
start=18
count=6
questionstart=44
extract_set

cardset=coffeepot
setname="Apply Creative Problem Solving"
start=26
count=7
questionstart=48
extract_set

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

file="pdfs/Hope And Dreams Cards (Updated Public File).pdf"

cardset=hourglass
setname="Hopes and Dreams"
start=0
count=6
questionstart=8
extract_set
