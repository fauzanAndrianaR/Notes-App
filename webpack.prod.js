const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const TerserPlugin = require('terser-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

module.exports = merge(common, {
  mode: 'production', // Mode production
  optimization: {
    minimize: true, // Mengaktifkan minimization
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: {
            drop_console: true, // Menghapus console.log di mode production
          },
        },
      }),
      new CssMinimizerPlugin(), // Minimasi CSS
    ],
  },
  devtool: 'source-map', // Source maps untuk production (optional)
});
