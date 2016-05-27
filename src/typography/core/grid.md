<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
    <title>栅格布局</title>
    <meta name="author" content="xuld@vip.qq.com">
    <meta name="description" content="栅格布局法：将网页分成 N 行，每行分成 N 列。通过此方法对整体网页分成多个模块进行排版。">

    <script type="text/javascript" src="../../../assets/doc/doc.js"></script>

    <link rel="stylesheet" type="text/css" href="../core/reset.css" />
    <link rel="stylesheet" type="text/css" href="../core/grid.css" />

    <!-- 以下代码仅用于当前文档演示 -->
    <link rel="stylesheet" type="text/css" href="../core/utility.css" />
    <style>
        .x-col span {
            background: #EEEEEE;
            height: 20px;
            width: 100%;
            text-align: center;
            line-height: 20px;
            color: #555555;
            display: block;
        }
    </style>
</head>
<body>
    <h2>基本用法</h2>
    <p>使用 <code>.x-row</code> 表示一行，使用 <code>.x-col</code> 表示一列，每列的宽度自行设置。</p>
    <aside class="doc-demo">
        <div class="x-row">
            <div class="x-col" style="width:25%;"><span>左</span></div>
            <div class="x-col" style="width:75%;"><span>右</span></div>
        </div>
    </aside>

    <h2>容器</h2>
    <p>容器的功能是定义一个全局居中的区域以显示网页内容：</p>
    <ul>
        <li>手机/平板：容器会占满整个屏幕，并预留默认 <code>1em=14px</code> 边距。</li>
        <li>电脑：容器固定为默认 <code>980px</code> 宽居中，无边距。</li>
    </ul>

    <aside class="doc-demo">
        <div class="x-container">我是居中的容器</div>
    </aside>

    <blockquote class="doc-note"><h4>注意</h4>不能将 <code>.x-container</code> 和 <code>.x-row</code> 赋予同一个标签，而应该用 <code>.x-container</code> 嵌套 <code>.x-row</code>。</blockquote>

    <h2>12栅格法</h2>
    <p>使用 <code>.x-col-*</code>(其中 * 是 1-12 的整数) 标识列宽。只要一行内的所有列宽度后缀加起来等于 12，即可占满一行。如果超过 12，列会自动换行。</p>
    <aside class="doc-demo">
        <div class="x-row">
            <div class="x-col x-col-4"><span>左</span></div>
            <div class="x-col x-col-8"><span>右</span></div>
        </div>
    </aside>

    <p>通过添加前缀可以实现不同的屏幕大小应用不同的布局方式：</p>
    <ul>
        <li><code>.x-col-*</code>: 手机（默认）按此宽度布局。</li>
        <li><code>.x-col-medium-*</code>: 平板按此宽度布局。</li>
        <li><code>.x-col-large-*</code>: 电脑按此宽度布局。（当未特别指定时，按 <code>.x-col-medium-*</code> 布局）</li>
    </ul>
    <h4>实例：大屏（平板、电脑等）上显示 3 列，小屏（手机）上显示 1 列（可以调整浏览器窗口大小查看效果）：</h4>
    <aside class="doc-demo">
        <div class="x-row">
            <div class="x-col x-col-12 x-col-medium-4">
                <span>A</span>
            </div>
            <div class="x-col x-col-12 x-col-medium-4">
                <span>B</span>
            </div>
            <div class="x-col x-col-12 x-col-medium-4">
                <span>C</span>
            </div>
        </div>
    </aside>

    <h2>等分布局</h2>
    <p>使用 <code>.x-row-*</code>(其中 * 是 1-6 的整数) 标识当前行的等分数额。</p>
    <aside class="doc-demo">
        <div class="x-row x-row-3">
            <div class="x-col"><span>A</span></div>
            <div class="x-col"><span>B</span></div>
            <div class="x-col"><span>C</span></div>
        </div>
    </aside>

    <p>通过添加前缀可以实现不同的屏幕大小应用不同的布局方式：</p>
    <ul>
        <li><code>.x-row-*</code>: 手机（默认）按此宽度布局。</li>
        <li><code>.x-row-medium-*</code>: 平板按此宽度布局。</li>
        <li><code>.x-row-large-*</code>: 电脑按此宽度布局。（当未指定时，按 <code>.x-row-medium-*</code> 布局）</li>
    </ul>
    <h4>实例：大屏（平板、电脑等）上显示 3 列，小屏（手机）上显示 1 列（可以调整浏览器窗口大小查看效果）：</h4>
    <aside class="doc-demo">
        <div class="x-row x-row-1 x-row-medium-3">
            <div class="x-col"><span>A</span></div>
            <div class="x-col"><span>B</span></div>
            <div class="x-col"><span>C</span></div>
        </div>
    </aside>

    <h2>高级用法</h2>

    <h3>布局嵌套</h3>
    <p>在任一列中又可以继续应用栅格方法细分。</p>
    <aside class="doc-demo">
        <div class="x-row">
            <div class="x-col" style="width:25%;"><span>左</span></div>
            <div class="x-col" style="width:75%;">
                <div class="x-row">
                    <div class="x-col" style="width:25%;"><span>右1</span></div>
                    <div class="x-col" style="width:75%;"><span>右2</span></div>
                </div>
            </div>
        </div>
    </aside>

    <h3>列排序</h3>
    <p>使用 <a href="../core/utility.html">辅助样式(utility)</a> 提供的 <code>.x-left</code> 和 <code>.x-right</code> 可重定义列的顺序。这在为了 SEO 需要将重要内容提前又不希望内容显示在左边的时候特别有用。</p>
    <aside class="doc-demo">
        <div class="x-row">
            <div class="x-col x-right" style="width:25%;"><span>我显示右边</span></div>
            <div class="x-col x-left" style="width:75%;"><span>我显示在左边</span></div>
        </div>
        <div class="x-row">
            <div class="x-col x-right" style="width:25%;"><span>我显示右边</span></div>
            <div class="x-col x-right" style="width:50%;"><span>我显示中边</span></div>
            <div class="x-col x-left" style="width:25%;"><span>我显示在左边</span></div>
        </div>
    </aside>

    <h3>列间距</h3>
    <p>如果需要在列之间插入空白，可使用空白的列。</p>
    <aside class="doc-demo">
        <div class="x-row">
            <div class="x-col x-col-12 x-col-medium-4">
                <span>A</span>
            </div>
            <div class="x-col x-hide-small x-col-medium-4"></div>
            <div class="x-col x-col-12 x-col-medium-4">
                <span>C</span>
            </div>
        </div>
    </aside>

    <h3>列换行</h3>
    <p>列采用浮动布局，布局时如果需要某一列强制在下一行显示，可插入清除浮动的元素。这在存在非常高的列时特别有用。</p>
    <aside class="doc-demo">
        <div class="x-row">
            <div class="x-col x-col-12 x-col-medium-4">
                <span style="height:100px;">A</span>
            </div>
            <div class="x-col x-col-12 x-col-medium-4">
                <span>B</span>
            </div>
            <!-- 清除浮动以强制换行，只在 medium 显示 -->
            <div class="x-clear x-show-medium"></div>
            <div class="x-col x-col-12 x-col-medium-4">
                <span>C</span>
            </div>
        </div>
    </aside>

    <h2>常用布局</h2>

    <h3>左小右大</h3>
    <aside class="doc-demo">
        <div class="x-row">
            <div class="x-col x-col-12 x-col-medium-3"><span>左边栏</span></div>
            <div class="x-col x-col-12 x-col-medium-9"><span>主体</span></div>
        </div>
    </aside>

    <h3>左大右小</h3>
    <aside class="doc-demo">
        <div class="x-row">
            <div class="x-col x-col-12 x-col-medium-9"><span>主体</span></div>
            <div class="x-col x-col-12 x-col-medium-3"><span>右边栏</span></div>
        </div>
    </aside>

    <h3>左右平分</h3>
    <aside class="doc-demo">
        <div class="x-row">
            <div class="x-col x-col-12 x-col-medium-6"><span>主体 1</span></div>
            <div class="x-col x-col-12 x-col-medium-6"><span>主体 2</span></div>
        </div>
    </aside>

    <h3>左中右</h3>
    <aside class="doc-demo">
        <div class="x-row">
            <div class="x-col x-col-12 x-col-medium-3"><span>左边栏</span></div>
            <div class="x-col x-col-12 x-col-medium-7"><span>主体</span></div>
            <div class="x-col x-col-12 x-col-medium-2"><span>右边栏</span></div>
        </div>
    </aside>

    <h3>三等分</h3>
    <aside class="doc-demo">
        <div class="x-row">
            <div class="x-col x-col-12 x-col-medium-4"><span>主体 1</span></div>
            <div class="x-col x-col-12 x-col-medium-4"><span>主体 2</span></div>
            <div class="x-col x-col-12 x-col-medium-4"><span>主体 3</span></div>
        </div>
    </aside>

    <h3>四等分</h3>
    <aside class="doc-demo">
        <div class="x-row">
            <div class="x-col x-col-12 x-col-medium-3"><span>主体 1</span></div>
            <div class="x-col x-col-12 x-col-medium-3"><span>主体 2</span></div>
            <div class="x-col x-col-12 x-col-medium-3"><span>主体 3</span></div>
            <div class="x-col x-col-12 x-col-medium-3"><span>主体 4</span></div>
        </div>
    </aside>

    <h2>列宽一览表</h2>
    <aside class="doc-demo">
        <div class="x-row">
            <div class="x-col x-col-12">
                <span>1/1</span>
            </div>
        </div>
        <div class="x-row">
            <div class="x-col x-col-6"><span>1/2</span></div>
            <div class="x-col x-col-6"><span>1/2</span></div>
        </div>
        <div class="x-row">
            <div class="x-col x-col-4"><span>1/3</span></div>
            <div class="x-col x-col-4"><span>1/3</span></div>
            <div class="x-col x-col-4"><span>1/3</span></div>
        </div>
        <div class="x-row">
            <div class="x-col x-col-3"><span>1/4</span></div>
            <div class="x-col x-col-3"><span>1/4</span></div>
            <div class="x-col x-col-3"><span>1/4</span></div>
            <div class="x-col x-col-3"><span>1/4</span></div>
        </div>
        <div class="x-row">
            <div class="x-col x-col-2"><span>1/6</span></div>
            <div class="x-col x-col-2"><span>1/6</span></div>
            <div class="x-col x-col-2"><span>1/6</span></div>
            <div class="x-col x-col-2"><span>1/6</span></div>
            <div class="x-col x-col-2"><span>1/6</span></div>
            <div class="x-col x-col-2"><span>1/6</span></div>
        </div>
        <div class="x-row">
            <div class="x-col x-col-1"><span>1/12</span></div>
            <div class="x-col x-col-1"><span>1/12</span></div>
            <div class="x-col x-col-1"><span>1/12</span></div>
            <div class="x-col x-col-1"><span>1/12</span></div>
            <div class="x-col x-col-1"><span>1/12</span></div>
            <div class="x-col x-col-1"><span>1/12</span></div>
            <div class="x-col x-col-1"><span>1/12</span></div>
            <div class="x-col x-col-1"><span>1/12</span></div>
            <div class="x-col x-col-1"><span>1/12</span></div>
            <div class="x-col x-col-1"><span>1/12</span></div>
            <div class="x-col x-col-1"><span>1/12</span></div>
            <div class="x-col x-col-1"><span>1/12</span></div>
        </div>
    </aside>
    <aside class="doc-demo">
        <div class="x-row x-row-1">
            <div class="x-col"><span>A</span></div>
        </div>
        <div class="x-row x-row-2">
            <div class="x-col"><span>A</span></div>
            <div class="x-col"><span>B</span></div>
        </div>
        <div class="x-row x-row-3">
            <div class="x-col"><span>A</span></div>
            <div class="x-col"><span>B</span></div>
            <div class="x-col"><span>C</span></div>
        </div>
        <div class="x-row x-row-4">
            <div class="x-col"><span>A</span></div>
            <div class="x-col"><span>B</span></div>
            <div class="x-col"><span>C</span></div>
            <div class="x-col"><span>D</span></div>
        </div>
        <div class="x-row x-row-5">
            <div class="x-col"><span>A</span></div>
            <div class="x-col"><span>B</span></div>
            <div class="x-col"><span>C</span></div>
            <div class="x-col"><span>D</span></div>
            <div class="x-col"><span>E</span></div>
        </div>
        <div class="x-row x-row-6">
            <div class="x-col"><span>A</span></div>
            <div class="x-col"><span>B</span></div>
            <div class="x-col"><span>C</span></div>
            <div class="x-col"><span>D</span></div>
            <div class="x-col"><span>E</span></div>
            <div class="x-col"><span>F</span></div>
        </div>
    </aside>
</body>
</html>
