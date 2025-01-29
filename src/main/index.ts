import { app, BrowserWindow, autoUpdater, dialog } from 'electron'
import * as path from 'path'
import * as url from 'url'

const server = 'https://github.com/ebe-nezer/test-el/releases/latest' // Your GitHub releases URL
const feedURL = `${server}`

let win: BrowserWindow | null = null

function createWindow(): void {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  })

  // Load your index.html or app page
  win.loadURL(
    url.format({
      pathname: path.join(__dirname, 'index.html'),
      protocol: 'file:',
      slashes: true
    })
  )

  // Open DevTools for debugging (optional)
  win.webContents.openDevTools()
}

// Electron Ready event
app.whenReady().then(() => {
  createWindow()

  // Check for updates when the app is ready
  autoUpdater.setFeedURL({
    url: feedURL
  })
  autoUpdater.checkForUpdates()

  // Listen for update events
  autoUpdater.on('update-available', () => {
    dialog.showMessageBox(win!, {
      type: 'info',
      buttons: ['OK'],
      title: 'Update Available',
      message: 'A new version is available. The app will automatically update.'
    })
  })

  autoUpdater.on('update-downloaded', () => {
    dialog
      .showMessageBox(win!, {
        type: 'info',
        buttons: ['Restart'],
        title: 'Update Ready',
        message: 'The update has been downloaded. Restart the app to apply the changes.'
      })
      .then(() => {
        autoUpdater.quitAndInstall() // Restart and install the update
      })
  })

  // Handle autoUpdater errors
  autoUpdater.on('error', (error) => {
    console.error('Error during auto-update:', error)
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (win === null) {
    createWindow()
  }
})
