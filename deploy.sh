#! /bin/sh

set -eu

build_dir="build"

rm -rf "$build_dir"
npm run build

maybe_limit=""
if [ "$#" -gt 0 ]; then
    if [ -n "$1" = "slow" ]; then
        maybe_limit="--bwlimit=128k"
    fi
fi


rsync $maybe_limit -aPv --delete "${build_dir}/" visarend.solasistim.net:/srv/http/lysander/
