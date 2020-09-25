/* eslint-disable no-sync */
/// <reference path="../../globals.d.ts" />

import { app } from 'electron'

import { AppWindow } from './app-window'

let mainWindow: AppWindow | null = null

let preventQuit = false

type OnDidLoadFn = (window: AppWindow) => void
/** See the `onDidLoad` function. */
let onDidLoadFns: Array<OnDidLoadFn> | null = []

export function handleAppURL(url: string) {
  console.log('Processing protocol url')
  onDidLoad(window => {
    // This manual focus call _shouldn't_ be necessary, but is for Chrome on
    // macOS. See https://github.com/desktop/desktop/issues/973.
    window.focus()
    window.sendURLAction(url)
  })
}

// let isDuplicateInstance = false;
// // If we're handling a Squirrel event we don't want to enforce single instance.
// // We want to let the updated instance launch and do its work. It will then quit
// // once it's done.

// const gotSingleInstanceLock = app.requestSingleInstanceLock();
// isDuplicateInstance = !gotSingleInstanceLock;

// app.on('second-instance', () => {
//   // Someone tried to run a second instance, we should focus our window.
//   if (mainWindow) {
//     if (mainWindow.isMinimized()) {
//       mainWindow.restore();
//     }

//     if (!mainWindow.isVisible()) {
//       mainWindow.show();
//     }

//     mainWindow.focus();
//   }
// });

// if (isDuplicateInstance) {
//   app.quit();
// }

app.on('will-finish-launching', () => {
  // macOS only
  app.on('open-url', (event: any, url: any) => {
    event.preventDefault()
    handleAppURL(url)
  })
})

app.on('ready', () => {
  // if (isDuplicateInstance) {
  //   return;
  // }

  createWindow()
})

app.on('activate', () => {
  onDidLoad(window => {
    window.show()
  })
})

app.on('web-contents-created', (_event: any, contents: any) => {
  contents.on('new-window', (event: any, url: any) => {
    // Prevent links or window.open from opening new windows
    event.preventDefault()
    console.log(`Prevented new window to: ${url}`)
  })
})

function createWindow() {
  const window = new AppWindow()

  if (__DEV__) {
    const {
      default: installExtension,
      REACT_DEVELOPER_TOOLS,
      REACT_PERF,
    } = require('electron-devtools-installer')

    require('electron-debug')({ showDevTools: true })

    const ChromeLens = {
      id: 'idikgljglpfilbhaboonnpnnincjhjkd',
      electron: '>=1.2.1',
    }

    const extensions = [REACT_DEVELOPER_TOOLS, REACT_PERF, ChromeLens]

    for (const extension of extensions) {
      try {
        installExtension(extension)
      } catch (e) {}
    }
  }

  window.onClose(() => {
    mainWindow = null
    if (!__DARWIN__ && !preventQuit) {
      app.quit()
    }
  })

  window.onDidLoad(() => {
    window.show()

    const fns = onDidLoadFns!
    onDidLoadFns = null
    for (const fn of fns) {
      fn(window)
    }
  })

  window.load()

  mainWindow = window
}

/**
 * Register a function to be called once the window has been loaded. If the
 * window has already been loaded, the function will be called immediately.
 */
function onDidLoad(fn: OnDidLoadFn) {
  if (onDidLoadFns) {
    onDidLoadFns.push(fn)
  } else {
    if (mainWindow) {
      fn(mainWindow)
    }
  }
}
