const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
    entry: "./src/index.ts",
    output: {
        filename: "main.js"
    },
    resolve: {
        extensions: [".ts", ".tsx", ".js"]
    },
    module: {
        rules: [{
            test: /\.tsx?$/,
            use: "ts-loader",
            exclude: /node_modules/
        }]
    },
    devtool: process.env.NODE_ENV === "production" ? false: "inline-source-map",
    devServer: {
        contentBase: "./dist",
        stats: "errors-only",
        compress: false,
        // 这里若没有使用两个参数，可在package.json中配置webpack-dev-server --host 127.0.0.1 --port 8089
        host: "localhost",
        port: 8089
    },
    plugins: [
        new CleanWebpackPlugin({
            cleanOnceBeforeBuildPatterns: ["./dist"]
        }),
        new HtmlWebpackPlugin({
            template: "./src/template/index.html"
        })
    ]
}