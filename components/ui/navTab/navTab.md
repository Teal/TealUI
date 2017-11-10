---
version: 0.0.1
author: xuld <xuld@vip.qq.com>
import:
    - typo/reset
---
# 导航标签
实现标签页效果。

## 基本用法
```jsx demo
import { VNode, render } from "ui/control";
import NavTab from "ui/navTab";

var navTab = render(
    __root__,
    <NavTab hideLastClose></NavTab>
);

render(
    __root__,
    <button onClick={()=>{ navTab.addTab('Tab ' + navTab.tabs.length)} }>添加标签</button>
);
```

## 常用功能

### 添加标签页（带图标）
```js
var tab = navTab.addTab("标题");
tab.lastChild.innerHTML = `<i class="x-icon">★</i>` + tab.lastChild.innerHTML;
```

### 关闭所有标签页
```js
while (navTab.tabs.length) {
    navTab.removeTab(navTab.tabs[0]);
}
```

## 样式

```html demo
<nav class="x-navtab x-navtab-overflow">
    <a href="javascript:;" class="x-icon x-navtab-left">⮜</a>
    <a href="javascript:;" class="x-icon x-navtab-right">⮞</a>
    <div class="x-navtab-container">
        <ul class="x-navtab-body" role="tablist">
            <li role="tab"><button class="x-close x-icon" title="关闭" aria-label="关闭">✖</button><a href="javascript:;">标签1</a></li>
            <li role="tab"><button class="x-close x-icon" title="关闭" aria-label="关闭">✖</button><a href="javascript:;">标签2标签2标签2标签2</a></li>
            <li role="tab"><button class="x-close x-icon" title="关闭" aria-label="关闭">✖</button><a href="javascript:;">标签1</a></li>
            <li role="tab"><button class="x-close x-icon" title="关闭" aria-label="关闭">✖</button><a href="javascript:;">标签2</a></li>
            <li role="tab"><button class="x-close x-icon" title="关闭" aria-label="关闭">✖</button><a href="javascript:;">标签1</a></li>
            <li role="tab"><button class="x-close x-icon" title="关闭" aria-label="关闭">✖</button><a href="javascript:;">标签2</a></li>
        </ul>
        <div class="x-navtab-bar" style="left: 0; width: 6rem;"></div>
    </div>
</nav>
```