## API <small>(源码: [utility/dom/cssRule.js](../../utility/dom/cssRule.js))</small>

| API | 描述 | 示例 |
| `CssRules.add` | 动态增加一个样式 | 

<pre>CssRules.add("body", "background: #96CBFE;");</pre>

 |
| `CssRules.remove` | 动态删除一个样式 | 

<pre>CssRules.remove("body", "background: #96CBFE;");</pre>

 |
| `CssRules.get` | 获取指定样式 | 

<pre>CssRules.get("body");</pre>

 |
| `CssRules.set` | 设置指定样式 | 

<pre>CssRules.set("body", "background: #96CBFE;");</pre>

 |
| `CssRules.get` | 禁用或启用指定的样式表文件 | 

##### 禁用

<pre>CssRules.disableStyleSheet("css");</pre>

##### 启用

<pre>CssRules.disableStyleSheet("css", false);</pre>

 |
| `CssRules.setStyleSheet` | 设置指定的样式表文件路径 | 

<pre>CssRules.setStyleSheet("css", "css2.css");</pre>

 |