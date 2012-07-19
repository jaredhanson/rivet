REPORTER=spec

test:
	./node_modules/.bin/mocha \
		--require should \
		--reporter $(REPORTER) \
		--bail

.PHONY: test
