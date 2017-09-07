# 导航菜单
面包屑主要用于网站层次导航。
<link rel="stylesheet" href="../core/reset.scss" />
<link rel="stylesheet" href="../nav/nav.scss" />
<link rel="stylesheet" href="../partial/badge.scss" />

## 水平布局
```htm
<ul class="x-nav x-nav-horizonal">
    <li class="x-nav-active"><a href="###">首页</a></li>
    <li><a href="###">此页</a></li>
</ul>
```

当在手机上，水平布局会自动改为垂直布局。

## 垂直布局
```htm
<ul class="x-nav x-nav-vertical">
    <li class="x-nav-active"><a href="###">首页</a></li>
    <li><a href="###">此页</a></li>
</ul>
```

## 内联布局
```htm
请选择：<ul class="x-nav x-nav-inline">
        <li class="x-nav-active"><a href="###">首页</a></li>
        <li><a href="###">此页</a></li>
    </ul>
```

## 导航和徽章
```htm
<ul class="x-nav x-nav-horizonal">
    <li class="x-nav-active"><a href="###">首页<span class="x-badge">23</span></a></li>
    <li><a href="###">此页<span class="x-badge">23</span></a></li>
</ul>
```
