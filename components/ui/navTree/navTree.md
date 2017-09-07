---
version: 0.0.1
author: xuld <xuld@vip.qq.com>
import:
    - typo/reset
---
# 树导航
用于展示有层次的列表。
<link rel="stylesheet" href="../core/reset.scss" />
<link rel="stylesheet" href="../partial/icon.scss" />
<link rel="stylesheet" href="../nav/tree.scss" />

## 基本用法
```htm
<ul class="x-tree" x-role="tree">
    <li>
        <a href="###"><span class="x-icon">﹀</span>节点 1</a>
        <ul>
            <li>
                <a href="###"><span class="x-icon">　</span>节点 1 - 1</a>
            </li>
            <li class="x-tree-selected">
                <a href="###"><span class="x-icon">﹀</span>节点 1 - 2</a>
                <ul>
                    <li><a href="###"><span class="x-icon">　</span>节点 1 - 2 - 1</a></li>
                    <li><a href="###"><span class="x-icon">　</span>节点 1 - 2 - 2</a></li>
                </ul>
            </li>
            <li><a href="###"><span class="x-icon">　</span>节点 1 - 3</a></li>
        </ul>
    </li>
    <li><a href="###"><span class="x-icon">﹀</span>节点 2</a></li>
    <li><a href="###"><span class="x-icon">﹀</span>节点 3</a></li>
</ul>
```
