const os = require("os");

const debug = process.env.NODE_ENV !== "production";
const dataPath = `${os.homedir()}/.ETranslate`;
const userConfigFile = `${dataPath}/config.json`;

module.exports = {
    debug,
    dataPath,
    userConfigFile,
    languages: [
        {
            value: "zh",
            label: "简体中文",
        },
    ],
};
