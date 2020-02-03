#! /bin/sh

export NODE_OPTIONS="--max-old-space-size=4096"

set -eu

build_dir="build"

rm -rf "$build_dir"
npm run build

maybe_limit=""
if [ "$#" -gt 0 ]; then
    if [ "$1" = "slow" ]; then
        maybe_limit="--bwlimit=128k"
    fi
fi


rsync $maybe_limit -azPv --delete "${build_dir}/" visarend.solasistim.net:/srv/http/lysander/
