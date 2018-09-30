set -eu -o pipefail

triple_split="150 1237 2325"
triple_height=825

extract() {
    local page=$1
    local crop=$2
    local outfile=$3
    if ! [ -f "$outfile" ]; then
        if ! convert -density 300 "$file[$page]" -crop "$crop" -rotate "$rotation" "$outfile"; then
            echo 'Failed command:' convert -density 300 "'$file[$page]'" -crop "$crop" -rotate "$rotation" "'$outfile'"
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
    mkdir -p images/$cardset/{suspect,investigator}
    rotation="90"
    extract_faces "$((start+1))" "images/$cardset/suspect/back" 1
    extract_faces "$start" "images/$cardset/suspect/human" 1
    extract_faces "$((start+4))" "images/$cardset/suspect/robot" $count
    rotation="0"
    extract_faces "$((questionstart+1))" "images/$cardset/investigator/back" 1
    extract_faces "$((questionstart))" "images/$cardset/investigator/secondary" 3
    extract_faces "$((questionstart+2))" "images/$cardset/investigator/primary" 3
}

file="pdfs/Inhuman Conditions Print & Play (Updated Public File).pdf"

cardset=chair
start=2
count=6
questionstart=36
extract_set

cardset=dragon
start=10
count=6
questionstart=40
extract_set

cardset=rose
start=18
count=6
questionstart=44
extract_set

cardset=coffeepot
start=26
count=7
questionstart=48
extract_set

rotation=0

cardsize=806x$triple_height
page=62
mkdir -p "images/notes/"
extract "$((page+1))" "$cardsize+150+150" "images/notes/back.png"

i=0
count=26
while true; do
    for offset_y in $triple_split; do
        for offset_x in 150 1592; do
            extract "$page" "$cardsize+$offset_x+$offset_y" "images/notes/$i.png"
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
mkdir -p "images/penalties/"
extract "$((page+1))" "$cardsize+150+150" "images/penalties/back.png"

i=0
count=17
while true; do
    for offset_y in 150 1873; do
        for offset_x in 150 1573; do
            extract "$page" "$cardsize+$offset_x+$offset_y" "images/penalties/$i.png"
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
