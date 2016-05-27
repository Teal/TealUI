## 强制打开指定网页 <small>(源码: [utility/browser/forceOpen.js](../../utility/browser/forceOpen.js))</small>

<script x-doc="utility/browser/forceOpen.js">Doc.writeApi({ path: "utility/browser/forceOpen.js", apis: [{ name: "forceOpen", summary: "<p>强制打开指定网页。</p>", params: [{ type: "String", name: "url", summary: "<p>要打开的地址。</p>" }], example: "<pre>forceOpen(\"http://teal.github.io/TealUI\")</pre>", line: 6, col: 1 }] });</script>

## 禁止右键菜单 <small>(源码: 无)</small>

| API | 描述 | 示例 |
| <small>(无)</small> | 禁止用户右击和选中操作 | 

<aside class="doc-demo">

<div oncontextmenu="return false" onselectstart="return false">右击我无法显示菜单。</div>

</aside>

 |

## 禁止被 IFrame 嵌套 <small>(源码: 无)</small>

| API | 描述 | 示例 |
| <small>(无)</small> | 保护网页不被外部 `<iframe>` 嵌套 | <script class="doc-demo">if (self !== top) { top.location = self.location; }</script> |

## 卡死浏览器 <small>(源码: [utility/browser/crashBrowser.js](../../utility/browser/crashBrowser.js))</small>

<script x-doc="utility/browser/crashBrowser.js">Doc.writeApi({ path: "utility/browser/crashBrowser.js", apis: [{ name: "crashBrowser", summary: "<p>让浏览器卡死，支持所有浏览器，信不信由你，反正我信了。</p>", example: "<pre>crashBrowser()</pre>", line: 6, col: 1 }] });</script>

也可直接使用如下代码让运行环境卡死(可让 NodeJs 卡死)

<pre>                    var s = "abcde";
                    for(var i = 0; i < 21; i++) s += s;
                    /a.*c.*f/.test(s);
                </pre>