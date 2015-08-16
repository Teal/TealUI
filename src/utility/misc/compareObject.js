

function compareJson(objX, objY, result) {

    result = result || [];

    // 基础类型

    
    // 对象类型
    for (var key in objY) {
        if (objY[key] !== objX[key]) {
            if (!(key in objX)) {
                result.push({
                    action: 'delete',
                    key: key
                });
                continue;
            }
            compareJson(objX[key], objY[key], result.children = []);
        }
    }
    for (var key in objX) {
        if (!(key in objY)) {
            result.push({
                action: "add",
                key: key
            });
        }
    }


    return result;
}