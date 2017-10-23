---
version: 0.0.1
author: xuld <xuld@vip.qq.com>
---
# 枚举
枚举即用字段名代替难记的数值。定义枚举可增加代码的可读性。

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

if (new Date().getDay() === WeekDay.sunday) {
    console.log("今天是星期天哦");
}
```

## 枚举标记位
通过位操作将多个标记存在同一个数值中。
```js
var Colors = {
    red: 1 << 0,
    yellow: 1 << 1,
    blue: 1 << 2
};
var green = Colors.red | Colors.yellow;
```
