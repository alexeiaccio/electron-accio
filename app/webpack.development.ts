import * as common from './webpack.common'

import * as webpack from 'webpack'
import * as merge from 'webpack-merge'

const config: webpack.Configuration = {
  mode: 'development',
  devtool: 'source-map',
}

const mainConfig = merge({}, common.main, config)

// TODO:
// if we have a PORT environment variable set and running `yarn start` we also
// need to update this script to use the same port when building because this
// is currently hard-coded.

const webpackHotModuleReloadUrl =
  'webpack-hot-middleware/client?path=http://localhost:3000/__webpack_hmr'

const getRendererEntryPoint = () => {
  const entry = common.renderer.entry as webpack.Entry
  if (entry == null) {
    throw new Error(
      `Unable to resolve entry point. Check webpack.common.ts and try again`
    )
  }

  return entry.renderer as string
}

const rendererConfig = merge({}, common.renderer, config, {
  entry: {
    renderer: [webpackHotModuleReloadUrl, getRendererEntryPoint()],
  },
  output: {
    publicPath: 'http://localhost:3000/build/',
  },
  plugins: [new webpack.HotModuleReplacementPlugin()],
})


export = [
  mainConfig,
  rendererConfig,
]
