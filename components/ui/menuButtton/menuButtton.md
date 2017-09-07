---
version: 0.0.1
author: xuld <xuld@vip.qq.com>
import:
    - typo/reset
---
# 菜单按钮

## 基本用法

```htm
<MenuButtton />
```# 菜单按钮

<link rel="stylesheet" href="reset.scss" />
<link rel="stylesheet" href="button.scss" />
<link rel="stylesheet" href="icon.scss" />
<link rel="stylesheet" href="../../control/popup/menu.scss" />
<link rel="stylesheet" href="../../control/core/popover.scss" />
可以打开更多菜单功能的按钮。

## 基本用法
```htm
菜单 &#9662;

    [菜单 1](###)
    [菜单 2](###)

            [菜单 1](###)
            [菜单 2](###)

            [菜单 3](###)

        [菜单 3](###)
```

MenuButton 使用 [IDropDownOwner](../Core/IDropDownOwner.html) 创建和管理下拉菜单。其默认的菜单类型是 [Menu](../Menu/Menu.html)。另可参考类似的 [ComboBox](../Form/ComboBox.html) 组件。

## JavaScript 方式

### 自动生成菜单

**必须手动引入 Controls.Menu.Menu 组件，才能自动生成菜单。**

            菜单Menu_ _

                var d1 = new MenuButton('#d1');
                var newItem = d1.add('这是通过 add 添加的');
                Dom.on(newItem.elem, 'click', function(){alert("菜单项点击了")});

### HTML 方式定制菜单

按钮后面的 `x-dropdown` 会被自动认为是当前按钮的子菜单。

            菜单Menu_ _

                预定义的第1个菜单

                    [预定义的第2个菜单](javascript:;)

                    _预定义的第3个菜单_

                var d2 = new MenuButton('#d2');

        相关 API 分别参考 [Menu](../Menu/Menu.html) 和 [Button](Button.html) 。

    -->
