<style>.doc-box { cursor: move; }</style>

## 拖动

### 基本用法

<aside class="doc-demo">

<div id="d1" class="doc-box">基本拖动</div>

<script>$('#d1').draggable();</script></aside>

### 拖动句柄

<aside class="doc-demo">

<div id="d2" class="doc-box"><button>拖动句柄</button></div>

<script>$('#d2').draggable({ handle: $('#d2 button') });</script></aside>

### 拖动回调

<aside class="doc-demo">

<div id="d3" class="doc-box">拖动回调</div>

<script>$('#d3').draggable({ onDragStart: function(e) { this._text = this.dom.html(); }, onDragMove: function(e) { this.dom.html(this.endX + "," + this.endY); }, onDragEnd: function(e) { this.dom.html(this._text); } });</script></aside>

### 拖动事件生命周期

拖动可以让用户根据意愿移动页面元素，拖动交互的具体流程为：鼠标（手指）按下，然后保持按下动作移动鼠标（手指），最后松开鼠标（手指），其中发生的事件分别为：

1.  `handlerMouseDown`：当鼠标（手指）按下，开始监听鼠标（手指）松开和移动事件。此时会记录 `startX` 和 `startY` 字段。
2.  `startDragging`：当鼠标（手指）按下保持 `dragDelay` 毫秒数（默认 300）或者第一次移动时，认为拖动开始。
3.  `dragStart`：记录 `startOffset` 字段。如果函数返回 `false`，则直接进入第 9 步。
4.  `onDragStart`：响应拖动开始事件。
5.  `handlerMouseMove`：鼠标移动时，记录 `endX` 和 `endY` 字段。
6.  `dragMove`：计算 `toOffset` 字段。
7.  `onDragMove`：响应拖动事件。
8.  `handlerMouseUp`：鼠标松开时，解绑所有事件。
9.  `stopDragging`：停止拖动，解绑所有事件。
10.  `dragEnd`：判断拖动是否合理并尝试还原位置。
11.  `onDragEnd`：响应拖动结束事件。

<script x-doc="utility/ux/drag.js">Doc.writeApi({ path: "utility/ux/drag.js", apis: [{ memberOf: "Dom.prototype", name: "draggable", summary: "<p>初始化指定的元素为可拖动对象。</p>", params: [{ type: "Object", name: "options", optional: true, summary: "<p>拖动的相关配置。可用的字段有：</p>\n\ \n\ <ul>\n\ <li>handle: <code>Dom</code> 拖动的句柄元素。</li>\n\ <li>proxy: <code>Dom</code> 拖动的代理元素。</li>\n\ <li>dragDelay: <code>Number</code> 从鼠标按下到开始拖动的延时。</li>\n\ <li>onDragStart: <code>Function</code> 设置拖动开始时的回调。</li>\n\ <li>onDragMove: <code>Function</code> 设置拖动移动时的回调。</li>\n\ <li>onDragEnd: <code>Function</code> 设置拖动结束时的回调。</li>\n\ </ul>" }], returns: { type: "Draggable", summary: "<p>返回一个可拖动对象。</p>" }, example: "<pre>$(\"#elem1\").draggable();</pre>", line: 258, col: 1 }] });</script>

## 拖动扩展

### 自动滚屏

<aside class="doc-demo">

<div id="d4" class="doc-box">自动滚屏</div>

<script>$('#d4').draggable({ onDragMove: function (e) { this.autoScroll(e); } });</script></aside>

### 返回原地

<aside class="doc-demo">

<div id="d5" class="doc-box">返回原地</div>

<script>$('#d5').draggable({ onDragEnd: function (e) { this.revert(); } });</script></aside>

### 拖动步长

<aside class="doc-demo">

<div id="d6" class="doc-box">拖动步长</div>

<script>$('#d6').draggable({ onDragMove: function (e) { this.setStep(60); } });</script></aside>

### 限制区域

<aside class="doc-demo">

<div id="d7" class="doc-box">限制区域</div>

<script>$('#d7').draggable({ onDragMove: function (e) { this.limit(this.dom.parent().rect()); } });</script></aside>

<script x-doc="utility/ux/dragEx.js">Doc.writeApi({ path: "utility/ux/dragEx.js", apis: [{ memberOf: "Draggable.prototype", name: "autoScroll", summary: "<p>自动滚动屏幕。</p>", params: [{ type: "Event", name: "e", summary: "<p>滚动的事件。</p>" }, { type: "Dom", name: "scrollParent", defaultValue: "document", optional: true, summary: "<p>滚动所在的容器。</p>" }], line: 8, col: 1 }, { memberOf: "Draggable.prototype", name: "revert", summary: "<p>恢复节点位置。</p>", line: 20, col: 1 }, { memberOf: "Draggable.prototype", name: "setStep", summary: "<p>设置当前拖动的步长。</p>", params: [{ type: "Number", name: "value", summary: "<p>拖动的步长。</p>" }], line: 34, col: 1 }, { memberOf: "Draggable.prototype", name: "limit", summary: "<p>将当前值改在指定范围内。</p>", params: [{ type: "Rectangle", name: "rect", summary: "<p>限制的范围。</p>" }], line: 44, col: 1 }] });</script>

## 拖放

<aside class="doc-demo"><script>$('#drop').droppable({ onDragEnter: function(draggable) { draggable.dom.addClass('doc-red'); this.dom.css('backgroundColor', '#eee'); }, onDrop: function() { trace('拖放成功'); }, onDragLeave: function(draggable) { draggable.dom.removeClass('doc-red'); this.dom.css('backgroundColor', ''); } }); $('#drag').draggable();</script></aside>

<script x-doc="utility/ux/drop.js">Doc.writeApi({ path: "utility/ux/drop.js", apis: [{ memberOf: "Dom.prototype", name: "droppable", summary: "<p>初始化指定的元素为可拖放对象。</p>", params: [{ type: "Object", name: "options", optional: true, summary: "<p>拖放的相关属性。可用的字段有：</p>\n\ \n\ <ul>\n\ <li>handle: <code>Dom</code> 拖动的句柄元素。</li>\n\ <li>proxy: <code>Dom</code> 拖动的代理元素。</li>\n\ <li>dragDelay: <code>Number</code> 从鼠标按下到开始拖动的延时。</li>\n\ <li><code>Function</code> onDragEnter: 设置拖动进入时的回调。</li>\n\ <li>onDragLeave: <code>Function</code> 设置拖动移动移出时的回调。</li>\n\ <li>onDrop: <code>Function</code> 设置拖放结束时的回调。</li>\n\ </ul>" }], returns: { type: "Draggable", summary: "<p>返回一个可拖放对象。</p>" }, example: "<pre>$(\"#elem1\").droppable();</pre>", line: 201, col: 1 }] });</script>