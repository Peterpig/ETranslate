const { contextBridge, ipcRenderer } = require("electron");

const ipcSendSync = (type, data) => {
    const returnValue = ipcRenderer.sendSync("msg-trigger", {
        type,
        data,
    });
    if (returnValue instanceof Error) throw returnValue;
    return returnValue;
};

const ipcSend = async (type, data) => {
    return ipcRenderer
        .invoke("msg-trigger", {
            type,
            data,
        })
        .then((res) => {
            return JSON.parse(res);
        });
};

contextBridge.exposeInMainWorld("API", {
    getSelectedText: () => {
        return ipcSend("getSelectedText");
    },
    fixTranslateWindowToogle: (isFix) => {
        ipcSendSync("fixWindowToogle", {
            isFix,
            window: "translateWindow",
        });
    },
    copyText: (text) => {
        ipcSendSync("copyText", { text });
    },
    TranslateIdentify: (data) => {
        return ipcSend("TranslateIdentify", { data });
    },
    exec: (data) => {
        return ipcSend("PluginExec", { data });
    },
});

// contextBridge.exposeInMainWorld("Plugin", {
//     exec: (data) => {
//         return ipcSendSync("PluginExec", { data });
//     },
// });
