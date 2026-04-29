"use strict";
const electron = require("electron");
const api = {
  engine: {
    connect: () => electron.ipcRenderer.invoke("engine:connect"),
    disconnect: () => electron.ipcRenderer.invoke("engine:disconnect"),
    queryStatus: () => electron.ipcRenderer.invoke("engine:query-status"),
    queryModules: () => electron.ipcRenderer.invoke("engine:query-modules"),
    onEvent: (callback) => {
      const handler = (_, data) => callback(data);
      electron.ipcRenderer.on("engine:event", handler);
      return () => electron.ipcRenderer.removeListener("engine:event", handler);
    },
    onHeartbeat: (callback) => {
      const handler = (_, moduleIds) => callback(moduleIds);
      electron.ipcRenderer.on("engine:heartbeat", handler);
      return () => electron.ipcRenderer.removeListener("engine:heartbeat", handler);
    },
    onStateChange: (callback) => {
      const handler = (_, state) => callback(state);
      electron.ipcRenderer.on("engine:state-change", handler);
      return () => electron.ipcRenderer.removeListener("engine:state-change", handler);
    }
  }
};
electron.contextBridge.exposeInMainWorld("api", api);
