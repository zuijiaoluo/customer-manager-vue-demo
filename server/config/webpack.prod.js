/* eslint-disable import/no-extraneous-dependencies */
const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const baseConfig = require('./webpack.base');

const ROOT = path.resolve(__dirname, '..', '..');

module.exports = merge(baseConfig, {
  output: {
    filename: 'js/[name].[chunkhash].js',
  },
  // add sourcemaps to production build
  devtool: '#source-map',
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: {
            sass: ExtractTextPlugin.extract({
              loader: 'css-loader!sass-loader?indentedSyntax',
              fallbackLoader: 'vue-style-loader',
            }),
          },
        },
      },
    ],
  },
  plugins: [
    // http://vue-loader.vuejs.org/en/workflow/production.html
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"',
      },
    }),

    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false,
    }),

    // extract css into its own file
    new ExtractTextPlugin(path.join('css', 'style.[contenthash].css')),

    // let webpack generate all your favicons and icons for you
    // https://github.com/jantimon/favicons-webpack-plugin
    new FaviconsWebpackPlugin({
      logo: path.join(ROOT, 'src', 'assets', 'logo.png'),
      persistentCache: false,
      emitStats: false,
      icons: {
        android: true,
        appleIcon: true,
        appleStartup: false,
        coast: false,
        favicons: true,
        firefox: false,
        opengraph: true,
        twitter: true,
        yandex: false,
        windows: false,
      },
    }),

    // generate dist index.html with correct asset hash for caching.
    // you can customize output by editing /index.html
    // see https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      filename: path.join(ROOT, 'client', 'index.html'),
      template: path.join(ROOT, 'src', 'index.html'),
      inject: true,
      minify: {
        removeComments: true,
        // more options:
        // https://github.com/kangax/html-minifier#options-quick-reference
      },
      // necessary to consistently work with multiple chunks via CommonsChunkPlugin
      chunksSortMode: 'dependency',
    }),

    // split vendor js into its own file
    // prevents hash from being updated whenever app bundle is updated
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks(module) {
        // any required modules inside node_modules are extracted to vendor
        const nodeModules = path.join(ROOT, 'node_modules');
        return (
          module.resource &&
          /\.js$/.test(module.resource) &&
          module.resource.indexOf(nodeModules) === 0
        );
      },
    }),

    // extract webpack runtime and module manifest into its own file
    // prevents hash from being updated whenever app bundle is updated
    new webpack.optimize.CommonsChunkPlugin({
      name: 'manifest',
      chunks: ['vendor'],
    }),
  ],
});
