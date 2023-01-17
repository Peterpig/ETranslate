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
    ipcRenderer.send("msg-trigger", {
        type,
        data,
    });
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
});
