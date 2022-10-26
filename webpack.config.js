const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  mode: 'none',
  entry: './index.js',
  output: {
    path: path.resolve(__dirname, 'public'),
    filename: '[name].js',
  },
  // webpack-dev-server, hot-loading 설정
  devServer: {
    hot: true,
    port: 8080,
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
    ],
  },

  plugins: [
    new HtmlWebpackPlugin({
      // index.html 템플릿을 기반으로 빌드 결과물을 추가
      hash: true,
      template: 'index.html',
      filename: 'index.html',
    }),
    new MiniCssExtractPlugin({
      filename: 'style.css',
      ignoreOrder: false, // Enable to remove warnings about conflicting order
    }),
  ],
};
