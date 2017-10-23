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

render(
    __root__,
    <NavMenu onItemClick={console.log}>
        <ul>
            <li class="x-navmenu-collapsable x-navmenu-collapsed">
                <a href="javascript:;"><i class="x-icon">★</i><span>菜单1</span></a>
                <ul>
                    <li>
                        <a href="javascript:;"><i class="x-icon">★</i><span>菜单2</span></a>
                    </li>
                    <li>
                        <a href="javascript:;"><i class="x-icon">★</i><span>菜单2</span></a>
                    </li>
                    <li class="x-navmenu-collapsable x-navmenu-collapsed">
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
            <li class="x-navmenu-active">
                <a href="javascript:;"><i class="x-icon">★</i><span>菜单1</span></a>
            </li>
            <li>
                <a href="javascript:;"><i class="x-icon">★</i><span>菜单1</span></a>
            </li>
            <li class="x-navmenu-collapsable x-navmenu-collapsed">
                <a href="javascript:;"><i class="x-icon">★</i><span>菜单1</span></a>
                <ul>
                    <li>
                        <a href="javascript:;"><i class="x-icon">★</i><span>菜单2</span></a>
                    </li>
                </ul>
            </li>
        </ul>
    </NavMenu>
);
```
