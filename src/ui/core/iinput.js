/**
 * @author xuld
 */

//#include dom/base.js

/**
 * 所有表单输入控件实现的接口。
 * @interface IInput
 */
var IInput = {
	
	/**
	 * 获取或设置当前表单的代理输入域。
	 * @protected
	 * @type {Dom}
	 */
	inputNode: null,
	
	/**
	 * 获取当前输入域实际用于提交数据的表单域。
	 * @return {Dom} 一个用于提交表单的数据域。
     * @remark 此函数会在当前控件内搜索可用于提交的表单域，如果找不到，则创建返回一个 input[type=hidden] 表单域。
	 * @protected virtual
	 */
	input: function () {
        
	    // 如果不存在隐藏域, 则创建一个。
	    // 如果当前控件本身就是 INPUT|SELECT|TEXTAREA|BUTTON，则输入域为自身。
	    // 否则在控件内部查找合适的输入域。
        // 如果找不到，则创建一个 input:hidden 。
		return this.inputNode || (this.inputNode = /^(INPUT|SELECT|TEXTAREA|BUTTON)$/.test(this.elem.tagName) ? this.elem : Dom.find("input,select,textarea", this.elem) || Dom.append(this.elem, '<input type="hidden" name="' + Dom.getAttr(this.elem, "name") + '">'));
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
	
	/**
	 * 获取当前控件所在的表单。
	 * @return {Dom} 返回当前控件所在的表单的 Dom 对象。
	 */
	form: function () {
		return this.input().form;
	},

	getValue: function () {
		return Dom.getText(this.input());
	},

	setValue: function (value) {
		Dom.setText(this.input(), value);
		return this;
	},

	getAttr: function (name, type) {
		return Dom.getAttr(this.input(), name, type);
	},

	setAttr: function (name, value) {

	    // 一些状态属性需执行 state() 
        // 几个特殊属性需要对 input() 操作。
	    if (/^(disabled|readonly|checked|selected|actived|hover)$/i.test(name)) {
	        value = value !== false;
	        this.state(name.toLowerCase(), value);
	    }

	    Dom.setAttr(this.input(), name, value);
	    return this;
	}
	
};
