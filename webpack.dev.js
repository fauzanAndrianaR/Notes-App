const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'development', // Mode development
  devServer: {
    static: './dist',
    port: 8080,
    open: true, // Buka browser otomatis
    hot: true, // Enable Hot Module Replacement (HMR)
  },
  devtool: 'inline-source-map', // Source maps untuk debugging
});
