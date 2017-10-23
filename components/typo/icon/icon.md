---
version: 0.0.1
author: xuld <xuld@vip.qq.com>
import:
    - typo/reset
    - typo/spin
    - typo/icon/icon-class
---
# 图标
提供各类小图标。

## 基本用法
创建一个独立的 `<i class="x-icon">` 标签来表示图标，标签内部字符决定了图标的内容。
```html demo
<i class="x-icon">★</i> 你好　　
<a href="###"><i class="x-icon">★</i>你好</a>
```

> ##### (!)注意
> 不要在已有的标签直接添加 `.x-icon` 来显示图标。

使用图标时应在图标后追加一个空格以保证美观。
链接内图标不需要追加空格，因为其已包含了 `0.25rem` 右边距，这可以避免图标右边空格出现下划线影响视觉效果。

## 通过 `class` 指定图标
引入 `typo/icon/icon-class.scss` 后可以通过 `class` 来指定图标。
```html demo
<i class="x-icon x-icon-star"></i> 你好　
<a href="###"><i class="x-icon x-icon-star"></i>你好</a>
```

## 加载图标
结合[[typo/spin]]，可以完成加载中的效果。
```html demo
<i class="x-icon x-spin">&#1161;</i> 正在加载...　　
<i class="x-icon x-spin">🗘</i> 正在刷新...
```

## 图标列表
图标的内容由内部文字决定，更换 `<i>` 里面的字符可以切换图标的内容。
一些特殊字符可以使用 HTML 转义码（如`&#9733;`）表示。

<style>
    td[align="center"] {
        text-align: center!important;
    }
</style>

<div class="doc" id="iconlist"></div>

<script>
    window.onload = function(){
        var html = '<table>', odd = true;

        function appendLine(iconChar, iconName) {
            if (odd) {
                html += '<tr>';
            }
            html += '<td align="center"><span class="x-icon">' + iconChar + '</span></td>';
            html += '<td align="center"><code>' + iconChar + '</code></td>';
            html += '<td><code>&amp;#' + iconChar.charCodeAt(0) + ';</code></td>';
            html += '<td><code>x-icon-' + iconName + '</code></td>';
            if (!odd) {
                html += '</tr>';
            }
            odd = !odd;
        }

        try {
            html += '<tr><th align="center">图标</th><th align="center">字符</th><th>字符编码</th><th>类名</th><th align="center">图标</th><th align="center">字符</th><th>字符编码</th><th>类名</th></tr>';
            for (var i = 0; i < document.styleSheets.length; i++) {
                var styleSheet = document.styleSheets[i];
                for (var j = 0; j < styleSheet.cssRules.length; j++) {
                    styleSheet.cssRules[j].cssText.replace(/\.x-icon-([-\w]+):+before\s*\{\n?\s*content:\s*['"]\\?(.+)['"]\s*;\s*\}/g, function (all, name, unicode) {
                        appendLine(unicode, name);
                    });
                }
            }
            if (!odd) {
                html += '<td></td><td></td><td></td><td></td></tr>';
            }
            html += '</table>';
        } catch (e) {
            html = '<blockquote class="doc-blockquote doc-blockquote-note">由于安全限制，目前无法列出所有可用图标，请改用 http 协议打开本页面。</blockquote>';
        }

        document.getElementById("iconlist").innerHTML = html;
    }
</script>
