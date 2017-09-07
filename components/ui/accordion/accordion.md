---
version: 0.0.1
author: xuld <xuld@vip.qq.com>
import:
    - typo/reset
---
# 手风琴
手风琴即多个面板的组合。

## 基本用法
```jsx demo
import { VNode, render } from "ui/control";
import Accordion from "ui/accordion";
import Panel from "ui/panel";

render(
    __root__,
    <Accordion selectedIndex={1}>
        <Panel title="标题">你好</Panel>
        <Panel title="标题">你好</Panel>
        <Panel title="标题">你好</Panel>
    </Accordion>
);
```

## 允许多开
```jsx demo
import { VNode, render } from "ui/control";
import Accordion from "ui/accordion";
import Panel from "ui/panel";

render(
    __root__,
    <Accordion multiply>
        <Panel title="标题">你好</Panel>
        <Panel title="标题">你好</Panel>
        <Panel title="标题" collapsed>你好</Panel>
    </Accordion>
);
```

## 样式
```html demo
<div class="x-accordion">
    <section class="x-panel x-panel-collapsable x-panel-collapsed">
        <header class="x-panel-header">
            标题 1
        </header>
        <div class="x-panel-body">
            正文 1
        </div>
    </section>
    <section class="x-panel x-panel-collapsable">
        <header class="x-panel-header">
            标题 2
        </header>
        <div class="x-panel-body">
            正文 2
        </div>
    </section>
    <section class="x-panel x-panel-collapsable x-panel-collapsed">
        <header class="x-panel-header">
            标题 3
        </header>
        <div class="x-panel-body">
            正文 3
        </div>
    </section>
</div>
```
