// let path = require("path");
const config = require("@/config");
// const { resolve } = require("path");

let pluginMap;
// pluginMap = {
//     youdao: {
//         name: "youdao",
//         enable: true,
//         type: "translate",
//         config: {},
//         // 加载后存在
//         plugin: {
//             exec: () => {},
//         },
//     },
// };

function loadPluginMap() {
    pluginMap = {};
    Object.keys(config.plugins).forEach((pluginName) => {
        const pluginInfo = config.plugins[pluginName];
        if (!pluginInfo.enable) return;
        pluginInfo.name = pluginName;
        pluginMap[pluginName] = pluginInfo;
    });
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
