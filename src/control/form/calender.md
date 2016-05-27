> 本组件是日历本身，如果需要日期时间选择器，请参考 [日期选择器(datePicker)](../input/datePicker.html) 组件。

## 基本用法

日历组件不需要用户提供 HTML，指定为日历控件后内容将自动生成。

<aside class="doc-demo"></aside>

## 自定义样式

### 显示时间选择器

设置 `x-format` 字段，如果包含 HH:mm:ss 的任一部分，就会显示时间选择器，否则不显示。

<aside class="doc-demo"></aside>

### 月份选择器

设置 `x-format` 字段，如果不包含 d 的任一部分，就会只显示月份选择器。

<aside class="doc-demo"></aside>

### 设置现在时间

设置 `x-now` 字段可指定当前时间。这在需要显示服务器时间时非常有用。

<aside class="doc-demo"></aside>

### 隐藏现在时间

直接通过 CSS 覆盖即可隐藏。

<pre>        .x-calender-now { 
            display:none; 
        }
    </pre>

### 设置可选的区间

<aside class="doc-demo"></aside>

## 数据处理

c

##### 获取当前用户选中的日期

<pre>$('[x-role="calender"]').role().on('select', function(date){ alert(date); });</pre>

注意：当用户切换月份或点击禁用按钮都不会触发 `select` 事件。

##### 当值发生改变后触发

<pre>$('[x-role="calender"]').role().on('change', function(date){ alert(date); });</pre>

##### 获取当前选中的值

<pre>$('[x-role="calender"]').role().getValue();</pre>

##### 设置当前选中的值

<pre>$('[x-role="calender"]').role().setValue(new Date());</pre>

## 更多定制

##### 自定义节日

<pre>$('[x-role="calender"]').role().getHoliday = function(date){ if(date.format("MM/dd") == "4/1") return "愚人节"; };</pre>

##### 自定义不可选日期

<pre>$('[x-role="calender"]').role().getClassName = function(date){ if(date.format("MM/dd") == "4/1") return "x-calender-invalid"; };</pre>

##### 切换当前显示的视图

<pre>$('[x-role="calender"]').role().setView('month');</pre>

##### 缩小渐变切换当前显示的视图

<pre>$('[x-role="calender"]').role().setView('month', 'zoomIn');</pre>

## HTML 结构

<div class="x-calender">

<div class="x-calender-container">

<div class="x-calender-header">[▸](javascript://下一页 "下一页") [◂](javascript://上一页 "上一页") [2011年11月](javascript://上一级 "返回上一级")</div>

<div class="x-calender-body">

<div class="x-calender-days">

| 日 | 一 | 二 | 三 | 四 | 五 | 六 |
| 31 | [1](###) | [2](###) | [3](###) | [4](###) | [5](###) | [6](###) |
| [7](###) | [8](###) | [9](###) | [10](###) | [11](###) | [12](###) | [13](###) |
| [14](###) | [15](###) | [16](###) | [17](###) | [18](###) | [19](###) | [20](###) |
| [21](###) | [22](###) | [23](###) | [24](###) | [25](###) | [26](###) | [27](###) |
| [28](###) | [29](###) | [30](###) | [31](###) | 1 | 2 | 3 |
| 4 | 5 | 6 | 7 | 8 | 9 | 10 |

</div>

</div>

<div class="x-calender-time">时间: <input type="number" value="23" min="0" max="24" maxlength="2"> :<input type="number" value="23" min="0" max="60" maxlength="2"> :<input type="number" value="23" maxlength="2" readonly=""></div>

<div class="x-calender-footer">[今天: 2010年10月20日](javascript://今天)</div>

</div>

</div>

<script>Doc.renderCodes();</script>