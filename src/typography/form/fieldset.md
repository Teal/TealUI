## 默认样式

<aside class="doc-demo">

<fieldset><legend>标题</legend> 内容</fieldset>

</aside>

## 自定义样式

<aside class="doc-demo">

<fieldset class="x-fieldset"><legend>标题</legend> 内容</fieldset>

</aside>

## Firfox 表格响应式无效

在 Firefox 中，表格的相应式无法生效，使用如下代码修复：

<pre>        @-moz-document url-prefix() {
            fieldset { display: table-cell; }
        }
    </pre>