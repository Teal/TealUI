/**
 * @author 
 */


include("dom/base.js");

window.DomHelper = (function () {

    var $ = function (selector) {
        var nodelist = Dom.query(selector);
        nodelist.selector = selector;
        return nodelist;
    };
	
    var fn = $.fn = $.prototype = DomList.prototype;

    // attr css
	
	Object.each({
	
		attr: 0,
	
		css: 'style'
			
	}, function(value, key) {
	
		value = (value || key).capitalize();
		var getter = 'get' + value;
		var setter = 'set' + value;
			
		fn[key] = function(key, value) {
			if(value === undefined){
			    if (key && typeof key === 'object') {
					for(value in key){
						this[setter](key, key[value]);	
					}
					
					return this;
				}
				return this[getter](key);
			}
			return this[setter](key, value);
		};
		
	});

    // html width height offset position val text
	
	Object.each({
	
	    html: 0,

	    val: 'text',

	    text: 0,

		width: 0,
	
		height: 0,
	
		offset: 0,

		scroll: 0,

		size: 0,
	
		position: 0
			
	}, function(value, key) {
	
		value = (value || key).capitalize();
		var getter = 'get' + value;
		var setter = 'set' + value;
			
		fn[key] = function(value) {
			if(value === undefined){
				return this[getter](key);
			}
			return this[setter](key);
		};
		
	});

    // click ...
	
	Object.each(Dom.$event, function (value, eventName) {

	    var triggerFn = fn[eventName];

		fn[eventName] = function(handler) {
		    return typeof handler === 'function' ? this.on(eventName, handler) : triggerFn ? triggerFn.call(this, handler) : this.trigger(eventName, handler);
		};
	});
	
	fn.live = function(eventName, handler){
	    if (typeof eventName !== 'string') {
			for(handler in eventName){
				this.live(eventName, eventName[handler]);
			}
			return this;
		}
		
		document.delegate(this.selector, eventName, handler);
		return this;
	};

	return $;
		
})();

if (!window.$ || window.$ === Dom.get) {
    window.$ = DomHelper;
}