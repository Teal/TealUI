---
version: 0.0.1
author: xuld <xuld@vip.qq.com>
---
# 拖动
允许元素跟随指针移动。

## 基本用法
```html demo {5}
<div id="box" class="doc-box" style="cursor: move"></div>
<script>
    import draggable from "ux/drag";

    draggable(box);
</script>
```

## 事件
拖动过程会依次触发以下事件：
1. `onDragStart`：拖动开始事件。
2. `onDragMove`：拖动移动事件。
3. `onDragEnd`：拖动结束事件。

通过事件函数的第一参数 `e.pageX` 和 `e.pageY` 获取的鼠标位置。
通过事件函数的第二参数 `s.endX` 和 `s.endY` 读写拖动元素的最新位置。

```html demo {6-15}
<div id="box1" class="doc-box" style="cursor: move"></div>
<script>
    import draggable from "ux/drag";

    draggable(box1, {
        onDragStart(){ 
            box1.className += " doc-box-green"; 
        },
        onDragMove(e, s){ 
            box1.innerHTML = s.endX.toFixed(0) + "," + s.endY.toFixed(0); 
        },
        onDragEnd(){ 
            box1.innerHTML = "";
            box1.className = "doc-box"; 
        }
    });
</script>
```

## 手柄
如果设置了 `handle`，则只有点击指定元素才能开始拖动。
如果设置了 `cancel`，则可避免点击指定元素开始拖动。默认地，所有输入框都禁止开始拖动。
```html demo {6,14-16}
<div id="box_handle" class="doc-box"><button id="box_handle_body" style="cursor: move">点我拖动</button></div>
<script>
    import draggable from "ux/drag";

    draggable(box_handle, {
        handle: box_handle_body
    });
</script>
---
<div id="box_cancel" class="doc-box" style="cursor: move"><button id="box_cancel_body" style="cursor: default;">点我不拖</button></div>
<script>
    import draggable from "ux/drag";

    draggable(box_cancel, {
        cancel(e) {
            return e.target === box_cancel_body;
        }
    });
</script>
```

## 自动滚屏
允许拖动时更改滚动条位置。
```html demo {6-8}
<div id="box_scroll" class="doc-box" style="cursor: move"></div>
<script>
    import draggable from "ux/drag";

    draggable(box_scroll, {
        onDragMove(e, s) {
            s.autoScroll();
        }
    });
</script>
```

## 方向
限制拖动的方向。
```html demo {7-9,18-20}
<div id="box_direction_horizontal" class="doc-box" style="cursor: e-resize"></div>
<script>
    import * as dom from "ux/dom";
    import draggable from "ux/drag";

    draggable(box_direction_horizontal, {
        onDragMove(e, s) {
            s.direction("horizontal");
        }
    });
</script>
---
<div id="box_direction_vertial" class="doc-box" style="cursor: n-resize"></div>
<script>
    import * as dom from "ux/dom";
    import draggable from "ux/drag";

    draggable(box_direction_vertial, {
        onDragMove(e, s) {
            s.direction("vertical");
        }
    });
</script>
```

## 区域
限制拖动的范围。
```html demo {7-9}
<div id="box_limit" class="doc-box" style="cursor: move"></div>
<script>
    import * as dom from "ux/dom";
    import draggable from "ux/drag";

    draggable(box_limit, {
        onDragMove(e, s) {
            s.limit(__root__);
        }
    });
</script>
```

## 步长
拖动到一定距离后才移动位置。
```html demo {7-9}
<div id="box_step" class="doc-box" style="cursor: move"></div>
<script>
    import draggable from "ux/drag";

    draggable(box_step, {
        onDragMove(e, s) {
            s.step(50);
        }
    });
</script>
```

## 返回原地
拖动结束后返回原地。
```html demo {7-9}
<div id="box_revert" class="doc-box"></div>
<script>
    import draggable from "ux/drag";

    draggable(box_revert, {
        onDragEnd(e, s) {
            s.revert(300);
        }
    });
</script>
```

## 吸附
允许拖动时吸附指定的位置。
```html demo {7-9}
<div id="box_snap" class="doc-box" style="cursor: move"></div>
<div id="box_snap_target" class="doc-box doc-box-large doc-box-blue"></div>
<script>
    import draggable from "ux/drag";

    draggable(box_snap, {
        onDragMove(e, s) {
            s.snap(box_snap_target);
        }
    });
</script>
```

## 代理
允许拖动时创建移动代理元素。
```html demo {7-27}
<div id="box_proxy" class="doc-box" style="cursor: move"></div>
<script>
    import draggable from "ux/drag";
    import * as dom from "ux/dom";

    draggable(box_proxy, {
        onDragStart(e, s) {
            // 保存实际元素。
            s._original = s.elem;

            // 创建代理元素。
            s.elem = s._original.parentNode.appendChild(document.createElement(s._original.tagName));
            s.elem.className = s._original.className;
            s.elem.innerHTML = s._original.innerHTML;
            s.elem.style.position = "absolute";
            s.elem.style.zIndex = 1000000;
            s.elem.style.opacity = 0.5;
            dom.setRect(s.elem, getRect(s._original));
        },
        onDragEnd(e, s) {
            // 设置实际元素的位置。
            dom.setRect(s._original, getRect(s.elem));

            // 还原实际元素。
            s.elem.parentNode.removeChild(s.elem);
            s.elem = s._original;
        }
    });
</script>
```

## 拖动内部流程
拖动交互的具体流程为：鼠标（手指）按下，然后保持按下动作移动鼠标（手指），最后松开鼠标（手指），其中发生的事件分别为：
1. `handlePointerDown`：当鼠标（手指）按下，开始监听鼠标（手指）松开和移动事件。此时会记录 `startX` 和 `startY` 字段。
2. `startDragging`：当鼠标（手指）按下保持 `delay` 毫秒数（默认 500）或移动距离超过 `distance`（默认 3） 时，认为拖动开始。
3. `dragStart`：记录 `startClientX` 和 `startClientY` 字段。如果函数返回 `false`，则直接进入第 9 步。
4. `onDragStart`：触发拖动开始事件。
5. `handlePointerMove`：鼠标移动时，记录 `endX` 和 `endY` 字段。
6. `dragMove`：计算 `endClientX` 和 `endClientY` 字段。
7. `onDragMove`：触发拖动事件。
8. `handlePointerUp`：鼠标松开时，开始停止拖动。
9. `stopDragging`：停止拖动，解绑所有事件。
10. `dragEnd`：判断拖动是否合理并尝试还原位置。
11. `onDragEnd`：触发拖动结束事件。
