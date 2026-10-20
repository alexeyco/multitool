.PHONY: check

check:
	npm test
	node scripts/check-package.js
