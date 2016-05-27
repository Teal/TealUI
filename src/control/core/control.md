## 统一组件用法

TealUI 统一了所有组件使用方式，以减少学习成本。

### 使用组件

假设有一个 UI 组件叫 `MyButton`，那用法如下：

<script type="text/html" class="doc-demo"><div x-role="myButton">组件内容</div></script>

系统会在 DOM ready 时遍历所有 `[x-role]`并初始化为相应组件。

如果 HTML 是动态生成的，需要在生成之后手动执行初始化：

<script type="text/html" class="doc-demo"><div x-role="myButton" id="myButton1">组件内容</div> &lt;script>$('[x-role]').role();&lt;/script></script>

也可完全通过 JavaScript 初始化组件，不依赖 HTML：

<script type="text/html" class="doc-demo"><div id="myButton1">组件内容</div> &lt;script>$('#myButton1').role("myButton");&lt;/script></script>

### 配置组件

假设`MyButton` 组件有一个 `buttonSize` 配置项和 `customevent` 自定义事件，那可在 HTML 中配置：

<script type="text/html" class="doc-demo"><div x-role="myButton" x-button-size="3" x-oncustomevent="alert(0)">组件内容</div></script>

或在 JavaScript 中，传递第二个参数：

<pre>        $('#myButton1').role("myButton", {
            buttonSize: 3,
            oncustomevent: function () {
                alert(0)
            }
        });
    </pre>

### API

<script>Doc.writeApi({ path: "utility/dom/dom.js", apis: [{ memberOf: "Dom.prototype", name: "role", summary: "<p>初始化当前集合为指定的角色。</p>", params: [{ type: "String", name: "roleName", summary: "<p>要初始化的角色名。</p>" }, { type: "Object", name: "options", optional: true, summary: "<p>传递给角色类的参数。</p>" }], returns: { type: "Object", summary: "<p>返回第一项对应的角色对象。</p>" }, example: "<pre>$(\"#elem1\").role(\"draggable\")</pre>", line: 1531, col: 1 }] });</script>

## 开发新组件

### 定义组件

所有组件都继承自 `Control` 类，子类可重写 `init` 函数来实现组件的初始化逻辑。

<script type="text/javascript" class="doc-demo">var MyButton = Control.extend({ role: "myButton", buttonSize: 3, // 定义配置项及默认值。 init: function () { this.dom.css('width', this.buttonSize); // this.elem 是当前绑定的元素。 this.trigger('customevent'); // 触发自定义事件。 } });</script>

### 组件样式

一般地，组件拥有一个同名的 CSS 类负责定制样式。组件内部也可通过 CSS 类定位元素。合理的组件结构应该把交互细节交给 JS 完成，而把样式细节交给 CSS 完成。

### API

<script x-doc="control/core/control.js">Doc.writeApi({ path: "control/core/control.js", apis: [{ memberOf: "Control.prototype", name: "dom", summary: "<p>获取当前控件对应的 DOM 对象。</p>", type: ["Dom"], example: "<pre>$(\"#elem1\").role().dom.html()</pre>", line: 16, col: 1 }, { name: "Control", summary: "<p>初始化一个新的控件。</p>", params: [{ type: "Dom", name: "dom", summary: "<p>绑定当前控件的节点。</p>" }, { type: "Object", name: "options", optional: true, summary: "<p>初始化控件的相关选项。</p>" }], example: "<pre>new Control(\"#id\")</pre>", memberType: "constructor", line: 53, col: 1 }, { memberOf: "Control", name: "extend", summary: "<p>定义一个组件类型。</p>", params: [{ type: "Object", name: "prototype", summary: "<p>子类实例成员列表。</p>" }], example: "<pre>Control.extend({\n\ role: \"myButton\",\n\ init: function(){\n\ this.dom.html('text');\n\ }\n\ })</pre>", line: 136, col: 1 }] });</script>