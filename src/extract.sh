set -eu -o pipefail

triple_split="150 1237 2325"
triple_height=825

extract() {
    local page=$1
    local crop=$2
    local outfile=$3
    convert -density 300 "$file[$page]" -crop "$crop" -rotate "$rotation" $outfile
}

extract_faces() {
    cardsize=2100x$triple_height

    local page="$1"
    local path="$2"
    local count="$3"
    local i=0
    while true; do
        for offset in triple_split; do
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

cardset=coffeepot
start=26
count=7
questionstart=48
extract_set
