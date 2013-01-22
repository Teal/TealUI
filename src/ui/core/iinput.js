/**
 * @author xuld
 */


using("System.Dom.Base");


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
        
	    // 如果不存在隐藏域, 则创建一个。
	    // 如果当前控件本身就是 INPUT|SELECT|TEXTAREA|BUTTON，则输入域为自身。
	    // 否则在控件内部查找合适的输入域。
        // 如果找不到，则创建一个 input:hidden 。
	    return this.inputProxy || (this.inputProxy = /^(INPUT|SELECT|TEXTAREA|BUTTON)$/.test(this.node.tagName) ? new Dom(this.node) : this.find("input,select,textarea") || Dom.parse('<input type="hidden">').setAttr('name', Dom.getAttr(this.node, 'name')).appendTo(this));
	},

    /**
	 * 设置当前输入域的状态, 并改变控件的样式。
     * @param {String} name 状态名。常用的状态如： disabled、readonly、checked、selected、actived 。
     * @param {Boolean} value=false 要设置的状态值。
	 * @protected virtual
	 */
	state: function (name, value) {
	    this.toggleClass('x-' + this.xtype + '-' + name, value);
	},
	
	/**
	 * 获取当前控件所在的表单。
	 * @return {Dom} 返回当前控件所在的表单的 Dom 对象。
	 */
	form: function () {
		return new Dom(this.input().node.form);
	},

	setAttr: function (name, value) {
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

	    Dom.prototype.setAttr.call(dom, name, value);
	    return this;
	},

	getAttr: function (name, type) {
	    // 几个特殊属性需要对 input() 操作。
	    return Dom.getAttr((/^(disabled|readonly|checked|selected|actived|value|name|form)$/i.test(name) ? this.input() : this).node, name, type);
	},

	getText: function () {
	    return Dom.getText(this.input().node);
	},

	setText: function () {
	    Dom.prototype.setText.apply(this.input(), arguments);
	    return this;
	},
	
	/**
	 * 选中当前控件。
	 * @return this
	 */
	select: function(){
		Dom.prototype.select.apply(this.input(), arguments);
		return this;
	}
	
};