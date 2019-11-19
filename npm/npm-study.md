# npm command-line
```bash
npm login
# change taobao
npm config set registry https://registry.npm.taobao.org
npm config delete registry

npm whoami
# view user profile setting
# its should using official registry config(not taobao)
npm profile get
# setting profile: email,two-factor auth, fullname,homepage,freenode,github,password
npm profile set <prop> <value>
npm profile set password
# install the latest stable version of npm
npm install npm@latest -g
# update the next release of npm
npm install npm@next -g

# strongly recommend using a node version manager to install nodejs and npm
# (NVM   nodist  n   nave    nodebrew)
# #! deleted the existing npm install and node before using nvm
# using nvm-windows-noinstall.zip 
# upzip to installed-directory(P:\Apps\nvm-noinstall)
# click install.cmd
# setting settings.txt(in c:\\ root-directory)
root: P:\Apps\nvm-noinstall
path: P:\Apps\nvm-noinstall\nodejs_(NODE version shortcuts)
arch: 64(系统架构)
proxy: none
node_mirror: http://npm.taobao.org/mirrors/node/
# npm安装失败可能是淘宝镜像错误，换成GitHub就可以了
npm_mirror: https://github.com/npm/cli/archive/
# setting env looking at `NVM_HOME` and `NVM_SYMLINK`(NODE version shortcuts)
# but also take `%NVM_HOME%` and `%NVM_SYMLINK%` to path

# check out install success using:
nvm version(or nvm -v)
# install/uninstall nodejs using:
nvm [ install | uninstall ] <version> [<arch>]
nvm insatll 12.13.0 (arch default system architecture)
# switch to use the specified version using:
nvm use <version> [<arch>]
nvm use 12.13.0 32
# list nodejs installations using:
nvm list [available(all available version) | installed]
# enable/disable node.js version management using:
nvm [ on | off ]
# config global and cache for node using(using nvm don't config this):
npm config ls
npm config set prefix "node_global_path"
npm config set cache "node_cache_path"
# set `NODE_PATH` with "node_global_path\node_modules"
# set `path` with "node_global_path"

# before using nodist should:
# uninstall nodejs app and delete nodejs directories
# delete user/appdata/roaming/npm-*
# delete env about nodejs and npm reference
nodist --help
# add env
NODIST_NODE_MIRROR                值：https://npm.taobao.org/mirrors/node
NODIST_IOJS_MIRROR                值：https://npm.taobao.org/mirrors/iojs

# using npmrc to managing multiple profiles for different registries
npm i npmrc -g
# create an npm enterprise profile
npmrc -c <name>
# set an registry for the profile
npm config set registry https://registry.your-company-registry.npme.io/
# switch profiles with npmrc
npmrc <name>
# login with npmrc
npm login

# installing/publishing(others as well like uninstall) packages and generate an npm-debug.log file help you figure out what went wrong
npm install <package> --timing
npm publish <package> --timing
# find npm-debug.log in .npm directory
npm config get cache

# errors(https://docs.npmjs.com/common-errors)
# update the latest stable npm
# random errors resolve using two methods:
npm cache clean
npm install <package> -verbose(see more details)


# look global packages path
npm config get prefix -g
npm config set prefix "path" -g

```