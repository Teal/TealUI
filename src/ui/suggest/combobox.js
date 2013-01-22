/**
 * @author xuld
 */

include("ui/suggest/picker.js");
include("ui/suggest/dropdownmenu.js");

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

    /**
	 * 当前控件是否为列表形式。如果列表模式则优先考虑使用下拉菜单。
     * @config {Boolean}
	 */
    listMode: false,
	
    xtype: 'combobox',
	
    autoResize: true,
	
    /**
	 * 创建当前 Picker 的菜单。
	 * @return {Control} 下拉菜单。
	 * @protected override
	 */
    createDropDown: function (existDom) {
        return new DropDownMenu({
            node: existDom,
            owner: this,
            selectMethod: 'selectItem'
        });
    },
	
    /**
	 * 将当前文本的值同步到下拉菜单。
	 * @protected override
	 */
    updateDropDown: function(){
        this.dropDown.hovering(this.getSelectedItem());
    },
	
    init: function (options) {
		
        // 1. 处理 <select>
        var selectDom;
		
        // 如果初始化的时候传入一个 <select> 则替换 <select>, 并拷贝相关数据。
        if(this.node.tagName === 'SELECT') {
			
            this.selectDom = selectDom = new Dom(this.node);
			
            // 调用 create 重新生成 dom 。
            this.node = this.create();
			
        }
		
        // 2. 初始化文本框
		
        // 初始化文本框
        this.base('init');
		
        // 3. 设置默认项
			
        if(selectDom) {
			
            // 让 listBox 拷贝 <select> 的成员。
            this.copyItemsFromSelect(selectDom);
			
            // 隐藏 <select> 为新的 dom。
            selectDom.hide();

            // 插入当前节点。
            selectDom.after(this);
        }
		
    },
	
    /**
	 * 模拟用户选择某一个项。
	 */
    selectItem: function (item) {

        var me = this, old;
    	
        if (me.trigger('selecting', item)) {
            old = me.getText();
            me.setSelectedItem(item);
            if (old !== me.getText()) {
                me.trigger('change');
            }
            me.hideDropDown();
        }

        return me;
    },
	
    /**
	 * 设置当前选中的项。
	 * @param {Dom} item 选中的项。
	 * @return this
	 */
    setSelectedItem: function (item) {
        this.setText(item ? item.getText() : "");
        return this;
    },

    /**
	 * 获取当前选中的项。如果不存在选中的项，则返回 null 。
	 * @return {Dom} 选中的项。
	 */
    getSelectedItem: function () {
        var value = this.getText();
        return this.dropDown.child(function (dom) {
            return Dom.getText(dom) === value;
        });
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
			oldWidth = dropDown.getStyle('width'),
			oldDisplay = dropDown.getStyle('display');
			
        dropDown.setStyle('display', 'inline-block');
        dropDown.setWidth('auto');
		
        this.first().setSize(dropDown.getWidth());
		
        dropDown.setStyle('width', oldWidth);
        dropDown.setStyle('display', oldDisplay);
        return this;
    },
	
    copyItemsFromSelect: function(select) {
		
        this.dropDown.empty();
		
        for(var node = select.node.firstChild; node; node = node.nextSibling) {
            if(node.tagName  === 'OPTION') {
                var item = this.dropDown.add(Dom.getText(node));
				
                item.dataField().option = node;
                if(node.selected){
                    this.setSelectedItem(item);
                }
            }
        }
		
        if(select.node.onclick)
            this.node.onclick = select.node.onclick;
		
        if(select.node.onchange)
            this.on('change', select.node.onchange);
		
        if(this.autoResize)
            this.setWidth(select.getWidth());
        
        if(select.getAttr('disabled')) {
            this.setAttr('disabled', true);
        }

        if (select.getAttr('readonly')) {
            this.setAttr('readonly', true);
        }
		
    }

});

ListControl.aliasMethods(ComboBox, 'dropDown');

