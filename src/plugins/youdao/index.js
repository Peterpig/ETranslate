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
    console.log(res.data);
    let ret = {
        ori: "",
        web: [],
    };
    if (!res || !res.data) return;
    if (res.data.translation) {
        ret.ori = res.data.translation.join(", ");
    }
    if (res.data.web) {
        res.data.web.forEach((element) => {
            ret.web.push(element.value.join(", "));
        });
    }
    return ret;
}

module.exports = {
    exec,
};
