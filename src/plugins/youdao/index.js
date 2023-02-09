var querystring = require("querystring");
var axios = require("axios");

let key = "917764008";

function exec(cmdInfo) {
    let args = cmdInfo.args.join(" ");
    if (!args) return;
    args = querystring.escape(args);

    return axios
        .get(
            `http://fanyi.youdao.com/openapi.do?keyfrom=ELaunch&key=${key}&type=data&doctype=json&version=1.1&q=${args}`
        )
        .then((res) => {
            return parseRes(res);
        });
}

function parseRes(res) {
    if (res && res.data && res.data.translation) {
        return res.data.translation.join("\n");
    }
}

module.exports = {
    exec,
};
