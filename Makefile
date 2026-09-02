.PHONY: build dev clean

build:
	hugo --minify --cleanDestinationDir

dev:
	hugo server -D --disableFastRender

clean:
	rm -rf public resources/_gen
