const { app, protocol, BrowserWindow } = require("electron");

const { loadPluginMap } = require("./plugins/index.js");

const shortCutMgr = require("./utils/shortCutMgr");
const { createWindow, createTranslateWindow } = require("./utils/winMgr");
const initMenu = require("./utils/menuMgr");
const initTray = require("./utils/trayMgr");

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
    { scheme: "app", privileges: { secure: true, standard: true } },
]);

function init() {
    // if (!config.debug) {
    //     if (app.dock) app.dock.hide();
    // }
    // app.dock.hide();
    app.on("ready", async () => {
        // createWindow();
        shortCutMgr.registerAll();
        initTray();
        initMenu();
        loadPluginMap();
        createTranslateWindow();
    });

    app.on("window-all-closed", () => {
        if (process.platform !== "darwin") {
            app.quit();
        }
    });

    app.on("activate", () => {
        console.log(
            "BrowserWindow.getAllWindows().length == ",
            BrowserWindow.getAllWindows().length
        );
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
}

init();
