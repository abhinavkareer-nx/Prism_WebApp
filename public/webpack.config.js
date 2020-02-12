var webpack = require('webpack');
var path = require('path');
var SWPrecacheWebpackPlugin = require('sw-precache-webpack-plugin');
console.log('__dirname', __dirname);
module.exports = {
  entry: ["babel-polyfill", './src/index.js'],
  output: {
    path: path.resolve(__dirname, './'),
    filename: 'bundle.js',
  },
  devtool: 'sourcemap',
  // watch: true,
  module: {
    loaders: [
      {
        test: /.css$/,
        loader: 'style-loader!css-loader'
      },
      {
        test: /\.s?less$/i,
        exclude:'/node_modules/',
        use: [
          'style-loader',
          'css-loader',
          'less-loader'
        ]
      },
      {
        test: /\.js?$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader',
        query: {
          presets: ['react', 'es2015', 'stage-0'],
          plugins: ['react-html-attrs', 'transform-class-properties',
            'transform-decorators-legacy', 'transform-runtime']
        }
      }
    ]
  },
  // plugins: [
  //   new SWPrecacheWebpackPlugin(
  //     {
  //       cacheId: 'sw-pwa-cache',
  //       filename: 'service-worker.js',
  //       staticFileGlobs: [
  //         './static/style.less',
  //         './index.html',
  //         './images/**.*'
  //       ],
  //       staticFileGlobsIgnorePatterns: [/\.map$/],
  //       mergeStaticsConfig: true,
  //       runtimeCaching: [
  //         {
  //           urlPattern: /.*\/mock_data\/.*/,
  //           handler: 'fastest'
  //         }
  //       ]
  //     }
  //   )
  // ]
}