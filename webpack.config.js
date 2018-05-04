var webpack = require('webpack');
var path = require('path');

const Autoprefixer = require('autoprefixer');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
// const BrowserSyncPlugin = require('browser-sync-webpack-plugin');

const mode = "development";
// const mode = "production";
module.exports = {
  mode,
  devtool: 'inline-source-map',
  entry: {
    newtab:   ['./js/newtab.js','./stylesheets/style.sass'],
    background: './js/background.js'
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].min.js'
  },
  resolve: {
    alias: {
      'waypoints': 'waypoints/lib/jquery.waypoints.js'
    },
    extensions: ['.js', '.sass', '.scss']
  },
  module: {
    rules: [
    {
      test: /\.js$/, exclude: /node_modules/, loader: "babel-loader"
    },
    {
      test: /\.css$/,
      use: [
        MiniCssExtractPlugin.loader,
        'css-loader',
        'postcss-loader',
        'sass-loader',
      ],
    },
    {
      test: /\.s[ac]ss$/,
      use: [
        MiniCssExtractPlugin.loader,
        {
          loader: 'css-loader',
          options: {
            minimize: true,
            sourceMap: mode === 'development',
            importLoaders: 3,
          },
        },
        {
          loader: 'postcss-loader',
          options: {
            sourceMap: mode === 'development',
            plugins: () => [
              Autoprefixer(),
            ],
          },
        },
        {
          loader: 'resolve-url-loader',
        },
        {
          loader: 'sass-loader',
          options: {
            sourceMap: mode === 'development',
            // includePaths: NodeNeat.includePaths,
          },
        }
      ]
    },
    {
      test: /\.(jpe?g|png|gif|svg)$/i,
      loader: "file-loader?name=[path][name].[ext]"
    },
    {
      test: /\.css$/,
      use: [
        MiniCssExtractPlugin.loader,
        "css-loader"
      ]
    }
  ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: "[name].css",
      chunkFilename: "[id].css"
    })
  ]
};
