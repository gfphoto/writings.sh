# vim:set noet:

default: server

build:
	bundler install
	bundler exec jekyll build

server:
	bundler exec jekyll s

.PHONY: default build server
