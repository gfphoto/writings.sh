#!/bin/bash

# FIX src="*.svg" to real image in feed.
perl -pi -e 's|src\=(\&quot\;)(.*?)(\-small.svg\&quot\;)|src\=\&quot\;\2\&quot\;|g' _site/feed.xml
perl -pi -e 's|data\-src\=(\&quot\;)(.*?)(\&quot\;)||g' _site/feed.xml
