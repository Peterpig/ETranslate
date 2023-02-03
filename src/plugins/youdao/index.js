var querystring = require("querystring");
var axios = require("axios");

let key = "917764008";

module.exports = {
    exec: (cmdInfo) => {
        console.log("youdao cmdInfo --- ", cmdInfo);
        let args = cmdInfo.args.join(" ").trim();
        if (!args) return;
        args = querystring.escape(args);

        let ret = "";

        axios.get(
            `http://fanyi.youdao.com/openapi.do?keyfrom=ELaunch&key=${key}&type=data&doctype=json&version=1.1&q=${args}`,
            (res) => {
                res.on("data", (data) => {
                    ret = data;
                });
                res.on("end", (data) => {
                    // cb(JSON.parse(html));
                    console.log(data);
                });
            }
        );
        return ret;
    },
};
