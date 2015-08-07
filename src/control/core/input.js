/**
 * @author xuld
 */

// #require base

/**
 * 表示一个输入框控件。
 */
var Input = Control.extend({

    role: "input",

    /**
	 * 获取当前控件实际用于提交数据的表单域。
	 * @returns {Dom} 一个用于提交表单的数据域。
     * @remark 此函数会在当前控件内搜索可用于提交的表单域，如果找不到，则创建返回一个 input[type=hidden] 表单域。
	 * @protected 
	 * @virtual
	 */
    input: function (value) {

        var me = this;
        if (value === undefined) {

            // 如果当前控件本身就是 INPUT|SELECT|TEXTAREA，则输入域为自身。
            // 否则在控件内部查找合适的输入域。
            // 如果找不到，则创建一个 input:hidden 。
            return me._input || (me._input = me.dom.is("input,select,textarea") ? me.dom : me.dom.find("input,select,textarea").valueOf() || me.dom.parent().append('<input type="hidden" name="' + (me.dom.attr('name') || '') + '">'));
        }
        me._input = value;
        return me;
    },

    /**
     * 获取或设置当前输入框的值。
     * @param {String} [value] 要设置的文本。
     * @returns this
     */
    value: function (value) {
        var text = this.input().text(value);
        return value === undefined ? text : this;
    },

    /**
     * 获取或设置当前输入控件的状态。
     * @param {String} name 要设置的状态名。
     * @param {Boolean} [value=false] 要设置的状态值。
     * @returns {mixed} 返回 @this 或获取的状态值。
     */
    state: function (name, value) {
        var me = this;
        var input = me.input();
        if (value === undefined) {
            return input.attr(name);
        }
        value = value !== false;
        input.attr(name, value || null).toggleClass('x-' + me.role + '-' + name.toLowerCase(), value);
        return me;
    }

});
