---
version: 0.0.1
author: xuld <xuld@vip.qq.com>
import:
    - typo/reset
    - typo/util
keyword:
    - 12
    - 等分
    - 平分
    - 左右
---
# 栅格布局
栅格布局法：将网页分成多行，每行分成多列，最终将网页拆成多个模块进行排版。

<style>
    .x-col span {
        background: #EEEEEE;
        height: 20px;
        width: 100%;
        text-align: center;
        line-height: 20px;
        color: #555555;
        display: block;
    }
</style>

## 基本用法
使用 `.x-row` 表示一行，使用 `.x-col` 表示一列，每列的宽度可自行设置。
```html demo
<div class="x-row">
    <div class="x-col" style="width:25%;"><span>左</span></div>
    <div class="x-col" style="width:75%;"><span>右</span></div>
</div>
```

## 等分布局
为 `.x-row` 添加 `.x-row-avg` 表示所有列都是等分的。
```html demo
<div class="x-row x-row-avg">
    <div class="x-col"><span>A</span></div>
    <div class="x-col"><span>B</span></div>
    <div class="x-col"><span>C</span></div>
</div>
```

或者也可以使用 `.x-row-*`(其中 * 是 1-6 的整数) 手动标识当前行的等分数额。
```html demo
<div class="x-row x-row-3">
    <div class="x-col"><span>A</span></div>
    <div class="x-col"><span>B</span></div>
    <div class="x-col"><span>C</span></div>
</div>
```

此时可以针对不同屏幕采用不同列数的等分布局。
- `.x-row-*`: 小屏（手机）（默认）按此列数等分。
- `.x-row-medium-*`: 大中屏（平板、电脑）按此列数等分。
- `.x-row-large-*`: 大屏（电脑）按此列数等分。

#### 如何实现：大屏（平板、电脑等）上显示 3 列，小屏（手机）上显示 1 列：
```html demo
<div class="x-row x-row-1 x-row-large-3">
    <div class="x-col">
        <span>A</span>
    </div>
    <div class="x-col">
        <span>B</span>
    </div>
    <div class="x-col">
        <span>C</span>
    </div>
</div>
```

> ##### (i)提示
> 可以调整浏览器窗口大小查看布局效果。

> ##### (!)注意
> 不能将 `.x-row-avg` 和 `.x-row-*` 赋予同一个标签。

## 24 栅格法
使用 `.x-col-*`(其中 * 是 1-24 的整数) 标识列宽。
只要一行内的所有列宽度后缀加起来等于 24，即可占满一行。
如果超过 24，列会自动换行。
```html demo
<div class="x-row">
    <div class="x-col x-col-8"><span>左</span></div>
    <div class="x-col x-col-10"><span>中</span></div>
    <div class="x-col x-col-6"><span>右</span></div>
</div>
```

通过添加前缀可以实现不同的屏幕大小应用不同的布局方式：
- `.x-col-*`: 手机（默认）按此宽度布局。
- `.x-col-medium-*`: 平板按此宽度布局。
- `.x-col-large-*`: 电脑按此宽度布局。（当未特别指定时，按 `.x-col-medium-*` 布局）

#### 如何实现：大屏（平板、电脑等）上显示 3 列，小屏（手机）上显示 1 列：
```html demo
<div class="x-row">
    <div class="x-col x-col-24 x-col-medium-7">
        <span>A</span>
    </div>
    <div class="x-col x-col-24 x-col-medium-12">
        <span>B</span>
    </div>
    <div class="x-col x-col-24 x-col-medium-5">
        <span>C</span>
    </div>
</div>
```

## 容器
容器的功能是定义一个全局居中的区域以显示网页内容：
- 中小屏幕（手机、平板）：容器占满整个屏幕，并预留默认 `1rem` 边距。
- 大屏幕（电脑）：容器固定为默认 `1200px` 宽度居中。

```html demo
<div class="x-container">我是容器</div>
```

> ##### (!)注意
> 不能将 `.x-container` 和 `.x-row` 赋予同一个标签，而应该用 `.x-container` 嵌套 `.x-row`。

## 高级用法

### 嵌套布局
在任一列中又可以继续应用栅格方法细分。

```html demo
<div class="x-row">
    <div class="x-col" style="width:25%;"><span>左</span></div>
    <div class="x-col" style="width:75%;">
        <div class="x-row">
            <div class="x-col" style="width:25%;"><span>右-1</span></div>
            <div class="x-col" style="width:75%;"><span>右-2</span></div>
        </div>
    </div>
</div>
```

### 列排序
使用[[typo/util]]提供的 `.x-left` 和 `.x-right` 可重定义列的顺序。
这在为了 SEO 需要将重要内容提前又不希望内容显示在左边的时候特别有用。
```html demo
<div class="x-row">
    <div class="x-col x-right" style="width:25%;"><span>我显示右边</span></div>
    <div class="x-col x-left" style="width:75%;"><span>我显示在左边</span></div>
</div>
<div class="x-row">
    <div class="x-col x-right" style="width:25%;"><span>我显示右边</span></div>
    <div class="x-col x-right" style="width:50%;"><span>我显示中边</span></div>
    <div class="x-col x-left" style="width:25%;"><span>我显示在左边</span></div>
</div>
```

### 列间距
如果需要在列之间插入空白，可以插入使用空白的列。
使用 `.x-hide-small` 在特定屏幕隐藏该列。
```html demo
<div class="x-row">
    <div class="x-col x-col-24 x-col-large-8">
        <span>左</span>
    </div>
    <div class="x-col x-hide-small x-col-large-1"></div>
    <div class="x-col x-col-24 x-col-large-15">
        <span>右</span>
    </div>
</div>
```

