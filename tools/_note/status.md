已完成
--------------------------------------------
utility/text/

待测试
--------------------------------------------




生成的目标：


object: 

export function ss(){}

默认生成为： Object.ss = ss
    如果 ss 的第一个参数为 _this，则生成原型函数：
    Object.prototype.ss = ss (同时更改代码中 _this 为 this)
如果 ss 有 @since ES5 和 6 则生成 Object.ss = Object.ss || ss 。
如果 ss 有 @since ES4 则生成 /*@cc_on */ 代码
如果 名字是 ss_simple 则支持为 ss。

