第四章 语句
========================================================
语句(Statement)就像完整的一句话。
代码是由一行行语句组成的。

TypeScript 中语句有以下几种：

1. [定义语句(Declaration)](#41定义语句Declaration)
2. [判断语句(Conditional Statement)](#42判断语句ConditionalStatement)
3. [循环语句(Loop Statement)](#43循环语句LoopStatement)
4. [跳转和标签语句(Jump Statement & Label Statement)](#44跳转和标签语句JumpStatementLabelStatement)

4.1 定义语句(Declaration)
--------------------------------------------------------
定义语句可以用于定义变量、常量和函数。

### 4.1.1 变量定义语句(Variable Declaration)
要定义一个变量，格式为：`var 变量名;` 或 `let 变量名;`，如 `var x;`。
两者的区别在于：
- `var` 声明的变量可以在当前函数有效。
- `let` 声明的变量只在当前块（具体将在下文介绍）内有效。

一行语句可以同时用于定义多个变量，用逗号隔开，如 `var x, y;`。

定义变量时，可以同时提供变量的初始值，如 `var x = 1;`
未提供初始值的变量，值为 `undefined`。

TypeScript 中定义变量时，可以同时提供变量的类型，如 `var x: number;`
默认地，如果提供了初始值，系统会自动推导变量类型。
如果未提供初始值，系统会自动推导成 `any` 类型。

如果同时有初始值和类型声明，先书写类型。

### 4.1.2 常量定义语句(Constant Declaration)
常量是不能重新赋值的变量。
要定义一个常量，格式为：`const 变量名 = 初始值;`。

和变量定义类似，可以一次定义多个常量，定义常量时可以同时声明类型。

### 4.1.3 函数定义语句(Function Declaration)
```js
function 函数名(参数列表) {
    函数主体
}
```
其中参数列表的书写方式和函数常量相同。
如：

```
    function f(x) { }
    function f2(x: number, y: number) { }
    function f3(x: number, y?: number, z = 1) { }
```

4.2 判断语句
--------------------------------------------------------
判断语句可以让程序根据条件选择执行。

### 4.2.1 条件判断语句(If Statement)
```js
if(表达式) {
    如果表达式为 true，则执行此代码
}
```
```js
if(表达式) {
    执行的代码
} else {
    执行的代码
}
```
```js
if(表达式) {
    执行的代码
} else if(表达式) {
    执行的代码
} else if(表达式) {
    执行的代码
...
} else {
    执行的代码
}
```
