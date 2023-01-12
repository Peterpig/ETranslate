const { defineConfig } = require("@vue/cli-service");
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");

module.exports = defineConfig({
    transpileDependencies: true,

    pluginOptions: {
        electronBuilder: {
            preload: "src/preload.js",
            // nodeIntegration: true,
        },
    },
    chainWebpack: (config) => {
        config.module
            .rule("node")
            .test(/.node$/)
            .use("node-loader")
            .loader("node-loader");

        config.plugin().use(NodePolyfillPlugin);
    },
});
