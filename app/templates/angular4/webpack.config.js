var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var CompressionPlugin = require('compression-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var path = require('path');

module.exports = {
  entry: {
    'polyfills': './client/polyfills.ts',
    'vendor': './client/vendor.ts',
    'app': './client/app.ts'
  },

  resolve: {
    extensions: ['.ts', '.js', '.scss']
  },

  module: {
    rules: [{
      test: /\.ts$/,
      loaders: [{
        loader: 'awesome-typescript-loader',
        options: { configFileName: path.resolve(__dirname, 'tsconfig.json') }
      }, 'angular2-template-loader']
    },
      {
        test: /\.html$/,
        loader: 'html-loader'
      },
      {
        test: /\.scss$/,

        loaders: ['to-string-loader', ].concat(ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: [
            { loader: 'css-loader', query: { modules: false, sourceMaps: true } },
            { loader: 'sass-loader', query: { sourceMaps: true } }
          ]
        }))
      }

    ]
  },

  plugins: [

    new ExtractTextPlugin('stylesheet.css'),

    new CopyWebpackPlugin([{ from: path.resolve(__dirname, 'client/assets') }]),
    // Workaround for angular/angular#11580

    new webpack.ContextReplacementPlugin(
      /angular(\\|\/)core(\\|\/)@angular/,
      path.resolve(__dirname, './client')
    ),
    new webpack.optimize.CommonsChunkPlugin({
      name: ['app', 'vendor', 'polyfills']
    }),

    new HtmlWebpackPlugin({
      template: 'client/index.html'
    })
  ],

  output: {
    path: path.join(__dirname, 'public'),
    filename: '[name].js',
    chunkFilename: '[id].chunk.js'
  },
};

if (process.env.NODE_ENV === 'production') {
  module.exports.devtool = false;
  module.exports.plugins = (module.exports.plugins || []).concat([
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
        pure_funcs: ['console.log', 'window.console.log.apply']
      },
      mangle: false
    }),
    new webpack.optimize.AggressiveMergingPlugin(),
    new CompressionPlugin({
      asset: "[path].gz[query]",
      algorithm: "gzip",
      test: /\.js$|\.html$/,
      threshold: 10240,
      minRatio: 0
    })
  ])
}
