## 基本用法

<aside class="doc-demo">

| colA | colB |
| --- | --- |
| A1 | B1 |
| A2 | B2 |

</aside>

## 加载大数据

### 前端加载

<pre>        var data = [];
        for (var i = 0; i < 10000; i++) {
            data.push({
                colA: 'A' + i,
                colB: 'A' + i,
            });
        }
        $('.x-datagridview').dataGridView().pageSize(20).pageNumber(2).data(data);
    </pre>

### 后端加载

<pre>        function ajaxLoadData(pageSize, pageNumber, callback) {
            // 这里使用 setTimeout 模拟后台请求。
            setTimeout(function() {
                callback(data.slice(pageNumber * pageSize, pageSize));
            }, 800);
        } +

        $('.x-datagridview').dataGridView().pageSize(20).pageNumber(2).dataLoader(ajaxLoadData);
    </pre>

## 列信息

### 自定义列数据格式化方式

<pre>        $('.x-datagridview').columns({
            colA: {
                formator: '$ {0}'
            },
            colB: {
                formator: function(text){
                    return '_' + text + '_';
                }
            }
        });
    </pre>

### 自定义列排序规则

<pre>        $('.x-datagridview').columns({
            colB: {
                sort: function(x, y){
                    return x - y;
                }
            }
        });
    </pre>