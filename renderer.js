const {
  ipcRenderer
} = require('electron')

// const expressAppUrl = 'http://localhost:4000/graphql?query={hello}'
const reactAppUrl = 'http://localhost:3000/'
const spawn = require('child_process').spawn
  // For electron-packager change cwd in spawn to app.getAppPath() and
  // uncomment the app require below
  //app = require('electron').remote.app
// const express = spawn('node', ['./express-app/index.js'], {
//   cwd: process.cwd()
// })
const react = spawn('node', ['./react-app/scripts/start.js'], {
  cwd: process.cwd()
})
const request = require('request')
const expressApp = document.getElementById('expressApp')

ipcRenderer.on('stop-server', (event, data) => {
  // This is okay for now but there is a better solution. We can use IPC to
  // tell the server (the Express app itself) to gracefully shutdown. This
  // would be much better especially if we had database connections or other
  // resources we were using that needed to be cleaned up.
  // express.kill('SIGINT')
  react.kill('SIGINT')
})
let checkServerRunning = setInterval(() => {
  request(reactAppUrl, (error, response, body) => {
    console.log(response)
    if (!error && response.statusCode == 200) {
      expressApp.setAttribute('src', reactAppUrl)
      clearInterval(checkServerRunning)
    }
  })
}, 1000)
