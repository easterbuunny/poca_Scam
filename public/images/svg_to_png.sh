#!/bin/sh

LIST=`ls`
FORMAT=".svg"
FORMAT_LEN=${#FORMAT}

for FILE in $LIST; do
	if [[ "$FILE" == *"$FORMAT" ]]; then
		FILE_LEN=${#FILE}
		OUTPUT_FILE=${FILE:0:`expr $FILE_LEN - $FORMAT_LEN`}".png"
  		rsvg-convert --format="png" --output="$OUTPUT_FILE" "$FILE"
	fi
done