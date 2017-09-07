---
version: 0.0.1
author: xuld <xuld@vip.qq.com>
---
# 剪贴板
剪贴板
提供和剪贴板的直接交互。

    注意：最新浏览器由于安全限制，不允许使用此功能。这时，函数会提示用户手动操作。

# 使用 Flash 处理剪贴板
基于 Flash　支持复制功能。

    复制

    我是需要复制的文本

        ZeroClipboard.init({
            dom: document.getElementById("button1"),
            input: document.getElementById("textBox1"),
        });
