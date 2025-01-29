import { app, shell, BrowserWindow, ipcMain, dialog } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import { autoUpdater } from 'electron-updater'
import icon from '../../resources/icon.png?asset'

function createWindow(): void {
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }

  // Auto-updater events
  autoUpdater.on('checking-for-update', () => {
    console.log('Checking for updates...')
    mainWindow.webContents.send('update-check', 'Checking for updates...')
  })

  autoUpdater.on('update-available', () => {
    console.log('Update available')
    dialog.showMessageBox(mainWindow, {
      type: 'info',
      title: 'Update Available',
      message: 'A new version is available. Downloading now...'
    })
  })

  autoUpdater.on('update-not-available', () => {
    console.log('No update available')
    dialog.showMessageBox(mainWindow, {
      type: 'info',
      title: 'No Update Available',
      message: 'Your application is up-to-date.'
    })
  })

  autoUpdater.on('update-downloaded', () => {
    console.log('Update downloaded')
    const result = dialog.showMessageBoxSync(mainWindow, {
      type: 'question',
      buttons: ['Install and Restart', 'Later'],
      defaultId: 0,
      title: 'Update Ready',
      message: 'An update has been downloaded. Would you like to install it now?'
    })

    if (result === 0) {
      autoUpdater.quitAndInstall()
    }
  })

  autoUpdater.on('error', (error) => {
    console.error('Update error:', error)
    dialog.showErrorBox('Update Error', `Error: ${error.message || error}`)
  })

  console.log('App version:', app.getVersion())
  autoUpdater.checkForUpdatesAndNotify()
}

app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.electron')

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  ipcMain.on('ping', () => console.log('pong'))

  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
