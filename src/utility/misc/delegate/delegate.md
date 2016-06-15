## 基本用法

<pre>        var delegate = new Delegate(); // 创建新的委托。
        delegate.add(function(){ alert(1) }); // 添加委托函数。
        delegate.add(function(){ alert(2) }); // 添加委托函数。
        delegate(); // 执行委托的所有函数。将 alert(1) 和 alert(2)
    </pre>

<script x-doc="utility/misc/delegate.js">Doc.writeApi({ path: "utility/misc/delegate.js", apis: [{ memberOf: "Delegate.prototype", name: "add", summary: "<p>增加一个委托函数。</p>", params: [{ type: "Function", name: "fn", summary: "<p>函数。</p>" }], returns: { summary: "<p>this</p>" }, example: "<pre>new Delegate().add(function(){})</pre>", line: 20, col: 1 }, { memberOf: "Delegate.prototype", name: "remove", summary: "<p>删除一个函数。</p>", params: [{ type: "Function", name: "fn", summary: "<p>函数。</p>" }], returns: { type: "Delegate", summary: "<p>this。</p>" }, example: "<pre>new Delegate().remove(function(){})</pre>", line: 31, col: 1 }, { memberOf: "Delegate.prototype", name: "clear", summary: "<p>删除所有函数。</p>", returns: { type: "Delegate", summary: "<p>this。</p>" }, example: "<pre>new Delegate().clear()</pre>", line: 42, col: 1 }] });</script>

#### 使用场景

<pre>        document.onclick = new Delegate(); // 支持使用同一个函数触发多个函数。
    </pre>