<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
    <title>组件列表</title>
</head>
<body>
    <!-- 以下代码仅用于文档演示 -->
    <script type="text/javascript" src="../assets/doc/doc.js"></script>
    <script type="text/javascript" src="control/layout/waterfallLayout.js"></script>
    <div id="list" class="doc">
        正在载入列表...
    </div>

    <script>
        Doc.loadModuleList(function (moduleList) {

            var list = moduleList.src,
                segments = [],
                totalCount = 0,
                totalDoneCount = 0,
                currentCount = 0;

            for (var path in list) {
                var item = list[path];
                if (item.level) {
                    if (/^<li/.test(segments[segments.length - 1])) {
                        segments.push('</ul></div>');
                    }
                    if (item.level > 1) {
                        if (segments.length) {
                            segments.push("</div>");
                        }
                        segments.push('<h2>' + item.title + '</h2><div class="doc-waterfall">');
                    } else {
                        segments.push('<div class="doc"><h3>' + item.title + '</h3>');
                        segments.push('<ul>');
                    }
                } else {
                    totalCount++;
                    if (item.status == 'done' || !item.status) {
                        totalDoneCount++;
                    }
                    segments.push('<li><a href="' + path + '" title="' + item.title + '">' + item.title + '</a></li>');
                }
            }
            if (segments.length) {
                segments.push("</div>");
            }

            document.getElementById('list').innerHTML = segments.join('');

            var small = document.getElementById('doc_title').lastChild;
            small.innerHTML = '<small>(共 ' + totalCount + ' 个)</small>';
            small.title = '已完成:' + totalDoneCount + '\n未完成:' + (totalCount - totalDoneCount);

            Doc.iterate(".doc-waterfall", function (dom) {
                waterfallLayout(dom);
            });

        });
    </script>
</body>
</html>
