const { app, protocol, BrowserWindow } = require("electron");

const { loadPluginMap } = require("@/plugins/index.js");

const shortCutMgr = require("@/utils/shortCutMgr");
const { createWindow } = require("@/utils/winMgr");
const initMenu = require("@/utils/menuMgr");
const initTray = require("@/utils/trayMgr");
const { API } = require("@/utils/api");
const config = require("@/config");

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
    { scheme: "app", privileges: { secure: true, standard: true } },
]);

function init() {
    app.dock.hide();
    app.on("ready", async () => {
        // createWindow();
        shortCutMgr.registerAll();
        initTray();
        initMenu();
        loadPluginMap();
    });

    app.on("window-all-closed", () => {
        if (process.platform !== "darwin") {
            app.quit();
        }
    });

    app.on("activate", () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
    API(config.context.translateWindow);
}

init();
