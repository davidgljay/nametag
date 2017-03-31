const path = require('path')
const autoprefixer = require('autoprefixer')
const Copy = require('copy-webpack-plugin')
const LicenseWebpackPlugin = require('license-webpack-plugin')
const webpack = require('webpack')

// Edit the build targets and embeds below.

module.exports = {
  devtool: '#cheap-module-source-map',
  entry: Object.assign({}, {
    'app': [
      'babel-polyfill',
      path.join(__dirname, 'app/scripts/app')
    ]
  }),
  output: {
    path: path.join(__dirname, 'dist', 'public', 'scripts'),
    publicPath: '/public/',
    filename: '[name].js',
    library: 'Nametag'
  },
  module: {
    rules: [
      {
        loader: 'babel-loader',
        exclude: /node_modules/,
        test: /\.js$/,
        query: {
          cacheDirectory: true,
          sourceMap: true
        }
      },
      {
        loader: 'json-loader',
        test: /\.json$/,
        exclude: /node_modules/
      },
      {
        loader: 'url-loader?limit=100000',
        test: /\.png$/
      },
      {
        loader: 'file-loader',
        test: /\.(jpg|png|gif|svg)$/
      },
      {
        loader: 'url-loader?limit=100000',
        test: /\.woff$/
      },
      {
        test: /\.(graphql|gql)$/,
        exclude: /node_modules/,
        loader: 'graphql-tag/loader'
      }
    ]
  },
  plugins: [
    new LicenseWebpackPlugin({
      pattern: /^(MIT|ISC|BSD.*)$/,
      addUrl: true
    }),
    new Copy([
      {
        from: path.join(__dirname, 'app', 'images'),
        to: path.join(__dirname, 'dist', 'public', 'images')
      },
      {
        from: path.join(__dirname, 'app', 'sw.js'),
        to: path.join(__dirname, 'dist', 'public', 'sw.js')
      },
      {
        from: path.join(__dirname, 'app', 'manifest.json'),
        to: path.join(__dirname, 'dist', 'public', 'manifest.json')
      },
      {
        from: path.join(__dirname, 'app', 'index.html'),
        to: path.join(__dirname, 'dist', 'public', 'index.html')
      },
      {
        from: path.join(__dirname, 'app', 'styles'),
        to: path.join(__dirname, 'dist', 'public', 'styles')
      }
    ]),
    autoprefixer,
    new webpack.ProvidePlugin({
      'fetch': 'imports-loader?this=>global!exports-loader?global.fetch!whatwg-fetch'
    }),
    new webpack.DefinePlugin({
      'process.env': {
        'VERSION': `"${require('./package.json').version}"`
      }
    })
  ],
  resolve: {
    modules: [
      path.resolve(__dirname, 'app'),
      'node_modules'
    ]
  }
}
