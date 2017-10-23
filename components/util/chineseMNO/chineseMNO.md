---
version: 0.0.1
author: xuld <xuld@vip.qq.com>
---
# 中国移动运营商
获取手机号码所属的移动运营商。

```html demo doc hide
<input type="text" pattern="\d{13}" id="input" placeholder="输入手机号">
<button onclick="check()">识别运营商</button>
<span id="output"></span>
<script>
function check() {
    output.innerHTML = {
        chinaMobile: "中国移动",
        chinaUnion: "中国联通",
        chinaTelcom: "中国电信",
        unknown: "未知"
    }[getMNO(input.value)];
}
</script>
```