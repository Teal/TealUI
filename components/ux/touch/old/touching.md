<div id="elem" class="doc-box"><a>#elem</a></div>

## 滑动 <small>(源码: [utility/dom/swipe.js](../../utility/dom/swipe.js))</small>

| API | 描述 | 示例 |
| `_dom_.swippable` | 旋转指定对象 | 

<pre>var elem = document.getElementById('elem');
                var log = document.getElementById('log');
                elem.swippable({
                    onSwipeStart: function () {
                        log.innerHTML = '开始滑动';
                    }, 
                    onSwipeMove: function () {
                        if (this.state === 1) {
                            log.innerHTML = '正在水平滑动：' + this.endX;
                        } else {
                            log.innerHTML = '正在垂直滑动：' + this.endY;
                        }
                    },
                    onTap: function() {
                        log.innerHTML = '按下';
                    },
                    onLongTap: function () {
                        log.innerHTML = '长按';
                    },
                    onShortTap: function () {
                        log.innerHTML = '短按';
                    },
                    onSwipeEnd: function () {
                        log.innerHTML = '滑动结束';
                    }
        });</pre>

 |

## 转动 <small>(源码: [utility/dom/touchRotate.js](../../utility/dom/touchRotate.js))</small>

| API | 描述 | 示例 |
| `_dom_.scrollTo` | 旋转指定对象 | 

<pre>$("#elem").touchRotate({

                touchMove: function(radius){

                }

            });</pre>

 |