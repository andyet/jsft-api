SHELL := /bin/bash
PATH := ./node_modules/.bin:$(PATH)

STYLUS_FILES := $(shell glob-cli "public/styl/**/*.styl")

build: public/css/docs.css

public/css/docs.css: $(STYLUS_FILES)
	mkdir -p public/css
	stylus public/styl/docs.styl -u yeticss -o public/css
