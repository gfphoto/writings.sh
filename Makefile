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

.PHONY: default build server gulp
