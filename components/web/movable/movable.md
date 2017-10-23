---
version: 0.0.1
author: xuld <xuld@vip.qq.com>
---
# 移动效果
所有“按下-移动-松开”交互效果的抽象底层。

## 基本用法
`Movable` 封装了指针“按下-移动-松开”的连续操作，并分别触发 `moveStart`、`move`、`moveEnd` 三个事件（但不移动元素）。

如果在 `move` 事件中改变元素的位置就可以实现经典的移动效果。
`Movable` 是移动、手势、触摸滚动等交互效果的底层实现。

```html demo doc
<div id="elem">摸我</div>
<script>
import movable from "web/movable";

movable(elem, {
    moveStart(){
        console.log("移动开始");
    },
    move(){
        console.log("移动中：", this.offsetX, this.offsetY);
    },
    moveEnd(){
        console.log("移动结束");
    }
})
</script>
```

> ##### 另参考
> - [[web/draggable]]
> - [[web/touchable]]
> - [[web/scrollable]]

## 内部原理
移动交互的具体流程为：
1. `handlePointerDown`：当鼠标（手指）按下时触发。记录 `startX` 和 `startY` 并开始监听鼠标（手指）松开和移动事件。
2. `init`：当鼠标（手指）按下保持 `delay` 毫秒数或移动距离超过 `distance` 时，认为移动开始。
3. `moveStart`：触发开始移动事件。
4. `handlePointerMove`：当鼠标（手指）移动时触发。记录 `endX` 和 `endY` 字段。
5. `move`：触发移动事件。
6. `handlePointerUp`：当鼠标（手指）松开时触发。
7. `uninit`：解绑鼠标（手指）松开和移动事件。
8. `moveEnd`：触发移动结束事件。
