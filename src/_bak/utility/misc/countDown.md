# 倒计时

## 基本用法

### 倒计时：N 天 N 小时 N 分 N 秒

```demo
<span id="timeCounter1"></span>
<script>
    countDown(new Date('2020/1/1'), function (day, hour, minute, second, leftTime) {
        document.getElementById('timeCounter1').innerHTML = '还有 ' + day + ' 天 ' + hour + ' 小时 ' + minute + ' 分 ' + second + ' 秒';
    });
</script>
```