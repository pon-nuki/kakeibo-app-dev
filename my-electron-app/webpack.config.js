const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const webpack = require('webpack');

module.exports = (env, argv) => {
  const mode = argv.mode || 'development';

  const rendererConfig = {
    mode,
    entry: './src/renderer/index.tsx',
    output: {
      filename: 'renderer.js',
      path: path.resolve(__dirname, 'dist', 'renderer'),
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
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
          },
        },
        {
          test: /\.css$/,
          use: [MiniCssExtractPlugin.loader, 'css-loader'],
          exclude: /node_modules/,
        },
      ],
    },
    devtool: 'source-map',
    devServer: {
      static: {
        directory: path.join(__dirname, 'public'),
        publicPath: '/static/',
      },
      port: 8080,
      hot: true,
      open: false,
      headers: {
        'Content-Security-Policy':
          "default-src 'self'; " +
          "script-src 'self' 'nonce-abc123' 'unsafe-inline' ; " +
          "style-src 'self' 'nonce-abc123' 'unsafe-inline' ; " +
          "img-src 'self' data:; " +
          "connect-src 'self' ws://localhost:8080 http://localhost:3000;",
      },
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(mode),
      }),
      new HtmlWebpackPlugin({
        template: './public/index.html',
        scriptLoading: 'defer',
        inject: 'body',
        nonce: 'abc123',
      }),
      new MiniCssExtractPlugin({ filename: 'styles.css' }),
    ],
  };

  const preloadConfig = {
    mode,
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
          use: {
            loader: 'ts-loader',
            options: {
              configFile: 'tsconfig.preload.json'
            }
          },
          exclude: /node_modules/,
        },
      ],
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(mode),
      }),
    ],
  };

  const mainConfig = {
    mode,
    entry: './src/main/main.ts',
    target: 'electron-main',
    externals: {
      express: 'commonjs express',
      sqlite3: 'commonjs sqlite3',
    },
    output: {
      filename: 'main.js',
      path: path.resolve(__dirname, 'dist', 'main'),
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
    plugins: [
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(mode),
      }),
    ],
  };

  return [rendererConfig, preloadConfig, mainConfig];
};
