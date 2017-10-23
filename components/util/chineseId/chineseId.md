---
version: 0.0.1
author: xuld <xuld@vip.qq.com>
---
# 中国身份证号
解析中国身份证号中的信息。

```html demo hide doc
<input type="text" id="input" placeholder="输入身份证号" value="152500198909267865" />
<button onclick="output.innerHTML = format(parseChineseId(input.value))">校验中国身份证</button>
<div id="output"></div>
<script>
const provinces = {
    11: "北京",
    12: "天津",
    13: "河北",
    14: "山西",
    15: "内蒙古",
    21: "辽宁",
    22: "吉林",
    23: "黑龙江",
    31: "上海",
    32: "江苏",
    33: "浙江",
    34: "安徽",
    35: "福建",
    36: "江西",
    37: "山东",
    41: "河南",
    42: "湖北",
    43: "湖南",
    44: "广东",
    45: "广西",
    46: "海南",
    50: "重庆",
    51: "四川",
    52: "贵州",
    53: "云南",
    54: "西藏",
    61: "陕西",
    62: "甘肃",
    63: "青海",
    64: "宁夏",
    65: "新疆",
    71: "台湾",
    81: "香港",
    82: "澳门",
    91: "国外"
};
function format(idInfo) {
    return '合法：' + idInfo.valid + 
    '<br>性别：' + (idInfo.sex ? '男' : '女') + 
    '<br>省份：' + (provinces[idInfo.province] || '') + 
    '<br>地级市：' + (idInfo.city || '') + 
    '<br>县级市：' + (idInfo.county || '') + 
    '<br>生日： ' + idInfo.birthday.toLocaleString();
}
</script>
```

> ##### 另参考
> - [身份证编码原理](http://www.ip33.com/shenfenzheng.html)
