const path = require('path')
const ForkTsCheckerNotifierWebpackPlugin = require('fork-ts-checker-notifier-webpack-plugin')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
const nodeExternals = require('webpack-node-externals')

const main = ['core-js', './src/index.ts']

module.exports = {
  context: process.cwd(), // to automatically find tsconfig.json
  entry: {
    main,
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
  },
  plugins: [
    new ForkTsCheckerWebpackPlugin({
      tslint: false,
      useTypescriptIncrementalApi: true,
      memoryLimit: 4096,
    }),
    new ForkTsCheckerNotifierWebpackPlugin({
      title: 'TypeScript',
      excludeWarnings: false,
    }),
  ],
  module: {
    rules: [
      {
        test: /.tsx?$/,
        use: [{ loader: 'ts-loader', options: { transpileOnly: true } }],
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  devtool: 'inline-source-map',
  externals: [nodeExternals()],
}
