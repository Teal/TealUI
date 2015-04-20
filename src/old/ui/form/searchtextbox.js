/**
 * @author xuld
 */

//#include ui/form/textbox.css
//#include ui/form/searchtextbox.css
//#include ui/suggest/picker.js

var SearchTextBox = Picker.extend({
	
	cssClass: 'x-searchtextbox',
	
	tpl: '<span class="x-picker">\
				<input type="text" class="x-textbox {cssClass}"/>\
			</span>',
		
	menuButtonTpl: '<button type="button" class="{cssClass}-search"></button>',
	
	onKeyDown: function(e){
		if(e.keyCode === 10 || e.keyCode === 13){
		    this.search();
		}
	},

	search: function () {

	    var text = this.getValue();
	    if (text) {
	        this.onSearch(text);
	        this.trigger('search', text);
	    }


	},
	
	onSearch: Function.empty,
	
	init: function(){
		
		// 如果是 <input> 或 <a> 直接替换为 x-picker
		if (!Dom.first(this.elem) && !Dom.hasClass(this.elem, 'x-picker')) {
			var elem = this.elem;
			
			// 创建 x-picker 组件。
			this.elem = Dom.parseNode('<span class="x-picker"></span>');
			
			// 替换当前节点。
			if(elem.parentNode){
				elem.parentNode.replaceChild(this.elem, elem);
			}
			
			// 插入原始 <input> 节点。
			Dom.prepend(this.elem, elem);
		}
		
		// 如果没有下拉菜单按钮，添加之。
		if(!this.button()) {
			Dom.append(this.elem, String.format(this.menuButtonTpl, this));
		}
		
		var textBox = this.input();
		Dom.on(textBox, 'focus', textBox.select, textBox);
		
		Dom.on(this.button(), 'click', this.search, this);
		Dom.on(textBox, 'keydown', this.onKeyDown, this);
		
		if(navigator.isIE6){
			Dom.on(textBox, 'keypress', this.onKeyDown, this);
		}
	}
});




