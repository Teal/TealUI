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
    import draggable from "web/draggable";

    draggable(box);
</script>
```

## 事件
拖动过程会依次触发以下事件：
1. `onDragStart`：拖动开始事件。
2. `onDragMove`：拖动移动事件。
3. `onDragEnd`：拖动结束事件。

通过事件函数的第一参数 `e.pageX` 和 `e.pageY` 获取的鼠标位置。
通过事件函数的第二参数 `s.offsetX` 和 `s.offsetY` 获取拖动的距离。

```html demo {6-15}
<div id="box1" class="doc-box" style="cursor: move"></div>
<script>
    import draggable from "web/draggable";

    draggable(box1, {
        onDragStart(){ 
            box1.className += " doc-box-green"; 
        },
        onDragMove(e, s){ 
            box1.innerHTML = s.offsetX.toFixed(0) + "," + s.offsetY.toFixed(0); 
        },
        onDragEnd(){ 
            box1.innerHTML = "";
            box1.className = "doc-box"; 
        }
    });
</script>
```

## 局部拖动
如果不希望点击元素任意位置都能开始拖动：
- 仅特定位置可以拖动：对该位置设置拖动，并将 `proxy` 设为整个元素。
- 仅有些位置不可拖动：使用 `cancel` 排除不希望拖动的位置。默认所有输入框都会被排除。
```html demo {6,14-16}
<div id="box_handle" class="doc-box"><button id="box_handle_body" style="cursor: move">点我拖动</button></div>
<script>
    import draggable from "web/draggable";

    draggable(box_handle_body, {
        proxy: box_handle
    });
</script>
---
<div id="box_cancel" class="doc-box" style="cursor: move"><button id="box_cancel_body" style="cursor: default;">点外拖动</button></div>
<script>
    import draggable from "web/draggable";

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
    import draggable from "web/draggable";

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
    import * as dom from "web/dom";
    import draggable from "web/draggable";

    draggable(box_direction_horizontal, {
        onDragMove(e, s) {
            s.direction("horizontal");
        }
    });
</script>
---
<div id="box_direction_vertial" class="doc-box" style="cursor: n-resize"></div>
<script>
    import * as dom from "web/dom";
    import draggable from "web/draggable";

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
    import * as dom from "web/dom";
    import draggable from "web/draggable";

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
    import draggable from "web/draggable";

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
<div id="box_revert" class="doc-box" style="cursor: move"></div>
<script>
    import draggable from "web/draggable";

    draggable(box_revert, {
        onDragEnd(e, s) {
            s.revert();
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
    import draggable from "web/draggable";

    draggable(box_snap, {
        onDragMove(e, s) {
            s.snap(box_snap_target);
        }
    });
</script>
```

## 代理
允许拖动时创建移动代理元素。
```html demo {7-24}
<div id="box_proxy" class="doc-box" style="cursor: move"></div>
<script>
    import draggable from "web/draggable";
    import * as dom from "web/dom";

    draggable(box_proxy, {
        onDragStart(e, s) {
            // 创建代理元素。
            s.proxy = s.elem.parentNode.appendChild(document.createElement(s.elem.tagName));
            s.proxy.className = s.elem.className;
            s.proxy.innerHTML = s.elem.innerHTML;
            s.proxy.style.position = "absolute";
            s.proxy.style.zIndex = 1000000;
            s.proxy.style.opacity = 0.5;
            dom.setRect(s.proxy, getRect(s.elem));
        },
        onDragEnd(e, s) {
            // 设置实际元素的位置。
            dom.setRect(s.elem, getRect(s.proxy));

            // 删除代理元素。
            s.proxy.parentNode.removeChild(s.proxy);
            s.proxy = s.elem;
        }
    });
</script>
```
