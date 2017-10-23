---
version: 0.0.1
author: xuld <xuld@vip.qq.com>
---
# 类
为 JavaScript 提供快速创建类的功能。

## 定义类
直接调用 `Class.extend` 创建一个新类。
```js {3}
import Class from "util/class";

var Animal = Class.extend();
```

## 字段和方法
通过 `Class.extend` 的第一参数添加类的字段和方法。
```js {4-7}
import Class from "util/class";

var Animal = Class.extend({
    name: "小黑",         // 我是字段（Field）
    say: function () {   // 我是方法（Method）
        console.log(this.name + "调用了 say 方法");
    }
});

var ani = new Animal();  // 创建一个类的实例。
ani.name = "大白";       // 为字段赋值。
ani.say();               // 调用 Animal 类的 say 方法。
```

## 构造函数
如果子类未定义构造函数，则继承父类构造函数。
子类也可使用 `constructor` 定义构造函数。
```js {4-6}
import Class from "util/class";

var Animal = Class.extend({
    constructor: function (args) {
        console.log("调用了 Animal 类的构造函数");
    }
});
var ani = new Animal(); // 创建一个类的实例时会调用类构造函数。
```

## 继承
调用创建的类的 `extend`，可继承该类创建新子类。
```js {12-16}
import Class from "util/class";

var Animal = Class.extend({
    say: function () {
        console.log("调用了 Animal 类的 say 方法");
    },
    constructor: function (args) {
        console.log("调用了 Animal 类的构造函数");
    }
});

var Dog = Animal.extend({ // 继承 Animal 类创建子类。
    say2: function () {
        console.log("调用了 Dog 类的 say 方法");
    }
});

var dog = new Dog(); // 创建一个类的实例。
dog.say(); // 调用 Animal 类的 say 方法。
dog.say2(); // 调用 Dog 类的 say2 方法。
```

如果子类需要调用被覆盖的父类成员，可通过原型调用：
```js {12}
import Class from "util/class";

var Animal = Class.extend({
    say: function () {
        console.log("调用了 Animal 类的 say 方法");
    }
});

// 继承 Animal 类创建子类。
var Dog = Animal.extend({
    say: function () {
        Animal.progress.say.apply(this, arguments);
        console.log("调用了 Dog 类的 say 方法");
    }
});

var dog = new Dog(); // 创建一个类的实例。
dog.say(); // 调用 Animal 类的 say 方法。
```

目前 JavaScript 仅能实现单继承。

## 建议
项目中建议使用 ECMAScript 6 的语法直接定义类，而不需要使用本组件。