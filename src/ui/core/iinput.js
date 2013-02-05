/**
 * @author xuld
 */

include("dom/base.js");

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
	inputProxy: null,
	
	/**
	 * 获取当前输入域实际用于提交数据的表单域。
	 * @return {Dom} 一个用于提交表单的数据域。
     * @remark 此函数会在当前控件内搜索可用于提交的表单域，如果找不到，则创建返回一个 input[type=hidden] 表单域。
	 * @protected virtual
	 */
	input: function () {
		
		if(!this.inputProxy) {
			this.inputProxy = /^(INPUT|SELECT|TEXTAREA|BUTTON)$/.test(this.dom[0].tagName) ? this.dom : (Dom.get(this.dom.find("input,select,textarea")) || Dom.parse('<input type="hidden">').setAttribute('name', Dom.getAttribute(this[0], 'name')).appendTo(this));
		}
        
	    // 如果不存在隐藏域, 则创建一个。
	    // 如果当前控件本身就是 INPUT|SELECT|TEXTAREA|BUTTON，则输入域为自身。
	    // 否则在控件内部查找合适的输入域。
        // 如果找不到，则创建一个 input:hidden 。
	    return this.inputProxy;
	},
	
	/**
	 * 获取当前控件所在的表单。
	 * @return {Dom} 返回当前控件所在的表单的 Dom 对象。
	 */
	form: function () {
		return new Dom(this.input()[0].form);
	},

	setAttribute: function (name, value) {
	    var dom = this;

	    // 一些状态属性需执行 state() 
        // 几个特殊属性需要对 input() 操作。
	    if (/^(disabled|readonly|checked|selected|actived)$/i.test(name)) {
	        value = value !== false;
	        this.state(name.toLowerCase(), value);
	        dom = this.input();
	    } else if (/^(value|name|form)$/i.test(name)) {
	        dom = this.input();
	    }

	    this.dom.setAttribute(name, value);
	    return this;
	},

	getAttribute: function (name, type) {
	    // 几个特殊属性需要对 input() 操作。
	    return this.dom.getAttribute((/^(disabled|readonly|checked|selected|actived|value|name|form)$/i.test(name) ? this.input() : this)[0], name, type);
	}
	
};