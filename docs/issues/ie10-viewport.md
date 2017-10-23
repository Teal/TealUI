---
version: 0.0.1
author: xuld <xuld@vip.qq.com>
---
# IE 10（WP 8）不识别 `<meta name="viewport">`
添加如下代码修复：
```js
if (/IEMobile\/10\.0/.test(navigator.userAgent)) {
    document.head.appendChild(document.createElement("style")).innerHTML = "@-ms-viewport{width:auto!important}";
}
```
[[../components/typo/reset]]组件已内置此代码。

> ##### 另参考
> - [Windows Phone 8 and Device-Width](https://timkadlec.com/2013/01/windows-phone-8-and-device-width/)
