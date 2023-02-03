let path = require("path");
const config = require("../config");

let pluginMap;

function loadPluginMap() {
    pluginMap = {};
    Object.keys(config.plugins).forEach((pluginName) => {
        const pluginInfo = config.plugins[pluginName];
        pluginInfo.name = pluginName;
        pluginMap[pluginName] = pluginInfo;

        if (pluginInfo.config && pluginInfo.config.init_on_start) {
            //init plugin on program start
            const plugin = getPlugin(pluginInfo);
            try {
                plugin.initOnStart &&
                    plugin.initOnStart(pluginInfo.config, config);
            } catch (e) {
                console.error("Plugin [%s] initOnStart failed!", pluginName, e);
            }
        }
    });
}

function getPlugin(pluginInfo) {
    console.log("pluginInfo === ", pluginInfo);
    const pluginFile = path.normalize(pluginInfo.path);
    console.log("pluginFile === ", pluginFile);
    const pluginIsRequiredBefore = !!require.cache[pluginFile];
    const plugin = require(pluginFile);
    console.log("plugin === ", plugin);
    pluginMap[pluginInfo.name] = plugin;
    if (!pluginIsRequiredBefore) {
        try {
            // init once
            plugin.init &&
                plugin.init(pluginInfo.config, config, config.context);
            // setConfig was declared
            plugin.setConfig &&
                plugin.setConfig(pluginInfo.config, config, config.context);
        } catch (e) {
            console.error("Plugin [%s] setConfig failed!!", pluginInfo.name, e);
        }
    }
    return plugin;
}

function parseCmd(cmd) {
    const args = cmd.split(" ");
    let pluginName = "app";
    if (args.length > 1 && args[0] in pluginMap) {
        pluginName = args.shift();
    }
    const plugin = pluginMap[pluginName];
    if (!plugin) return;
    return {
        name: pluginName,
        args: args,
        plugin: plugin,
    };
}

module.exports = {
    loadPluginMap,
    parseCmd,
    getPlugin,
};
