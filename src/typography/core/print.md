<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
    <title>打印样式</title>
    <meta name="author" content="xuld@vip.qq.com">
    <meta name="description" content="定义网页打印时的附加样式，增加打印后的易读性。">

    <script type="text/javascript" src="../../../assets/doc/doc.js"></script>

    <link rel="stylesheet" type="text/css" href="../../typography/core/reset.css" />
    <link rel="stylesheet" type="text/css" href="../../typography/core/print.css" data-doc />
</head>
<body>
    <blockquote class="doc-note"><h4>本页示例只在打印时有效</h4>点击浏览器菜单 文件/打印/打印预览 可以查看效果。</blockquote>

    <h2>全局打印样式优化</h2>
    <ul>
        <li>将网页转为黑色以提升打印速度。</li>
        <li>关闭背景和阴影。</li>
        <li>防止部分标签被强制分页（如图表不允许分页打印）。</li>
    </ul>

    <h2>显示链接和描述</h2>
    <p>链接在打印时将隐藏下划线，并在链接文字后追加地址。</p>

    <aside class="doc-demo">
        <a href="http://github.com/Teal/TealUI/">我是链接</a>
        <abbr title="我是 ABBR 描述">ABBR</abbr>
    </aside>

    <h2>辅助样式：打印时显示和隐藏</h2>
    <p><code>.x-hide-print</code> 在打印时被隐藏，<code>.x-show-print</code> 则相反。</p>
    <aside class="doc-demo">
        <div class="x-hide-print">
            现在网页正在浏览器显示，打印时不会显示这行文字
        </div>
        <div class="x-show-print">
            现在网页正在打印，浏览器不会显示这行文字
        </div>
    </aside>
</body>
</html>
