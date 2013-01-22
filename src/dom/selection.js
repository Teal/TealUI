/**
 * @author sun
 */

//===========================================
//  元素的选区       selection.js       A
//===========================================



(function() {

	function selection(dom){
		
		var s, e, range, stored_range;
		if (dom.selectionStart == undefined) {
			var selection = document.selection;
			if (dom.tagName.toLowerCase() != "textarea") {
				var val = Dom.getText(dom),
				range = selection.createRange().duplicate();
				range.moveEnd("character", val.length);
				s = (range.text == "" ? val.length: val.lastIndexOf(range.text));
				range = selection.createRange().duplicate();
				range.moveStart("character", -val.length);
				e = range.text.length;
			} else {
				range = selection.createRange();
				stored_range = range.duplicate();
				stored_range.moveToElementText(dom);
				stored_range.setEndPoint('EndToEnd', range);
				s = stored_range.text.length - range.text.length;
				e = s + range.text.length;
			}
		} else {
			s = dom.selectionStart;
			e = dom.selectionEnd;
		}
		var te = dom.value.substring(s, e);
		return {
			start: s,
			end: e,
			text: te
		}
		
	}
	
	function setCursor(dom, pos){
		
		if(dom.createTextRange) { 
			var range = dom.createTextRange(); 
			range.move("character", pos); 
			range.select(); 
		} else if(dom.selectionStart) { 
			dom.focus();
			dom.setSelectionRange(pos, pos); 
		} 
		
	}
	
	function setRange(dom, start, end){
		
		if(dom.createTextRange){
			
			var range = dom.createTextRange();
			range.moveStart("character", 0)
			range.moveEnd("character", 0);
			range.collapse(true);
			range.moveEnd("character", end);
			range.moveStart("character", start);
			range.select();
			
		}else if(dom.selectionStart){
			
			dom.focus();
			dom.setSelectionRange(start, end); 
			
		}
		
	}
	
	Dom.implement({
		
		/**
		 * 获取选区区域范围
		 * @return {Object} 返回 {start: 0, end: 3}  对象。
		 */
		getSelectionRange: function(){
		
			var s = selection(this.node);
			
			return{
				start: s.start,
				end: s.end
			}
		
		},
		
		/**
		 * 设置选区区域范围
		 * @param {Object} {start: 0, end: 3} 对象。
		 */
		setSelectionRange: function(arg){
			
			setRange(this.node, arg.start, arg.end);
			
		},
		
		/**
		 * 获取选区文本
		 * @return {String} 选中的文本
		 */
		getSelectedText: function(){
			
			var s = selection(this.node);
			return s.text;
			
		},
		
		/**
		 * 设置选区文本
		 * @param {String} 文本
		 * @param {Boolean} true代表选中插入文本 false表示不选中
		 */
		setSelectedText: function(text, isSelect){
			
			var isSelect = isSelect || false;
			var val = this.getText();
			
			var s = selection(this.node);
			
			var a = val.substring(0,s.start);
			var b = val.substring(s.end);
			
			this.setText(a + text + b);
			
			if(isSelect){
				setRange(this.node, s.start, s.start + text.length);
			}else{
				setCursor(this.node, s.start + text.length);
			}
			
		}
	
	});

})();