# 二次开发
搭建团队专属的组件库。

## Git Fork
得益于 Git 的优势，使用 [Git fork](https://github.com/Teal/TealUI/#fork-destination-box)，可以在二次开发后同时合并 TealUI 最新的更新。

## 目录结构
```
TealUI/
    ├── assets/         文档所需的资源文件
    ├── docs/           文档
    ├── components/     组件源码
    │   ├── util/       工具函数（适用于所有环境）
    │   ├── web/        网页开发的工具函数（仅适用于浏览器）
    │   ├── typo/       CSS 排版样式
    │   ├── ui/         UI 组件（适用于管理端和 PC 端）
    │   ├── touch/      APP UI 组件（仅适用于移动端）
    │   ├── hybrid/     混合开发组件
    │   └── project/    业务组件
    └── tools/          工具
```

## 构建命令

### 启动
- 安装依赖包：
```bash
npm install
```
- 启动项目：
```bash
npm start
```
启动后会自动打开项目首页。

### 更多命令
TealUI 是使用 [Digo](http://digojs.github.io/) 构建的，首先安装：
```bash
npm install digo -g
```
然后可以使用以下构建命令：
```bash
digo server     # 启动开发服务器（然后打开 http://127.0.0.1:9090）
digo dist       # 发布代码（用于给 webpack 等直接引用）
digo publish    # 发布文档（用于上传到 tealui.com）
digo --list     # 列出所有命令
```

## 新建组件
```bash
digo new ui/test "测试组件"
```
执行以上命令后会生成：
```
TealUI/
    └── components/
        └── ui/
            └── test/
                ├── test.md           组件文档
                ├── test.tsx          组件 JS 源码
                ├── test.scss         组件 CSS 源码
                └── package.json      模块描述文件（主要用于指定入口文件）
```
默认组件使用 [TypeScript](http://typescriptlang.org)（.tsx） 和 [SCSS](http://sass-lang.com/)（.scss）开发，你也可以改回 .js 和 .css 文件。

在浏览器打开 http://127.0.0.1:9090/components/ui/test 会显示 `test.md` 文件的内容。

修改 components/index.yml 可以调整组件在列表中的位置，方便查找组件。
index.yml 是一个 [YAML](http://yaml.org/) 文件。

## 编写组件
现在你可以修改 test.tsx 和 test.scss 编写组件了。

每个组件都是一个符合 [commonjs](http://www.commonjs.org/) 规范的小模块。

使用 `export` 导出接口：
```jsx
export function hello() {
    alert("Hello world!");
}
```

使用 `import` 导入其它组件：
```jsx
import MessageBox from "ui/messageBox";

export function hello() {
    MessageBox.alert("Hello world!");
}
```

## 编写文档
组件完成后修改 `test.md` 文件编写文档。文档使用 Markdown 语法。
TealUI 提供了强大的文档系统，使得编写组件文档可以非常轻松。

### 元信息
在 .md 文件顶部可以使用 [YAML](http://yaml.org/) 语法描述组件的元信息：
```md
--- 
version: 0.0.1
author: xuld@vip.qq.com
--- 
```

可描述的字段有：
- `version`：描述组件的版本号。
- `author`：描述组件的作者，可以是多个：
```
--- 
author:
    - xuld@vip.qq.com
    - ...
--- 
```
- `title`：描述组件的名字。
- `description`：描述组件的详细说明。
- `keyword`：描述组件的搜索关键字：
```
--- 
keyword:
    - 测试
    - ...
--- 
```
- `tag`：描述组件的标签（将显示在文档顶部）：
```
--- 
tag:
    - IE6
--- 
```
- `import`：描述文档页面额外导入的组件：
```
--- 
import:
    - ui/messageBox
--- 
```

### 插入代码段
使用 Markdown 语法插入一段代码：
<pre>
```js
var a = 1;
```
</pre>

语言后添加 {1,3-5} 表示高亮第 1 行和第 3 到 5 行。   
代码段中可以使用 `---` 插入分割线。

<pre>
```js {3}
var a = 1;
---
var b = 1;
---
var c = 1;
```
</pre>
最终显示为：
```js {3}
var a = 1;
---
var b = 1;
---
var c = 1;
```

### 插入组件演示（DEMO）
在 html、css 或 js 语言后加 `demo`，可以将代码段转为演示代码：
<pre>
```html demo
Hello World!
```
</pre>
以上代码将显示为：
```html demo
Hello World!
```

在演示 js 语言时，可以使用 `__root__` 获取演示容器 div 的 ID：
<pre>
```js demo
__root__.innerHTML = "Hello World!";
```
</pre>

如果希望演示的代码默认折叠，则在 `demo` 后添加 `hide`。    
如果希望美化演示部分的样式，则在 `demo` 后添加 `doc`。
<pre>
```html demo {1} hide doc
Hello
---
World!
```
</pre>
以上代码将显示为：
```html demo {1} hide doc
Hello
---
World!
```

### 插入引用
```
> ##### 信息
> 我是信息
```
以上代码将显示为：
> ##### 信息
> 我是信息

在标题前加标记可以设置引用的级别：
- (i)：信息级别，显示为蓝色。
- [!]：警告级别，显示为橙色。
- (!)：错误级别，显示为红色。

```
> ##### [!]注意
> 我是警告
```
以上代码将显示为：
> ##### [!]注意
> 我是警告

### 插入盒子
为演示方便，有时需要在页面显示一个方块：
```html
<div class="doc-box">doc-box</div>
```
使用 `.doc-box-small` 和 `.doc-box-large` 改变盒子大小。     
使用 `.doc-box-red`、`.doc-box-blue` 和 `.doc-box-yellow` 改变盒子颜色。

```html
<div class="doc-box doc-box-small doc-box-red"></div>
<div class="doc-box doc-box-yellow">doc-box</div>
<div class="doc-box doc-box-large doc-box-blue">doc-box</div>
```
以上代码显示为：
<div class="doc-box doc-box-small doc-box-red"></div>
<div class="doc-box doc-box-yellow">doc-box</div>
<div class="doc-box doc-box-large doc-box-blue">doc-box</div>

### API 文档
为导出的接口添加 [jsdoc](http://usejsdoc.org/)，系统将会自动提取生成 API 文档。

如果不需要生成 API 文档，可以在元信息添加：
```
--- 
jsdoc: false
--- 
```

如果组件没有使用 `export` 导出接口，可以通过元信息手动描述导出项。
```
--- 
exportDefault: test
export:
    - test1
    - ...
--- 
```

## 单元测试
系统已集成了 [QUnit](http://qunitjs.com) 单元测试框架。

新建 组件名-test.js 文件，然后点击文档右上角工具菜单中的单元测试可以进入单元测试（如果没有请重新保存一次 .md 文件）。

测试用例和组件一样使用模块化开发。
每个导出函数即一个测试用例。
```js
import assert from "assert";
import * as test from "./test";

export function helloTest(){
    assert.ok(test.hello());
}
```

如果需要测试异步任务，可以为测试函数声明形参：
```js
import assert from "assert";
import * as test from "./test";

export function helloTest(done){
    setTimeout(() => {
        assert.ok(test.hello());
        done();
    }, 1000);
}
```

> ##### 另参考
> - [assert 接口文档](http://api.qunitjs.com/assert/)

## 发布
修改 `package.json` 中的 `name` 和 `description` 可以修改项目名和描述。

使用 `digo publish` 生成 `_publish` 文件夹，将此文件夹上传到内网即可打造团队内部的组件库。

使用 `digo dist` 生成 `_dist` 文件夹，将此文件夹上传到内网 git 的 dist 分支。
然后在项目的 `package.json` 中添加引用：
```json
{
    "dependencies": {
        "tealui": "git+http://github.com/Teal/TealUI.git#dev-v4-dist"
    }
}
```
这样项目里就可以直接使用内部定制过的组件库开发了。
