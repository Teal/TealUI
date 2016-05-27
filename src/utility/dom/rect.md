<div id="target" class="doc-box doc-blue" style="z-index: 8; cursor: move;">#target</div>

<div id="elem" class="doc-box-large doc-green">#elem</div>

定位： <select id="position" onchange="realign()" onkeyup="realign()"><option value="b" selected="selected">b</option> <option value="r">r</option> <option value="t">t</option> <option value="l">l</option> <option value="rt">rt</option> <option value="bl">bl</option></select> <script>function realign() { $('#elem').pin($('#target'), $('#position').text()); } realign(); target.setDraggable({ onDragEnd: realign });</script>

<div id="elem" class="doc-box-large doc-green">#elem</div>

<article class="demo"><script>Demo.writeExamples({ '判断节点': 'Dom.get("a").within("b")', '判断区块': 'Dom.get("a").within(100, 500, 234, 667)', '判断坐标': 'Dom.get("a").within(250, 170)' }); Demo.writeExamples({ '获取窗口大小': 'Dom.window.getSize()', '设置窗口大小': 'Dom.window.setSize(100, 400)', '获取窗口位置': 'Dom.window.getPosition()' });</script></article>