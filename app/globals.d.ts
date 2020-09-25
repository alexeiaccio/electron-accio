/* eslint-disable @typescript-eslint/interface-name-prefix */
/** Is the app running in dev mode? */
declare const __DEV__: boolean

/** The OAuth client id the app should use */
declare const __OAUTH_CLIENT_ID__: string | undefined

/** The OAuth secret the app should use. */
declare const __OAUTH_SECRET__: string | undefined

/** Is the app being built to run on Darwin? */
declare const __DARWIN__: boolean

/** Is the app being built to run on Win32? */
declare const __WIN32__: boolean

/** Is the app being built to run on Linux? */
declare const __LINUX__: boolean

/**
 * The commit id of the repository HEAD at build time.
 * Represented as a 40 character SHA-1 hexadecimal digest string.
 */
declare const __SHA__: string

/**
 * The currently executing process kind, this is specific to desktop
 * and identifies the processes that we have.
 */
declare const __PROCESS_KIND__:
  | 'main'
  | 'ui'

declare namespace NodeJS {
  interface Process extends EventEmitter {
    once(event: 'uncaughtException', listener: (error: Error) => void): this
    on(event: 'uncaughtException', listener: (error: Error) => void): this
    removeListener(event: 'exit', listener: Function): this
    once(event: 'exit', listener: Function): this
  }
}

interface XMLHttpRequest extends XMLHttpRequestEventTarget {
  /**
   * Initiates the request. The optional argument provides the request body. The argument is ignored if request method is GET or HEAD.
   * Throws an "InvalidStateError" DOMException if either state is not opened or the send() flag is set.
   */
  send(body?: Document | BodyInit | null): void
}

declare namespace Electron {
  interface RequestOptions {
    readonly method: string
    readonly url: string
    readonly headers: any
  }

  type AppleActionOnDoubleClickPref = 'Maximize' | 'Minimize' | 'None'

  interface SystemPreferences {
    getUserDefault(
      key: 'AppleActionOnDoubleClick',
      type: 'string'
    ): AppleActionOnDoubleClickPref
  }
}
