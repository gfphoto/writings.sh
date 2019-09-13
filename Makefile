# vim:set noet:

default: server

install:
	bundler install

build-dev: gulp
	bundler exec jekyll build

build-prod: gulp
	env JEKYLL_ENV=production bundler exec jekyll build
	# This is for netlify
	# cp _redirects _site/
	cp Caddyfile _site

fix-feed-mathjax:
	# Fix $ANY$ to Img for math.
	# https://www.noamross.net/archives/2012-04-04-math-in-rss-feeds/
	perl -pi -e 's|(\$$)(.*?)(\$$)|&lt;img src=&quot;http://latex.codecogs.com/png.latex?\2&quot; alt=&quot;\2&quot; /&gt;|g' _site/feed.xml

deploy: build-prod fix-feed-mathjax
	rsync -avz ./_site/*  writings.sh:/srv/site/

gulp:
	gulp

server:
	bundler exec jekyll s

.PHONY: default build server deploy gulp
