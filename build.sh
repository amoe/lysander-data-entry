#! /bin/sh


export NODE_OPTIONS="--max-old-space-size=4096"

set -eu

build_dir="build"

rm -rf "$build_dir"
npm run build
tar -cf build.tar build
