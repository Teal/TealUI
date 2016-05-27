## 禁止 TAB <small>(源码: [utility/dom/disableTab.js](../../utility/dom/disableTab.js))</small>

| API | 描述 | 示例 |
| `_dom_.disableTab` | 在文本框按 TAB 不切换焦点，改为输入 TAB | 

<aside class="doc-demo"><textarea id="disableTab_elem">abc</textarea> <script>$('#disableTab_elem').disableTab();</script></aside>

 |

## @提示 <small>(源码: [utility/dom/at.js](../../utility/dom/at.js))</small>

| API | 描述 | 示例 |
| `_dom_.at` | 输入 at 后插入提示层 | 

<aside class="doc-demo"><textarea id="at_elem"></textarea><script>$('#at_elem').at({ char: '@', show: function (x, y, contentBefore, contentAfter, e) { // 创建弹层... }, hide: function (e) { // 关闭弹层... }, up: function (e) { // 弹层显示后输入上的操作。 }, down: function (e) { // 弹层显示后输入下的操作。 }, enter: function (e) { // 弹层显示后输入回车的操作。 }, keyPress: function (e) { // 谈层显示后输入键盘事件的操作。 } });</script></aside>

 |

## 文本域自动放大缩小 <small>(源码: [utility/dom/autoResize.js](../../utility/dom/autoResize.js))</small>

| API | 描述 | 示例 |
| `_dom_.autoResize` | 查找子节点 | 

<aside class="doc-demo"><textarea id="autoResize_elem"></textarea><script>$('#autoResize_elem').autoResize();</script></aside>

 |

您也可以选择使用可编辑的 HTML 片段代替文本框，同样有自动放大缩小效果。

<aside class="doc-demo">

<div style="border:1px solid #ccc;padding: 10px;" contenteditable="true">我是内容</div>

</aside>

## 文本框占位符 <small>(源码: [utility/dom/placeholder.js](../../utility/dom/placeholder.js))</small>

| API | 描述 | 示例 |
| `_dom_.placeholder` | 设置当文本框空的时候，显示的文本 | 

<aside class="doc-demo"><textarea id="placeholder_elem"></textarea><script>$('#placeholder_elem').placeholder("请输入内容...");</script></aside>

 |

> #### 建议
> 
> 尽量使用 HTML5 `placeholder` 属性来实现占位符效果。

## 键码表

<input onkeydown="this.value=event.keyCode" placeholder="按键以测试键盘码...">

### 字母和数字键的键码值

| 按键 | 键码 | 按键 | 键码 | 按键 | 键码 | 按键 | 键码 |
| A | 65 | J | 74 | S | 83 | 1 | 49 |
| B | 66 | K | 75 | T | 84 | 2 | 50 |
| C | 67 | L | 76 | U | 85 | 3 | 51 |
| D | 68 | M | 77 | V | 86 | 4 | 52 |
| E | 69 | N | 78 | W | 87 | 5 | 53 |
| F | 70 | O | 79 | X | 88 | 6 | 54 |
| G | 71 | P | 80 | Y | 89 | 7 | 55 |
| H | 72 | Q | 81 | Z | 90 | 8 | 56 |
| I | 73 | R | 82 | 0 | 48 | 9 | 57 |

### 数字/功能键盘上的键的键码值

| 按键 | 键码 | 按键 | 键码 | 按键 | 键码 | 按键 | 键码 |
| 0 | 96 | 8 | 104 | F1 | 112 | F7 | 118 |
| 1 | 97 | 9 | 105 | F2 | 113 | F8 | 119 |
| 2 | 98 | * | 106 | F3 | 114 | F9 | 120 |
| 3 | 99 | + | 107 | F4 | 115 | F10 | 121 |
| 4 | 100 | Enter | 108 | F5 | 116 | F11 | 122 |
| 5 | 101 | - | 109 | F6 | 117 | F12 | 123 |
| 6 | 102 | . | 110 |   |   |   |   |
| 7 | 103 | / | 111 |   |   |   |   |

### 控制键键码值

| 按键 | 键码 | 按键 | 键码 | 按键 | 键码 | 按键 | 键码 |
| BackSpace | 8 | Esc | 27 | Right Arrow | 39 | -_ | 189 |
| Tab | 9 | Spacebar | 32 | Dw Arrow | 40 | .> | 190 |
| Clear | 12 | Page Up | 33 | Insert | 45 | /? | 191 |
| Enter | 13 | Page Down | 34 | Delete | 46 | `~ | 192 |
| Shift | 16 | End | 35 | Num Lock | 144 | [{ | 219 |
| Control | 17 | Home | 36 | ;: | 186 | | | 220 |
| Alt | 18 | Left Arrow | 37 | =+ | 187 | ]} | 221 |
| Cape Lock | 20 | Up Arrow | 38 | ,< | 188 | '" | 222 |

### 多媒体键码值

| 按键 | 键码 | 按键 | 键码 | 按键 | 键码 | 按键 | 键码 |
| 音量加 | 175 |   |   |   |   |   |   |
| 音量减 | 174 |   |   |   |   |   |   |
| 停止 | 179 |   |   |   |   |   |   |
| 静音 | 173 |   |   |   |   |   |   |
| 浏览器 | 172 |   |   |   |   |   |   |
| 邮件 | 180 |   |   |   |   |   |   |
| 搜索 | 170 |   |   |   |   |   |   |
| 收藏 | 171 |   |   |   |   |   |   |