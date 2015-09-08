#!/bin/sh
tsc --out js/index.js \
	ts/index.ts \
	ts/MainController.ts \
	ts/MainScope.ts \
	ts/Maybe.ts \
	ts/InvalidOperationError.ts
