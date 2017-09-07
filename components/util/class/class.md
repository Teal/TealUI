---
version: 0.0.1
author: xuld <xuld@vip.qq.com>
---
# 类
为 JavaScript 提供快速创建类的功能。

## 创建最简单的类
```js
var Animal = Class.extend();
```

## 字段和方法
```js
var Animal = Class.extend({

    // 我是字段（Field）
    name: '小黑',

    // 我是方法（Method）
    say: function () {
        alert(this.name + "调用了 say 方法");
    }
});

var ani = new Animal();  // 创建一个类的实例。
ani.name = '大白';       // 为字段赋值。
ani.say();               // 调用 Animal 类的 say 方法。
```

## 构造函数
```js
var Animal = Class.extend({
    constructor: function (args) {
        alert("正在执行 Animal 类的构造函数。");
    }
});
var ani = new Animal(); // 创建一个类的实例时会调用类构造函数。
```

如果子类未定义构造函数，则继承父类构造函数。

## 继承
```js
var Animal = Class.extend({
    say: function () {
        alert("正在执行 Animal 类的 say 方法");
    },
    constructor: function (args) {
        alert("正在执行 Animal 类的构造函数。");
    }
});
```
```js
// 继承 Animal 类创建子类。
var Dog = Animal.extend({
    say2: function () {
        alert("正在执行 Dog 类的 say 方法");
    }
});
```
```js
var dog = new Dog(); // 创建一个类的实例。
dog.say(); // 调用 Animal 类的 say 方法。
dog.say2(); // 调用 Dog 类的 say2 方法。
```

如果子类需要调用被覆盖的父类成员，可通过原型调用，如 `Animal.progress.say.apply(this, arguments)`。