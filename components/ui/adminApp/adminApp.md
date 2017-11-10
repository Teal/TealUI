---
version: 0.0.1
author: xuld <xuld@vip.qq.com>
import:
    - typo/reset
---
# 管理端界面布局
管理端界面布局

## 基本用法

```jsx demo
import { VNode, render } from "ui/control";
import AdminApp from "ui/adminApp";

render(
    __root__,
    <AdminApp title="最上流的管理系统" userName="管理员" style="height:300px; position: relative;"></AdminApp>
);
```

## 样式

```html demo
<div class="x-adminapp" style="height:300px; position: relative;">
    <header class="x-adminapp-header">
        <a href="javascript:;" class="x-adminapp-button x-adminapp-collapse"></a>
        <a href="javascript:;" class="x-adminapp-text"><img src="" /><span>最上流的管理系统</span></a>
        <div class="x-adminapp-right">
            <div class="x-adminapp-text">
                欢迎，<a href="javascript:;" class="x-adminapp-username">管理员</a>
            </div>
            <a class="x-adminapp-button x-adminapp-logout" href="javascript:;">退出</a>
        </div>
    </header>
    <div class="x-adminapp-container">
        <aside class="x-adminapp-sidebar">
            菜单
        </aside>
        <div class="x-adminapp-main">
            <div class="x-adminapp-tabs">导航条</div>
            <div class="x-adminapp-body">
                <div class="x-adminapp-tabpage" style="height:600px;">内容</div>
            </div>
        </div>
    </div>
</div>
```