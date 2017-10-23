---
version: 0.0.1
author: xuld <xuld@vip.qq.com>
---
# 颜色处理
颜色计算

```html demo doc hide
<input type="color" id="input" value="#ff0000" style="padding: 0">
<br>
<input type="number" id="input_value" step="0.1" min="-1" max="1" value="0.1">
<button onclick="input.value=darken(input.value, +input_value.value)">更暗</button>
<button onclick="input.value=lighten(input.value, +input_value.value)">更亮</button>
<button onclick="input.value=mix(input.value, '#fff', +input_value.value)">更透明</button>
<br>
<input type="color" id="input_mix" value="#0000ff" style="padding: 0">
<button onclick="input.value=mix(input.value, input_mix.value)">混合</button>
```

> ##### 另参考
> -  http://en.wikipedia.org/wiki/HSL_color_space
> - [HSL to RGB color conversion](http://www.rapidtables.com/convert/color/hsl-to-rgb.htm)
> - [RGB to HSL color conversion](http://www.rapidtables.com/convert/color/rgb-to-hsl.htm)