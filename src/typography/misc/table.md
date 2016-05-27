<link rel="stylesheet" type="text/css" href="../../typography/core/utility.css">

## 默认样式

<aside class="doc-demo">

| 序号 | 项目名称 | 项目地址 |
| 1 | TealUI | http://teal.github.com/TealUI |
| 2 | TealLang | http://teal.github.com/TealLang |

</aside>

## 自定义样式

添加 `.x-table` 可设置为美化版的表格样式。添加 `.x-table-striped` 可以让表格行有间隔色。

<aside class="doc-demo">

<caption>项目列表</caption>
| 序号 | 项目名称 | 项目地址 |
| 1 | TealUI | http://teal.github.com/TealUI |
| 2 | TealLang | http://teal.github.com/TealLang |

</aside>

## 状态

添加 `.x-table-*`（其中 * 可以是`warning`、`error`、`info`、`success` 或 `selected`） 可以设置表格行或列的状态。通过 [工具样式(utility)](../../typography/core/utility.html) 组件的 `.x-center` 可居中单元格。

<aside class="doc-demo">

| Table | Th 1 | Th 2 | Th 3 |
| --- | --- | --- | --- |
| 1 | Td 1 | Td 2 | Td 3 |
| 2 | Td 1 | Td 2 | Td 3 |
| 2 | Td 1 | Td 2 | Td 3 |

</aside>

## 尺寸

添加 `.x-table-large` 或 `.x-table-small` 可放大或缩小表格单元格间隙。

<aside class="doc-demo">

| 序号 | 项目名称 | 项目地址 |
| 1 | TealUI | http://teal.github.com/TealUI |
| 2 | TealLang | http://teal.github.com/TealLang |

| 序号 | 项目名称 | 项目地址 |
| 1 | TealUI | http://teal.github.com/TealUI |
| 2 | TealLang | http://teal.github.com/TealLang |

</aside>

## 响应式表格

通过 [工具样式(utility)](../../typography/core/utility.html) 组件的 `.x-scrollable-horizontal` 可以实现超出内容后自动添加滚动条。

<link rel="stylesheet" type="text/css" href="../../typography/core/utility.css">

<aside class="doc-demo">

<div class="x-scrollable-horizontal">

| 序号 | 项目名称 | 项目地址 | 项目说明 |
| 1 | TealUI | http://teal.github.com/TealUI | 最完整的前端组件库，包括了200个前端组件。 |
| 2 | TealLang | http://teal.github.com/TealLang | 一个集 C 和 JavaScript 优点于一身的编程语言。 |

</div>

</aside>

## 圆角表格

表格的角色和插图一致，默认是不带圆角样式的。如果需要为表格定义圆角，需同时为各子级元素设置圆角。

<pre>        table {
            border-radius: 4px;
        }
        thead:first-child tr:first-child th:first-child, tbody:first-child tr:first-child td:first-child {
            border-radius: 4px 0 0 0;
        }
        thead:first-child tr:first-child th:last-child, tbody:first-child tr:first-child td:last-child {
            border-radius: 0 4px 0 0;
        }
        thead:last-child tr:last-child th:first-child, tbody:last-child tr:last-child td:first-child {
            border-radius: 0 0 0 4px;
        }
        thead:last-child tr:last-child th:last-child, tbody:last-child tr:last-child td:last-child {
            border-radius: 0 0 4px 0;
        }
    </pre>

> 如果需要用于展示大量数据的表格控件，请参考 [数据报表(dataGridView)](../dataView/dataGridView.html) 控件，此组件包含排序、筛选、行列选择、分页等常用功能。