# vim:set noet:

default: server

install:
	bundler install
	npm install

build: gulp
	bundler exec jekyll build

gulp:
	gulp

server:
	bundler exec jekyll s -H 0.0.0.0 --watch

deploy:
	./deploy.sh

build-netlify:
	bundler install
	env JEKYLL_ENV=production bundler exec jekyll build
	# Fix $ANY$ to Img for math.
	# https://www.noamross.net/archives/2012-04-04-math-in-rss-feeds/
	perl -pi -e 's|(\$$)(.*?)(\$$)|&lt;img src=&quot;http://latex.codecogs.com/png.latex?\2&quot; alt=&quot;\2&quot; /&gt;|g' _site/feed.xml

.PHONY: default build server gulp deploy build-netlify
