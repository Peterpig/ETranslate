// const os = require("os");
// const home = os.homedir();

module.exports = {
    title: "ELaunch",
    width: 925,
    height: 700,
    maxHeight: 700,
    language: null,
    autoLaunch: true,
    position: "center", // 'center' or {x: 100, y:200}
    // default is your primary display, you can change it by setting display id(integer),
    // get all ids by require('electron').screen.getAllDisplays().map(d=>d.id)
    display: "primary",
    shortcuts: {
        translateText: { default: "ctrl+D" },
    },
    plugins: {
        // app: {
        //     path: `${__dirname}/../plugins/app/index.js`,
        //     enable: true, // whether the plugin is enable, default is true
        //     default: true, // default plugin don't need to input key
        //     config: {
        //         darwin: {
        //             appPaths: ["/Applications", `${home}/Applications`],
        //         },
        //         linux: {
        //             appPaths: [
        //                 "/usr/share/applications",
        //                 "/usr/local/share/applications",
        //                 `${home}/.local/share/applications`,
        //             ],
        //             iconPaths: [
        //                 "/usr/share/icons",
        //                 `${home}/.local/share/icons`,
        //                 "/usr/share/pixmaps",
        //             ],
        //         },
        //         win32: {},
        //     },
        //     commands: {
        //         app: {},
        //     },
        // },
        youdao: {
            enable: true,
            type: "translate",
            config: {},
        },
    },
};
