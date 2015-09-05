#!/bin/sh
tsc --out js/index.js \
	ts/index.ts \
	ts/Maybe.ts \
	ts/InvalidOperationError.ts
