"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const electron = require("electron");
const node_url = require("node:url");
const path = require("node:path");
const events = require("events");
const zeromq = require("zeromq");
const msgpack = require("@msgpack/msgpack");
const log = require("electron-log");
const ENGINE_HOST = "127.0.0.1";
const EVENT_PORT = 5556;
const HEARTBEAT_PORT = 5558;
const ADMIN_PORT = 5560;
function classifyEvent(eventName) {
  if (eventName.startsWith("on_common_")) return "on_common";
  if (eventName.startsWith("on_")) return "on";
  if (eventName.startsWith("ack_")) return "ack";
  if (eventName.startsWith("whisper_")) return "whisper";
  if (eventName.startsWith("broadcast_")) return "broadcast";
  return "unknown";
}
class ConnectionManager extends events.EventEmitter {
  state = "DISCONNECTED";
  eventSocket = null;
  heartbeatSocket = null;
  adminSocket = null;
  eventLoopRunning = false;
  heartbeatLoopRunning = false;
  moduleHealth = /* @__PURE__ */ new Map();
  getState() {
    return this.state;
  }
  setState(state) {
    if (this.state === state) return;
    this.state = state;
    this.emit("state-change", state);
  }
  async connect() {
    if (this.state === "CONNECTED" || this.state === "CONNECTING") return;
    this.setState("CONNECTING");
    try {
      this.eventSocket = new zeromq.Subscriber();
      this.eventSocket.connect(`tcp://${ENGINE_HOST}:${EVENT_PORT}`);
      this.eventSocket.subscribe("");
      this.heartbeatSocket = new zeromq.Subscriber();
      this.heartbeatSocket.connect(`tcp://${ENGINE_HOST}:${HEARTBEAT_PORT}`);
      this.heartbeatSocket.subscribe("");
      this.adminSocket = new zeromq.Request();
      this.adminSocket.connect(`tcp://${ENGINE_HOST}:${ADMIN_PORT}`);
      this.setState("CONNECTED");
      log.info("[ConnectionManager] Connected to TycheEngine");
      this.startEventLoop();
      this.startHeartbeatLoop();
    } catch (err) {
      log.error("[ConnectionManager] Connect failed:", err);
      this.setState("DISCONNECTED");
      throw err;
    }
  }
  async disconnect() {
    this.eventLoopRunning = false;
    this.heartbeatLoopRunning = false;
    this.eventSocket?.close();
    this.heartbeatSocket?.close();
    this.adminSocket?.close();
    this.eventSocket = null;
    this.heartbeatSocket = null;
    this.adminSocket = null;
    this.setState("DISCONNECTED");
    log.info("[ConnectionManager] Disconnected");
  }
  async queryStatus() {
    if (!this.adminSocket || this.state !== "CONNECTED") return null;
    try {
      await this.adminSocket.send(msgpack.encode("STATUS"));
      const [msg] = await this.adminSocket.receive();
      return msgpack.decode(msg);
    } catch (err) {
      log.error("[ConnectionManager] queryStatus failed:", err);
      return null;
    }
  }
  async queryModules() {
    if (!this.adminSocket || this.state !== "CONNECTED") return [];
    try {
      await this.adminSocket.send(msgpack.encode("MODULES"));
      const [msg] = await this.adminSocket.receive();
      const raw = msgpack.decode(msg);
      return Object.entries(raw).map(([id, info]) => {
        const liveness = info.liveness ?? 0;
        return {
          id,
          interfaces: info.interfaces ?? [],
          liveness,
          status: liveness >= 2 ? "OK" : liveness >= 1 ? "WARN" : "EXPIRED"
        };
      });
    } catch (err) {
      log.error("[ConnectionManager] queryModules failed:", err);
      return [];
    }
  }
  startEventLoop() {
    if (this.eventLoopRunning) return;
    this.eventLoopRunning = true;
    (async () => {
      while (this.eventLoopRunning && this.eventSocket) {
        try {
          const [msg] = await this.eventSocket.receive();
          const data = msgpack.decode(msg);
          data.event = data.event ?? "";
          const classified = { ...data, _type: classifyEvent(data.event) };
          this.emit("event", classified);
        } catch (err) {
          if (this.eventLoopRunning) {
            log.error("[ConnectionManager] Event receive error:", err);
          }
        }
      }
    })();
  }
  startHeartbeatLoop() {
    if (this.heartbeatLoopRunning) return;
    this.heartbeatLoopRunning = true;
    (async () => {
      while (this.heartbeatLoopRunning && this.heartbeatSocket) {
        try {
          const [msg] = await this.heartbeatSocket.receive();
          const moduleIds = msgpack.decode(msg);
          for (const id of moduleIds) {
            this.moduleHealth.set(id, (this.moduleHealth.get(id) ?? 0) + 1);
          }
          this.emit("heartbeat", moduleIds);
        } catch (err) {
          if (this.heartbeatLoopRunning) {
            log.error("[ConnectionManager] Heartbeat receive error:", err);
          }
        }
      }
    })();
  }
  onEvent(callback) {
    this.on("event", callback);
  }
  onHeartbeat(callback) {
    this.on("heartbeat", callback);
  }
  onStateChange(callback) {
    this.on("state-change", callback);
  }
}
const __dirname$1 = path.dirname(node_url.fileURLToPath(require("url").pathToFileURL(__filename).href));
process.env.APP_ROOT = path.join(__dirname$1, "../..");
const MAIN_DIST = path.join(process.env.APP_ROOT, "dist-electron");
const RENDERER_DIST = path.join(process.env.APP_ROOT, "dist");
const VITE_DEV_SERVER_URL = process.env.VITE_DEV_SERVER_URL;
process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, "public") : RENDERER_DIST;
log.initialize();
let mainWindow = null;
let connection = null;
function createWindow() {
  mainWindow = new electron.BrowserWindow({
    width: 1600,
    height: 1e3,
    minWidth: 1200,
    minHeight: 700,
    title: "TycheApp",
    webPreferences: {
      preload: path.join(__dirname$1, "../preload/index.js"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false
    }
  });
  const devUrl = process.env.ELECTRON_RENDERER_URL;
  if (devUrl) {
    mainWindow.loadURL(devUrl);
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(RENDERER_DIST, "index.html"));
  }
  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}
electron.app.on("ready", () => {
  createWindow();
  connection = new ConnectionManager();
  electron.ipcMain.handle("engine:connect", async () => {
    if (!connection) return false;
    await connection.connect();
    return true;
  });
  electron.ipcMain.handle("engine:disconnect", async () => {
    if (!connection) return false;
    await connection.disconnect();
    return true;
  });
  electron.ipcMain.handle("engine:query-status", async () => {
    if (!connection) return null;
    return connection.queryStatus();
  });
  electron.ipcMain.handle("engine:query-modules", async () => {
    if (!connection) return [];
    return connection.queryModules();
  });
  connection.onEvent((data) => {
    mainWindow?.webContents.send("engine:event", data);
  });
  connection.onHeartbeat((data) => {
    mainWindow?.webContents.send("engine:heartbeat", data);
  });
  connection.onStateChange((state) => {
    mainWindow?.webContents.send("engine:state-change", state);
  });
});
electron.app.on("window-all-closed", () => {
  connection?.disconnect();
  if (process.platform !== "darwin") electron.app.quit();
});
electron.app.on("activate", () => {
  if (electron.BrowserWindow.getAllWindows().length === 0) createWindow();
});
exports.MAIN_DIST = MAIN_DIST;
exports.RENDERER_DIST = RENDERER_DIST;
exports.VITE_DEV_SERVER_URL = VITE_DEV_SERVER_URL;
