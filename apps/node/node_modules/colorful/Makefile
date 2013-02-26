all:
	@npm install -d
	@cp scripts/githooks/* .git/hooks/
	@chmod -R +x .git/hooks/


specs := $(shell find ./tests -name '*.test.js' ! -path "*node_modules/*")
reporter = spec
test:
	@node_modules/.bin/mocha --reporter ${reporter} ${specs}


files := $(shell find . -name '*.js' ! -path "*node_modules/*" ! -path "*lib/logging.js")
lint:
	@node_modules/.bin/jshint ${files} --config=scripts/config-lint.js

out = tests/coverage.html
coverage:
	# NOTE: You must have node-jscoverage installed:
	# https://github.com/visionmedia/node-jscoverage
	# The jscoverage npm module and original JSCoverage packages will not work
	@jscoverage lib lib-cov
	@SWIG_COVERAGE=1 $(MAKE) test reporter=html-cov > ${out}
	@rm -rd lib-cov
	@echo
	@echo "Built Report to ${out}"
	@echo

theme = $(HOME)/.spm/themes/one
documentation:
	@cp README.md _docs/index.md
	@nico build --theme=${theme}

publish: clean documentation
	@ghp-import _site -p

clean:
	@rm -fr _site

server:
	@nico server --theme=${theme}

.PHONY: all build test lint coverage