### 列换行
列采用浮动布局，布局时如果需要某一列强制在下一行显示，可插入一个 `.x-clear` 的元素。
如果某一列特别高可以使用此方法。
```html demo
<div class="x-row">
    <div class="x-col x-col-24 x-col-large-8">
        <span style="height:100px;">左</span>
    </div>
    <div class="x-col x-col-24 x-col-large-8">
        <span>右</span>
    </div>
    <div class="x-clear x-show-large"></div>
    <div class="x-col x-col-24 x-col-large-8">
        <span>我显示在新行</span>
    </div>
</div>
```

## 常用布局

### 左小右大
```html demo
<div class="x-row">
    <div class="x-col x-col-24 x-col-large-6"><span>左边栏</span></div>
    <div class="x-col x-col-24 x-col-large-18"><span>主体</span></div>
</div>
```

### 左大右小
```html demo
<div class="x-row">
    <div class="x-col x-col-24 x-col-large-18"><span>主体</span></div>
    <div class="x-col x-col-24 x-col-large-6"><span>右边栏</span></div>
</div>
```

### 左右平分
```html demo
<div class="x-row">
    <div class="x-col x-col-24 x-col-large-12"><span>主体 1</span></div>
    <div class="x-col x-col-24 x-col-large-12"><span>主体 2</span></div>
</div>
```

### 左中右
```html demo
<div class="x-row">
    <div class="x-col x-col-24 x-col-large-6"><span>左边栏</span></div>
    <div class="x-col x-col-24 x-col-large-14"><span>主体</span></div>
    <div class="x-col x-col-24 x-col-large-4"><span>右边栏</span></div>
</div>
```

### 三等分
```html demo
<div class="x-row">
    <div class="x-col x-col-24 x-col-large-8"><span>主体 1</span></div>
    <div class="x-col x-col-24 x-col-large-8"><span>主体 2</span></div>
    <div class="x-col x-col-24 x-col-large-8"><span>主体 3</span></div>
</div>
```

### 四等分
```html demo
<div class="x-row">
    <div class="x-col x-col-24 x-col-large-6"><span>主体 1</span></div>
    <div class="x-col x-col-24 x-col-large-6"><span>主体 2</span></div>
    <div class="x-col x-col-24 x-col-large-6"><span>主体 3</span></div>
    <div class="x-col x-col-24 x-col-large-6"><span>主体 4</span></div>
</div>
```

## 列宽一览表
```html demo
<div class="x-row">
    <div class="x-col x-col-24">
        <span>1/1</span>
    </div>
</div>
<div class="x-row">
    <div class="x-col x-col-12"><span>1/2</span></div>
    <div class="x-col x-col-12"><span>1/2</span></div>
</div>
<div class="x-row">
    <div class="x-col x-col-8"><span>1/3</span></div>
    <div class="x-col x-col-8"><span>1/3</span></div>
    <div class="x-col x-col-8"><span>1/3</span></div>
</div>
<div class="x-row">
    <div class="x-col x-col-6"><span>1/4</span></div>
    <div class="x-col x-col-6"><span>1/4</span></div>
    <div class="x-col x-col-6"><span>1/4</span></div>
    <div class="x-col x-col-6"><span>1/4</span></div>
</div>
<div class="x-row">
    <div class="x-col x-col-4"><span>1/6</span></div>
    <div class="x-col x-col-4"><span>1/6</span></div>
    <div class="x-col x-col-4"><span>1/6</span></div>
    <div class="x-col x-col-4"><span>1/6</span></div>
    <div class="x-col x-col-4"><span>1/6</span></div>
    <div class="x-col x-col-4"><span>1/6</span></div>
</div>
<div class="x-row">
    <div class="x-col x-col-2"><span>1/12</span></div>
    <div class="x-col x-col-2"><span>1/12</span></div>
    <div class="x-col x-col-2"><span>1/12</span></div>
    <div class="x-col x-col-2"><span>1/12</span></div>
    <div class="x-col x-col-2"><span>1/12</span></div>
    <div class="x-col x-col-2"><span>1/12</span></div>
    <div class="x-col x-col-2"><span>1/12</span></div>
    <div class="x-col x-col-2"><span>1/12</span></div>
    <div class="x-col x-col-2"><span>1/12</span></div>
    <div class="x-col x-col-2"><span>1/12</span></div>
    <div class="x-col x-col-2"><span>1/12</span></div>
    <div class="x-col x-col-2"><span>1/12</span></div>
</div>
<div class="x-row">
    <div class="x-col x-col-1"><span></span></div>
    <div class="x-col x-col-1"><span></span></div>
    <div class="x-col x-col-1"><span></span></div>
    <div class="x-col x-col-1"><span></span></div>
    <div class="x-col x-col-1"><span></span></div>
    <div class="x-col x-col-1"><span></span></div>
    <div class="x-col x-col-1"><span></span></div>
    <div class="x-col x-col-1"><span></span></div>
    <div class="x-col x-col-1"><span></span></div>
    <div class="x-col x-col-1"><span></span></div>
    <div class="x-col x-col-1"><span></span></div>
    <div class="x-col x-col-1"><span></span></div>
    <div class="x-col x-col-1"><span></span></div>
    <div class="x-col x-col-1"><span></span></div>
    <div class="x-col x-col-1"><span></span></div>
    <div class="x-col x-col-1"><span></span></div>
    <div class="x-col x-col-1"><span></span></div>
    <div class="x-col x-col-1"><span></span></div>
    <div class="x-col x-col-1"><span></span></div>
    <div class="x-col x-col-1"><span></span></div>
    <div class="x-col x-col-1"><span></span></div>
    <div class="x-col x-col-1"><span></span></div>
    <div class="x-col x-col-1"><span></span></div>
    <div class="x-col x-col-1"><span></span></div>
</div>
```
