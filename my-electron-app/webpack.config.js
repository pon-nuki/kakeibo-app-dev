const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

// Renderer プロセス用の設定
const rendererConfig = {
  entry: './src/renderer/index.tsx',
  output: {
    filename: 'renderer.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    fallback: {
      path: require.resolve('path-browserify'),
      fs: false,
    },
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  devServer: {
  static: {
    directory: path.join(__dirname, 'public'),
    publicPath: '/static/',
  },
    port: 8080,
    hot: true,
    open: false,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
    }),
  ],
};

// Preload スクリプト用の設定
const preloadConfig = {
  entry: './src/renderer/preload.ts',
  target: 'electron-preload',
  output: {
    filename: 'preload.js',
    path: path.resolve(__dirname, 'dist', 'renderer'),
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
};

module.exports = [rendererConfig, preloadConfig];
