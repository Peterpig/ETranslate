var querystring = require("querystring");
var axios = require("axios");

let key = "917764008";

module.exports = {
    exec: (cmdInfo) => {
        let args = cmdInfo.args.join(" ");
        if (!args) return;
        args = querystring.escape(args);

        let ret = "";

        axios
            .get(
                `http://fanyi.youdao.com/openapi.do?keyfrom=ELaunch&key=${key}&type=data&doctype=json&version=1.1&q=${args}`
            )
            .then((res) => {
                console.log("youdao ret =", res.data);
            });
        return ret;
    },
};
