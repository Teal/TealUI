---
version: 0.0.1
author: xuld <xuld@vip.qq.com>
import:
    - typo/reset
---
# 分隔按钮
两个按钮组合成一个分割按钮。
<link rel="stylesheet" href="reset.scss" />
<link rel="stylesheet" href="button.scss" />
<link rel="stylesheet" href="buttonGroup.scss" />
<link rel="stylesheet" href="icon.scss" />
<link rel="stylesheet" href="../../control/popup/menu.scss" />
<link rel="stylesheet" href="../../control/core/popover.scss" />
<link rel="stylesheet" href="../../control/form/splitButton.scss" />

## 基本用法
```htm
<span class="x-splitbutton x-buttongroup" x-role="splitButton">
    <button type="button" class="x-button">菜单</button>
    <button type="button" class="x-button"><span class="x-icon">&#9662;</span></button>
</span>
<menu class="x-menu x-dropdownmenu" x-role="menu">
    <li><a href="###">菜单 1</a></li>
    <li><a href="###">菜单 2</a></li>
    <li class="x-menu-divider"></li>
    <li>
        <menu class="x-menu" x-role="menu">
            <li><a href="###">菜单 1</a></li>
            <li><a href="###">菜单 2</a></li>
            <li class="x-menu-divider"></li>
            <li><a href="###">菜单 3</a></li>
        </menu>
        <a href="###">菜单 3</a>
    </li>
</menu>
```
```htm
<span class="x-splitbutton x-buttongroup x-radius" x-role="splitButton">
    <button type="button" class="x-button x-button-bordered x-button-small">菜单</button>
    <button type="button" class="x-button x-button-bordered x-button-small"><span class="x-icon">&#9662;</span></button>
</span>
<menu class="x-menu x-dropdown">
    <li><a href="###">菜单 1</a></li>
    <li><a href="###">菜单 2</a></li>
    <li><hr /></li>
    <li><a href="###">菜单 3</a></li>
</menu>
```


## JavaScript 方式

### 自动生成菜单

**必须手动引入 Controls.Menu.Menu 组件，才能自动生成菜单。**

                    按钮button

                        var d1 = new SplitButton('#d1');
                        var item = d1.add('这是通过 add 添加的');
                        Dom.on(item.elem, 'click', function(){alert("菜单项点击了")});

### HTML 方式生成菜单

按钮后面的 `x-dropdown` 会被自动认为是当前按钮的子菜单。

                    按钮button

                    预定义的第1个菜单

                        [预定义的第2个菜单](javascript:;)

                        _预定义的第3个菜单_

                        var d2 = new SplitButton('#d2');

    -->

## HTML 方式
```htm
<span class="x-splitbutton x-buttongroup">
            <button type="button" class="x-button">按钮button</button>
            <button type="button" class="x-button"><span class="x-menubutton-arrow"></span></button>
        </span>
```


    -->

## API

分别参考 [Menu](../Menu/Menu.html) 和 [Button](Button.html) 的 API 。

    -->
