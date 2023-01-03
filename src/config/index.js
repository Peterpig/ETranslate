const fs = require("fs-extra");

const { merge } = require("../utils/merge");
const defaultConfig = require("./config.default.js");
const { debug, dataPath, userConfigFile } = require("../constants");

let isFreshInstalled = false;
let rawConfig = {};
let config = {};

Object.freeze(defaultConfig);

function writeConfig() {
    fs.outputFileSync(
        userConfigFile,
        JSON.stringify(rawConfig, null, 2),
        "utf8"
    );
}

function writeDefaultConfig() {
    try {
        rawConfig = merge({}, defaultConfig);
        writeConfig();
    } catch (err) {
        console.error(err);
    }
}

function loadConfig() {
    const exist = fs.existsSync(userConfigFile);
    if (!exist) {
        writeDefaultConfig();
        isFreshInstalled = true;
    } else {
        const userConfigStr = fs.readFileSync(userConfigFile, "utf8");
        if (userConfigStr.trim().startsWith("module.exports")) {
            writeDefaultConfig();
        } else {
            rawConfig = merge({}, defaultConfig, JSON.parse(userConfigStr));
        }
    }
    return this;
}

Object.assign(config, {
    dataPath,
    userConfigFile,
    debug,
    merge,
    isFreshInstalled,
    getRawConfig() {
        return rawConfig;
    },
    getDefaultConfig() {
        return defaultConfig;
    },
    getCopyedConfig() {
        return merge({}, rawConfig);
    },
    get(key, defaultValue) {
        return rawConfig[key] || defaultValue;
    },
    write(key, value) {
        rawConfig[key] = value;
        writeConfig();
    },
    set(key, value) {
        // write with emit event
        const originalVal = this.get(key);
        try {
            this.write(key, value);
            return true;
        } catch (e) {
            rawConfig[key] = originalVal;
            console.error(e);
            return false;
        }
    },
    context: {
        mainWindow: null,
        translateWindow: null,
    },
});

loadConfig();

config = new Proxy(config, {
    get(target, name) {
        return name in target ? target[name] : rawConfig[name];
    },
});

module.exports = config;
