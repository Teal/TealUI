---
version: 0.0.1
author: xuld <xuld@vip.qq.com>
---
# 颜色处理
颜色处理
<input type="color" id="color1"> <input type="color" id="color2"> <input type="button" value="叠加" onclick="document.getElementById('color3').value = new Color(document.getElementById('color1').value).mix(new Color(document.getElementById('color2').value), .5).toString()"> <input type="color" id="color3" readonly="">
