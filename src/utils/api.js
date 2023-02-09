const path = require("path");
const { BrowserWindow, ipcMain, clipboard } = require("electron");
const execSync = require("child_process").execSync;
const config = require("@/config");

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

    static fixWindowToogle({ data }) {
        console.log("context == ", config.context);

        if (
            data.window &&
            config.context[data.window] &&
            !config.context[data.window].isDestroyed()
        ) {
            config.context[data.window].setAlwaysOnTop(data.isFix);
        }
    }

    static copyText({ data }) {
        clipboard.writeText(data.text);
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

    static getTranslatePlugins() {}

    static PluginExec({ data }) {
        const cmdInfo = parseCmd(data.data);
        const plugin = getPlugin(cmdInfo);
        try {
            return plugin.exec(cmdInfo);
        } catch (e) {
            throw new Error(`Plugin ${plugin.name} exec failed! ${e}`);
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
    ipcMain.handle("msg-trigger", async (event, arg) => {
        let window;
        try {
            window = arg.winId ? BrowserWindow.fromId(arg.winId) : mainWindow;
        } catch (error) {
            return;
        }

        const data = (await API_[arg.type](arg, window, event)) || "";
        return JSON.stringify(data);
    });
}
