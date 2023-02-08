// let path = require("path");
const config = require("@/config");
// const { resolve } = require("path");

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
    let plugin;
    try {
        plugin = require(`../plugins/${pluginInfo.name}`);
        console.log("plugin == ", plugin);
    } catch (error) {
        console.error("Plugin [%s] load failed!!", pluginInfo.name, error);
        return;
    }
    pluginMap[pluginInfo.name].plugin = plugin;

    let pluginIsRequiredBefore = false;
    try {
        const pluginPath = require.resolve(`../plugins/${pluginInfo.name}`);
        console.log("pluginPath == ", pluginPath);

        pluginIsRequiredBefore =
            !!require.cache[require.resolve(`../plugins/${pluginInfo.name}`)];
    } catch (error) {
        console.error("pluginPath没找到", error);
    }

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
