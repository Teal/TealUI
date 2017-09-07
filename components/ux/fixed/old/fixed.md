<style>
    body{
        margin:0;
        padding: 0;
    }
    p{
        margin: 0;
        padding: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    .inputNode{
        margin: 16px;
        padding: 8px;
        border: 1px solid #ccc;
    }
    .buttonNode{
        padding:8px;
        background: #2196f3;
        color:#fff;
        border: 0;
        margin-left: 16px;
    }
    .textNode{
        font-size: 24px;
        padding: 16px;
        color: #efefef;
        background: #4c9022;
        margin: 100px 0;
    }
    .fixedNode{
        background: #ff6600; 
        color: #fff; 
        text-align:center;
        width: 100%;
        height: 44px;
        line-height: 44px;
        position: fixed;
        bottom: 0;
    }
</style>
<script src="fixed.ts"></script>
<script>

    window.onload = function() {
        var vp = document.createElement("meta");
        vp.name = "viewport";
        vp.content = "width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no,minimal-ui";
        document.head.append(vp);
    }

    var inputNode = document.createElement('input');
    inputNode.className = "inputNode";
    inputNode.id = "num";
    inputNode.value = 52;
    document.body.append(inputNode);
    var buttonNode = document.createElement('button');
    buttonNode.className = "buttonNode";
    buttonNode.innerHTML = "打乱分4组";
    document.body.append(buttonNode);
    document.getElementsByClassName('buttonNode')[0].addEventListener('click', function() {
        var numberSize = parseInt(document.getElementById('num').value);
        var result = upsetNumber(numberSize);
        for(var k in result) {
            var textNode = document.createElement('p');
            textNode.innerHTML = "当前为 " + (+k+1) + " 组：" + result[k];
            textNode.className = "textNode";
            document.body.append(textNode);
        }
    });

    var fixedNode = document.createElement('div');
    fixedNode.className = "fixedNode";
    fixedNode.innerHTML = "fixed demo";
    document.body.append(fixedNode);
    
    document.getElementsByClassName("inputNode")[0].addEventListener('focus', function() {
        fixed(fixedNode);
    })
 


    function upsetNumber(numberSize) {
        var arr = [];
        var arr2 = [[],[],[],[]];
        for(var i = 0; i < numberSize; i++) {
            arr.push(i);
        }
        for(var j = numberSize; j > 0 ; j--) {
            var t = parseInt(Math.random()*(arr.length - 1));
            arr2[j%4].push(arr[t]);
            arr[t] = arr[arr.length - 1];
            arr.length --;
        }
        return arr2;
    }

    // console.log(arr2);
    // a =  [...arr2[0], ...arr2[1], ...arr2[2], ...arr2[3]]
    // a.sort((x, y)=>x-y);
    // console.log(a)
</script>