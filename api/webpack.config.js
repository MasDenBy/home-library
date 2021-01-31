const path = require('path');
const FilterWarningsPlugin = require('webpack-filter-warnings-plugin');

module.exports = {
  watch: false,
  entry: './src/app.ts',
  devtool: 'inline-source-map',
  mode: 'development',
  target: 'node',
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  output: {
    filename: 'app.js',
    path: path.resolve(__dirname, './dist'),
  },
  plugins: [
    new FilterWarningsPlugin({
      exclude: [/typeorm/, /app-root-path/, /express/, /inversify/]
    })
  ]
};