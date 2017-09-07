---
version: 0.0.1
author: xuld <xuld@vip.qq.com>
---
# 兼容补丁
让调用了 ECMAScript 5+ 新增接口的程序在低版本浏览器也能正常运行。

## ECMAScript 3
所有浏览器（包括 IE6）都支持 ECMAScript 3 所有接口。

> ##### 另参考
> - [ECMAScript 3 规范](http://www-archive.mozilla.org/js/language/E262-3.pdf)

## ECMAScript 5
除了 IE6-8 和 2015 年之前发布的桌面浏览器，其它现代浏览器都支持 ECMAScript 5。
如果只开发移动端应用或不考虑 IE6-8 兼容性，则可以直接使用 ECMAScript 5 所有接口。

通过 `import "util/shim/es5-shim"` 可安全使用以下 ECMAScript 5 新增接口：
- `Object.create`*
- `Object.defineProperty`*
- `Object.defineProperties`*
- `Object.getPrototypeOf`*
- `Object.keys`
- `Object.seal`*
- `Object.freeze`*
- `Object.preventExtensions`*
- `Object.isSealed`*
- `Object.isFrozen`*
- `Object.isExtensible`*
- `Object.getOwnPropertyDescriptor`*
- `Object.getOwnPropertyNames`*
- `Array.isArray`
- `Array.prototype.indexOf`
- `Array.prototype.lastIndexOf`
- `Array.prototype.every`
- `Array.prototype.some`
- `Array.prototype.forEach`
- `Array.prototype.filter`
- `Array.prototype.map`
- `Array.prototype.reduce`
- `Array.prototype.reduceRight`
- `Date.now`
- `Date.prototype.toISOString`
- `Function.prototype.bind`*
- `JSON.stringify`*
- `JSON.parse`*

*: 补丁仅模拟了该接口部分功能。

> ##### (!)IE6-8 无法模拟 `Object.defineProperty`
> `Object.defineProperty` 依赖了 JavaScript 引擎本身实现，无法在 IE6-8 完全模拟。
> 如果项目中用到此接口，则无法兼容 IE6-8。

> ##### [!]补丁仅提供常用功能
> 完整版本参考：[es5-shim](https://github.com/es-shims/es5-shim)。

> ##### 另参考
> - [ECMAScript 5 规范](http://www.ecma-international.org/ecma-262/5.1/)
> - [ECMAScript 5 规范（中文）](http://lzw.me/pages/ecmascript/)

## ECMAScript 6
在 2016 年之后发布的浏览器都支持 ECMAScript 6。

通过 `import "util/shim/es6-shim"` 可安全使用以下 ECMAScript 6 新增接口：
- `Promise`
- `Object.assign`
- `Object.is`
- `Object.setPrototypeOf`
- `String.prototype.startsWith`
- `String.prototype.endsWith`
- `String.prototype.repeat`
- `Array.from`
- `Array.prototype.find`
- `Array.prototype.findIndex`
- `Array.prototype.fill`
- `Number.isInteger`

> ##### [!]补丁仅提供常用功能
> 完整版本参考：[es6-shim](https://github.com/es-shims/es6-shim)。

> ##### 另参考
> - [ECMAScript 6 规范](http://www.ecma-international.org/ecma-262/6.0/)
> - [Promises](https://www.promisejs.org/)

## ECMAScript 7
通过 `import "util/shim/es7-shim"` 可安全使用以下 ECMAScript 7 新增接口：
- `Object.values`
- `Object.entries`
- `Array.prototype.includes`
- `String.prototype.padStart`
- `String.prototype.padEnd`
- `String.prototype.trimLeft`
- `String.prototype.trimRight`

> ##### [!]补丁仅提供常用功能
> 完整版本参考：[es7-shim](https://github.com/es-shims/es7-shim)。

> ##### 另参考
> - [ECMAScript 7 规范](http://www.ecma-international.org/ecma-262/7.0/)

## `atob` & `btoa`
IE 6-9 和 Opera 10.1 未内置 `atob` & `btoa`。

通过 `import "util/shim/atob-shim"` 可安全使用以下接口：
- `atob`
- `btoa`

> ##### (!)不支持中文
> 如需支持中文，使用[[util/base64]]。

## 建议
ECMAScript 5 新增接口在项目中的使用频率较高。
移动端和主流浏览器及 IE9+ 都可直接使用。
如果需要兼容 IE6-8 及其它低版本浏览器则引入 `util/shim/es5-shim` 组件，
以此确保所有 ECMAScript 5 新增接口都没有兼容性问题。

ECMAScript 6+ 中仅部分功能比较常用。
可使用精简后的 `util/shim` 组件代替 `util/shim/es6-shim` 来减少体积。 

通过 `import "util/shim"` 可安全使用以下 ECMAScript 6+ 新增接口：
- `Promise`
- `Object.assign`（仅支持双参数）

> ##### 另参考
> - [[../docs/spec/compatibility]]
> - [ECMAScript 兼容性报告](http://kangax.github.io/compat-table/)
> - [core.js - Standard Library](https://github.com/zloirock/core-js)
