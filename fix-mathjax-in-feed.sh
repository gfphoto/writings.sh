#!/bin/bash

# Fix $ANY$ to Img for math.
# https://www.noamross.net/archives/2012-04-04-math-in-rss-feeds/
perl -pi -e 's|(\$)(.*?)(\$)|&lt;img src=&quot;http://latex.codecogs.com/png.latex?\2&quot; alt=&quot;\2&quot; /&gt;|g' _site/feed.xml
