## 基本用法

<link rel="stylesheet" type="text/css" href="../../typography/partial/icon.css" data-doc="">

创建一个独立的 `<span class="x-icon">` 标签来表示图标，标签内部字符决定了图标的内容。

<aside class="doc-demo"><span class="x-icon">★</span> 你好　　 [<span class="x-icon">★</span>你好](###)</aside>

> #### 注意
> 
> 1.  不要在已有的标签直接添加 `.x-icon` 来显示图标。
> 2.  使用图标时应在图标后追加一个空格以保证美观。
> 3.  链接内图标不需要追加空格，因为其已包含了 `0.32em` 右边距，这可以避免图标右边空格出现下划线影响视觉效果。

## 通过 `class` 指定图标

<link rel="stylesheet" type="text/css" href="../../typography/partial/iconEx.css" data-doc="">

部分用户习惯使用 `class` 来指定图标，所以 TealUI 也提供了额外的 `iconEx.css`。但我们不建议用户使用它，因为这会大幅增加最终的 CSS 代码量。

<aside class="doc-demo"><span class="x-icon x-icon-star"></span>你好　 [<span class="x-icon x-icon-star"></span>你好](###)　</aside>

## 旋转图标

<link rel="stylesheet" type="text/css" href="../../typography/partial/spin.css">

结合 [旋转效果(spin)](spin.html) 组件，可以完成加载中的效果。

<aside class="doc-demo"><span class="x-icon x-spin">҉</span> 正在加载...　　 <span class="x-icon x-spin">↺</span> 正在刷新...</aside>

## 所有图标

图标的内容由内部文字决定，更换 `<span>` 里面的字符可以切换图标的内容。一些特殊字符可以使用 HTML 转义码（如`&#9733;`）表示。

<style>td[align="center"] { text-align: center!important; }</style> <script>var html = '<table>', odd = true; function appendLine(iconChar, iconName) { if (odd) { html += '<tr>'; } html += '<td align="center"><span class="x-icon">' + iconChar + '</span></td>'; html += '<td align="center"><code>' + iconChar + '</code></td>'; html += '<td><code>&amp;#' + iconChar.charCodeAt(0) + ';</code></td>'; html += '<td><code>' + iconName + '</code></td>'; if (!odd) { html += '</tr>'; } odd = !odd; } try { html += '<tr><th align="center">图标</th><th align="center">字符</th><th>字符编码</th><th>类名(<code>x-icon-*</code>)</th><th align="center">图标</th><th align="center">字符</th><th>字符编码</th><th>类名(<code>x-icon-*</code>)</th></tr>'; for (var span = 0; span < document.styleSheets.length; span++) { if (/iconex/i.test(document.styleSheets[span].href)) { var iconex = document.styleSheets[span]; for (var j = 0; j < iconex.cssRules.length; j++) { iconex.cssRules[j].cssText.replace(/\.x-icon-(\w+):+before\s*\{\n?\s*content:\s*['"]\\?(.+)['"]\s*;\s*\}/g, function (all, name, unicode) { appendLine(unicode, name); }); } } } if (!odd) { html += '<td></td><td></td><td></td><td></td></tr>'; } html += '</table>'; } catch (e) { html = '<blockquote class="doc-note">由于安全限制，目前无法列出所有可用图标，请改用 http 协议打开本页面。</blockquote>'; } document.write(html);</script>

> 所有图标由 [IcoMoon](http://icomoon.io/app/) 提供。在其官方应用导入 [icomoon_TealUI.json](icomoon_TealUI.json) 配置文件，可继续自定义图标。

## 经典图标 <small>(兼容IE6)</small>

<link rel="stylesheet" type="text/css" href="../../typography/partial/icon-glyph.css">

除了使用字体图标，还可使用经典的图片图标效果。图标由 [Glyphicons](http://glyphicons.com) 提供。

<style>#list li { width: 213px; float: left; list-style: none; line-height: 24px; } #list i { margin-right: 4px; }</style>

<aside class="doc-demo">文字 文字</aside>

*   x-icon-glyph-glass
*   x-icon-glyph-music
*   x-icon-glyph-search
*   x-icon-glyph-envelope
*   x-icon-glyph-heart
*   x-icon-glyph-star
*   x-icon-glyph-star-empty
*   x-icon-glyph-user
*   x-icon-glyph-film
*   x-icon-glyph-th-large
*   x-icon-glyph-th
*   x-icon-glyph-th-list
*   x-icon-glyph-ok
*   x-icon-glyph-remove
*   x-icon-glyph-zoom-in
*   x-icon-glyph-zoom-out
*   x-icon-glyph-off
*   x-icon-glyph-signal
*   x-icon-glyph-cog
*   x-icon-glyph-trash
*   x-icon-glyph-home
*   x-icon-glyph-file
*   x-icon-glyph-time
*   x-icon-glyph-road
*   x-icon-glyph-download-alt
*   x-icon-glyph-download
*   x-icon-glyph-upload
*   x-icon-glyph-inbox
*   x-icon-glyph-play-circle
*   x-icon-glyph-repeat
*   x-icon-glyph-refresh
*   x-icon-glyph-list-alt
*   x-icon-glyph-lock
*   x-icon-glyph-flag
*   x-icon-glyph-headphones
*   x-icon-glyph-volume-off
*   x-icon-glyph-volume-down
*   x-icon-glyph-volume-up
*   x-icon-glyph-qrcode
*   x-icon-glyph-barcode
*   x-icon-glyph-tag
*   x-icon-glyph-tags
*   x-icon-glyph-book
*   x-icon-glyph-bookmark
*   x-icon-glyph-print
*   x-icon-glyph-camera
*   x-icon-glyph-font
*   x-icon-glyph-bold
*   x-icon-glyph-italic
*   x-icon-glyph-text-height
*   x-icon-glyph-text-width
*   x-icon-glyph-align-left
*   x-icon-glyph-align-center
*   x-icon-glyph-align-right
*   x-icon-glyph-align-block
*   x-icon-glyph-list
*   x-icon-glyph-indent-left
*   x-icon-glyph-indent-right
*   x-icon-glyph-facetime-video
*   x-icon-glyph-picture
*   x-icon-glyph-pencil
*   x-icon-glyph-map-marker
*   x-icon-glyph-adjust
*   x-icon-glyph-tint
*   x-icon-glyph-edit
*   x-icon-glyph-share
*   x-icon-glyph-check
*   x-icon-glyph-move
*   x-icon-glyph-step-backward
*   x-icon-glyph-fast-backward
*   x-icon-glyph-backward
*   x-icon-glyph-play
*   x-icon-glyph-pause
*   x-icon-glyph-stop
*   x-icon-glyph-forward
*   x-icon-glyph-fast-forward
*   x-icon-glyph-step-forward
*   x-icon-glyph-eject
*   x-icon-glyph-chevron-left
*   x-icon-glyph-chevron-right
*   x-icon-glyph-plus-sign
*   x-icon-glyph-minus-sign
*   x-icon-glyph-remove-sign
*   x-icon-glyph-ok-sign
*   x-icon-glyph-question-sign
*   x-icon-glyph-info-sign
*   x-icon-glyph-screenshot
*   x-icon-glyph-remove-circle
*   x-icon-glyph-ok-circle
*   x-icon-glyph-ban-circle
*   x-icon-glyph-arrow-left
*   x-icon-glyph-arrow-right
*   x-icon-glyph-arrow-up
*   x-icon-glyph-arrow-down
*   x-icon-glyph-share-alt
*   x-icon-glyph-resize-full
*   x-icon-glyph-resize-small
*   x-icon-glyph-plus
*   x-icon-glyph-minus
*   x-icon-glyph-asterisk
*   x-icon-glyph-exclamation-sign
*   x-icon-glyph-gift
*   x-icon-glyph-leaf
*   x-icon-glyph-fire
*   x-icon-glyph-eye-open
*   x-icon-glyph-eye-close
*   x-icon-glyph-warning-sign
*   x-icon-glyph-plane
*   x-icon-glyph-calendar
*   x-icon-glyph-random
*   x-icon-glyph-comment
*   x-icon-glyph-magnet
*   x-icon-glyph-chevron-up
*   x-icon-glyph-chevron-down
*   x-icon-glyph-retweet
*   x-icon-glyph-shopping-cart
*   x-icon-glyph-folder-close
*   x-icon-glyph-folder-open
*   x-icon-glyph-resize-vertical
*   x-icon-glyph-resize-horizontal
*   x-icon-glyph-hdd
*   x-icon-glyph-bullhorn
*   x-icon-glyph-bell
*   x-icon-glyph-certificate
*   x-icon-glyph-thumbs-up
*   x-icon-glyph-thumbs-down
*   x-icon-glyph-hand-right
*   x-icon-glyph-hand-left
*   x-icon-glyph-hand-up
*   x-icon-glyph-hand-down
*   x-icon-glyph-circle-arrow-right
*   x-icon-glyph-circle-arrow-left
*   x-icon-glyph-circle-arrow-up
*   x-icon-glyph-circle-arrow-down
*   x-icon-glyph-globe
*   x-icon-glyph-wrench
*   x-icon-glyph-tasks
*   x-icon-glyph-filter
*   x-icon-glyph-briefcase
*   x-icon-glyph-fullscreen