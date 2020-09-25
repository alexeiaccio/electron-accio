import * as common from './webpack.common'

import * as webpack from 'webpack'
import * as merge from 'webpack-merge'
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer'
const MinifyPlugin = require('babel-minify-webpack-plugin')

const config: webpack.Configuration = {
  mode: 'production',
  devtool: 'source-map',
  optimization: {
    minimizer: [new MinifyPlugin()],
  },
}

const mainConfig = merge({}, common.main, config)

const rendererConfig = merge({}, common.renderer, config, {
  plugins: [
    new BundleAnalyzerPlugin({
      // this generates the static HTML file to view afterwards, rather
      // than disrupting the user
      analyzerMode: 'static',
      openAnalyzer: false,
      // we can't emit this directly to the dist directory because the
      // build script immediately blows away dist after webpack is done
      // compiling the source into bundles
      reportFilename: 'renderer.report.html',
    }),
  ],
})


export = [
  mainConfig,
  rendererConfig,
]
