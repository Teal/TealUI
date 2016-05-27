## 基本用法

<aside class="doc-demo"><span class="x-updown x-inputgroup" x-role="upDown"><span><button class="x-button x-updown-up"><span class="x-icon">━</span></button></span> <input type="text" class="x-textbox" value="0"> <span><button class="x-button x-updown-down"><span class="x-icon">✚</span></button></span></span> </aside>

## 纯 HTML 实现

<aside class="doc-demo"><span class="x-updown x-inputgroup"><span><button class="x-button x-updown-up" onclick="this.parentNode.nextElementSibling.value--"><span class="x-icon">━</span></button></span> <input type="text" class="x-textbox" value="0"> <span><button class="x-button x-updown-down" onclick="this.parentNode.previousElementSibling.value++"><span class="x-icon">✚</span></button></span></span> </aside>

> 本组件只提供底层的上下切换效果。具体的输入框参考 [数字输入框(numericUpDown)](numericUpDown.html) 组件。