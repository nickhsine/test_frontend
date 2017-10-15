const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: {
    main: './src/client.js',
  },
  output: {
    filename: process.env.NODE_ENV === 'production' ? '[name].[hash].bundle.js' : '[name].dev.bundle.js',
    path: path.join(__dirname, 'dist'),
    publicPath: '/dist/'
  },
  resolve: {
    alias: {
      components: path.resolve(__dirname, 'src/components/'),
      static: path.resolve(__dirname, 'static/'),
      helpers: path.resolve(__dirname, 'src/helpers/')
    }
  },
  devtool: 'inline-source-map',
  devServer: {
    hot: true,
    host: 'localhost',
    port: 5000
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          presets: ['env', 'stage-0', 'react']
        }
      },
      {
        test: /\.(ttf|eot|otf|svg|png)$/,
        loader: 'file-loader?emitFile=false'
      }
    ]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: process.env.NODE_ENV === 'prodcution' ? '"production"' : '"development"',
      },
      __SERVER__: false
    }),
  ],
};
