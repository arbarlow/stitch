.PHONY: run build
run:
	parcel src/index.html

build:
	parcel build src/index.html --public-url /
