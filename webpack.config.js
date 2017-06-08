var webpack = require('webpack');
var path = require('path');
require('babel-polyfill');
require('babel-loader');
var webpackUglifyJsPlugin = require('webpack-uglify-js-plugin');

module.exports = {
  devtool: 'inline-source-map',
  entry: {
  // styles : './stylesheets/style.sass',
  newtab:   ['./js/newtab.js','./stylesheets/style.sass'],
  background: './js/background.js'
  },
  watch: true,
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].min.js'
  },
  resolve: {
    alias: {
      'waypoints': 'waypoints/lib/jquery.waypoints.js'
    },
    extensions: ['.js', '.sass']
  },
  module: {
    loaders: [
      {
        // Only run .js and .jsx files through Babel
        test: /\.jsx?$/,
        include: path.resolve(__dirname, "js"),
        exclude: path.resolve(__dirname, "node_modules"),

        loader: 'babel-loader',
        query: {
          presets: ['es2015'],
          plugins: []
        }
      },
      { test: /\.(jpe?g|png|gif|svg)$/i, loader: "file-loader?name=[path][name].[ext]" },
      {
        test: /\.sass$/,
        include: path.resolve(__dirname, "stylesheets"),
        loaders: ["style-loader", "css-loader", "sass-loader"]
      }
    ]
  },
  plugins: [
    new webpack.NoErrorsPlugin(),
    new webpackUglifyJsPlugin({
      cacheFolder: path.resolve(__dirname, 'dist/cached_uglify/'),
      debug: true,
      minimize: true,
      sourceMap: true,
      output: {
        comments: false
      },
      compressor: {
        warnings: false
      }
    })
  ]
};
