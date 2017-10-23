---
version: 0.0.1
author: xuld <xuld@vip.qq.com>
keyword:
    - polyfill
    - legacy
    - 垫片
    - es5
    - es6
    - es7
    - esnext
    - ecma
    - json
---
# JS 兼容补丁
在低版本浏览器直接使用 ECMAScript 5+ 新增的接口。

## ECMAScript 5
移动端和现代浏览器（IE9+）都支持 ECMAScript 5（HTML5 的一部分）。IE 6-8 和 2015 年之前的桌面浏览器需导入：
```js
import "util/shim/es5-shim";
```

补丁包含了以下 ECMAScript 5 新增的接口：
- [`Object.create`¹](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/create)
- [`Object.defineProperty`¹ ²](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty)
- [`Object.defineProperties`¹ ²](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperties)
- [`Object.getPrototypeOf`¹](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/getPrototypeOf)
- [`Object.keys`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/keys)
- [`Object.seal`¹](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/seal)
- [`Object.freeze`¹](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze)
- [`Object.preventExtensions`¹](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/preventExtensions)
- [`Object.isSealed`¹](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/isSealed)
- [`Object.isFrozen`¹](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/isFrozen)
- [`Object.isExtensible`¹](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/isExtensible)
- [`Object.getOwnPropertyDescriptor`¹](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/getOwnPropertyDescriptor)
- [`Object.getOwnPropertyNames`¹](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/getOwnPropertyNames)
- [`Array.isArray`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/isArray)
- [`Array.prototype.indexOf`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/indexOf)
- [`Array.prototype.lastIndexOf`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/lastIndexOf)
- [`Array.prototype.every`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/every)
- [`Array.prototype.some`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/some)
- [`Array.prototype.forEach`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach)
- [`Array.prototype.filter`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/filter)
- [`Array.prototype.map`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/map)
- [`Array.prototype.reduce`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce)
- [`Array.prototype.reduceRight`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/reduceRight)
- [`Date.now`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Date/now)
- [`Date.prototype.toISOString`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Date/toISOString)
- [`Function.prototype.bind`¹](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/bind)
- [`JSON.stringify`¹](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify)
- [`JSON.parse`¹](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse)

¹：补丁仅模拟了该接口的部分功能。    
²：受引擎限制，IE6-8 无法模拟 `Object.defineProperty`，使用了该接口的程序将无法在 IE6-8 运行。

> ##### 另参考
> - [ECMAScript 5 支持情况](http://kangax.github.io/compat-table/es5/)
> - [ECMAScript 5 完整实现：es5-shim](https://github.com/es-shims/es5-shim)
> - [ECMAScript 3 规范](http://www-archive.mozilla.org/js/language/E262-3.pdf)
> - [ECMAScript 5 规范](http://www.ecma-international.org/ecma-262/5.1/)
> - [ECMAScript 5 规范（中文）](http://lzw.me/pages/ecmascript/)

## ECMAScript 6
2016 年之后发布的浏览器（Edge 14+）都支持 ECMAScript 6。其它浏览器需导入：
```js
import "util/shim/es6-shim";
```

项目中一般用不到 ECMAScript 6 的完整功能，建议改用精简后的补丁：
```js
import "util/shim";
```

补丁包含了以下 ECMAScript 6 新增的接口（精简版只包含了其中加 ³ 的接口）：
- [`Promise`³](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise)
- [`Object.assign`³](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/assign)
- [`Object.is`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/is)
- [`Object.setPrototypeOf`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/setPrototypeOf)
- [`String.prototype.startsWith`³](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/startsWith)
- [`String.prototype.endsWith`³](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/endsWith)
- [`String.prototype.repeat`³](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/repeat)
- [`Array.from`³](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/from)
- [`Array.prototype.find`³](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/find)
- [`Array.prototype.findIndex`³](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/findIndex)
- [`Array.prototype.fill`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/fill)
- [`Number.isInteger`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Number/isInteger)

> ##### 另参考
> - [ECMAScript 6 支持情况](http://kangax.github.io/compat-table/es6/)
> - [ECMAScript 6 完整实现：es6-shim](https://github.com/es-shims/es6-shim)
> - [ECMAScript 6 规范](http://www.ecma-international.org/ecma-262/6.0/)
> - [Promises](https://www.promisejs.org/)

## ECMAScript 7（ECMAScript 2016）
目前（2017）没有完全支持 ECMAScript 7 的浏览器。需导入：
```js
import "util/shim/es7-shim";
```

补丁包含了以下 ECMAScript 7 新增的接口：
- [`Object.values`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/value)
- [`Object.entries`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/entries)
- [`Array.prototype.includes`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/includes)
- [`String.prototype.padStart`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/padStart)
- [`String.prototype.padEnd`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/padEnd)
- [`String.prototype.trimLeft`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/trimLeft)
- [`String.prototype.trimRight`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/trimRight)

> ##### 另参考
> - [ECMAScript 7 支持情况](http://kangax.github.io/compat-table/es7/)
> - [ECMAScript 7 完整实现：es7-shim](https://github.com/es-shims/es7-shim)
> - [ECMAScript 7 规范](http://www.ecma-international.org/ecma-262/7.0/)

## 建议

### PC 端项目
建议导入 `util/shim/es5-shim` 和 `util/shim`，确保 ECMAScript 5 全部和 ECMAScript 6+ 常用接口可用。

### 移动端项目
ECMAScript 5 在移动端可直接使用，建议导入 `util/shim` 确保 ECMAScript 6+ 常用接口可用。

### Node.js 项目
建议直接升级为 Node.js 6+，可直接使用所有 ECMAScript 6 功能。

### 打包优化
有些打包插件可以实现在调用 ECMAScript 新增的接口时自动打补丁，可参考相关文档。

> ##### 另参考
> - [[../docs/spec/compatibility]]
> - [ECMAScript 兼容性报告](http://kangax.github.io/compat-table/)
> - [core.js - Standard Library](https://github.com/zloirock/core-js)
