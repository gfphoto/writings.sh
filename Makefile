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

deploy-vps:
	./deploy.sh

build-netlify:
	bundler install
	env JEKYLL_ENV=production bundler exec jekyll build
	# Fix feed
	./fix-mathjax-in-feed.sh
	./fix-lazyload-in-feed.sh
	# Copy file redirects
	cp _redirects _site/
	cp -rf .wellknown _site/

sqip:
	./sqip-images.sh

.PHONY: default build server gulp deploy-vps build-netlify sqip
