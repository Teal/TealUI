///*// 启用光标。
//// 令 IOS 支持为普通节点添加可点击支持。
//// 参考 https://developer.mozilla.org/en-US/docs/Web/Events/click#Safari_Mobile 。
//.x-pointer {
//    cursor: pointer;
//}*/
//<dd><code>x-pointer</code>: 设置鼠标手势</dd>


//    ///**
//    // * 设置当前组件的选项。
//    // * @param {Object} options 要设置的选项。
//    // * @returns this
//    // */
//    //set: function(options, initing) {
//    //},
    
/////**
//// * 创建一个节点属性。
//// * @returns {} 
//// */
////Control.prop = function (parser, defaultValue) {
////    parser = parser || function (value) { return value; };
////    var propValue;
////    return function (value) {
////        var me = this;
////
////        // 设置属性。
////        if (value !== undefined) {
////            propValue = parser.call(me, propValue);
////            return me;
////        }
////
////        // 获取默认属性。
////        if (propValue === undefined) {
////            propValue = defaultValue ? null : defaultValue.call(me);
////        }
////
////        // 返回属性。
////        return propValue;
////    };
////};
