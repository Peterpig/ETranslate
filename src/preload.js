const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("translateWin", {
    open: () => ipcRenderer.on("translateWin:open"),
});
