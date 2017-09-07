模板引擎
========================================================
@description 如果需要用 JS 生成一大段文本(特别是 HTML 片段)时，建议使用模板引擎。

<style>textarea { width: 800px; height: 190px; display: block; }</style>

ASP 语法
--------------------------------------------------------

## TealUI 模板引擎

<textarea id="from">遍历 dataArr 数组，输出其中的奇数: <ul> {for(var i = 0; i < $data.dataArr.length; i++)} {if (i > 1)}<li>{i}: {$data.dataArr[i]}</li>{/if} {/for} </ul> <ul> {foreach a in $data.dataArr} {if a % 2 == 1}<li>{a}</li>{/if} {/foreach} </ul></textarea> 输入数据: <input type="text" value="{dataArr: [3,2,1,0]}" id="data">  <input onclick="document.getElementById('to').value = Tpl.parse(document.getElementById('from').value, eval('(' + document.getElementById('data').value + ')'))" type="button" value="解析模板">
<textarea id="to"></textarea>

### 常量

模板内任意字符串都会原样输出，模板引擎只解析 {} 内的数据。模板内使用 {{ 代替 {，使用 }} 代替 }

### 逻辑

所有的表达式语法和 JavaScript 相同。

#### if 语句

<pre>        {if (true)}
            text1
        {else if (false)}
            text2
        {else}
            text3
        {/if}
    </pre>

#### foreach 语句

<pre>        {foreach (value, key in [0,1,2])}
            {key} = {value}
        {/foreach}
    </pre>

foreach 语句同时支持数组和对象。

#### for 语句

<pre>        {for (var i=0; i < 3; i++) }
            text{i}
        {/for}
        {for (var key in obj) }
            text{key}
        {/for}
    </pre>

#### while 语句

<pre>        {while (false) }
            text
        {/while}
    </pre>

#### var 语句

<pre>        {var a = 2;}
    </pre>

#### function 语句

<pre>        {function a()}
            func
        {/function}
        {a() // 函数调用}
    </pre>

#### void 语句

void 语句用于执行代码，但不会在模板字符串内添加任何内容。

<pre>        {void alert("alert")}
    </pre>

### 内置宏变量

在模板内部可以直接使用一些内置宏变量。

#### $data

被解析的数据。

#### $key

foreach 语句中获取最近的循环索引或键。

#### $target

foreach 语句中获取最近的循环对象。