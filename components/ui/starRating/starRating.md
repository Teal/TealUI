---
version: 0.0.1
author: xuld <xuld@vip.qq.com>
import:
    - typo/reset
---
# 星级评分

## 基本用法

```htm
<StarRating />
```
<article>

## 只读模式

<aside class="doc-demo"></aside>

## 正常模式

<aside class="doc-demo"><a class="x-star x-star-active"></a><a class="x-star"></a>

<div class="x-starrating-do x-clear x-relative" read-only=""><input id="x-starrating-do-result" type="hidden" value="80" x-grade="推荐"> <span class="x-left">请您评分：</span>

*   [20](javascript:; "很差")
*   [40](javascript:; "较差")
*   [60](javascript:; "还行")
*   [80](javascript:; "推荐")
*   [100](javascript:; "力荐")

<span id="x-starrating-grade" class="x-starrating-grade"></span></div>

<script>Starrating.init();</script></aside>

</article>