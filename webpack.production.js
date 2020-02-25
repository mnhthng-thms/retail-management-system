const path = require('path');

const nodeExternals = require('webpack-node-externals');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const buildPath = path.resolve(__dirname, 'dist');
const buildPathForViews = path.resolve(__dirname, 'dist/views');

module.exports = [
  {
    target: 'node',
    node: {
      // need these configurations when building Express app
      __dirname: false,
      __filename: false,
    },
    externals: [nodeExternals()],

    /* This option controls if and how source maps are generated.
       https://webpack.js.org/configuration/devtool/ 
     */
    devtool: 'source-map',

    /* https://webpack.js.org/concepts/entry-points/#multi-page-application */
    entry: {
      server: path.resolve(__dirname, 'src/server.js'),
    },

    /* how to write the compiled files to disk
       https://webpack.js.org/concepts/output/ */
    output: {
      filename: '[name].js',
      publicPath: '/',
      path: buildPath
    },

    /* https://webpack.js.org/concepts/loaders/ */
    module: {
      rules: [
        {
          test: /\.js$/i,
          exclude: /node_modules/,
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            plugins: [
              "@babel/plugin-transform-runtime",
              "@babel/plugin-transform-destructuring",
              "@babel/plugin-proposal-object-rest-spread"
            ]
          }
        },
      ]
    },

    // https://webpack.js.org/configuration/optimization/
    optimization: {
      minimize: true,
      minimizer: [
        new TerserPlugin({
          cache: true,
          parallel: true,
          sourceMap: true
        }),
        new OptimizeCssAssetsPlugin({})
      ]
    }
  }
]