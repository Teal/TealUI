<textarea id="elem">abc</textarea>

## API <small>(源码: [utility/dom/selection.js](../../utility/dom/selection.js))</small>

| API | 描述 | 示例 |
| `_dom_.selectionRange` | 读写选区信息 | 

<pre>$('#elem').selectionRange()</pre>

<pre>$('#elem').selectionRange({start:1, end: 4})</pre>

 |
| `_dom_.selectionText` | 读写选区文本 | 

<pre>$('#elem').selectionText()</pre>

<pre>$('#elem').selectionText("content")</pre>

 |