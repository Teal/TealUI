---
version: 0.0.1
author: xuld <xuld@vip.qq.com>
import:
    - typo/reset
    - typo/util
---
# 表格
常规表格样式。
> 复杂的数据报表见[[ui/dataGridView]]。

## 基本用法
```html demo
<table class="x-table">
    <tr>
        <th>序号</th>
        <th>项目名称</th>
        <th>项目地址</th>
    </tr>
    <tr>
        <th>1</th>
        <td>TealUI</td>
        <td>http://tealui.com</td>
    </tr>
    <tr>
        <th>2</th>
        <td>TealLang</td>
        <td>http://teallang.com</td>
    </tr>
</table>
```       

## 高亮行
添加 `.x-table-striped` 设置间隔色。
添加 `.x-table-hover` 设置悬停高亮。

```html demo
<table class="x-table x-table-striped x-table-hover">
    <caption>项目列表</caption>
    <tr>
        <th>序号</th>
        <th>项目名称</th>
        <th>项目地址</th>
    </tr>
    <tbody>
        <tr>
            <th>1</th>
            <td>TealUI</td>
            <td>http://tealui.com</td>
        </tr>
        <tr>
            <th>2</th>
            <td>TealLang</td>
            <td>http://teallang.com</td>
        </tr>
    </tbody>
</table>
```

## 基线风格

```html demo
<table class="x-table x-table-baseline">
    <caption>项目列表</caption>
    <tr>
        <th>序号</th>
        <th>项目名称</th>
        <th>项目地址</th>
    </tr>
    <tr>
        <td>1</td>
        <td>TealUI</td>
        <td>http://tealui.com</td>
    </tr>
    <tr>
        <td>2</td>
        <td>TealLang</td>
        <td>http://teallang.com</td>
    </tr>
</table>
```

## 占满一行
使用[[typo/util]]提供的 `.x-block` 可占满整行。
使用[[typo/util]]提供的 `.x-center` 可实现居中。
```html demo
<table class="x-table x-block">
    <caption>项目列表</caption>
    <tr>
        <th class="x-center">序号</th>
        <th>项目名称</th>
        <th>项目地址</th>
    </tr>
    <tr>
        <td class="x-center">1</td>
        <td>TealUI</td>
        <td>http://tealui.com</td>
    </tr>
    <tr>
        <td class="x-center">2</td>
        <td>TealLang</td>
        <td>http://teallang.com</td>
    </tr>
</table>
```

## 状态
添加 `.x-table-*`（其中 * 可以是`warning`、`error`、`info`、`success` 或 `selected`） 可以设置表格行或列的状态。

```html demo
<table class="x-table x-table-striped">
    <thead>
        <tr>
            <th>Table</th>
            <th>Th 1</th>
            <th>Th 2</th>
            <th>Th 3</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>1</td>
            <td class="x-table-warning">Td 1</td>
            <td>Td 2</td>
            <td class="x-table-error">Td 3</td>
        </tr>
        <tr class="x-table-error">
            <td>2</td>
            <td class="x-table-warning">Td 1</td>
            <td>Td 2</td>
            <td class="x-table-success">Td 3</td>
        </tr>
        <tr class="x-table-selected">
            <td>2</td>
            <td class="x-table-info">Td 1</td>
            <td>Td 2</td>
            <td>Td 3</td>
        </tr>
    </tbody>
</table>
```

## 尺寸
添加 `.x-table-large` 或 `.x-table-small` 可放大或缩小表格单元格间隙。
```html demo
<table class="x-table x-table-large">
    <tr>
        <th>序号</th>
        <th>项目名称</th>
        <th>项目地址</th>
    </tr>
    <tr>
        <td>1</td>
        <td>TealUI</td>
        <td>http://tealui.com</td>
    </tr>
    <tr>
        <td>2</td>
        <td>TealLang</td>
        <td>http://teallang.com</td>
    </tr>
</table>

<table class="x-table x-table-small">
    <tr>
        <th>序号</th>
        <th>项目名称</th>
        <th>项目地址</th>
    </tr>
    <tr>
        <td>1</td>
        <td>TealUI</td>
        <td>http://tealui.com</td>
    </tr>
    <tr>
        <td>2</td>
        <td>TealLang</td>
        <td>http://teallang.com</td>
    </tr>
</table>
```

## 响应式
通过[[typo/util]]提供的 `.x-scrollable-horizontal` 可以实现表格太长时显示横向滚动条。
```html demo
<div class="x-scrollable-horizontal" style="white-space: nowrap;">
    <table>
        <tr>
            <th>序号</th>
            <th>项目名称</th>
            <th>项目地址</th>
            <th>项目说明</th>
        </tr>
        <tr>
            <th>1</th>
            <td>TealUI</td>
            <td>http://tealui.com</td>
            <td>打造小而全、精而美的开源组件库。</td>
        </tr>
        <tr>
            <th>2</th>
            <td>TealLang</td>
            <td>http://teallang.com</td>
            <td>一个面向描述的新一代编程语言。</td>
        </tr>
    </table>
</div>
```

## 圆角
表格的角色和插图一致，不建议为表格添加圆角。
如果需要显示圆角，见[[typo/table/table-more]]。
