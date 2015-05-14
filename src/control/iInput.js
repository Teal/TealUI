/**
 * @author xuld
 */

//#require ../dom/base.js

/**
 * 所有表单输入控件实现的接口。
 * @interface
 */
var IInput = {
	
	/**
	 * 获取当前表单的代理输入域。
	 * @protected
	 * @type {Element}
	 */
	input: null,
	
	/**
	 * 获取当前输入域实际用于提交数据的表单域。
	 * @return {Element} 一个用于提交表单的数据域。
     * @remark 此函数会在当前控件内搜索可用于提交的表单域，如果找不到，则创建返回一个 input[type=hidden] 表单域。
	 * @protected 
	 * @virtual
	 */
	getInput: function () {
        
	    // 如果不存在隐藏域, 则创建一个。
	    // 如果当前控件本身就是 INPUT|SELECT|TEXTAREA|BUTTON，则输入域为自身。
	    // 否则在控件内部查找合适的输入域。
        // 如果找不到，则创建一个 input:hidden 。
	    return this.input || (this.input = /^(INPUT|SELECT|TEXTAREA|BUTTON)$/.test(this.elem.tagName) ? this.elem : Dom.find("input,select,textarea", this.elem) || Dom.append(this.elem, '<input type="hidden" name="' + this.elem.getAttribute('name') + '">'));
	},

	/**
	 * 设置当前输入域的状态, 并改变控件的样式。
     * @param {String} name 状态名。
     * @param {Boolean} value=false 要设置的状态值。
	 * @protected virtual
	 */
	state: function (name, value) {
		Dom.toggleClass(this.elem, this.cssClass + '-' + name, value);
	},
	
	getValue: function () {
	    return this.getInput().value;
	},

	setValue: function (value) {
	    this.getInput().value = value;
		return this;
	},

    /**
     * 获取当前输入控件的状态。
     */
	getState: function (name) {
	    return Dom.hasClass(this.getInput(), ('x-' + this.role + '-' + name).toLowerCase());
	},

    /**
     * 设置当前输入控件的状态。
     */
	setState: function (name, value) {
	    value = value !== false;
	    Dom.toggleClass(this.elem, ('x-' + this.role + '-' + name).toLowerCase(), value !== false);
	    this.getInput()[name] = value;
	    return this;
	}
	
};
