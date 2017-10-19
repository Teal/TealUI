/**
 * @author xuld
 */

//#include ui/form/listbox.css
//#include ui/core/listcontrol.js


/**
 * 表示一个列表框。
 * @extends ListControl
 */
var ListBox = ListControl.implement(IInput).extend({

	cssClass: "x-listbox",

	/**
     * 获取当前高亮项。
     */
	getSelectedItem: function () {
		return Dom.find('.' + this.cssClass + '-selected', this.elem);
	},

    /**
     * 重新设置当前高亮项。
     */
    setSelectedItem: function (item) {
    	var clazz = this.cssClass + '-selected';
    	Dom.query('.' + clazz, this.elem).iterate(Dom.removeClass, [clazz]);

        if(item) {
        	Dom.addClass(item, clazz);
        }

        return this;
    },

    getSelectedIndex: function () {
    	return this.indexOf(this.getSelectedItem());
    },

    setSelectedIndex: function (value) {
    	return this.setSelectedItem(this.item(value));
    },

    /**
	 * 模拟用户选择某一项。
	 */
    selectItem: function (item) {
        if (this.trigger('selecting', item) !== false) {
            var old = this.getSelectedItem();
            this.setSelectedItem(item);

            if (!(old ? old === item : item)) {
                this.trigger('change');
            }
        }
    },

    onItemClick: function(item){
        if(!this.getAttr('disabled') && !this.getAttr('readonly')) {
            this.selectItem(item);
        }
        return false;
    },

    /**
     * 设置当前下拉菜单的所有者。绑定所有者的相关事件。
     */
    init: function () {

        // 绑定下拉菜单的点击事件
        this.itemOn('mousedown', this.onItemClick, this);

    }

});



///**
// * 表示一个列表框。
// * @class
// * @extends ListControl
// * @implements IInput
// */
//var ListBox = ListControl.extend(IInput).implement({
	
//	xtype: 'listbox',
	
//	/**
//	 * 当用户点击一项时触发。
//	 */
//	onItemClick: function (item) {
//		return this.trigger('itemclick', item);
//	},
	
//	/**
//	 * 当一个选项被选中时触发。
//	 */
//	onSelect: function(item){
		
//		// 如果存在代理元素，则同步更新代理元素的值。
//		if(this.formProxy)
//			this.formProxy.value = this.baseGetValue(item);
			
//		return this.trigger('select', item);
//	},
	
//	/**
//	 * 点击时触发。
//	 */
//	onClick: function (e) {
		
//		// 如果无法更改值，则直接忽略。
//		if(this.hasClass('x-' + this.xtype + '-disabled') || this.hasClass('x-' + this.xtype + '-readonly'))
//			return;
			
//		//获取当前项。
//		var item = e.getTarget().closest('li');
//		if(item && !!this.clickItem(item)){
//			return false;
//		}
//	},
	
//	/**
//	 * 底层获取一项的值。
//	 */
//	baseGetValue: function(item){
//		return item ? item.value !== undefined ? item.value : item.getText() : null;
//	},
	
//	/**
//	 * 模拟点击一项。
//	 */
//	clickItem: function(item){
//		if(this.onItemClick(item)){
//			this.toggleSelected(item);
//			return true;
//		}
		
//		return false;
//	},
	
//	init: function(options){
//		var t;
//		if(this.node.tagName === 'SELECT'){
//			t = this.node;
//			this.node = this.create(options);
//			t.parentNode.replaceChild(this.node, t);
//		}
		
//		this.base('init');
			
//		this.on('click', this.onClick);
		
//		if(t)
//			this.copyItemsFromSelect(t);
		
//	},
	
//	// form
	
//	/**
//	 * 反选择一项。
//	 */
//	clear: function () {
//		return this.setSelectedItem(null);
//	},
	
//	/**
//	 * 获取选中项的值，如果每天项被选中，则返回 null 。
//	 */
//	getValue: function(){
//		var selectedItem = this.getSelectedItem();
//		return selectedItem ? this.baseGetValue(selectedItem) : this.formProxy ? this.formProxy.value : null;
//	},
	
//	/**
//	 * 查找并选中指定值内容的项。如果没有项的值和当前项相同，则清空选择状态。
//	 */
//	setValue: function(value){
		
//		// 默认设置为值。
//		if(this.formProxy)
//			this.formProxy.value = value;
			
//		var t;
		
//		this.each(function(item){
//			if(this.baseGetValue(item) === value){
//				t = item;
//				return false;
//			}
//		}, this);
		
//		return this.setSelectedItem(t);
//	},
	
//	copyItemsFromSelect: function(select){
//		if(select.name){
//			this.setName(select.name);
//			select.name = '';
//		}
//		for(var node = select.firstChild; node; node = node.nextSibling) {
//			if(node.tagName  === 'OPTION') {
//				var item = this.add(Dom.getText(node));
					
//				item.value = node.value;
//				if(node.selected){
//					this.setSelectedItem(item);
//				}
//			}
//		}
		
//		if(select.onclick)
//			this.node.onclick = select.onclick;
		
//		if(select.onchange)
//			this.on('change', select.onchange);
		
//	}
	
//});

