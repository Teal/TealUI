---
version: 0.0.1
author: xuld <xuld@vip.qq.com>
import:
    - typo/reset
---
<article class="demo">

<aside class="demo">![](../../apps/demo/resources/200x150.png) <script>Dom.imageZoom(Dom.get('imageZoom1'));</script> </aside>

<aside class="demo">![](../../apps/demo/resources/100x100.png) <script>Dom.imageZoom(Dom.get('imageZoom2'), function(url){ return "../../apps/demo/resources/200x150.png"; });</script> </aside>

</article>