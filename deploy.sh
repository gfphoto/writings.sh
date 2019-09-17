#!/bin/bash

# This is the directory of this script.
# Should locate at the root of this repo.
REPO_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}"  )" && pwd  )"
echo "Working at ${REPO_DIR}"

# Make a temp directory
TEMP_DIR=`mktemp -d -t writing.sh`
# Check if temp dir was created.
if [[ ! "$TEMP_DIR" || ! -d "$TEMP_DIR"  ]]; then
    echo "Could not create temp dir, abort"
    exit 1
fi
echo "Created ${TEMP_DIR}"

function cleanup_temp_dir {
    if [[ -d "$TEMP_DIR" ]]; then
        rm -rf $TEMP_DIR
        echo "Deleted ${TEMP_DIR}"
    fi
}

# Register clean function at the EXIT signal.
trap cleanup_temp_dir EXIT

# Clone this repo to that temp directory.
git clone $REPO_DIR $TEMP_DIR
echo "Cloned into ${TEMP_DIR}"

# Copy node modules cache.
NODE_MODULES_DIR=$REPO_DIR/node_modules
cp -r $NODE_MODULES_DIR $TEMP_DIR
echo "Copy $NODE_MODULES_DIR into $TEMP_DIR done"

cd ${TEMP_DIR}
echo "Walked into ${TEMP_DIR}"

# Install Deps
echo "Installing bundler gems"
bundler install
echo "Installing npm modules"
npm install

# Build
echo "Building assets css,js.."
gulp
echo "Building jekyll site on production environment"
env JEKYLL_ENV=production bundler exec jekyll build
echo "Copy Caddyfile to _site"
cp Caddyfile _site

# Fix $ANY$ to Img for math.
# https://www.noamross.net/archives/2012-04-04-math-in-rss-feeds/
echo "Fix math in feed.xml"
perl -pi -e 's|(\$$)(.*?)(\$$)|&lt;img src=&quot;http://latex.codecogs.com/png.latex?\2&quot; alt=&quot;\2&quot; /&gt;|g' _site/feed.xml

# Deploy
echo "Rsync to remote server"
rsync -avz ./_site/*  writings.sh:/srv/site/
