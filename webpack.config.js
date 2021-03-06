const path = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const WebpackShellPlugin = require('webpack-shell-plugin');

//
// Configuration for the client-side bundle (client)
// -----------------------------------------------------------------------------
const clientConfig = {
  // Tell webpack the root file of our
  // server application
  entry: [
    'babel-polyfill',
    './src/client/index.js'
  ],

  // Tell webpack where to put the output file
  // that is generated
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'client')
  },

  // Tell webpack to run babel on every file it runs through
  module: {
    rules: [
      {
        test: /\.js?$/,
        loader: 'babel-loader',
        exclude: '/node_modules/',
        options: {
          presets: [
            'react',
            'stage-0',
            ['env', { targets: { browsers: ['last 2 versions'] } }]
          ],
          compact: true,
          plugins: ['transform-class-properties', 'babel-plugin-styled-components']
        }
      },
    ]
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env.BROWSER': true
    }),

    // new CopyWebpackPlugin([
    //   {
    //     from: path.resolve(__dirname, 'src/client/assets'),
    //     to: path.resolve(__dirname, 'client/assets')
    //   }
    // ]),

    new WebpackShellPlugin({ onBuildEnd: [ "webpack --config webpack.server.config.js --watch" ] })
  ]
};


module.exports = clientConfig;