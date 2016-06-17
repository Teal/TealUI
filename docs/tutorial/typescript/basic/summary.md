第一章 概述
========================================================

一、什么是编程
--------------------------------------------------------
编程，就是编写代码，然后让计算机去理解和执行，并最终让计算机去自动完成作者预设的目标。

编程的主要任务是**数据处理**。
数据可以通过键盘、鼠标、触屏、录音机、摄像机等方式录入，
经过程序处理后，
数据最终会以屏幕、声音、打印等方式输出。

通过设计不同的程序，可以最终让计算机、智能手机等设备拥有游戏、网购、在线视频聊天等现代化的功能。

二、学习编程需要哪些基础和能力
--------------------------------------------------------
编程的主要工作就是接收输入的数据，处理完成后再进行输出。
而数据在计算机中是以数字的形式存在的，
因此学习编程需要一点数学和逻辑的基础。

同时由于现在主流编程语言全部使用英文单词来表示的，
因此熟悉英文也会对学习编程有很大的帮助。

三、JavaScript 简介
--------------------------------------------------------
JavaScript 是一个由美国的网景通信公司(Netscape Communications Corporation)在 1995 为其旗下浏览器(Netscape Navigator)研发的脚本编程语言，
其设计初衷是为了增强网页的交互能力，
但由于其易用、开放等特点，
目前 JavaScript 的使用范围也在不断变大，
比如流行的 3D 游戏开发引擎 Utility 和服务器编程领域都已支持使用 JavaScript 进行开发。

相比其它编程语言，JavaScript 更容易入门，非常适合初学者。

JavaScript 可以直接在浏览器(对，就是你平时用来看网页的那个软件)执行。
在浏览器地址栏输入 `javascript: alert("hello world")` 并回车。
可以看到浏览器弹出了一个窗口并显示了 hello world。
这就是一个简单的 JavaScript 程序。

> 提示：JavaScript 原名为 LiveScript，和编程语言 Java 没有多少联系。要了解 JavaScript 的发展历史，可自行搜索相关资料。

> 常见问题：
> [我不知道怎么打开浏览器](../qa.md#)
> [地址栏在哪里?](../qa.md#)
> [为什么我执行代码没有出现弹窗?](../qa.md#)

### 1.2 JavaScript 简介

### 1.3 TypeScript 简介
TypeScript 是由微软研发的 JavaScript 扩展语言。
TypeScript 可以直接转换成 JavaScript 并执行。
相比 JavaScript，使用 TypeScript 可以减少错误率，提升总体编程效率。

### 1.4 第一份代码
TypeScript 脚本文件的扩展名一般是 `.ts`。
TypeScript 代码区分字母大小写，编写时请注意大小写。

#### 1. 新建 `hello.ts`
保存以下内容：
```ts
alert("你好");
```

> 提示：要编辑代码，可以使用任意的文本编辑软件。这里推荐一些专业的代码编辑器：[vscode](https://code.visualstudio.com/)(推荐)、[sublime](http://www.sublimetext.com/)、[Webstorm](https://www.jetbrains.com/webstorm/)、[Microsoft Visual Studio](https://www.visualstudio.com/)。

> 常见问题：
> [怎么新建 `hello.ts`?](qa.md#怎么新建hellots)
> [什么是扩展名?](qa.md#什么是扩展名)
> [怎么更改文件的扩展名?](qa.md#怎么更改文件的扩展名)

#### 2. 编译 `hello.ts` 到 `hello.js`
为了执行代码，我们需要先将 TypeScript 编译成 JavaScript。
编译的方式有很多，这里列举几个最通用的做法。

##### 使用 NodeJS
1. 安装 [NodeJs 和 NPM](http://nodejs.org/)。
2. 执行命令 `npm install typescript -g` 安装 TypeScript 编译器。
3. 执行命令 `tsc hello.ts` 生成 `hello.js`。

> 常见问题：
> [怎么执行命令?](qa.md#怎么执行命令)
> [提示 `“node” 不是内部或外部命令，也不是可运行的程序` 怎么办?](qa.md#提示node不是内部或外部命令也不是可运行的程序怎么办)
> [提示 `“npm” 不是内部或外部命令，也不是可运行的程序` 怎么办?](qa.md#提示npm不是内部或外部命令也不是可运行的程序怎么办)
> [提示 `“tsc” 不是内部或外部命令，也不是可运行的程序` 怎么办?](qa.md#提示tsc不是内部或外部命令也不是可运行的程序怎么办)
> [提示 `找不到 “hello.ts”` 怎么办?](qa.md#找不到hellots怎么办)
> [找不到 `hello.js` 怎么办?](qa.md#[找不到hellojs怎么办)

##### 使用 Microsoft Visual Studio 2015
1. 启动 Microsoft Visual Studio 2015。
2. 点击工具/选项.../文本编辑器/TypeScipt/项目，右边勾上“自动编译不是项目一部分的 TypeScript 文件”并确定。
3. 点击文件/新建/新建网站/输入名字后确认。
4. 右击“解决方案浏览器”中的网站名/添加/JavaScript 文件。文件名写 `hello.ts` 并确认。
5. 编写代码并保存。
6. 右击“解决方案浏览器”中的网站名/刷新文件夹，可以看到生成了 `hello.js`。
7. 每次重新保存代码时，都会重新生成这个文件。

> 常见问题：
> [其它编辑怎么编译 TypeScript?](qa.md#其它编辑怎么编译TypeScript)

#### 3. 执行 `hello.js`
新建 `hello.html`，保存以下代码：
```html
<meta charset="utf-8">
<script src="hello.js"></script>
```
然后在浏览器打开 `hello.html`，
如果浏览器弹出了 "你好" 说明执行成功。

> 常见问题：
> [如何在浏览器打开 `hello.html`?](qa.md#如何在浏览器打开hellohtml)
> [我的浏览器打开是空白页没有弹窗?](qa.md#我的浏览器打开是空白页没有弹窗)
> [出现乱码?](qa.md#出现乱码)

> 练习:
> 1. 按照示例编写第一份代码，在浏览器打开并查看效果。
> 2. 更改代码中的 `你好` 为其它文字，看看效果。
> 3. 更改代码中的 `alert` 为 `prompt`，看看效果。
