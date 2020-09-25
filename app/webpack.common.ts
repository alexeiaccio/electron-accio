import * as path from 'path'
import * as HtmlWebpackPlugin from 'html-webpack-plugin'
// import * as CleanWebpackPlugin from 'clean-webpack-plugin'
import * as webpack from 'webpack'
import * as merge from 'webpack-merge'

import { getReplacements } from './app-info'


export const externals = ['7zip']
if (process.env.NODE_ENV === 'development') {
  externals.push('devtron')
}

const outputDir = 'out'
export const replacements = getReplacements()

const commonConfig: webpack.Configuration = {
  optimization: {
    noEmitOnErrors: true,
  },
  externals: externals,
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, '..', outputDir),
    libraryTarget: 'commonjs2',
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        include: path.resolve(__dirname, 'src'),
        use: [
          {
            loader: 'awesome-typescript-loader',
            options: {
              useBabel: true,
              useCache: true,
            },
          },
        ],
        exclude: /node_modules/,
      },
      {
        test: /\.node$/,
        loader: 'awesome-node-loader',
        options: {
          name: '[name].[ext]',
        },
      },
    ],
  },
  // plugins: [
  //   new CleanWebpackPlugin([outputDir], { verbose: false }),
  //   // This saves us a bunch of bytes by pruning locales (which we don't use)
  //   // from moment.
  //   new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
  // ],
  resolve: {
    extensions: ['.js', '.ts', '.tsx'],
    modules: [path.resolve(__dirname, 'node_modules/')],
  },
  node: {
    __dirname: false,
    __filename: false,
  },
}

export const main = merge({}, commonConfig, {
  entry: { main: path.resolve(__dirname, 'src/main-process/main') },
  target: 'electron-main',
  plugins: [
    new webpack.DefinePlugin(
      Object.assign({}, replacements, {
        __PROCESS_KIND__: JSON.stringify('main'),
      })
    ),
  ],
})

export const renderer = merge({}, commonConfig, {
  entry: { renderer: path.resolve(__dirname, 'src/ui/index') },
  target: 'electron-renderer',
  module: {
    rules: [
      {
        test: /\.(jpe?g|png|gif|ico)$/,
        use: ['file?name=[path][name].[ext]'],
      },
      {
        test: /\.cmd$/,
        loader: 'file-loader',
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'static', 'index.html'),
      chunks: ['renderer'],
    }),
    new webpack.DefinePlugin(
      Object.assign({}, replacements, {
        __PROCESS_KIND__: JSON.stringify('ui'),
      })
    ),
  ],
})
