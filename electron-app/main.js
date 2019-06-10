// Modules to control application life and create native browser window
const {app, BrowserWindow} = require('electron')
const request = require('request')

const react = require('child_process').spawn('node', ['./scripts/start.js'], {
  cwd: process.cwd()
})

// const api = require('child_process').spawn('node', ['../api-server/index.js'], {
//   cwd: process.cwd()
// })

const graphql = require('child_process').spawn('node', ['../graphql-server/index.js'], {
  cwd: process.cwd()
})

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow
function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true,
      enableRemoteModule: true,
    }
  })

  // and load the index.html of the app.
  // mainWindow.loadFile('index.html')
  let checkServerRunning = setInterval(() => {
    request('http://localhost:3000/', (error, response, body) => {
      if (!error && response.statusCode === 200) {

        mainWindow.loadURL('http://localhost:3000/')
        clearInterval(checkServerRunning)
      }
    })
  }, 1000)

  // Open the DevTools.
  mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
    react.kill('SIGINT')
    // api.kill('SIGINT')
    graphql.kill('SIGINT')
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// app.on('web-contents-created', (event, contents) => {
//   contents.on('will-attach-webview', (event, webPreferences, params) => {
//     // Strip away preload scripts if unused or verify their location is legitimate
//     delete webPreferences.preload
//     delete webPreferences.preloadURL

//     // Disable Node.js integration
//     webPreferences.nodeIntegration = false
//     webPreferences.allowRunningInsecureContent = true
//     webPreferences.contextIsolation = true
//     webPreferences.enableRemoteModule = true

//     // Verify URL being loaded
//     // if (!params.src.startsWith('https://localhost:3001/')) {
//     //   event.preventDefault()
//     // }
//   })
// })

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function () {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) createWindow()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
