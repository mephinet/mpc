#! /bin/sh

DIR=$(dirname $0)
[[ "$DIR" ]] || DIR=.

export LANG=de_AT 
exec chromium --allow-file-access-from-files $DIR/index.html
