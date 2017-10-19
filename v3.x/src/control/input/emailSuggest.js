/**
 * @author xuld
 */

typeof include === "function" && include("suggest");

var EmailSuggest = Suggest.extend({

    role: "emailsuggest",

    mails: "@126.com,@139.com,@163.com,@gmail.com,@hotmail.cn,@hotmail.com,@live.cn,@qq.com,@sina.com,@sohu.com,@vip.163.com,@vip.qq.com,@yahoo.cn,@yahoo.com.cn".split(","),

    init: function () {
        var me = this;
        if (typeof me.mails === "string") {
            me.mails = me.mails.split(",");
        }
        Suggest.prototype.init.call(me);
    },

    /**
	 * 当被子类重写时，负责将当前文本的值同步到下拉菜单。
	 * @protected 
	 * @virtual
	 */
    updateMenu: function () {
        var value = this.value().trim().replace(/@.*$/, "");
        var items = [];
        if (value) {
            for (var i = 0; i < this.mails.length; i++) {
                items.push(value + this.mails[i]);
            }
        }
        this.suggest(items, true, true);
    }

});
