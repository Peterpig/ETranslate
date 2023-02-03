const { defineConfig } = require("@vue/cli-service");
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");
const path = require("path");

module.exports = defineConfig({
    transpileDependencies: true,

    pluginOptions: {
        electronBuilder: {
            preload: "src/preload.js",
        },
        "style-resources-loader": {
            preProcessor: "scss",
            patterns: [],
        },
    },
    chainWebpack: (config) => {
        const types = ["vue-modules", "vue", "normal-modules", "normal"];
        types.forEach((type) => {
            //匹配到所有需要导入的文件
            config.module
                .rule("scss")
                .oneOf(type)
                .use("style-resource")
                .loader("style-resources-loader")
                .options({
                    patterns: [path.resolve(__dirname, "src/styles.scss")],
                });
        });

        config.module
            .rule("node")
            .test(/.node$/)
            .use("node-loader")
            .loader("node-loader");

        config.plugin().use(NodePolyfillPlugin);

        config.devServer.watch = true;
    },
});
