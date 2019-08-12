# vim:set noet:

default: server

build:
	bundler install
	bundler exec jekyll build
	cp _redirects _site/

gulp:
	gulp

server:
	bundler exec jekyll s

.PHONY: default build server
