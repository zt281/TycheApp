import { app, BrowserWindow, ipcMain, screen } from 'electron'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import fs from 'node:fs'
import { ConnectionManager } from './connection'
import log from 'electron-log'

const WINDOW_STATE_FILE = path.join(app.getPath('userData'), 'window-state.json')

const __dirname = path.dirname(fileURLToPath(import.meta.url))

process.env.APP_ROOT = path.join(__dirname, '../..')
export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron')
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist')
export const VITE_DEV_SERVER_URL = process.env.VITE_DEV_SERVER_URL

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL
  ? path.join(process.env.APP_ROOT, 'public')
  : RENDERER_DIST

log.initialize()

function saveWindowState(bounds: Electron.Rectangle) {
  try {
    fs.writeFileSync(WINDOW_STATE_FILE, JSON.stringify(bounds))
  } catch (err) {
    log.error('Failed to save window state:', err)
  }
}

function loadWindowState(): Partial<Electron.Rectangle> | null {
  try {
    const data = JSON.parse(fs.readFileSync(WINDOW_STATE_FILE, 'utf-8'))
    return data
  } catch {
    return null
  }
}

function isWindowVisible(bounds: Electron.Rectangle): boolean {
  const displays = screen.getAllDisplays()
  return displays.some((d) =>
    bounds.x < d.bounds.x + d.bounds.width &&
    bounds.x + bounds.width > d.bounds.x &&
    bounds.y < d.bounds.y + d.bounds.height &&
    bounds.y + bounds.height > d.bounds.y
  )
}

function resolvePreload(): string {
  const base = path.join(__dirname, '../preload/index')
  for (const ext of ['.js', '.cjs', '.mjs']) {
    const p = base + ext
    if (fs.existsSync(p)) return p
  }
  return base + '.js'
}

let mainWindow: BrowserWindow | null = null
let connection: ConnectionManager | null = null

function createWindow(): void {
  const saved = loadWindowState()
  const primary = screen.getPrimaryDisplay()
  const workArea = primary.workAreaSize

  let opts: Electron.BrowserWindowConstructorOptions = {
    width: 1600,
    height: 1000,
    minWidth: 1200,
    minHeight: 700,
    title: 'TycheApp',
    webPreferences: {
      preload: resolvePreload(),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
      nativeWindowOpen: true
    }
  }

  if (saved && isWindowVisible(saved as Electron.Rectangle)) {
    opts.width = saved.width || 1600
    opts.height = saved.height || 1000
    opts.x = saved.x
    opts.y = saved.y
  } else {
    opts.x = Math.round((workArea.width - 1600) / 2)
    opts.y = Math.round((workArea.height - 1000) / 2)
  }

  mainWindow = new BrowserWindow(opts)

  const devUrl = process.env.ELECTRON_RENDERER_URL
  if (devUrl) {
    mainWindow.loadURL(devUrl)
    mainWindow.webContents.openDevTools({ mode: 'detach' })
  } else {
    mainWindow.loadFile(path.join(RENDERER_DIST, 'index.html'))
  }

  mainWindow.webContents.setWindowOpenHandler(({ frameName }) => {
    return {
      action: 'allow',
      overrideBrowserWindowOptions: {
        width: 800,
        height: 600,
        title: frameName || 'TycheApp',
        webPreferences: {
          preload: resolvePreload(),
          contextIsolation: true,
          nodeIntegration: false,
          sandbox: false
        }
      }
    }
  })

  const onBoundsChange = () => {
    if (mainWindow) saveWindowState(mainWindow.getBounds())
  }
  mainWindow.on('resize', onBoundsChange)
  mainWindow.on('move', onBoundsChange)

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.on('ready', () => {
  createWindow()

  connection = new ConnectionManager()

  // Auto-connect to TycheEngine on startup
  connection.connect().catch((err) => {
    log.warn('[Main] Auto-connect to TycheEngine failed:', err)
  })

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
    if (!connection) return null
    return connection.queryModules()
  })

  ipcMain.handle('engine:get-state', async () => {
    if (!connection) return null
    return connection.getState()
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
