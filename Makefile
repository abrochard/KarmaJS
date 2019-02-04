build: node_modules
	node node_modules/webpack/bin/webpack.js --config webpack/prod.config.js

node_modules:
	npm install
