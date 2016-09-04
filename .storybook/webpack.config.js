const path = require('path')

module.exports = {
  module: {
    loaders: [
      {
        test: /.+[^m][^i][^n]css$/,
        loader: 'style!css-loader?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]',
      },
      {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'url?limit=50000',
      },
      {
        test: /\.svg$/,
        loader: 'url?limit=50000',
      },
      {
        test: /\.ttf$/,
        loader: 'url?limit=50000',
      },
      {
        test: /\.eot$/,
        loader: 'url?limit=50000',
      },
    ],
  },
}
