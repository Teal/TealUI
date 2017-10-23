---
version: 0.0.1
author: xuld <xuld@vip.qq.com>
---
# 命名空间
定义命名空间避免全局命名冲突。

## 定义命名空间
将全局变量和函数放在某个命名空间下，可以避免命名冲突。
```js {3}
import namespace from "util/namespace";

var TealUICore = namespace("TealUI.Core"); 

// 然后可以使用 TealUICore.xx = ...
```

## 建议
项目中建议使用 CommonJS 模块化方案，而不需要使用本组件。