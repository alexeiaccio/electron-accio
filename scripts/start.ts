import * as express from 'express'
import * as webpack from 'webpack'
import * as devMiddleware from 'webpack-dev-middleware'
import * as hotMiddleware from 'webpack-hot-middleware'

/** Throw an error. */
export function fatalError(msg: string): never {
  throw new Error(msg)
}

/**
 * Utility function used to achieve exhaustive type checks at compile time.
 *
 * If the type system is bypassed or this method will throw an exception
 * using the second parameter as the message.
 *
 * @param x         Placeholder parameter in order to leverage the type
 *                  system. Pass the variable which has been type narrowed
 *                  in an exhaustive check.
 *
 * @param message   The message to be used in the runtime exception.
 *
 */
export function assertNever(x: never, message: string): never {
  throw new Error(message)
}

/**
 * Unwrap a value that, according to the type system, could be null or
 * undefined, but which we know is not. If the value _is_ null or undefined,
 * this will throw. The message should contain the rationale for knowing the
 * value is defined.
 */
export function forceUnwrap<T>(message: string, x: T | null | undefined): T {
  if (x == null) {
    return fatalError(message)
  } else {
    return x
  }
}

import configs = require('../app/webpack.development')

import { run } from './run'

function getPortOrDefault() {
  const port = process.env.PORT
  if (port != null) {
    const result = parseInt(port)
    if (isNaN(result)) {
      throw new Error(`Unable to parse '${port}' into valid number`)
    }
    return result
  }

  return 3000
}

function startApp() {
  const runningApp = run({ stdio: 'inherit' })
  if (runningApp == null) {
    console.error(
      "Couldn't launch the app. You probably need to build it first. Run `yarn build:dev`."
    )
    process.exit(1)
    return
  }

  runningApp.on('close', () => {
    process.exit(0)
  })
}

if (process.env.NODE_ENV === 'production') {
  startApp()
} else {
  const rendererConfig = configs[1]

  const server = express()
  const compiler = webpack(rendererConfig)
  const port = getPortOrDefault()

  const message = 'Could not find public path from configuration'
  server.use(
    devMiddleware(compiler, {
      publicPath: forceUnwrap(
        message,
        forceUnwrap(message, forceUnwrap(message, rendererConfig).output).publicPath
      ),
      logLevel: 'error',
    })
  )

  server.use(hotMiddleware(compiler))

  server.listen(port, 'localhost', (err: Error | null) => {
    if (err) {
      console.log(err)
      process.exit(1)
      return
    }

    console.log(`Server running at http://localhost:${port}`)
    startApp()
  })
}
