---
version: 0.0.1
author: xuld <xuld@vip.qq.com>
---
# 控件
控件（Control）即 UI 组件（UI Component）。
比如弹窗、下拉框等提供界面和交互功能的组件都称为控件。

## 基础

### 渲染 HTML
使用全局的 [`render`](#api/render) 可以将一段 HTML 渲染到文档上。
```jsx
import { VNode, render } from "ui/control";

render(
    document.body,
    <h1>Hello world</h1>
);
```
上述示例中 `<h1>Hello world</h1>` 是一种和 XML 类似的 JSX 语法，它可以被转换为标准 JavaScript 然后在浏览器运行，详见 [JSX 语法](#jsx)。

### 自定义控件
自定义控件是一个继承于 [`Control`](#api/Control) 的类，在类内部实现 [`render`](#api/Control/render) 并返回控件的内容。

自定义的控件可以在 [`render`](#api/render) 中直接使用。
```jsx {1,3-6,11}
import Control, { VNode, render } from "ui/control";

class MyButton extends Control {
    render() {
        return <button class="btn">Hello world</button>;
    }
}

render(
    document.body,
    <MyButton />
);
```

### 传递属性
在 `render` 中可以通过 `{this.xx}` 使用控件的自身属性。
```jsx {4,6,12}
import Control, { VNode } from "ui/control";

class MyButton extends Control {
    name = "world";
    render() {
        return <button class={"btn " + this.extraClass}>Hello {this.name}</button>;
    }
}

var btn = render(
    document.body,
    <MyButton extraClass="btn-primary"/>
);
```

### 数据绑定(MVVM)
界面是根据数据渲染出来的，通过数据绑定，可以让界面在每次数据改变后自动更新，减少手动更新界面的工作量。

给属性添加 [`@bind`](#api/bind) 后，每当该属性被重新赋值，`render` 都会重新执行并更新界面。
```jsx {4,5,17}
import Control, { VNode } from "ui/control";

class MyButton extends Control {
    @bind name = "world";
    @bind extraClass;
    render() {
        return <button class={"btn " + this.extraClass}>Hello {this.name}</button>;
    }
}

var btn = render(
    document.body,
    <MyButton extraClass="btn-primary"/>
);

setTimeout(() => {
    btn.name = "teal"; // 更新数据，界面将自动更新。
}, 1000);
```

如果绑定的数据是一个引用对象，仅改变某个属性是不会触发更新的，因为对象本身并未改变。
```jsx {16}
import Control, { VNode, bind } from "ui/control";

class MyButton extends Control {
    @bind state = { name: "world" };
    render() {
        return <button class="btn">Hello {this.state.name}</button>;
    }
}

var btn = render(
    document.body,
    <MyButton/>
);

setTimeout(() => {
    btn.state.name = "teal"; // 注意：不会触发更新，必须改成：btn.state = {name: "teal"}
}, 1000);
```

此时可以使用 `invalidate` 或 `update` 强制更新。
两者的区别在于：`update` 会立即更新，而 `invalidate` 会延时更新，同一时间调用多次 `invalidate` 后最后仅更新一次界面，以此提高性能。
```jsx {17}
import Control, { VNode, bind } from "ui/control";

class MyButton extends Control {
    @bind state = { name: "world" };
    render() {
        return <button class="btn">Hello {this.state.name}</button>;
    }
}

var btn = render(
    document.body,
    <MyButton/>
);

setTimeout(() => {
    btn.state.name = "teal";
    btn.invalidate(); // 手动触发更新。
}, 1000);
```

### 控件嵌套
在 `render` 中，如果标签首字母大写，那么它将被解析为自定义控件，而不是 HTML 元素。
```jsx {3-9,18-22}
import Control, { VNode } from "ui/control";

class App extends Control {
    render() {
        return <div>
                <MyButton name="teal" />
            </div>;
    }
}

class MyButton extends Control {
    name = "world";
    render() {
        return <button class="btn">Hello {this.name}</button>;
    }
}

new App().renderTo(document.body);
// => <div>
//      <button class="btn">Hello teal</button>
//  </div>
```

> ##### (!)不要嵌套自身
> 如果控件在 `render` 中嵌套了自身，会引发死循环。

### 控件内容
默认控件内容都会被添加到控件的 [`body`](#api/Control/body) 属性对应的节点。

控件中可以为 `render()` 添加参数以便自定义处理控件内容。
```jsx {12-14}
import Control, { VNode } from "ui/control";

class App extends Control {
    render() {
        return <div>
                <MyButton disabled={true}>teal</MyButton>
            </div>;
    }
}

class MyButton extends Control {
    render(children, props) {
        return <button class="btn" {...props}>Hello {children}</button>; // 此处 children = [teal]
    }
}

new App().renderTo(document.body);
// => <div>
//      <button class="btn" disabled>Hello teal</button>
//  </div>
```
`children` 始终是一个数组，每个项都是一个虚拟节点，如果其是文本节点，可以使用 `children[i].props` 获取原始数据。

### 绑定事件
通过节点的 `onXXX`(其中 XXX 是具体的事件名) 属性可绑定事件函数。
函数接收两个参数，分别是原生事件参数和发生事件的源对象。
为了确保事件执行时 `this` 始终是控件本身，事件函数应使用箭头函数语法。
```jsx {5,7-10}
import Control, { VNode } from "ui/control";

class MyButton extends Control {
    render() {
        return <button class="btn" onClick={this.handleClick}>Hello world</button>;
    }
    handleClick = (e, s) => {
        // this 是 MyButton
        // s 是触发事件的原始对象，即 <button>
    }
}
```

### 访问子控件
使用 [`控件.find(CSS 选择器)`](#api/Control/find) 获取内部的子控件或节点。

使用 [`控件.find("")`](#api/Control/find) 获取根控件或节点。

如果有多个匹配项，`find` 只返回最先出现的项。
如果需要获取所有匹配项，使用 [`控件.query`](#api/Control/query)。
```jsx {10}
import Control, { VNode } from "ui/control";

class MyButton extends Control {
    render() {
        return <div>
                <button class="btn" onClick={this.handleClick}>Hello world</button>
            </div>;
    }
    handleClick = e => {
        this.find(".btn").innerHTML = "Hello Teal";
    }
}
```
> ##### [!] 注意
> 1. 不能在 `constructor` 和 `render` 阶段访问子控件。
> 2. 如果匹配到了自定义控件的根节点，则 `find` 返回控件对象而非节点本身。
> 3. 只能使用 `find("")` 获取根节点，不能通过选择器获取。
> 4. 无法通过大写标签名获取自定义控件（如 `find("MyButton")` 是无效的）。

### 访问原生节点
控件本质上就是一段 HTML。
控件封装了一些 API 用于操作其内部关联的 HTML。

使用 [`控件.elem`](#api/Control/elem) 获取控件关联的原生节点。

可以使用[[web/dom]]进行后续处理：
```js {2,9}
import Control from "ui/control";
import * as dom from "dom";

class MyButton extends Control {
    render() {
        return <button class="btn" onClick={this.handleClick}>Hello world</button>;
    }
    handleClick = e => {
        dom.addClass(this.elem, "btn-disabled");
    }
}
```

也可以使用 [jQuery](jquery.com) 等第三方框架：
```js {2,9}
import Control from "ui/control";
import $ from "jquery";

class MyButton extends Control {
    render() {
        return <button class="btn" onClick={this.handleClick}>Hello world</button>;
    }
    handleClick = e => {
        $(this.elem).addClass("btn-disabled");
    }
}
```
> ##### [!] 注意
> 1. 不要在 constructor 和 render 阶段访问原生节点。
> 2. 尽量不要直接操作原生节点。

### 直接使用虚拟节点
使用 [`from`](#api/from) 可以直接将虚拟节点转为真实节点。
```js
import { VNode, from } from "ui/control";

var jsx = <button class="btn">Hello world</button>;

var btn = from(jsx);

document.body.appendChild(btn);
```

## 生命周期
控件从创建到销毁会依次执行下列函数:
```
constructor → update → init → renderTo → 多次 update... → uninit
```

### constructor: 构造函数
控件的构造函数是在 `new 控件名()` 时执行的函数。
构造函数内无法获取当前关联的 `elem`，主要用于设置当前控件的默认属性。

### update: 更新
`update` 主要用于生成或者重新生成当前控件关联的 HTML 节点。
默认地，`update` 会先调用 `render` 生成最新的虚拟节点，然后通过 `VNode.sync` 将其转为真实的节点，
转换时会比较上一次生成的虚拟节点并尽可能地重用上一次生成的真实节点，确保性能最优。

在 `render` 中无法使用 `elem`，也不能更新任何数据。
`render` 可以返回 `null` 表示当前控件为空。

### init: 初始化
当为控件关联一个新的 `elem` 后，都会执行 `init`。

在 `init` 中可以使用 `elem`，也可以更新数据。
一般地，`init` 主要用于绑定附加事件。

### renderTo: 渲染
将当前控件添加到文档树中。添加后控件才会显示。

### 多次 update...
每次更改通过 `@bind` 绑定的属性后，都会执行 `invalidate`，并在延时后调用 `update` 更新界面。

### uninit: 反初始化
当之前关联的元素不再被关联前，会执行 `uninit`，在 `uninit` 中可以使用 `elem`。
一般地，`uninit` 主要用于解绑附加事件。

## 控件通信

### 父 → 子
在父控件的 `render` 中可以直接将数据传递给子控件。
```js
class App extends Control {
    data = 1;
    render() {
        return <div>
                <MyButton name={this.data}></MyButton>
            </div>;
    }
}
```

### 子 → 父
子控件可通过事件将数据传递给父控件。
```js
class App extends Control {
    render() {
        return <div>
                <TextBox onChange={(e, t) => this.handleChange(t.value)}></TextBox>
            </div>;
    }
    handleChange = data => {
        // data 是 TextBox 传递来的数据
    }
}
```

### 子 → 子
将两个子控件放在公共父控件中，第一个子控件将数据传递给父控件，然后父控件再传递给第二个子控件。
以此实现子控件之间的互相通信。

### 统一数据管理
使用全局对象统一管理数据，可避免相互传递数据的麻烦。
```js
var store = {};

class App extends Control {
    render() {
        return <div>
                <MyButton></MyButton>
            </div>;
    }
}

class MyButton extends Control {
    alwaysUpdate = true;
    render() {
        return <button class="btn">Hello {store.content}</button>;
    }
}
```
> ##### (!)注意
> 默认如果子控件的属性和内容都未发生改变，子控件是不会重新渲染的。
> 通过设置 `alwaysUpdate = true` 使子组件强制更新。

在项目中应将控件分为交互效果和业务逻辑两大类。
只有业务逻辑控件才能使用和修改全局数据。

## 原理和优化
本节面向希望开发高性能控件的用户。

### 控件原理
任何一个控件都会关联一个 HTML 节点。这个节点可以由 `update` 生成，也可以直接被用户指定。
```js 
class Control {

    // 获取关联的节点
    get elem() {
        if (!this._elem) this.update(); // 如果未指定则生成新的
        return this._elem;
    }

    // 生成默认节点
    update() { 
        // ... 
    }

    // 允许用户手动设置关联的节点
    set elem(value) {
        if (this._elem) this.uninit();
        this._elem = value;
        this.init();
    }

    // 关联的元素改变后执行
    init() {
        // 在这里可以绑定事件
    }

    // 关联的元素改变前执行
    uninit() {
        // 在这里可以解绑事件
    }

    // 添加到文档树
    renderTo(parent) {  
        parent.appendChild(this.elem);
    }

}
```

假如已经写好了 HTML，可以直接关联：
```html {4}
<button class="btn" id="btn">Hello world!</button>
<script>
    var btn = new MyButton();
    btn.elem = document.getElementById("btn");
</script>
```

默认地，则调用 update 生成新的节点。
用户可以通过修改 update 自定义生成的节点内容。
```js {6-8}
import Control from "ui/control";

class MyButton extends Control {

    update() {
        this.elem = document.createElement("button");
        this.elem.className = "btn";
        this.elem.innerHTML = "Hello world!";
    }

}
```

### 数据绑定原理
为实现将数据被更改后界面自动更新的效果，需要分三步：
- 第一步：生成新虚拟节点。
- 第二步：对比新老虚拟节点，根据差异更新真正的节点。
- 第三步：监听数据改变然后执行一次更新。

虚拟节点以树结构存储了 HTML 节点的信息，如：
```json
{
    "type": "button",
    "props": {
        "class": "btn"
    },
    "children": [
        {
            "type": null,
            "props": "Hello world"
        }
    ]
}
```

比较新旧虚拟节点得到一份差异表，然后根据差异表更新真正的节点，以此可以跳过处理未被更新的 DOM 节点，提升性能。
```js {4-6,16-42}
class Control {

    update() {
        var oldVNode = this.vNode || { r: this, props: {}, children: [] };
        var newVNode = this.vNode = this.render();
        this.elem = sync(oldVNode, newVNode);
    }

    // 生成当前控件的虚拟节点。
    render() {
        return null; // Control 默认返回空。子控件则返回对应的虚拟节点。
    }

}

// 将新虚拟节点的改动同步到真正的节点。
function sync(oldVNode, newVNode) {

    // 如果节点类型发生变化则创建新节点；否则重用之。
    var typeChanged = oldVNode.type !== newVNode.type;
    var r = typeChanged ? document.createElement(newVNode.type) : oldVNode.r;

    // 如果创建了新节点则将原节点替换掉。
    if (typeChanged) {
        oldVNode.r.parentNode.replaceChild(r, oldVNode.r);
    }
    
    // 如果属性发生变化则更新属性。
    for (var prop in newVNode.props) {
        if (oldVNode.props[prop] !== newVNode.props[prop]) {
            r[prop] = newVNode.props[prop];
        }
    }

    // 递归更新子节点。
    for(var i = 0; i < newVNode.children.length; i++) {
        sync(oldVNode.children[i] || { r: oldVNode, props: {}, children: [] }, newVNode.children[i]);
    }
        
    return r;
}
```

最后，通过 `Object.defineProperty` 使得属性被重新赋值后调用 `update`。
```jsx
function bind(prototype, prop) {
    Object.defineProperty(prototype, prop, {
        get() {
            return this["_" + prop];
        }
        set(value) {
            this["_" + prop] = value;
            this.update();
        }
    });
}
```

为了避免每次更新属性都会调用 `update`，将原有的 `update` 替换为带延时效果的 `invalidate`。
```jsx
class Control {

    invalidate() {
        if (this._updateTimer) { // 如果在 1 秒内已经执行过则不再执行。
            return;
        }
        this._updateTimer = setTimeout(() => {
            this.update();
        }, 1);
    }

}
```
完整的 Control 实现请在页面右上角的工具菜单点击查看源码。

### JSX
JSX 语法最终将被转换为虚拟节点（[VNode](#api/VNode)）。

以下代码：
```jsx
import Control, { VNode, bind } from "ui/control";

class MyButton extends Control {
    @bind name = "world";
    render() {
        return <button class="btn">Hello {this.name}</button>;
    }
}
```
最终会被编译为：
```js
var control = require("ui/control"),
    Control = control.default, 
    VNode = control.VNode, 
    bind = control.bind;

function MyButton () { 
    this.name = "world";
}

MyButton.prototype = new Control();
MyButton.prototype.constructor = MyButton;

bind(MyButton.prototype, "name");

MyButton.prototype.render = function () {
    return VNode.create("button", { "class": "btn" }, "Hello ", this.name);
};
```

语法细节请参考 [JSX 规范](http://facebook.github.io/jsx/)。

在项目中使用 JSX 需要转换工具，如 [Babel](https://babeljs.io/)、[TypeScript](https://typescriptlang.org/)。

### 性能优化

网页中，最慢的操作是更新 DOM，其次是大量的运算。
通过虚拟节点对比的方法，真实 DOM 的操作已大幅减少，
因此剩下的性能问题就是计算量较大的 `render` 执行次数太多导致的。

那么，如何减少 `render` 执行的次数？

#### 优化一：减少控件数
`render` 的次数和网页中控件的数量成正比。
减少控件总数对性能改进会有明显的效果。

#### 优化二：避免设置 `alwaysUpdate = true`
未设置此属性时，仅当组件任一属性发生改变后才会重新渲染组件。

#### 优化三：直接操作节点
直接操作原生节点可以跳过比较虚拟节点的环节。

```tsx {9-11}
import Control, { VNode, bind } from "ui/control";

class MyButton extends Control {
    render() {
        return <div>
            <button class="btn">Hello </button>
        </div>;
    }
    set name(value) {
        this.find("button").innerHTML += value;
    }
}
```

通过 `@bind(CSS 选择器)` 可以绑定属性到某个子控件或节点。
使用 `@bind("")` 可以绑定根控件或节点。
```tsx {4,11}
import Control, { VNode, bind } from "ui/control";

class MyButton extends Control {
    @bind(".btn") btn; // 绑定到 <button> 元素。
    render() {
        return <div>
            <button class="btn" onClick={this.handleClick}>Hello world!</button>
        </div>;
    }
    handleClick = () => {
        alert(this.btn.innerHTML);
    }
}
```

使用 `@bind(CSS 选择器, 属性)` 可以绑定到某个子控件或节点的属性。
```tsx {4,11}
import Control, { VNode, bind } from "ui/control";

class MyButton extends Control {
    @bind(".btn", "innerHTML") btnContent; // 绑定到 <button> 元素的 innerHTML 属性。
    render() {
        return <div>
            <button class="btn" onClick={this.handleClick}>Hello world!</button>
        </div>;
    }
    handleClick = () => {
        alert(this.btnContent);
    }
}
```

如果属性名是 `style` 可以通过第三参数绑定到某个样式。
```tsx {4,11}
import Control, { VNode, bind } from "ui/control";

class MyButton extends Control {
    @bind(".btn", "style", "display") btnDisplay; // 绑定为 <button> 元素的 style.display。
    render() {
        return <div>
            <button class="btn" onClick={this.handleClick}>Hello world!</button>
        </div>;
    }
    handleClick = () => {
        this.btnDisplay = "none";
    }
}
```

如果属性名是 `class` 可以通过第三参数绑定到某个类名。
```tsx {4,11}
import Control, { VNode, bind } from "ui/control";

class MyButton extends Control {
    @bind(".btn", "class", "btn-primary") btnPrimary; // 绑定为 <button> 元素的 class 是否包含 btn-primary。
    render() {
        return <div>
            <button class="btn" onClick={this.handleClick}>Hello world!</button>
        </div>;
    }
    handleClick = () => {
        this.btnPrimary = true; // 相当于为 <button> 添加 btn-primary 类名。
    }
}
```

如果属性名是事件可以通过第三参数设置委托。
```tsx {4}
import Control, { VNode, bind } from "ui/control";

class MyButton extends Control {
    @bind(".btn", "onClick", "span") onButtonClick;
    render() {
        return <div>
            <button class="btn">Hello <span>world!</span></button>
        </div>;
    }
}
```

### 控件规范
- 控件命名必须首字母大写。
- 假如控件名为 `MyButton`，那么控件内部的 CSS 类必须前缀 `mybutton-`。
这样可以避免 CSS 类重名导致控件冲突。
- 控件只能访问当前节点，不能访问父控件，更不能访问 `document`。
- 每个控件的功能应该相对独立，如果两个控件相互依赖，应考虑合并为一个控件。
- 控件不需要为样式定义额外的 JS 接口，而应该让用户书写 CSS 覆盖默认样式。

## 实战演示

### 如何：实现一个计时器
```jsx demo
import Control, { VNode, bind, from } from "ui/control";

class Timer extends Control {
    @bind time = 0;
    render(){
        return <span>{this.time}</span>;
    }
    constructor() {
        super();
        setInterval(() => { this.time++; }, 1000);
    }
}

export default from(<Timer />).renderTo(__root__);
```

### 如何：实现一个简单的 TODO 列表
```jsx demo
import Control, { VNode, bind, from } from "ui/control";

class TodoList extends Control {
    @bind todos = [];
    render() {
        return <ul>{this.todos.map((todo, index) => <li>
                <span>{todo}</span>
                <button onClick={() => this.remove(index)}>删除</button>
            </li>)}
                <li>
                    <input type="text" id="newTodo" />
                    <button onClick={() => this.add(this.find("#newTodo").value)}>新增</button>
                </li>
            </ul>;
    }
    remove(index) {
        this.todos.splice(index, 1);
        this.invalidate();
    }
    add(item) {
        this.todos.push(item);
        this.invalidate();
    }
}

export default from(<TodoList />).renderTo(__root__);
```

## 针对 React 用户
`Control` 和 React 的用法相似，但底层实现原理完全不同。

### 差异
- `Control` 体积更小，去除注释后仅 22k（含所有功能），适用于移动端。
- 由于 `Control` 默认不触发子控件的更新，性能上也更高，特别在控件数多的情况性能提升非常明显。
- `Control` 充分利用了 ES7 的语法，实现同样的需求代码量比 React 少 40%。

### 从 React 到 `Control`
- `Control` 相当于 `React.Component`。
- `Control` 中普通属性相当于 React 的 `props`。
- `Control` 中带 `@bind` 的属性相当于 React 的 `state`。
- `Control` 的 `render` 等价于 React 的 `render`。
- `Control` 的 `init` 等价于 React 的 `componentDidMount`。
- `Control` 的 `update` 等价于 React 的 `forceUpdate`。
- `Control` 的 `uninit` 等价于 React 的 `componentWillUnmount`。

模拟 React 组件的代码如下：
```jsx
import Control from "ui/control";

class Component extends Control {
    getInitialState() { return {}; }
    componentWillMount() { }
    componentDidMount() { }
    componentWillReceiveProps(nextProps) { } // 此函数无法模拟
    shouldComponentUpdate() { return true; }
    componentWillUpdate() { }
    componentDidUpdate() { }
    componentWillUnmount() { }
    forceUpdate(){ this.update(); }

    constructor (props) {
        super();
        this.props = props || {};
        this.state = this.getInitialState();
        this.componentWillMount();
    }
    init() {
        this.componentDidMount();
    }
    uninit() {
        this.componentWillUnmount();
    }
    update() {
        if (this.shouldComponentUpdate(this.props)) {
            this.componentWillUpdate();
            super.update();
            this.componentDidUpdate();
        }
    }
    setState(name, value) {
        this.state[name] = value;
        this.invalidate();
    }
}
```