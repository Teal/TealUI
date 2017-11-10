---
version: 0.0.1
author: xuld <xuld@vip.qq.com>
import:
    - typo/reset
    - typo/icon
---
# 导航菜单

## 基本用法
```jsx demo
import { VNode, render } from "ui/control";
import NavMenu from "ui/navMenu";

var navMenu = render(
    __root__,
    <NavMenu onItemClick={console.log} items={[{
        icon: "★",
        content: "菜单1",
        children: [
            {
                 icon: "★",
                content: "菜单2"
            },
            {
                 icon: "★",
                content: "菜单3"
            }
        ]
    }, {
        icon: "★",
        content: "菜单4"
    }]}>
    </NavMenu>
);

render(
    __root__,
    <button onClick={() => navMenu.toggleCollapse()}>切换折叠模式</button>
)
```

## 样式

```html demo
<ul class="x-navmenu">
    <li class="x-navmenu-collapsable">
        <a href="javascript:;"><i class="x-icon">★</i><span>菜单1</span></a>
        <ul>
            <li class="x-navmenu-selected">
                <a href="javascript:;"><i class="x-icon">★</i><span>菜单2</span></a>
            </li>
            <li>
                <a href="javascript:;"><i class="x-icon">★</i><span>菜单2</span></a>
            </li>
            <li class="x-navmenu-collapsable">
                <a href="javascript:;"><i class="x-icon">★</i><span>菜单2</span></a>
                <ul>
                    <li>
                        <a href="javascript:;"><i class="x-icon">★</i><span>菜单3</span></a>
                        <ul class="x-navmenu-collapsable">
                            <li>
                                <a href="javascript:;"><i class="x-icon">★</i><span>菜单3</span></a>
                            </li>
                            <li>
                                <a href="javascript:;"><i class="x-icon">★</i><span>菜单3</span></a>
                            </li>
                            <li>
                                <a href="javascript:;"><i class="x-icon">★</i><span>菜单3</span></a>
                            </li>
                        </ul>
                    </li>
                    <li>
                        <a href="javascript:;"><i class="x-icon">★</i><span>菜单3</span></a>
                    </li>
                    <li>
                        <a href="javascript:;"><i class="x-icon">★</i><span>菜单3</span></a>
                    </li>
                </ul>
            </li>
            <li>
                <a href="javascript:;"><i class="x-icon">★</i><span>菜单2</span></a>
            </li>
        </ul>
    </li>
    <li class="x-navmenu-selected">
        <a href="javascript:;"><i class="x-icon">★</i><span>菜单1</span></a>
    </li>
    <li>
        <a href="javascript:;"><i class="x-icon">★</i><span>菜单1</span></a>
    </li>
    <li class="x-navmenu-collapsable">
        <a href="javascript:;"><i class="x-icon">★</i><span>菜单1</span></a>
        <ul>
            <li>
                <a href="javascript:;"><i class="x-icon">★</i><span>菜单2</span></a>
            </li>
        </ul>
    </li>
</ul>
```