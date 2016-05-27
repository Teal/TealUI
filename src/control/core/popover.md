<link rel="stylesheet" type="text/css" href="../../typography/partial/arrow.css">

## 弹出层控件

弹出层控件是一个抽象的控件基类。控件封装了鼠标操作后显示弹出层的交互实现。

## 基本用法

添加 `[x-role="popover"]`，即可将指定节点初始化为上一个节点的浮层。

<aside class="doc-demo"><button>按钮</button>

<div class="x-popover" x-role="popover">我是浮层</div>

</aside>

为下拉菜单添加 `[x-target="{目标节点选择器}"]` 可设置目标节点。

<aside class="doc-demo"><button id="button1">按钮</button>

<div class="x-popover" x-role="popover" x-target="#button1">我是浮层</div>

</aside>

## 触发类型

### 点击时显示(默认)

鼠标点击目标显示，空白处单击隐藏。

<aside class="doc-demo"><button>按钮</button>

<div class="x-popover" x-role="popover" x-event="click">我是浮层</div>

</aside>

### 鼠标移上后显示

鼠标移到目标或浮层时显示，移出目标和浮层时隐藏。

<aside class="doc-demo"><button>按钮</button>

<div class="x-popover" x-role="popover" x-event="mouseover">我是浮层</div>

</aside>

### 悬停时显示

鼠标移到目标时显示，移出目标时隐藏。

<aside class="doc-demo"><button>按钮</button>

<div class="x-popover" x-role="popover" x-event="hover">我是浮层</div>

</aside>

### 获取焦点后显示

目标获取焦点后显示，空白处单击隐藏。

<aside class="doc-demo"><button>按钮</button>

<div class="x-popover" x-role="popover" x-event="focus">我是浮层</div>

</aside>

### 包含焦点时显示

目标获取焦点时显示，失去焦点时隐藏。

<aside class="doc-demo"><button>按钮</button>

<div class="x-popover" x-role="popover" x-event="active">我是浮层</div>

</aside>

### 手动显示

<aside class="doc-demo"><button onclick="$(this.nextElementSibling).role().toggle()">按钮</button>

<div class="x-popover" x-role="popover" x-event="null">我是浮层</div>

</aside>

## 箭头支持

<aside class="doc-demo"><button>按钮</button>

<div class="x-popover" x-role="popover" x-event="click"><span class="x-arrow x-arrow-bottom"></span>我包含了一个向下的箭头。如果显示不下，系统自动调节位置。</div>

</aside>

## API

##### 手动初始化弹出层

<pre>$('#popover1').role('popover', {target: '#button1'});</pre>

##### 手动显示菜单

<pre>$('[x-role=popover]').role().show();</pre>

##### 手动隐藏菜单

<pre>$('[x-role=popover]').role().hide();</pre>

##### 设置菜单打开后的回调

<pre>$('[x-role=popover]').role().on('hide', function(){   alert("弹出层关闭了") } );</pre>