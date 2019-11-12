const HtmlWebpackPlugin = require("html-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");
module.exports = {
    entry: "./src/index.ts",
    output: {
        filename: "main.js"
    },
    resolve: {
        extensions: [".js"]
    },
    module: {
        rules: [{
            test: /\.tsx?$/,
            use: "ts-loader",
            exclude: /node_modules/
        }]
    },
    devtool: process.env.NODE_ENV === "production"? false: "inline-source-map",
    devServer: {
        contentBase: "./dist",
        stats: "errors-only",
        compress: false,
        host: "localhost",
        port: 8089
    },
    plugins: [
        new CleanWebpackPlugin({
            CleanOnceBeforeBuildPatterns: ["./dist"]
        }),
        new HtmlWebpackPlugin({
            template: "./src/template/index.html"
        })
    ]
}