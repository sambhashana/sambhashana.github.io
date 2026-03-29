RUBY_VERSION := $(shell cat .ruby-version 2>/dev/null || echo "3.2.1")
RUBY_ROOT := /Users/hrishikesh/.rvm/rubies/ruby-$(RUBY_VERSION)
GEM_BIN := /Users/hrishikesh/.rvm/gems/ruby-$(RUBY_VERSION)/bin
PATH_PREFIX := PATH=$(GEM_BIN):$(RUBY_ROOT)/bin:$$PATH
BUNDLE := $(PATH_PREFIX) bundle

.PHONY: install update serve serve-live build clean

install:
	$(BUNDLE) install

update:
	$(BUNDLE) update

serve:
	$(BUNDLE) exec jekyll serve

serve-live:
	$(BUNDLE) exec jekyll serve --livereload --open-url

build:
	$(BUNDLE) exec jekyll build

clean:
	$(BUNDLE) exec jekyll clean
