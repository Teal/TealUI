---
version: 0.0.1
author: xuld <xuld@vip.qq.com>
import:
    - typo/reset
    - typo/badge
---
# 导航菜单
简单的导航项

## 基本用法
```html demo
<ul class="x-nav">
    <li class="x-nav-active"><a href="###">首页</a></li>
    <li><a href="###">详情</a></li>
    <li><a href="###">关于我们</a></li>
</ul>
```

## 水平布局
添加 `.x-nav-h` 实现水平布局。
```html demo
请选择：
<ul class="x-nav x-nav-h">
    <li class="x-nav-active"><a href="###">首页</a></li>
    <li><a href="###">详情</a></li>
    <li><a href="###">关于我们</a></li>
</ul>
```

## 响应式布局
添加 `.x-nav-large-h` 实现在大屏上水平布局，在小屏上垂直布局。
```html demo
<ul class="x-nav x-nav-large-h">
    <li class="x-nav-active"><a href="###">首页</a></li>
    <li><a href="###">详情</a></li>
    <li><a href="###">关于我们</a></li>
</ul>
```

## 导航和徽章
```html demo
<ul class="x-nav x-nav-large-h">
    <li class="x-nav-active"><a href="###">首页<span class="x-badge">2</span></a></li>
    <li><a href="###">详情</a></li>
    <li><a href="###">关于我们<span class="x-badge">1</span></a></li>
</ul>
```
