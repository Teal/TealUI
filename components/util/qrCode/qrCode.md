---
version: 0.0.1
author: xuld <xuld@vip.qq.com>
jsdoc: false
exportDefault: QRCode
---
# 二维码
纯 JavaScript 生成二维码。

```html demo doc hide
<input type="text" id="input" placeholder="输入文本或网址" value="" style="width: 20rem" />
<button onclick="genQRCode()">生成二维码</button>
<div id="output"></div>
<script>
    function genQRCode(){
        output.innerHTML = "";
        qrcode = new QRCode(output, {
            text: input.value,
            width: 128,
            height: 128,
            colorDark : "#000000",
            colorLight : "#ffffff",
            correctLevel : QRCode.CorrectLevel.H
        });
    }
</script>
```

> ##### 另参考
> - https://github.com/davidshimjs/qrcodejs
