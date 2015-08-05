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
	 * 获取当前输入域实际用于提交数据的表单域。
	 * @returns {Element} 一个用于提交表单的数据域。
     * @remark 此函数会在当前控件内搜索可用于提交的表单域，如果找不到，则创建返回一个 input[type=hidden] 表单域。
	 * @protected 
	 * @virtual
	 */
    input: function () {

        // 如果不存在隐藏域, 则创建一个。
        // 如果当前控件本身就是 INPUT|SELECT|TEXTAREA|BUTTON，则输入域为自身。
        // 否则在控件内部查找合适的输入域。
        // 如果找不到，则创建一个 input:hidden 。
        return this.inputDom || (this.inputDom = this.dom.is("input,select,textarea,button") ? this.dom : this.dom.find("input,select,textarea") || this.dom.append('<input type="hidden" name="' + (this.dom.attr('name') || '') + '">'));
    },

    /**
     * 获取或设置当前输入框的值。
     */
    value: function (value) {
        var text = this.input().text(value);
        return value === undefined ? text : this;
    },

    /**
     * 获取或设置当前输入控件的状态。
     * @param {String} name 状态名。
     * @param {Boolean} value=false 要设置的状态值。
     */
    state: function (name, value) {
        var className = 'x-' + role + '-' + state.toLowerCase();
        var input = this.input();
        if (value === undefined) {
            return input.is('.' + className);
        }
        input.toggleClass(className, value).attr(name, value);
        return this;
    }

});
