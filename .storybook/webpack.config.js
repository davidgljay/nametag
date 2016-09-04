const path = require('path')

module.exports = {
  module: {
    loaders: [
      {
        test: /.css$/,
        loader: 'style!css-loader?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]',
      },
    ],
  },
}
