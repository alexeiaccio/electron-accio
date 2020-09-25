/* eslint-disable no-sync */
/// <reference path="../../globals.d.ts" />

import { BrowserWindow, ipcMain } from 'electron'
import { Emitter, Disposable } from 'event-kit'
import * as path from 'path'
import * as windowStateKeeper from 'electron-window-state'
import * as fileUrl from 'file-url'

export function now(): number {
  const time = process.hrtime()
  return time[0] * 1000 + time[1] / 1000000
}

export function encodePathAsUrl(...pathSegments: string[]): string {
  const filePath = path.resolve(...pathSegments)
  return fileUrl(filePath)
}

type URLActionType = string

export class AppWindow {
  private window: Electron.BrowserWindow
  private emitter = new Emitter()

  private _loadTime: number | null = null
  private _rendererReadyTime: number | null = null

  private minWidth = 960
  private minHeight = 660

  public constructor() {
    const savedWindowState = windowStateKeeper({
      defaultWidth: this.minWidth,
      defaultHeight: this.minHeight,
    })

    const windowOptions: Electron.BrowserWindowConstructorOptions = {
      x: savedWindowState.x,
      y: savedWindowState.y,
      width: savedWindowState.width,
      height: savedWindowState.height,
      minWidth: this.minWidth,
      minHeight: this.minHeight,
      show: false,
      // This fixes subpixel aliasing on Windows
      // See https://github.com/atom/atom/commit/683bef5b9d133cb194b476938c77cc07fd05b972
      backgroundColor: '#fff',
      webPreferences: {
        // Disable auxclick event
        // See https://developers.google.com/web/updates/2016/10/auxclick
        disableBlinkFeatures: 'Auxclick',
        // Enable, among other things, the ResizeObserver
        experimentalFeatures: true,
      },
      acceptFirstMouse: true,
    }

    if (__DARWIN__) {
      windowOptions.titleBarStyle = 'hidden'
    } else if (__WIN32__) {
      windowOptions.frame = false
    } else if (__LINUX__) {
      // windowOptions.icon = path.join(__dirname, 'static', 'icon-logo.png')
    }

    this.window = new BrowserWindow(windowOptions)

    if (__WIN32__) {
      // workaround for known issue with fullscreen-ing the app and restoring
      // is that some Chromium API reports the incorrect bounds, so that it
      // will leave a small space at the top of the screen on every other
      // maximize
      //
      // adapted from https://github.com/electron/electron/issues/12971#issuecomment-403956396
      //
      // can be tidied up once https://github.com/electron/electron/issues/12971
      // has been confirmed as resolved
      this.window.once('ready-to-show', () => {
        this.window.on('unmaximize', () => {
          setTimeout(() => {
            const bounds = this.window.getBounds()
            bounds.width += 1
            this.window.setBounds(bounds)
            bounds.width -= 1
            this.window.setBounds(bounds)
          }, 5)
        })
      })
    }
  }

  public load() {
    let startLoad = 0
    // We only listen for the first of the loading events to avoid a bug in
    // Electron/Chromium where they can sometimes fire more than once. See
    // See
    // https://github.com/desktop/desktop/pull/513#issuecomment-253028277. This
    // shouldn't really matter as in production builds loading _should_ only
    // happen once.
    this.window.webContents.once('did-start-loading', () => {
      this._rendererReadyTime = null
      this._loadTime = null

      startLoad = now()
    })

    this.window.webContents.once('did-finish-load', () => {
      if (process.env.NODE_ENV === 'development') {
        this.window.webContents.openDevTools()
      }

      this._loadTime = now() - startLoad

      this.maybeEmitDidLoad()
    })

    this.window.webContents.on('did-finish-load', () => {
      this.window.webContents.setVisualZoomLevelLimits(1, 1)
    })

    this.window.webContents.on('did-fail-load', () => {
      this.window.webContents.openDevTools()
      this.window.show()
    })

    // TODO: This should be scoped by the window.
    ipcMain.once(
      'renderer-ready',
      (event: Electron.IpcMessageEvent, readyTime: number) => {
        this._rendererReadyTime = readyTime

        this.maybeEmitDidLoad()
      }
    )

    this.window.on('focus', () => this.window.webContents.send('focus'))
    this.window.on('blur', () => this.window.webContents.send('blur'))

    this.window.loadURL(encodePathAsUrl(__dirname, 'index.html'))
  }

  /** Send the URL action to the renderer. */
  public sendURLAction(action: URLActionType) {
    this.show()

    this.window.webContents.send('url-action', { action })
  }

  /**
   * Emit the `onDidLoad` event if the page has loaded and the renderer has
   * signalled that it's ready.
   */
  private maybeEmitDidLoad() {
    if (!this.rendererLoaded) {
      return
    }

    this.emitter.emit('did-load', null)
  }

  /** Is the page loaded and has the renderer signalled it's ready? */
  private get rendererLoaded(): boolean {
    return !!this.loadTime && !!this.rendererReadyTime
  }

  public onClose(fn: () => void) {
    this.window.on('closed', fn)
  }

  /**
   * Register a function to call when the window is done loading. At that point
   * the page has loaded and the renderer has signalled that it is ready.
   */
  public onDidLoad(fn: () => void): Disposable {
    return this.emitter.on('did-load', fn)
  }

  public isMinimized() {
    return this.window.isMinimized()
  }

  /** Is the window currently visible? */
  public isVisible() {
    return this.window.isVisible()
  }

  public restore() {
    this.window.restore()
  }

  public focus() {
    this.window.focus()
  }

  /** Show the window. */
  public show() {
    this.window.show()
  }

  /**
   * Get the time (in milliseconds) spent loading the page.
   *
   * This will be `null` until `onDidLoad` is called.
   */
  public get loadTime(): number | null {
    return this._loadTime
  }

  /**
   * Get the time (in milliseconds) elapsed from the renderer being loaded to it
   * signaling it was ready.
   *
   * This will be `null` until `onDidLoad` is called.
   */
  public get rendererReadyTime(): number | null {
    return this._rendererReadyTime
  }

  public destroy() {
    this.window.destroy()
  }
}