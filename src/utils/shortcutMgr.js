const electron = require("electron");
const dialog = (electron || electron.remote).dialog;
const { createTranslateWindow } = require("./winMgr");

const config = require("@/config");
const { loadPluginMap } = require("@/plugins");

const globalCommands = {
    translateText: {
        defaultShortcut: "ctrl+D",
        func: async () => {
            await loadPluginMap();
            if (!config.context.translateWindow) {
                await createTranslateWindow();
            }

            if (!config.context.translateWindow.isVisible()) {
                config.context.translateWindow.show();
                config.context.translateWindow.focus();
            }
            config.context.translateWindow.focus();
        },
    },
    devTools: {
        defaultShortcut: "ctrl+F11",
        func: async () => {
            config.context.translateWindow.webContents.openDevTools({
                mode: "bottom",
            });
        },
    },
};

const shortCutMgr = {
    async registerAll() {
        const { shortcuts } = config;
        Object.keys(globalCommands).forEach((cmd) => {
            const { func, defaultShortcut } = globalCommands[cmd];

            const shortcut =
                shortcuts[cmd][process.platform] ||
                shortcuts[cmd].default ||
                defaultShortcut;

            if (!shortcut) return;

            const ret = electron.globalShortcut.register(shortcut, func);
            if (!ret) {
                dialog.showErrorBox(
                    "Error",
                    `Shortcut regist error,
                    shortcut: ${shortcut}
                    command: ${cmd}`
                );
            }
        });
    },

    unregisterAll() {
        electron.globalShortcut.unregisterAll();
    },
};

module.exports = shortCutMgr;
