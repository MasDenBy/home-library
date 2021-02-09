const path = require('path');
const FilterWarningsPlugin = require('webpack-filter-warnings-plugin');
const CircularDependencyPlugin = require('circular-dependency-plugin')

module.exports = {
  watch: false,
  entry: './src/index.ts',
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
    filename: 'index.js',
    path: path.resolve(__dirname, './dist'),
  },
  plugins: [
    new FilterWarningsPlugin({
      exclude: [/typeorm/, /app-root-path/, /express/, /inversify/]
    }),
    new CircularDependencyPlugin({
      exclude: /a\.js|node_modules/,
      failOnError: false,
      allowAsyncCycles: false,
      cwd: process.cwd(),
    })
  ]
};