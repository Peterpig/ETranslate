import { app, protocol, BrowserWindow } from "electron";
import { createProtocol } from "vue-cli-plugin-electron-builder/lib";
import API from "@/utils/api";

const path = require("path");
const config = require("./config");
const shortCutMgr = require("@/utils/shortCutMgr");
const initMenu = require("@/utils/menuMgr");
const initTray = require("@/utils/trayMgr");

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
    { scheme: "app", privileges: { secure: true, standard: true } },
]);

export let mainWindow;
export let translateWindow;

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
        // if (!config.IS_TEST) mainWindow.webContents.openDevTools();
    } else {
        createProtocol("app");
        mainWindow.loadURL("app://./index.html");
    }

    mainWindow.on("closed", () => {
        mainWindow.close();
        mainWindow = null;
    });

    mainWindow.on("blur", () => {
        // if (!config.debug) {
        //     mainWindow.hide();
        // }
        mainWindow.close();
        mainWindow = null;
    });
    API(translateWindow);
    config.context.mainWindow = mainWindow;
}

export async function createTranslateWindow() {
    translateWindow = new BrowserWindow({
        width: config.width,
        height: config.height,
        title: config.title,
        type: config.debug ? "normal" : "splash",
        frame: false,
        skipTaskbar: false,
        autoHideMenuBar: true,
        backgroundColor: "alpha(opacity=0)",
        show: false,
        transparent: !config.debug,
        alwaysOnTop: !config.debug,
        disableAutoHideCursor: true,
        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
            // nodeIntegration: true,
        },
    });

    API(translateWindow);

    if (config.debug) {
        await translateWindow.loadURL("http://127.0.0.1:8080/#/translate");
        if (!config.IS_TEST)
            translateWindow.webContents.openDevTools({ mode: "bottom" });
    } else {
        createProtocol("app");
        translateWindow.loadURL("app://./index.html/#/about");
    }

    translateWindow.on("closed", () => {
        translateWindow = undefined;
    });

    translateWindow.on("blur", (event) => {
        if (translateWindow.isAlwaysOnTop()) {
            event.preventDefault();
        } else {
            translateWindow.hide();
        }
    });
    config.context.translateWindow = translateWindow;
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
