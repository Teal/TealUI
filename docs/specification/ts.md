JavaScript 编码规范
========================================================

`var`、`const` 和 `let`。
--------------------------------------------------------
### 只读的、不可变的、用于表示别名的变量使用 `const`。
```js
for(const key in obj){
	// 由于 key 始终是不变的，应该使用 const。
}
```

### 其它可变的局部变量使用 `let`。
```js
for(let i = 0; i < 100; i++){
	// 由于 i 是可变的，应该使用 let。
}
```

```js
let result = []; // 虽然 result 本身未变，但是其成员发生变化，应该使用 let。
result.push(1); 
return result;
```

### `var` 只用于定义全局可变变量，其地位同 `function`。
```js
var global = this;
```

`for`、`for..in`、`for..of`
--------------------------------------------------------
### 如果只需要循环的值而不需要循环键，优先考虑使用 `for..of`。
```js
for(const val of [1, 2, 3]){
	console.log(val);
}
```

```js
for(const val of obj){
	console.log(val);
}
```

### 遍历对象或类数组，且需要使用循环键，使用 for..in 。
```js
for(const key in obj){
	console.log(key, obj[val]);
}
```

### 遍历数组，且需要使用循环键，使用 `for`。
```js
for(let i = 0; i < arr.length; i++){
	console.log(i, arr[i]);
}
```

`import from`、`import =`、`require`
--------------------------------------------------------
全部使用 `import from` 语法。
优先考虑使用 `import {foo} from 'module'`。
如果导入模块较多可使用 `import * as Module from 'module'`。
