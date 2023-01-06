import {
    app,
    protocol,
    BrowserWindow,
    Menu,
    Tray,
    ipcMain,
    clipboard,
} from "electron";
import { createProtocol } from "vue-cli-plugin-electron-builder/lib";
const path = require("path");
const config = require("./config");
const shortCutMgr = require("./utils/shortCutMgr");
import { getSelectedText } from "electron-selected-text";

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
    { scheme: "app", privileges: { secure: true, standard: true } },
]);

let mainWindow;
let translateWindow;

function printReadText() {
    console.log("text == ", clipboard.readText());
}

async function createWindow() {
    mainWindow = new BrowserWindow({
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
            proload: path.join(__dirname, "preload.js"),
        },
    });

    if (config.debug) {
        await mainWindow.loadURL("http://127.0.0.1:8080/");
        if (!config.IS_TEST) mainWindow.webContents.openDevTools();
    } else {
        createProtocol("app");
        mainWindow.loadURL("app://./index.html");
    }

    mainWindow.on("closed", () => {
        mainWindow = null;
    });

    mainWindow.on("blur", () => {
        if (!config.debug) {
            mainWindow.hide();
        }
    });

    config.context.mainWindow = mainWindow;
}

export async function createTranslateWindow() {
    translateWindow = new BrowserWindow({
        width: config.width,
        height: config.height,
        title: config.title,
        type: config.debug ? "normal" : "splash",
        // frame: config.debug,
        frame: false,
        skipTaskbar: !config.debug,
        autoHideMenuBar: !config.debug,
        backgroundColor: "alpha(opacity=0)",
        show: false,
        transparent: !config.debug,
        alwaysOnTop: !config.debug,
        disableAutoHideCursor: true,
        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
        },
    });

    if (config.debug) {
        await translateWindow.loadURL("http://127.0.0.1:8080/#/translate");
        if (!config.IS_TEST)
            translateWindow.webContents.openDevTools({ mode: "bottom" });
    } else {
        createProtocol("app");
        translateWindow.loadURL("app://./index.html/#/about");
    }

    translateWindow.fix = false;
    translateWindow.on("closed", () => {
        translateWindow = null;
        config.context.translateWindow = translateWindow;
    });

    translateWindow.on("blur", (event) => {
        if (config.context.translateWindow.fix) {
            translateWindow.setAlwaysOnTop(true);
            event.preventDefault();
        } else {
            // translateWindow.setAlwaysOnTop(false);
            // translateWindow.hide();
            translateWindow.close();
            translateWindow = null;
        }
    });
    ipcMain.on("translateWin:fix", (event, data) => {
        config.context.translateWindow.fix = data;
    });
    ipcMain.on("translateWin:selected", () => {
        getSelectedText().then((text) => {
            translateWindow.webContents.send(
                "translateWin:selectedReply",
                text.trim()
            );
        });
        // translateWindow.webContents.send(text);
    });

    config.context.translateWindow = translateWindow;
}

let tray;

async function initTray() {
    const icon = "./src/assets/CloudTabBarItemTemplate.png";
    tray = new Tray(icon);

    const contextMenu = Menu.buildFromTemplate([
        {
            label: "偏好设置",
            click: () => {
                () => {};
            },
        },
        { type: "separator" },
        {
            label: "退出",
            accelerator: "Cmd+Q",
            click: () => {
                app.quit();
            },
        },
    ]);
    tray.setToolTip("This is my application.");
    tray.setContextMenu(contextMenu);
}

async function initMenu() {
    const template = [];
    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
}

function init() {
    // if (!config.debug) {
    //     if (app.dock) app.dock.hide();
    // }
    app.dock.hide();
    app.on("ready", async () => {
        // createWindow();
        shortCutMgr.registerAll();
        initTray();
        initMenu();
        printReadText();
    });

    app.on("window-all-closed", () => {
        if (process.platform !== "darwin") {
            app.quit();
        }
    });

    app.on("activate", () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
}

init();
