const { contextBridge, ipcRenderer } = require("electron");

const ipcSendSync = (type, data) => {
    const returnValue = ipcRenderer.sendSync("msg-trigger", {
        type,
        data,
    });
    if (returnValue instanceof Error) throw returnValue;
    return returnValue;
};

const ipcSend = (type, data) => {
    const returnValue = ipcRenderer.send("msg-trigger", {
        type,
        data,
    });
    if (returnValue instanceof Error) throw returnValue;
    return returnValue;
};

contextBridge.exposeInMainWorld("API", {
    getSelectedText: () => {
        return ipcSendSync("getSelectedText");
    },
    fixWindow: (isFix) => {
        return ipcSendSync("fixWindow", { isFix });
    },
    copyText: (text) => {
        return ipcSendSync("copyText", { text });
    },
    showMessageBox: (data) => {
        return ipcSendSync("showMessageBox", { data });
    },
    TranslateIdentify: (data) => {
        return ipcSendSync("TranslateIdentify", { data });
    },
    exec: (data) => {
        // return ipcSendSync("PluginExec", { data });
        return ipcSend("PluginExec", { data });
    },
});

// contextBridge.exposeInMainWorld("Plugin", {
//     exec: (data) => {
//         return ipcSendSync("PluginExec", { data });
//     },
// });
