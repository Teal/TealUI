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
    import * as timingFunctions from "util/tween/timingFunctions";

    var html = "";
    for (var key in timingFunctions) {
        if (!/^ease/.test(key)) {
            html += `<input type="button" onclick="run(timingFunctions.${key})" value="${key}"> `;
            html += `<input type="button" onclick="run(timingFunctions.easeOut(timingFunctions.${key}))" value="easeOut(${key})"> `;
            html += `<input type="button" onclick="run(timingFunctions.easeInOut(timingFunctions.${key}))" value="easeInOut(${key})"> `;
            html += `<br>`;
        }
    }
    btn.innerHTML = html;

    var tween = new Tween();
    tween.duration = 3000;
    tween.set = (x) => {
        box.style.left = 300 * x + 'px';
    };
    
    export function run(timingFunction) {
        if (!tween.timer) {
            tween.reset();
        }
        tween.timingFunction = timingFunction;
        tween.start();
    }
    
    export { timingFunctions };
</script>
```

> ##### 另参考
> - [[util/tween/timingFunctions]]