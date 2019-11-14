```
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

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
            test: /\tsx?$/,
            use: "ts-loader",
            exclude: /node_modules/
        }]
    },
    devtool: process.env.NODE_ENV === "production" ? false: "inline-source-map",
    devServer: {
        contentBase: "./dist",
        stats: "errors-only",
        compress: false,
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


var package_json = {
    "start": "cross-env NODE_ENV=development webpack-dev-server --config ./build/webpack.config.js",
    "build": "cross-env NODE_ENV=production webpack --config ./build/webpack.config.js"
}

// const HtmlWebpackPlugin = require("html-webpack-plugin");
// const CleanWebpackPlugin = require("clean-webpack-plugin");

// module.exports = {
//     entry: "./src/index.ts",
//     output: {
//         filename: "main.js"
//     },
//     resolve: {
//         extensions: [".ts", ".tsx", ".js"]
//     },
//     module: {
//         rules: [{
//             test: /\tsx?$/,
//             use: "ts-loader",
//             exclude: /node_moduls/           
//         }]       
//     },
//     devtool: process.env.NODE_ENV === "production"? false: "inline-source-map",
//     devServer: {
//         contentBase: "./dist",
//         stats: "errors-only",
//         compress: false,
//         host: "localhost",
//         port: 8089
//     },
//     plugins: [
//         new CleanWebpackPlugin({
//             cleanOnceBeforeBuildPatterns: ["./dist"]
//         }),
//         new HtmlWebpackPlugin({
//             template: "./src/template/index.html"
//         })
//     ]
// }

/**
 * 搭建第一个typescript项目
 * 构建项目目录：
 * src:项目中使用的文件
 *  config: 配置文件
 *  assests:静态资源（图片，字体）
 *  template:
 *  utils:业务相关可复用的方法
 *  api:复用的封装的接口请求的方法
 *  tools:业务无关纯工具的函数
 *  index.ts:
 * build:项目打包上线的配置，本地开发服务的配置（webpack）
 *  webpack.config.js:
 * typings:ts的模块声明文件
 * package.json 
 * tsconfig.json
 * 
 * 初始化项目配置：npm init
 * 自动初始化项目配置：npm init -y
 * 初始化ts配置生成tsconfig.json文件：tsc --init
 * 
 * 项目依赖：
 * 全局依赖：typescript tslint
 * 本地依赖：typescript
 * 开发依赖(-D): webpack webpack-cli webpack-dev-server 
 *              cross-env ts-loader
 *              clean-webpack-plugin html-webpack-plugin
 * 
 *  package.json文件中scripts属性内部的属性可以通过<npm run 属性>的形式调用
 *  start属性指令可以直接通过<npm start>调用
 *      cross-env NODE_ENV=development webpack-dev-server --confing ./build/webpack.config.js
 *  build指令
 *      cross-env NODE_ENV=production webpack --config ./build/webpack.config.js
 * 
 * webpack.config.js配置
 * entry:项目编译的入口文件
 * output：编译输出文件
 * resolve：启动一下自动解析的文件扩展，在导入模块时不需写后缀
 * module：对于指定后缀文件的处理
 *      rules：
 *          test:匹配的文件后缀，re
 *          use：使用的解析工具ts-loader
 *          exclude：指定排除的文件
 *      devtool：调试定位sourcemap
 * devServer:webpack-dev-server配置
 *      contentBase:所运行的文件夹
 *      stas: 控制台打印的信息（比如error）
 *      compress：是否启动压缩
 *      host
 *      port
 * plugins：
 *      html-webpack-plugin:指定编译的模板
 *      clean-webpack-plugin:清理一些指定的文件
 */
```