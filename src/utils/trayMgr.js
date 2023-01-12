const { app, Menu, Tray } = require("electron");

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

module.exports = initTray;
