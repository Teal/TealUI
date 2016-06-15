<article id="todolist">

# TodoList

<div class="itemlist">

|  |  | <input placeholder="添加要做的事..." onkeyup="TodoList.onNewItemKeyUp(event);"> | [✚](javascript:TodoList.onAddNewItemClick();) |
| --- | --- | --- | --- |

<script id="contentTpl" type="text/template">{for item in $data.list} {if $data.filter == null || $data.filter == item.done } <tr class="{if item.done}done{end}"> <th class="item-toggle"><input type="checkbox" class="checkbox" onclick="TodoList.model.toggleDone({$key}, this.checked)" {if item.done} checked="checked" {end}></th> <td class="item-spacing"></td> <td class="item-label">{item.text}</td> <td class="item-action"><a href="javascript:TodoList.model.removeAt({$key});">✖</a></td> </tr> {end} {end}</script>

<div class="toolbar"><script id="toolbarTpl" type="text/template">{function getStateCount(done)} {var sum = 0;} {for(var i = 0; i < $data.list.length;i++)} {if($data.list[i].done == done)} {sum++;} {end} {end} {return sum;} {end} <div class="toolbar-shadow"></div> <div class="states"> <input type="checkbox" class="checkbox" {if $data.list.length && getStateCount(false)==0}checked="checked" {end} onclick="TodoList.model.toggleAllDone(this.checked)"><span>{getStateCount(false)}/{$data.list.length}</span> </div> <span class="filter"> <a href="javascript:TodoList.setFilter(null)" class="{if $data.filter==null}filter-actived{end}">全部</a> <a href="javascript:TodoList.setFilter(false)" class="{if $data.filter==false}filter-actived{end}">计划中</a> <a href="javascript:TodoList.setFilter(true)" class="{if $data.filter==true}filter-actived{end}">已完成</a> </span> <button class="clearCompleted" onclick="TodoList.model.clearDone()">清除已完成项 ({getStateCount(true)})</button></script></div>

<footer class="footer">Copyrght © 2014 xuld.</footer>

</div>

</article>