## 基本用法

### 为普通文本框扩展

为节点添加 `[x-role="picker"]` 即可将紧跟的 `.x-popover` 作为下拉菜单。

<aside class="doc-demo"><input type="text" id="picker1" x-role="picker">

<div class="x-popover">下拉菜单1</div>

</aside>

<aside class="doc-demo"><button id="button2" x-role="picker"><span>按钮2</span></button>

<div class="x-popover">下拉菜单2</div>

</aside>

### 为普通文本框+按钮扩展

为文本框添加 `[x-button="#button2"]` 可指定扩展的按钮，点击按钮可切换显示菜单。

为文本框添加 `[x-menu="#menu2"]` 可指定下拉菜单。

<aside class="doc-demo"><input type="text" id="picker3" x-role="picker" x-button="#button3" x-menu="#menu3"> <button id="button3">按钮2</button>

<div class="x-popover" id="menu3">下拉菜单3</div>

</aside>

## 预设样式

<aside class="doc-demo"><span class="x-picker" id="picker4" x-role="picker"><input type="text" class="x-textbox"> <button class="x-button">_▾_</button></span> 

<div class="x-popover">下拉菜单4</div>

</aside>

## 状态

<aside class="doc-demo"><span class="x-picker"><input type="text" class="x-textbox" readonly="readonly"> <button class="x-button">_▾_</button></span> </aside>

## 色系

<aside class="doc-demo"><span class="x-picker"><input type="text" class="x-textbox x-textbox-success"> <button class="x-button x-button-success">_▾_</button> </span> <span class="x-picker"> <input type="text" class="x-textbox x-textbox-warning"> <button class="x-button x-button-warning">_▾_</button> </span> <span class="x-picker"><input type="text" class="x-textbox x-textbox-error"> <button class="x-button x-button-error">_▾_</button></span> </aside>

<script>Doc.renderCodes();</script>