---
version: 0.0.1
author: xuld <xuld@vip.qq.com>
---
# 弹层效果
通过用户操作再显示的交互效果。

## 基本用法
设置元素 `elem` 在用户点击 `target` 后自动弹出：
```html demo {6-8} doc
<button id="target">按钮</button>
<div id="elem" class="doc-box" style="position: fixed; display: none;"></div>
<script>
    import popup from "ux/popup";

    popup(elem, {
        target: target
    });
</script>
```

## 弹层事件
使用 `event` 字段指定触发弹窗的事件。

### 点击事件
- `click`(默认): 点击 `target` 后弹出，点击屏幕空白处消失。
- `auxclick`: 右击 `target` 后弹出，点击屏幕空白处消失。
- `contextmenu`: 作为 `target` 右键菜单后弹出，点击屏幕空白处消失。
- `pointerdown`: 指针在 `target` 按下后弹出，点击屏幕空白处消失。
- `pointerup`: 指针在 `target` 按出后弹出，点击屏幕空白处消失。

```html demo {8,18,28,38} doc
<button id="target_auxclick">按钮</button>
<div id="elem_auxclick" class="doc-box" style="position: fixed; display: none;"></div>
<script>
    import popup from "ux/popup";

    popup(elem_auxclick, {
        target: target_auxclick,
        event: "auxclick"
    });
</script>
---
<button id="target_contextmenu">按钮</button>
<div id="elem_contextmenu" class="doc-box" style="position: fixed; display: none;"></div>
<script>
    import popup from "ux/popup";

    popup(elem_contextmenu, {
        target: target_contextmenu,
        event: "contextmenu"
    });
</script>
---
<button id="target_pointerdown">按钮</button>
<div id="elem_pointerdown" class="doc-box" style="position: fixed; display: none;"></div>
<script>
    import popup from "ux/popup";

    popup(elem_pointerdown, {
        target: target_pointerdown,
        event: "pointerdown"
    });
</script>
---
<button id="target_pointerup">按钮</button>
<div id="elem_pointerup" class="doc-box" style="position: fixed; display: none;"></div>
<script>
    import popup from "ux/popup";

    popup(elem_pointerup, {
        target: target_pointerup,
        event: "pointerup"
    });
</script>
```

### 移动事件
- `pointerenter`: 指针移入 `target`  后自动弹出，移到屏幕空白处消失。
- `hover`: 指针移入 `target` 后自动弹出，移出 `target` 后消失。
- `pointermove`: 指针移入 `target`  后自动弹出，并跟随鼠标移动。

```html demo {8,18,28} doc
<button id="target_pointerenter">按钮</button>
<div id="elem_pointerenter" class="doc-box" style="position: fixed; display: none;"></div>
<script>
    import popup from "ux/popup";

    popup(elem_pointerenter, {
        target: target_pointerenter,
        event: "pointerenter"
    });
</script>
---
<button id="target_hover">按钮</button>
<div id="elem_hover" class="doc-box" style="position: fixed; display: none;"></div>
<script>
    import popup from "ux/popup";

    popup(elem_hover, {
        target: target_hover,
        event: "hover"
    });
</script>
---
<button id="target_pointermove">按钮</button>
<div id="elem_pointermove" class="doc-box" style="position: fixed; display: none;"></div>
<script>
    import popup from "ux/popup";

    popup(elem_pointermove, {
        target: target_pointermove,
        event: "pointermove"
    });
</script>
```

### 聚焦事件
- `active`：指针在 `target` 按下时显示，松开后消失。
- `focus`： `target` 获取焦点后显示，失去焦点后后消失。
- `focusin`：`target` 获取焦点后显示，点击屏幕空白处消失。

```html demo doc
<button id="target_active">按钮</button>
<div id="elem_active" class="doc-box" style="position: fixed; display: none;"></div>
<script>
    import popup from "ux/popup";

    popup(elem_active, {
        target: target_active,
        event: "active"
    });
</script>
---
<button id="target_focus">按钮</button>
<div id="elem_focus" class="doc-box" style="position: fixed; display: none;"></div>
<script>
    import popup from "ux/popup";

    popup(elem_focus, {
        target: target_focus,
        event: "focus"
    });
</script>
---
<button id="target_focusin">按钮</button>
<div id="elem_focusin" class="doc-box" style="position: fixed; display: none;"></div>
<script>
    import popup from "ux/popup";

    popup(elem_focusin, {
        target: target_focusin,
        event: "focusin"
    });
</script>
```

### 自定义事件
手动调用 `popup.show()` 和 `popup.hide()` 显示和隐藏弹层。

```html demo {8,11-14} doc
<button id="target_custom">按钮</button>
<div id="elem_custom" class="doc-box" style="position: fixed; display: none;"></div>
<script>
    import popup from "ux/popup";

    const pop = popup(elem_custom, {
        target: target_custom,
        event: null
    });

    // 自定义绑定键盘事件。
    target_custom.onkeydown = () => {
        pop.show();
    };
</script>
```

## 弹层动画
通过 `animation` 设置弹层的动画。可用的内置动画见[[ux/dom#内置特效]]。
```html demo {8} doc
<button id="target_animation">按钮</button>
<div id="elem_animation" class="doc-box" style="position: fixed; display: none;"></div>
<script>
    import popup from "ux/popup";

    popup(elem_animation, {
        target: target_animation,
        animation: "scaleY"
    });
</script>
```
