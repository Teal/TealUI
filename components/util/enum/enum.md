---
version: 0.0.1
author: xuld <xuld@vip.qq.com>
---
# 枚举
枚举即将常用的字段用统一的数字编码存储表示，程序中使用字段名指代难记的数字。定义枚举可增加代码的可读性。

## 定义枚举
```js
var WeekDay = { 
    sunday: 0,
    monday: 1,
    tuesday: 2,
    wednesday: 3,
    thirsday: 4,
    friday: 5,
    saturday: 6
};
```

## 定义枚举标记位
通过位操作将多个标记存在同一个整数中。
```js
var Colors = {
    red: 1 << 0,
    yellow: 1 << 1,
    blue: 1 << 2
};
var green = Colors.red | Colors.yellow;
```
