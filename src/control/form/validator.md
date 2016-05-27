<article>

### 验证单一字段

<aside class="doc-demo"><input type="text" class="x-textbox" name="validator1" id="validator1"> <span class="x-tipbox"></span> <script>var validator1 = new Validator({ elem: Dom.get('validator1'), rules: { // 必填字段。 required: true, // 最小长度。 minLength: 1, // 最大长度。 maxLength: 10, // 自定义正则。 pattern: /\d/ }, // 通过 messages 的同名字段，可自定义错误信息。 messages: { pattern: '必须包含一个数字' } });</script> </aside>

| 验证字段 | 说明 | 示例 |
| required | 必填字段 | required: true |
| minLength | 最小长度 | minLength: 1 |
| maxLength | 最大长度 | maxLength: 100 |
| pattern | 匹配指定正则表达式 | pattern: /^\d+$/ |
| range | 在指定的大小之间 | range: [0, 500] |
| equalsTo | 和指定的文本框内容相同 | equalsTo: Dom.get('id') |
| type | 系统内置的验证器 | type: 'email'。 更多的值见 [这里](#predefined) |
| other | 自定义验证逻辑 | other: function(text){ return text > 0 ? '必须大于 0' : ''} |

### 验证表单

<form id="validator2" action="?"><input type="text" class="x-textbox" name="validator2_1"> <span class="x-tipbox"></span>
<input type="text" class="x-textbox" name="validator2_2"> <span class="x-tipbox"></span>
<button type="submit" class="x-button">提交</button></form>

<script>var validator2 = new Validator.Form({ elem: Dom.get('validator2'), rules: { validator2_1: { rules: { required: true, minLength: 2 } }, validator2_2: { rules: { maxLength: 2 } } } });</script>

### 自定义验证逻辑

<aside class="doc-demo"><input type="text" class="x-textbox" name="validator3" id="validator3"> <span class="x-tipbox"></span> <script>var validator3 = new Validator({ elem: Dom.get('validator3'), rules: { // 必填字段。 other: function (text, callback) { return text.toLowerCase() !== 'TealUI' ? '必须输入 TealUI' : ''; } } });</script> </aside>

### 自定义异步后台验证

<aside class="doc-demo"><input type="text" class="x-textbox" name="validator4" id="validator4"> <span class="x-tipbox"></span> <script>var validator4 = new Validator({ elem: Dom.get('validator4'), rules: { // 必填字段。 other: function (text, callback) { // 清除以前的验证信息为 正在验证的状态。 this.updateState(false); // 通过 AJAX 回调来调用 callback。 // 此处为了演示方便，直接调用。 setTimeout(function () { callback(text.toLowerCase() !== 'TealUI' ? '必须输入 TealUI' : ''); }, 2000); } } });</script> </aside>

### 内置数据类型

下列常用的数据类型验证都可以直接使用。

<div>email： <input type="text" class="x-textbox" id="validator5_1"> <span class="x-tipbox"></span></div>

<div>number： <input type="text" class="x-textbox" id="validator5_2"> <span class="x-tipbox"></span></div>

<div>phone <input type="text" class="x-textbox" id="validator5_3"> <span class="x-tipbox"></span></div>

<div>id <input type="text" class="x-textbox" id="validator5_4"> <span class="x-tipbox"></span></div>

<div>letter <input type="text" class="x-textbox" id="validator5_5"> <span class="x-tipbox"></span></div>

<div>url <input type="text" class="x-textbox" id="validator5_6"> <span class="x-tipbox"></span></div>

<div>mobile <input type="text" class="x-textbox" id="validator5_7"> <span class="x-tipbox"></span></div>

<div>qq <input type="text" class="x-textbox" id="validator5_8"> <span class="x-tipbox"></span></div>

<script>var validator5_1 = new Validator({ elem: Dom.get('validator5_1'), rules: { // 必须为邮箱地址。 type: 'email' } }); var validator5_2 = new Validator({ elem: Dom.get('validator5_2'), rules: { type: 'number' } }); var validator5_3 = new Validator({ elem: Dom.get('validator5_3'), rules: { type: 'phone' } }); var validator5_4 = new Validator({ elem: Dom.get('validator5_4'), rules: { type: 'id' } }); var validator5_5 = new Validator({ elem: Dom.get('validator5_5'), rules: { type: 'letter' } }); var validator5_6 = new Validator({ elem: Dom.get('validator5_6'), rules: { type: 'url' } }); var validator5_7 = new Validator({ elem: Dom.get('validator5_7'), rules: { type: 'mobile' } }); var validator5_8 = new Validator({ elem: Dom.get('validator5_8'), rules: { type: 'qq' } });</script></article>