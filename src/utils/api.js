const path = require("path");
const { BrowserWindow, ipcMain, clipboard, dialog } = require("electron");
const execSync = require("child_process").execSync;

const { getSelectedText } = require("electron-selected-text");
const { parseCmd, getPlugin } = require("../plugins");

class API_ {
    static getSelectedText() {
        return getSelectedText().then((text) => {
            if (text) {
                return text.trim();
            }
        });
    }

    static fixWindow({ data }, window) {
        if (!window.isDestroyed()) {
            window.setAlwaysOnTop(data.isFix);
        }
    }

    static copyText({ data }) {
        clipboard.writeText(data.text);
    }

    static showMessageBox({ data }, window) {
        dialog.showMessageBox(window, data.data);
    }

    static runExec(cmdStr, cmdPath, logIt = true) {
        let stdout, stderr;
        if (logIt) {
            console.log(`cd ${path.resolve(cmdPath)}; ${cmdStr}`);
        }
        try {
            stdout = execSync(cmdStr, { cwd: cmdPath, encoding: "utf8" });
        } catch (err) {
            stderr = err.stderr.toString();
        }
        return { stdout, stderr };
    }
    static TranslateIdentify({ data }) {
        return API_.runExec(
            "sh TranslateIdentify.sh '" + data.data + "'",
            "./src/utils/",
            false
        );
    }

    static PluginExec({ data }) {
        const cmdInfo = parseCmd(data.data);
        const plugin = getPlugin(cmdInfo);
        try {
            return plugin.exec(cmdInfo);
        } catch (e) {
            throw new Error("Plugin [%s] exec failed!", plugin.name, e);
        }
    }
}

export function API(mainWindow) {
    ipcMain.on("msg-trigger", async (event, arg) => {
        let window;
        try {
            window = arg.winId ? BrowserWindow.fromId(arg.winId) : mainWindow;
        } catch (error) {
            return;
        }

        const data = await API_[arg.type](arg, window, event);
        event.returnValue = data;
    });
}
