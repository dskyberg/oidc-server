const path = require('path');

module.exports = {
  entry: './src/views/index.jsx',
  mode: process.env.NODE_ENV || 'development',
  output: {
    path: path.resolve(__dirname, './public/js'),
    filename: 'bundle.js',
    publicPath: '/',
  },
  module: {
    rules: [
      {
        test: /\.js|jsx$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
      {
          test: /\.woff(2)?|ttf|eot$/,
          exclude: /node_modules/,
          loader: 'file-loader',
          options: {
              name: '[name].[ext]',
              outputPath: path.resolve(__dirname, './public/fonts'),
          }
      }
  ],
  },
  resolve: {
    extensions: ['*', '.js', '.jsx']
},
};
