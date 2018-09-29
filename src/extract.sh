set -eu -o pipefail

extract_set() {
    backpage=$[start + 1]
    mkdir -p images/$cardset/
    convert -density 300 "$file[$((start+1))]" -crop $cardsize+150+150 -rotate 90 "images/$cardset/back.png"
    convert -density 300 "$file[$start]" -crop $cardsize+150+150 -rotate 90 "images/$cardset/human.png"
    i=0
    for page in $((start+4)) $((start+6)); do
        for offset in 150 1237 2325; do
            convert -density 300 "$file[$page]" -crop $cardsize+150+$offset -rotate 90 "images/$cardset/robot-$((i++)).png"
        done
    done
}

file="pdfs/Inhuman Conditions Print & Play (Updated Public File).pdf"
cardsize=2100x825

cardset=chair
start=2
extract_set
