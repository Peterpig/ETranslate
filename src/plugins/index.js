let path = require("path");
const fs = require("fs");
const config = require("@/config");

let pluginMap;
// pluginMap = {
//     youdao: {
//         name: "youdao",
//         cn_name: "有道词典",
//         enable: true,
//         type: "translate",
//         config: {},
//         // 加载后存在
//         plugin: {
//             exec: () => {},
//         },
//     },
// };

async function loadPluginMap() {
    pluginMap = {};
    console.log("loadPluginMap === ");
    Object.keys(config.plugins).forEach((pluginName) => {
        let pluginInfo = config.plugins[pluginName];
        if (!pluginInfo.enable) return;
        pluginInfo.name = pluginName;

        try {
            let iconPath = require.resolve(
                `@/plugins/${pluginInfo.name}/assets/icon.svg`
            );
            let err = fs.accessSync(iconPath, fs.constants.F_OK);
            if (!err) {
                pluginInfo.iconPath = iconPath;
                pluginInfo.iconPath2 = `@/plugins/${pluginInfo.name}/assets/icon.svg`;
                pluginInfo.iconPath3 = path.join(
                    __dirname,
                    `/plugins/${pluginInfo.name}/assets/icon.svg`
                );
            }
        } catch (error) {
            console.log("error == ", error);
        }
        pluginMap[pluginName] = pluginInfo;
    });
    config.pluginMap = pluginMap;
}

function getPlugin(pluginInfo) {
    let plugin;

    // let pluginIsRequiredBefore;
    // try {
    //     pluginIsRequiredBefore =
    //         !!require.cache[require.resolve(`../plugins/${pluginInfo.name}`)];
    // } catch (error) {
    //     console.error("pluginPath没找到", error);
    // }

    try {
        plugin = require(`../plugins/${pluginInfo.name}`);
        pluginMap[pluginInfo.name].plugin = plugin;
    } catch (error) {
        console.error("Plugin [%s] load failed!!", pluginInfo.name, error);
        return;
    }
    return plugin;
}

function parseCmd(cmd) {
    const args = cmd.split(" ");
    let pluginName = "app";
    if (args.length > 1 && args[0] in pluginMap) {
        pluginName = args.shift();
    }
    const pluginInfo = pluginMap[pluginName];
    if (!pluginInfo) return;
    pluginInfo.args = args;
    return pluginInfo;
}

module.exports = {
    loadPluginMap,
    parseCmd,
    getPlugin,
};
