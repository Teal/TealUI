---
version: 0.0.1
author: xuld <xuld@vip.qq.com>
import:
    - typo/reset
---
# 按钮组
将多个按钮组成一个整体。
<link rel="stylesheet" href="reset.scss" />
<link rel="stylesheet" href="../form/button.scss" />
<link rel="stylesheet" href="../form/buttonGroup.scss" />

        .doc-demo {
            line-height: 40px;
        }

## 基本用法
```htm
<span class="x-buttongroup">
    <a href="###" class="x-button">左</a>
    <a href="###" class="x-button">中</a>
    <a href="###" class="x-button">右</a>
</span>
<span class="x-buttongroup">
    <a href="###" class="x-button">上</a>
    <a href="###" class="x-button">中</a>
    <a href="###" class="x-button">下</a>
</span>
```


## 占满一行

当使用 `div` 时，按钮组将占满一行。
```htm
<div class="x-buttongroup">
    <a href="###" class="x-button x-button-actived">左边</a>
    <a href="###" class="x-button">中间的</a>
    <a href="###" class="x-button">右边</a>
</div>
```
