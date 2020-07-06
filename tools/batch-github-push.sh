#!/bin/bash
N=40; while true; do git status | grep -A10000 'Untracked files:' | sed -r -e 's@\t@#@g' | grep '^##' | head -n$N | sed -r -e 's@^##@git add "@g' -e 's@$@"; ((N++))@g' | bash ; find . -type f -size 0c -exec git rm --cached "{}" \; ; find . -type f -size 0c -exec rm -fv "{}" \; ; git commit -a -m "Additional 17th Congress documents" && git push || break ; sleep 120; done
