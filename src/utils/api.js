import { mainWindow } from "@/background";
import { BrowserWindow, ipcMain, clipboard, dialog } from "electron";
const execSync = require("child_process").execSync;

import { getSelectedText } from "electron-selected-text";

class API {
    static getSelectedText() {
        return getSelectedText().then((text) => {
            if (text) {
                return text.trim();
            }
        });
    }

    static fixWindow({ data }, window) {
        console.log("window.isDestroyed() == ", window.isDestroyed());
        // setInterval(function () {
        //     window.setAlwaysOnTop(data.isFix);
        // }, 1);
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
            console.log(`cd ${cmdPath}; ${cmdStr}`);
        }
        try {
            stdout = execSync(cmdStr, { cwd: cmdPath, encoding: "utf8" });
        } catch (err) {
            stderr = err.stderr.toString();
        }
        return { stdout, stderr };
    }
    static TranslateIdentify({ data }) {
        return API.runExec(
            "sh TranslateIdentify.sh '" + data.data + "'",
            "./src/utils/",
            false
        );
    }
}

export default (mainWindow) => {
    ipcMain.on("msg-trigger", async (event, arg) => {
        let window;
        try {
            window = arg.winId ? BrowserWindow.fromId(arg.winId) : mainWindow;
        } catch (error) {
            return;
        }

        const data = await API[arg.type](arg, window, event);
        event.returnValue = data;
    });
};
