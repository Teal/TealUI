/**
 * @author xuld
 */

// #require picker
// #require dropdownMenu

/**
 * 表示一个组合框。
 * @extends Picker
 * @example <pre>
 * var comboBox = new ComboBox();
 * comboBox.add("aaa");
 * comboBox.add("bbb");
 * comboBox.setSelectedIndex(0);
 * </pre>
 */
var ComboBox = Picker.extend({

    role: "comboBox",

    initDropDown: function() {
        this.menu = this.dropDown.dom.role('menu');
    },

    /**
	 * 将当前文本的值同步到下拉菜单。
	 * @protected override
	 */
    updateDropDown: function(){
       // this.dropDown.hovering(this.getSelectedItem());
    },
	
    init: function () {
		
        //// 1. 处理 <select>
    	//var selectNode;
		
        //// 如果初始化的时候传入一个 <select> 则替换 <select>, 并拷贝相关数据。
        //if(this.elem.tagName === 'SELECT') {
			
        //	this.selectNode = selectNode = this.elem;
			
        //    // 调用 create 重新生成 dom 。
        //	this.elem = this.create();

        //	// 插入当前节点。
        //	Dom.after(selectNode, this.elem);
			
        //}
		
        //// 2. 初始化文本框
		
        // 初始化文本框
        Picker.prototype.init.apply(this, arguments);
		
        //// 3. 设置默认项
			
        //if (selectNode) {
			
        //    // 让 listBox 拷贝 <select> 的成员。
        //	this.copyItemsFromSelect(selectNode);

        //	// 隐藏 <select> 为新的 dom。
        //	Dom.hide(selectNode);

        //}
		
    },
	
    /**
	 * 模拟用户选择某一个项。
	 */
    selectItem: function (item) {

        var me = this, old;
    	
        if (me.trigger('select', item)) {
            old = me.getValue();
            me.setSelectedItem(item);
            if (old !== me.getValue()) {
                me.trigger('change');
            }
            me.hideDropDown();
        }

        return me;
    },
	
    /**
	 * 设置当前选中的项。
	 * @param {Dom} item 选中的项。
	 * @returns this
	 */
    setSelectedItem: function (item) {
    	this.setValue(item ? Dom.getText(item) : "");
        return this;
    },

    /**
	 * 获取当前选中的项。如果不存在选中的项，则返回 null 。
	 * @returns {Dom} 选中的项。
	 */
    getSelectedItem: function () {
    	var value = this.getValue();
    	var ret = null;
    	this.dropDown.each(function (item) {
    		if (Dom.getText(item) === value) {
    			ret = item;
    			return false;

        	}
        });

    	return ret;
    },
	
    setSelectedIndex: function(value){
        return this.setSelectedItem(this.dropDown.item(value));
    },

    getSelectedIndex: function () {
        return this.dropDown.indexOf(this.getSelectedItem());
    },

    // select
	
    resizeToFitItems: function(){
        var dropDown = this.dropDown,
			oldWidth = Dom.getStyle(dropDown.elem, 'width'),
			oldDisplay = Dom.getStyle(dropDown.elem, 'display');
			
        Dom.setStyle(dropDown.elem, 'display', 'inline-block');
        Dom.setWidth(dropDown.elem, 'auto');
		
        Dom.setSize(Dom.first(this.elem), Dom.getWidth(dropDown.elem));
		
        Dom.setStyle(dropDown.elem, 'width', oldWidth);
        Dom.setStyle(dropDown.elem, 'display', oldDisplay);
        return this;
    },
	
    copyItemsFromSelect: function(select) {
		
    	this.dropDown.empty();
		
        for(var node = select.firstChild; node; node = node.nextSibling) {
            if(node.tagName  === 'OPTION') {
                var item = this.dropDown.add(Dom.getText(node));
				
                Dom.data(item).option = node;
                if(node.selected){
                    this.setSelectedItem(item);
                }
            }
        }
		
        if(select.onclick)
            this.elem.onclick = select.onclick;
		
        if(select.onchange)
        	Dom.on(this.elem, 'change', select.onchange, select);
		
        if(this.autoResize)
        	Dom.setWidth(this.input(), Dom.getWidth(select) - Dom.getWidth(this.button()));
        
        if(Dom.getAttr(select, 'disabled')) {
        	Dom.setAttr(this.elem, 'disabled', true);
        }

        if (Dom.getAttr(select, 'readonly')) {
        	Dom.setAttr(this.elem, 'readonly', true);
        }
		
    }

});
