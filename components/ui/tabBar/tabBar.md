---
version: 0.0.1
author: xuld <xuld@vip.qq.com>
import:
    - typo/reset
---
# 标签条

## 基本用法
```jsx demo
import { VNode, render } from "ui/control";
import TabBar from "ui/tabBar";

var tabBar = render(
    __root__,
    <TabBar hideLastTabClose></TabBar>
);

render(
    __root__,
    <button onClick={()=>{ tabBar.addTab('xxx' + ~~(Math.random() * 10))} }>添加标签</button>
);
```

## 样式

```html demo
<nav class="x-tabbar x-tabbar-overflow">
    <a href="javascript:;" class="x-icon x-tabbar-left">⮜</a>
    <a href="javascript:;" class="x-icon x-tabbar-right">⮞</a>
    <div class="x-tabbar-body">
        <ul role="tablist">
            <li role="tab"><button class="x-close x-icon" title="关闭" aria-label="关闭">✖</button><a href="javascript:;">标签1</a></li>
            <li role="tab"><button class="x-close x-icon" title="关闭" aria-label="关闭">✖</button><a href="javascript:;">标签2标签2标签2标签2</a></li>
            <li role="tab"><button class="x-close x-icon" title="关闭" aria-label="关闭">✖</button><a href="javascript:;">标签1</a></li>
            <li role="tab"><button class="x-close x-icon" title="关闭" aria-label="关闭">✖</button><a href="javascript:;">标签2</a></li>
            <li role="tab"><button class="x-close x-icon" title="关闭" aria-label="关闭">✖</button><a href="javascript:;">标签1</a></li>
            <li role="tab"><button class="x-close x-icon" title="关闭" aria-label="关闭">✖</button><a href="javascript:;">标签2</a></li>
        </ul>
        <div class="x-tabbar-bar" style="left: 0; width: 6rem;"></div>
    </div>
</nav>
```