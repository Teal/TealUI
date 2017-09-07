---
version: 0.0.1
author: xuld <xuld@vip.qq.com>
---
# 拖放
监听拖动事件

```html demo doc
<div id="drag" class="doc-box doc-box-small" style="cursor: move;"></div>
<div id="drop" style="height: 60px; border: 1px solid #C6D880"></div>
<script>
    import draggable from "ux/drag";
    import droppable from "ux/drop";

    // 令滑块可拖动。
    draggable(drag); 

    // 令容器可拖放。
    droppable(drop, {
        onDragEnter(draggable) {
            drop.style.borderColor = "teal";
        },
        onDragLeave(draggable) {
            drop.style.borderColor = "#C6D880";
        },
        onDrop(draggable) {
            drag.className += " doc-box-red";
        },
        onDragStart(draggable){
            drag.className = "doc-box doc-box-small";
        }
    });
</script>
```
