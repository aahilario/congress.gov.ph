#!/bin/bash
GITSTAT="$(dirname $0)/git.status"
FILE="$@"
case "$FILE" in
  run)
    git status | grep -A10000 'Untracked files' | sed -r -e 's@\t@#@g' | grep '^##' | sed -r -e 's@^##@@g' | grep -v '.tar.xz$' > $GITSTAT
    cat $GITSTAT | wc -l
    find legisdocs -type f -name \*.pdf -exec $0 "{}" \;
    ;;
  *)
    if [ ! -f "$FILE" ]; then
      echo "Missing $FILE"
      exit 1
    fi
    if [ ! -f $GITSTAT ]; then
      echo "Run $(basename $0) run"
      exit 1
    fi
    STAT=$(grep -q "$FILE" $GITSTAT 2> /dev/null && echo "DontPack" || echo "Pack")
    echo "$STAT $FILE"
    if [ $STAT == "Pack" ]; then
      tar -vcJf "${FILE}.tar.xz" "$FILE" && rm -f "$FILE"
    fi
    df
    echo
    ;;
esac
