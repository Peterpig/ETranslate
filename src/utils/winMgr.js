const { BrowserWindow } = require("electron");
const { createProtocol } = require("vue-cli-plugin-electron-builder/lib");
const path = require("path");

const config = require("@/config");
let translateWindow;

async function createWindow() {
    config.context.mainWindow = new BrowserWindow({
        width: 900,
        height: 700,
        title: config.title,
        type: config.debug ? "normal" : "splash",
        frame: config.debug,
        skipTaskbar: !config.debug,
        autoHideMenuBar: !config.debug,
        backgroundColor: "alpha(opacity=0)",
        show: config.debug,
        transparent: !config.debug,
        alwaysOnTop: !config.debug,
        disableAutoHideCursor: true,
        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
        },
    });

    if (config.debug) {
        await config.context.mainWindow.loadURL("http://127.0.0.1:8080/");
        // if (!config.IS_TEST) mainWindow.webContents.openDevTools();
    } else {
        createProtocol("app");
        config.context.mainWindow.loadURL("app://./index.html");
    }

    config.context.mainWindow.on("blur", () => {});
}

async function createTranslateWindow() {
    translateWindow = new BrowserWindow({
        width: config.width,
        height: config.height,
        title: config.title,
        resizable: false,
        frame: false,
        skipTaskbar: false,
        autoHideMenuBar: true,
        backgroundColor: "alpha(opacity=0)",
        show: false,
        // transparent: !config.debug,
        // alwaysOnTop: !config.debug,
        disableAutoHideCursor: true,
        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
            // nodeIntegration: true,
        },
    });

    if (config.debug) {
        await translateWindow.loadURL("http://127.0.0.1:8080/#/translate");
        // if (!config.IS_TEST)
        //     translateWindow.webContents.openDevTools({
        //         mode: "bottom",
        //     });
    } else {
        createProtocol("app");
        translateWindow.loadURL("app://./index.html/#/translate");
        translateWindow.webContents.openDevTools({
            mode: "bottom",
        });
    }

    translateWindow.on("blur", (event) => {
        if (translateWindow && translateWindow.isAlwaysOnTop()) {
            event.preventDefault();
        } else {
            translateWindow.close();
            translateWindow = null;
            config.context.translateWindow = translateWindow;
        }
    });

    translateWindow.on("closed", () => {
        translateWindow = null;
        config.context.translateWindow = translateWindow;
    });

    config.context.translateWindow = translateWindow;
}

module.exports = { createWindow, createTranslateWindow };
