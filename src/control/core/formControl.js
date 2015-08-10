/**
 * @author xuld
 */

typeof include === "function" && include("control");

/**
 * 表示一个表单控件。
 * @abstract
 * @class
 * @extends Control
 */
var FormControl = Control.extend({

    /**
	 * 当被子类重写时，负责获取当前控件实际用于提交数据的表单域。
	 * @returns {Dom} 一个用于提交表单的数据域。
     * @remark 此函数的默认实现会在当前控件内搜索可用于提交的表单域，如果找不到，则创建返回一个 input[type=hidden] 表单域。
	 * @protected 
	 * @virtual
	 */
    getInput: function () {

        var me = this;

        // 如果当前控件本身就是 input,select,textarea，则输入域为自身。
        // 否则在控件内部查找 input,select,textarea。
        // 如果找不到，则创建一个 input:hidden 。
        return Dom(me.input).valueOf() || (me.input = me.dom.is("input,select,textarea") ? me.dom : me.dom.find("input,select,textarea").valueOf() || me.dom.after('<input type="hidden" name="' + (me.dom.attr('name') || '') + '">'));
    },

    /**
     * 当被子类重写时，负责获取或设置当前输入框的值。
     * @param {String} [value] 要设置的文本。
     * @returns {mixed} this
	 * @virtual
     */
    value: function (value) {
        var text = this.getInput().text(value);
        return value === undefined ? text : this;
    },

    /**
     * 当被子类重写时，负责获取或设置当前输入控件的状态。
     * @param {String} name 要设置的状态名。
     * @param {Boolean} [value=false] 要设置的状态值。
     * @returns {mixed} 返回 @this 或获取的状态值。
	 * @virtual
     */
    state: function (name, value) {
        var me = this;
        var input = me.getInput();
        if (value === undefined) {
            return input.attr(name);
        }
        value = value !== false;
        input.attr(name, value || null).toggleClass('x-' + me.role + '-' + name.toLowerCase(), value);
        return me;
    }

});
