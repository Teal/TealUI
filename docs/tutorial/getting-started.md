# 开始使用
你无需学习任何其它框架就可以快速上手 TealUI。

## Hello World
最快使用一个组件的方法是通过加载器。
比如要使用[[../components/ui/messageBox]]组件：
```html {5,9-11}
<!DOCTYPE html>
<html>
<head>
    <title>我的第一个页面</title>
    <script src="http://tealui.com/components/require.js"></script>
</head>
<body>
    <script>
        require(["ui/messageBox"], function (messageBox) {
            messageBox.default.alert("Hello world!");
        });
    </script>
</body>
</html>
```
将以上代码保存为 hello.html 并在浏览器打开，就可以看到弹出了一个“Hello world!”的消息框。

其中，第一段引入了一个名为 require.js 的加载器。
这个文件定义了全局的 `require` 函数用来加载组件。

第二段首先导入了 `ui/messageBox` 组件，然后通过这个组件导出的 `default.alert` 函数接口实现了弹窗效果。

## 使用构建工具
现在你已经掌握了如何使用组件的基本方法。

实际项目中建议使用如 webpack 之类的构建工具加载组件：
1. 可以使用更简短的 [`import`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/import) 语法导入组件。
2. 合并导入的组件，减少请求数以提升页面性能。
3. 支持在导入时压缩优化代码。
4. 同时支持导入其它 NPM 生态圈的组件。

### 使用 Webpack

#### 1. 准备工作
- 安装 [Node.js](https://nodejs.org) v6.5 或更高版本。
- 安装 [webpack](http://webpack.github.io/) 3 或更高版本：
```bash
npm install webpack -g
npm install webpack webpack-dev-server
```

#### 2. 下载 TealUI 源码
```bash
npm install tealui
```

#### 3. 配置 Webpack
> ##### (i)提示
> 使用 TealUI 不需要对 Webpack 作额外配置，如果你已熟悉 Webpack，以下配置仅供参考。

新建 webpack.config.js：
```js
module.exports = {
    module: {
        rules: [
            {
                test: /\.css/i,
                loader: "css-loader"
            }
        ]
    },
    entry: './src/index.js',
    output: {
        filename: 'bundle.js',
        path: __dirname + '/dist'
    }
};
```

#### 4. 新建测试代码
- 新建 dist/index.html：
```html
<!DOCTYPE html>
<html>
<head>
    <title>我的第二个页面</title>
    <script src="bundle.js"></script>
</head>
<body>

</body>
</html>
```
- 新建 src/index.js：
```jsx
import MessageBox from "tealui/ui/messageBox";

MessageBox.alert("Hello World!");
```

#### 5. 启动
```bash
webpack
```
执行后 Webpack 会编译 src/index.js 文件并生成 dist/bundle.js。

在浏览器打开 dist/index.html 可以看到[[../components/ui/messageBox]]组件已成功加载并显示了消息框。

### 脚手架
你可以使用现成的[脚手架](https://github.com/digojs/digofiles/tree/master/tealui-webpack)快速创建一个新项目。
```bash
npm install digo -g
digo --init tealui-webpack
```

#### 启动调试
```bash
npm start
```
在浏览器访问 http://127.0.0.1:8080/ 查看效果。

#### 发布构建
```bash
npm run build
```
入口文件会生成到 dist 目录，你可以直接引用。

## 组件路径
组件路径是相对于 require.js 的相对路径，比如 `ui/messageBox`。
每个组件文档顶部都会显示该组件的路径。

路径前缀的意义如下：
- util：工具函数（适用于所有环境）
- web：网页开发的工具函数（仅适用于浏览器）
- typo：CSS 排版样式
- ui：UI 组件（适用于管理端和 PC 端）
- touch：APP UI 组件（仅适用于移动端）
- hybrid：混合开发组件
- project：业务组件

<!-- 
每个组件都遵循了 [commonjs](http://www.commonjs.org/) 规范

TealUI 所有组件均使用 TypeScript + Sass 编写，并且遵循 [commonjs](http://www.commonjs.org/) 规范。
因此可以使用任何一个支持 commonjs 规范的构建工具导入组件源码。

TealUI 默认发布后的代码为标准 JavaScript 和 CSS 文件，其遵循 [AMD](https://github.com/amdjs/amdjs-api/blob/master/AMD.md) 规范。
因此也可以使用任何一个支持 AMD 规范的构建工具直接导入发布后的组件。

下文将介绍如何配置 [Webpack](http://webpack.github.io/) 和 [Digo](http://digojs.github.io/) 导入组件。

### 配置 Webpack
1. 新建 package.json，内容如下：
```json
{
    "dependencies": {
        "tealui": "latest"
    },
    "devDependencies": {
        "webpack": "latest",
        "webpack-dev-server": "latest"
    },
    "scripts": {
        "build": "webpack"
    }
}
```
2. 安装依赖包
```bash
npm install
```
这个命令会安装 package.json 中指定的依赖包。

2. 新建 webpack.config.js，内容如下：
```js

```

#### 1. 直接导入编译后的代码



2. 导入源码并使用对应的 webpack loader 即时编译。

导入 JavaScript 组件后可直接使用其导出的 API 接口。 
导入 CSS 组件后可以直接使用其内部定义的所有 CSS 类。

点击页面顶部的[组件](../../components)可以查看 TealUI 提供的所有组件列表，底部会列出该组件导出的所有 API 接口。

所有组件都可以通过绝对地址或相对于 `require.js` 的相对地址导入，导入一个组件时组件会自动导入其内部的依赖组件。

组件本质上就是一个符合 [AMD](https://github.com/amdjs/amdjs-api/blob/master/AMD.md) 模块规范的 JavaScript 文件或一个 CSS 文件。 -->
