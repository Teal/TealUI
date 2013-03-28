//===========================================
//  事件对象   event.js  A
//===========================================

var DomEvent = Class({
	
	constructor: function(event) {
		var doc = window.document;
		event = event || window.event;
		if (event.$extended) return event;
		this.$extended = true;
		var type = event.type, target = event.target || event.srcElement, page = {}, client = {}, related = null, rightClick, wheel, code, key;
		while (target && target.nodeType == 3) 
			target = target.parentNode;
		
		if (type.indexOf('key') != -1) {
			code = event.which || event.keyCode;
			key = Object.keyOf(Event.Keys, code);
			if (type == 'keydown') {
				var fKey = code - 111;
				if (fKey > 0 && fKey < 13) key = 'f' + fKey;
			}
			if (!key) key = String.fromCharCode(code).toLowerCase();
		} else if ((/click|mouse|menu/i).test(type)) {
			doc = (!doc.compatMode || doc.compatMode == 'CSS1Compat') ? doc.html : doc.body;
			page = {
				x: (event.pageX != null) ? event.pageX : event.clientX + doc.scrollLeft,
				y: (event.pageY != null) ? event.pageY : event.clientY + doc.scrollTop
			};
			client = {
				x: (event.pageX != null) ? event.pageX - win.pageXOffset : event.clientX,
				y: (event.pageY != null) ? event.pageY - win.pageYOffset : event.clientY
			};
			if ((/DOMMouseScroll|mousewheel/).test(type)) {
				wheel = (event.wheelDelta) ? event.wheelDelta / 120 : -(event.detail || 0) / 3;
			}
			rightClick = (event.which == 3) || (event.button == 2);
			if ((/over|out/).test(type)) {
				related = event.relatedTarget || event[(type == 'mouseover' ? 'from' : 'to') + 'Element'];
				var testRelated = function() {
					while (related && related.nodeType == 3) 
						related = related.parentNode;
					return true;
				};
				var hasRelated = (Browser.firefox2) ? testRelated.attempt() : testRelated();
				related = (hasRelated) ? related : null;
			}
		} else if ((/gesture|touch/i).test(type)) {
			this.rotation = event.rotation;
			this.scale = event.scale;
			this.targetTouches = event.targetTouches;
			this.changedTouches = event.changedTouches;
			var touches = this.touches = event.touches;
			if (touches && touches[0]) {
				var touch = touches[0];
				page = {
					x: touch.pageX,
					y: touch.pageY
				};
				client = {
					x: touch.clientX,
					y: touch.clientY
				};
			}
		}
		
		Object.append(this, {
			dom: event,
			type: type,
			
			pageX: page.x,
			pageY: page.y,
			clientX: client.x,
			clientY: client.y,
			contextMenu: rightClick,
			
			wheel: wheel,
			
			relatedTarget: document.id(related),
			target: document.id(target),
			
			charCode: code,
			keyCode: key,
			
			shiftKey: event.shiftKey,
			ctrlKey: event.ctrlKey,
			altKey: event.altKey,
			metaKey: event.metaKey
		});
		
		
	},
	
	preventDefault: function(){
		this.defaultPrevented = true;
		return this.node.preventDefault();
	},
	
	stopPropagation: function(){
		return this.node.stopPropagation();
	},
	
	stop: function(){
		this.preventDefault();
		this.stopPropagation();
	}
	
});

DomEvent.getCurrentEvent = navigator.isIE || navigator.isOpera ? function(){
	return window.event;
} : function(){
	var fn = arguments.callee.caller;
	while(fn){
		var arg0 = f.arguments[0];
		if(arg0 && args0.preventDefault && args0.stopPropagation){
			return new JPlus.DomEvent(arg0);
		}
		fn = fn.caller;
	}
	
	return null;
};

