set -eu -o pipefail

extract_faces() {
    local page="$1"
    local path="$2"
    local count="$3"
    local i=0
    while true; do
        for offset in 150 1237 2325; do
            if [ "$count" -eq 1 ]; then
                local suffix=".png"
            else
                local suffix="-$i.png"
            fi

            convert -density 300 "$file[$page]" -crop $cardsize+150+$offset -rotate 90 "$path$suffix"
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
    extract_faces "$((start+1))" "images/$cardset/suspect/back" 1
    extract_faces "$start" "images/$cardset/suspect/human" 1
    extract_faces "$((start+4))" "images/$cardset/suspect/robot" $count
}

file="pdfs/Inhuman Conditions Print & Play (Updated Public File).pdf"
cardsize=2100x825

cardset=chair
start=2
count=6
extract_set

cardset=jug
start=26
count=7
extract_set
