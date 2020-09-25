import * as React from 'react'
import * as ReactDOM from 'react-dom'
// import { ipcRenderer } from 'electron'

import { App } from './app'

const startTime = performance.now()

// ipcRenderer.on('focus', () => {

// })

ReactDOM.render(
  <App
    startTime={startTime}
  />,
  document.getElementById('desktop-app-container')!
)
