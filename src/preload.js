const { contextBridge, ipcRenderer } = require("electron");
const { validChannels } = require("@/constants");
// contextBridge.exposeInMainWorld("ipcRenderer", ipcRenderer);

// contextBridge.exposeInMainWorld("versions", {
//     node: () => process.versions.node,
//     chrome: () => process.versions.chrome,
//     electron: () => process.versions.electron,
//     // 能暴露的不仅仅是函数，我们还可以暴露变量
// });

// Expose ipcRenderer to the client
contextBridge.exposeInMainWorld("ipcRenderer", {
    send: (channel, data) => {
        if (validChannels.includes(channel)) {
            ipcRenderer.send(channel, data);
        } else {
            console.error("unregister on send channels: ", channel);
        }
    },
    receive: (channel, func) => {
        if (validChannels.includes(channel)) {
            ipcRenderer.on(channel, (event, ...args) => func(...args));
        } else {
            console.error("unregister on receive channels: ", channel);
        }
    },
});
