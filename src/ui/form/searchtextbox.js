


include("ui/form/textbox.css");
include("ui/suggest/searchtextbox.css");
include("ui/suggest/picker.js");


var SearchTextBox = Picker.extend({
	
	xtype: 'searchtextbox',
	
	tpl: '<span class="ui-picker">\
				<input type="text" class="ui-textbox ui-searchtextbox"/>\
			</span>',
		
	menuButtonTpl: '<button class="ui-searchtextboui-search"></button>',
	
	onKeyDown: function(e){
		if(e.keyCode === 10 || e.keyCode === 13){
		    this.search();
		}
	},

	search: function () {

	    var text = this.getText();
	    if (text) {
	        this.onSearch(text);
	        this.trigger('search', text);
	    }


	},
	
	onSearch: Function.empty,
	
	init: function(){
		
		// 如果是 <input> 或 <a> 直接替换为 ui-picker
		if(!this.first() && !this.hasClass('ui-picker')) {
			var elem = this.node;
			
			// 创建 ui-picker 组件。
			this.node = Dom.createNode('span', 'ui-picker');
			
			// 替换当前节点。
			if(elem.parentNode){
				elem.parentNode.replaceChild(this.node, elem);
			}
			
			// 插入原始 <input> 节点。
			this.prepend(elem);
		}
		
		// 如果没有下拉菜单按钮，添加之。
		if(!this.button()) {
			this.append(this.menuButtonTpl);
		}
		
		var textBox = this.input();
		textBox.on('focus', textBox.select);
		
		this.button().on('click', this.search, this);
		textBox.on('keydown', this.onKeyDown, this);
		
		if(navigator.isIE6){
			textBox.on('keypress', this.onKeyDown, this);
		}
	}
});




