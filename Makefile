# vim:set noet:

default: server

build:
	bundler install
	bundler exec jekyll build
	cp _redirects _site/
	perl -pi -e 's|(\$)(.*?)(\$)|&lt;img src=&quot;http://latex.codecogs.com/png.latex?\2&quot; alt=&quot;\2&quot; /&gt;|g' _site/feed.xml

gulp:
	gulp

server:
	bundler exec jekyll s

.PHONY: default build server
