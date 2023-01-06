const os = require("os");

const debug = process.env.NODE_ENV !== "production";
const dataPath = `${os.homedir()}/.Electron`;
const userConfigFile = `${dataPath}/config.json`;
const validChannels = [
    "translateWin:fix",
    "translateWin:selected",
    "translateWin:selectedReply",
];

module.exports = {
    debug,
    dataPath,
    userConfigFile,
    validChannels,
    languages: [
        {
            value: "zh",
            label: "简体中文",
        },
    ],
};
