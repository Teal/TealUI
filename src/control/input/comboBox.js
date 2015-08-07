/**
 * @author xuld
 */

// #require picker
// #require dropdownMenu

/**
 * 表示一个组合框。
 * @extends Picker
 * @example
 * var comboBox = new ComboBox();
 * comboBox.add("aaa");
 * comboBox.add("bbb");
 * comboBox.setSelectedIndex(0);
 */
var ComboBox = Picker.extend({

    role: "comboBox",

    initDropDown: function () {
        var me = this;
        me.dropDown.dom.on('mouseenter', 'li', function (e) {
            me.selectedItem(this, e);
        });
    },

    /**
	 * 将当前文本的值同步到下拉菜单。
	 * @protected override
	 */
    updateDropDown: function(){
        this.list.selectedItem(this.selectedItem());
    },
	
    init: function () {

        var me = this;
		
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

        // 设置点击选中功能。
        me.dropDown.dom.on('click', function (e) {
            me.selectItem(Dom(e.target).closest("li"));
        });

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
        var me = this;
        if (me.trigger('select', item)) {
            me.selectedItem(item);
            me.trigger('change');
        }
        return me;
    },
	
    /**
	 * 获取或设置当前选中的项。
	 * @param {Dom} item 选中的项。
	 * @returns this 如果不存在选中的项，则返回 null 。
	 */
    selectedItem: function (value) {
        var me = this;
        if (value === undefined) {
            var result = null;
            value = me.value();
            me.list.dom.find("li").each(function (item) {
                if (me.textOf(Dom(item)) === value) {
                    result = Dom(item);
                    return false;
                }
            });
            return result;
        }
        return me.value(me.textOf(Dom(value)));
    },

    /**
     * 获取指定下拉菜单对应的文本。
     * @param {Dom} item 
     * @returns {String} 要获取的文本。 
     */
    textOf: function(item) {
        return item.attr("data-text") || item.text();
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
