#!/bin/bash

command -v "sqip" || abort "can't findexecutable sqip"

# enable extended globbing
shopt -s extglob

for file in ./assets/images/posts/**/*.{jpg,jpeg,png,gif}
do
    out="${file}-small.svg"
    if [ -f ${out} ]; then
        action="skipped"
        size=`du -h ${out}`
    else
        action="done"
        sqip -n 32 -i ${file} -o ${out} --silent
    fi
    size=`du -h ${out}`
    echo "[SQIP] ${action} ${size}"
done
