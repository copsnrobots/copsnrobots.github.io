set -eu -o pipefail

extract_set() {
    backpage=$((start + 1))
    mkdir -p images/$cardset/{suspect,investigator}
    convert -density 300 "$file[$((start+1))]" -crop $cardsize+150+150 -rotate 90 "images/$cardset/suspect/back.png"
    convert -density 300 "$file[$start]" -crop $cardsize+150+150 -rotate 90 "images/$cardset/suspect/human.png"
    i=0
    page=$((start+4))
    while true; do
        for offset in 150 1237 2325; do
            convert -density 300 "$file[$page]" -crop $cardsize+150+$offset -rotate 90 "images/$cardset/suspect/robot-$((i++)).png"
            if [ $i -eq $count ]; then
                break 2
            fi
        done
        page=$((page+2))
    done
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
