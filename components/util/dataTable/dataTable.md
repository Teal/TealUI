---
version: 0.0.1
author: xuld <xuld@vip.qq.com>
---
# 数据表
数据表
## 数据表

<pre>        // 创建包含两列的表格。
        var dt = new DataTable({
            id: { type: 'number'  },
            name: { type: 'string'  }
        });
        // 为表格添加两行数据。
        dt.add({ id: 1, name: "a" });
        dt.add({ id: 3, name: "b" });

        // 为表格基于某列排序。
        dt.sort("name");

        // 获取指定行的内容。
        alert(dt[0].id);
    </pre>
