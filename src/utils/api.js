import { mainWindow } from "@/background";
import { BrowserWindow, ipcMain, clipboard, dialog } from "electron";

import { getSelectedText } from "electron-selected-text";

class API {
    static getSelectedText() {
        return getSelectedText().then((text) => {
            console.log("text ==", text);
            return text.trim();
        });
    }

    static fixWindow({ data }, window) {
        console.log("window.isDestroyed() == ", window.isDestroyed());
        // setInterval(function () {
        //     window.setAlwaysOnTop(data.isFix);
        // }, 1);
        window.setAlwaysOnTop(data.isFix);
    }

    static copyText({ data }) {
        clipboard.writeText(data.text);
    }

    static showMessageBox({ data }, window) {
        dialog.showMessageBox(window, data.data);
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
