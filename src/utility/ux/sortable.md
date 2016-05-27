<article class="demo">

## API

*   AAA
*   BBB
*   CCC
*   DDD

<script>Dom.get('sortable').children().draggable().on('dragend', function (e) { Dom.get('sortable').append(e.draggable.target).setOffset({ x: 0, y: 0 }); });</script></article>