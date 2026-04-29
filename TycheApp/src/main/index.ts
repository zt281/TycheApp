import { app, BrowserWindow, ipcMain } from 'electron'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { ConnectionManager } from './connection'
import log from 'electron-log'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

process.env.APP_ROOT = path.join(__dirname, '../..')
export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron')
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist')
export const VITE_DEV_SERVER_URL = process.env.VITE_DEV_SERVER_URL

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL
  ? path.join(process.env.APP_ROOT, 'public')
  : RENDERER_DIST

log.initialize()

let mainWindow: BrowserWindow | null = null
let connection: ConnectionManager | null = null

function createWindow(): void {
  mainWindow = new BrowserWindow({
    width: 1600,
    height: 1000,
    minWidth: 1200,
    minHeight: 700,
    title: 'TycheApp',
    webPreferences: {
      preload: path.join(__dirname, '../preload/index.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false
    }
  })

  const devUrl = process.env.ELECTRON_RENDERER_URL
  if (devUrl) {
    mainWindow.loadURL(devUrl)
    mainWindow.webContents.openDevTools()
  } else {
    mainWindow.loadFile(path.join(RENDERER_DIST, 'index.html'))
  }

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.on('ready', () => {
  createWindow()

  connection = new ConnectionManager()

  ipcMain.handle('engine:connect', async () => {
    if (!connection) return false
    await connection.connect()
    return true
  })

  ipcMain.handle('engine:disconnect', async () => {
    if (!connection) return false
    await connection.disconnect()
    return true
  })

  ipcMain.handle('engine:query-status', async () => {
    if (!connection) return null
    return connection.queryStatus()
  })

  ipcMain.handle('engine:query-modules', async () => {
    if (!connection) return []
    return connection.queryModules()
  })

  connection.onEvent((data) => {
    mainWindow?.webContents.send('engine:event', data)
  })

  connection.onHeartbeat((data) => {
    mainWindow?.webContents.send('engine:heartbeat', data)
  })

  connection.onStateChange((state) => {
    mainWindow?.webContents.send('engine:state-change', state)
  })
})

app.on('window-all-closed', () => {
  connection?.disconnect()
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})
