src: 项目中的文件
    utils：业务相关代码
    tools：业务无关，纯工具函数
    assets：静态资源文件（图片，字体）
    api: 可复用的封装请求方法
    config：配置文件
typings：ts的模块声明文件
build：项目打包上线配置，webpack配置

安装依赖：typescript tslint
初始化配置文件：npm init (-y)
tsc初始化配置：tsc --init
webpack依赖：webpack webpack-cli webpack-dev-server cross-env -D
在build中新建webpack配置文件webpack.config.js
插件依赖：clean-webpack-plugin html-webpack-plugin 
