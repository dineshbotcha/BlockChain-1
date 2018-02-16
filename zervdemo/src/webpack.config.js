const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: { 
    app: './app/javascripts/app.js',
    accountinventory: './app/javascripts/accountinventory.js',
    buyer: './app/javascripts/buyer.js',
    seller: './app/javascripts/seller.js',
    portalhistory: './app/javascripts/portalhistory.js',
    reserve: './app/javascripts/reserve.js',
    index: './app/javascripts/index.js',
    redeem: './app/javascripts/redeem.js',
    node: './app/javascripts/node.js'
    },
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: '[name].js'
  },
  plugins: [
    // Copy our app's index.html to the build folder.
    new CopyWebpackPlugin([
      { from: './app/index.html', to: "index.html" },
      { from: './app/registration.html', to: "registration.html" },
      { from: './app/portalhistory.html', to: "portalhistory.html" },
      { from: './app/accountinventory.html', to:"accountinventory.html"},
      { from: './app/buyer.html', to:"buyer.html"},
      { from: './app/seller.html', to:"seller.html"},
      { from: './app/reserve.html', to:"reserve.html"},
      { from: './app/home.html', to:"home.html"},
      { from: './app/redeem.html', to:"redeem.html"},
      { from: './app/node.html', to:"node.html"}
    ])
  ],
  module: {
    rules: [
      {
       test: /\.css$/,
       use: [ 'style-loader', 'css-loader' ]
      }
    ],
    loaders: [
      { test: /\.json$/, use: 'json-loader' },
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015'],
          plugins: ['transform-runtime']
        }
      }
    ]
  }
}

