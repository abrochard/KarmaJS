const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const merge = require('webpack-merge');
const baseConfig = require('./base.config.js');

module.exports = merge(baseConfig, {
  mode: 'production',
  plugins: [
    new UglifyJsPlugin({
      test: /\.js($|\?)/i
    })
  ]
});
