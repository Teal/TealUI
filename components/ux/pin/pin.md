---
version: 0.0.1
author: xuld <xuld@vip.qq.com>
---
# 对齐
将元素对应到其它元素的边缘。

```html demo hide doc
<select id="align">
    <option value="leftTop">ll-tb（leftTop）</option>
    <option value="left">ll-cc（left）</option>
    <option value="leftTop">ll-tb（leftTop）</option>
    <option value="leftBottom">ll-bt（leftBottom）</option>
    <option value="rightBottom">lr-bb（rightBottom）</option>
    <option value="right">rr-cc（right）</option>
    <option value="rightTop" selected="selected">rr-tb（rightTop）</option>
    <option value="topRight">rl-tt（topRight）</option>
    <option value="top">cc-tt（top）</option>
    <option value="topLeft">lr-tt（topLeft）</option>
    <option value="bottomLeft">lr-bb（bottomLeft）</option>
    <option value="bottom">cc-bb（bottom）</option>
    <option value="bottomRight">rl-bb（bottomRight）</option>
    <option value="center">cc-cc（center）</option>
    <option value="ll-tt">ll-tt</option>
    <option value="rr-tt">rr-tt</option>
    <option value="ll-bb">ll-bb</option>
    <option value="rr-bb">rr-bb</option>
    <option value="lr-tb">lr-tb</option>
    <option value="rl-tb">rl-tb</option>
    <option value="lr-bt">lr-bt</option>
    <option value="rl-tb">rl-tb</option>
</select>

<div class="doc-box" style="cursor: move;" id="target"></div>
<div class="doc-box doc-box-small doc-box-yellow" id="elem"></div>

<script>
import pin from "ux/pin";
import draggable from "ux/drag";

repin();
function repin(){
    pin(elem, target, align.value);
}

align.onchange = repin;

draggable(target, {
    onDragMove: repin
});
</script>
```
