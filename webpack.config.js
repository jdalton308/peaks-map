
'use strict';

const webpack           = require('webpack');
const path              = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const OUT_PATH          = path.resolve('./dist');


module.exports = {
  entry: {
    main: './client/app/app.js'
  },
  output: {
    path: OUT_PATH,
    // publicPath: PUBLIC_PATH,
    filename: 'app.js'
  },

  devServer: {
    contentBase: './dist',
    historyApiFallback: true,
    host: '0.0.0.0',
    inline: true,
    port: 5280,
    stats: 'minimal',
    useLocalIp: true
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      {
        test: /\.css$/,
        use: [
          'vue-style-loader',
          'css-loader'
        ]
      },
      {
        test: /\.scss$/,
        use: [
          'vue-style-loader',
          'css-loader',
          'sass-loader'
        ]
      },
      {
        test: /\.sass$/,
        use: [
          'vue-style-loader',
          'css-loader',
          'sass-loader?indentedSyntax'
        ]
      },
      {
        test: /\.(gif|jpg|png|svg)$/,
        loader: 'file-loader',
        options: {
          emitFile: false,
          name: './assets/images/[name].[ext]'
        }
      },
      {
        test: /\.html$/,
        loader: 'file-loader',
        options: {
          context: './client/',
          name: '[path][name].[ext]'
        }
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: {
            'scss': [
              'vue-style-loader',
              'css-loader',
              'sass-loader'
            ],
            'sass': [
              'vue-style-loader',
              'css-loader',
              'sass-loader?indentedSyntax'
            ]
          }
        }
      }
    ]
  },

  plugins: [
    new CopyWebpackPlugin([
      // Assets
      { from: 'client/app/assets', to: 'assets' },
    ])
  ],

  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.esm.js'
    },
    extensions: ['*', '.js', '.vue', '.json']
  }
};