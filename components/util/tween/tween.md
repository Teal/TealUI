---
version: 0.0.1
author: xuld <xuld@vip.qq.com>
---
# 补间动画
底层实现补间动画算法，以便实现平滑渐变的效果。

```html demo hide doc
<div style="border: 1px solid #e89109; width: 318px;">
    <div id="box" style="width: 18px; height: 18px; background: #e89109; position: relative;"></div>
</div>
<div id="btn" class="doc" style="margin-top: 1rem;"></div>
<script>
    import Tween from "util/tween";
    import * as transitions from "util/tween/transitions";
    var html = "";
    for (var key in transitions) {
        if (!/^ease/.test(key)) {
            html += '<input type="button" onclick="run(transitions.' + key + ')" value="' + key + '"> ';
            html += '<input type="button" onclick="run(transitions.easeOut(transitions.' + key + '))" value="easeOut(' + key + ')"> ';
            html += '<input type="button" onclick="run(transitions.easeInOut(transitions.' + key + '))" value="easeInOut(' + key + ')"> ';
            html += '<br>';
        }
    }
    btn.innerHTML = html;
    var f = new Tween();
    f.duration = 3000;
    f.set = function (x) {
        box.style.left = 300 * x + 'px';
    };
    window.transitions = transitions;
    window.run = function (transition) {
        if (!f.timer) {
            f.reset();
        }
        f.transition = transition;
        f.start();
    };
</script>
```

> ##### 另参考
> - [[util/tween/transitions]]