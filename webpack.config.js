// webpack.config.js

var path = require('path');
var webpack = require('webpack');
var CommonsChunkPlugin = webpack.optimize.CommonsChunkPlugin;
var webpackTargetElectronRenderer = require('webpack-target-electron-renderer');

var config = {
  devtool: 'source-map',
  debug: true,

  entry: {
    'angular2': [
      'rxjs',
      'reflect-metadata',
      'angular2/core',
      'angular2/router',
      'angular2/http'
    ],
    'app': './app/app'
  },

  output: {
    path: __dirname + '/build/',
    publicPath: 'build/',
    filename: '[name].js',
    sourceMapFilename: '[name].js.map',
    chunkFilename: '[id].chunk.js'
  },

  resolve: {
    extensions: ['','.ts','.js','.json', '.css', '.html']
  },

  module: {
    loaders: [
      {
        test: /\.ts$/,
        loader: 'ts',
        exclude: [ /node_modules/ ]
      }
    ]
  },

  plugins: [
    new CommonsChunkPlugin({ name: 'angular2', filename: 'angular2.js', minChunks: Infinity }),
    new CommonsChunkPlugin({ name: 'common',   filename: 'common.js' })
  ]
};

config.target = webpackTargetElectronRenderer(config);

module.exports = config;
