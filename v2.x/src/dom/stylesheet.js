
   
createStyleSheet : function(cssText){
	var ss;
	if(Ext.isIE){
		ss = doc.createStyleSheet();
		ss.cssText = cssText;
	}else{
		var head = doc.getElementsByTagName("head")[0];
		var rules = doc.createElement("style");
		rules.setAttribute("type", "text/css");
		try{
			rules.appendChild(doc.createTextNode(cssText));
		}catch(e){
			rules.cssText = cssText; 
		}
		head.appendChild(rules);
		ss = rules.styleSheet ? rules.styleSheet : (rules.sheet || doc.styleSheets[doc.styleSheets.length-1]);
	}
	this.cacheStyleSheet(ss);
	return ss;
},

   
removeStyleSheet : function(id){
	var existing = doc.getElementById(id);
	if(existing){
		existing.parentNode.removeChild(existing);
	}
},

   
swapStyleSheet : function(id, url){
	this.removeStyleSheet(id);
	var ss = doc.createElement("link");
	ss.setAttribute("rel", "stylesheet");
	ss.setAttribute("type", "text/css");
	ss.setAttribute("id", id);
	ss.setAttribute("href", url);
	doc.getElementsByTagName("head")[0].appendChild(ss);
}, /**
     * APIMethod: getDynamicStyleSheet
     * return a reference to a styleSheet based on its title.  If the sheet
     * does not already exist, it is created.
     *
     * Parameter:
     * name - <String> the title of the stylesheet to create or obtain
     *
     * Returns:
     * <StyleSheet> a StyleSheet object with browser dependent capabilities.
     */
getDynamicStyleSheet: function (name) {
	name = (name) ? name : 'default';
	if (!this.dynamicStyleMap.has(name)) {
		var sheet = new Element('style').set('type', 'text/css').inject(document.head);
		sheet.indicies = [];
		this.dynamicStyleMap.set(name, sheet);
	}
	return this.dynamicStyleMap.get(name);
},
/**
     * APIMethod: enableStyleSheet
     * enable a style sheet
     *
     * Parameters:
     * name - <String> the title of the stylesheet to enable
     */
enableStyleSheet: function (name) {
	this.getDynamicStyleSheet(name).disabled = false;
},
/**
     * APIMethod: disableStyleSheet
     * enable a style sheet
     *
     * Parameters:
     * name - <String> the title of the stylesheet to disable
     */
disableStyleSheet: function (name) {
	this.getDynamicStyleSheet(name).disabled = true;
},
/**
     * APIMethod: removeStyleSheet
     * Removes a style sheet
     *
     * Parameters:
     * name = <String> the title of the stylesheet to remove
     */
removeStyleSheet: function (name) {
	this.disableStyleSheet(name);
	this.getDynamicStyleSheet(name).dispose();
	this.dynamicStyleMap.erase(name);
},
/**
     * APIMethod: isStyleSheetDefined
     * Determined if the passed in name is a defined dynamic style sheet.
     *
     * Parameters:
     * name = <String> the title of the stylesheet to remove
     */
isStyleSheetDefined: function (name) {
	return this.dynamicStyleMap.has(name);
}





            /**
             * Creates a stylesheet from a text blob of rules.
             * These rules will be wrapped in a STYLE tag and appended to the HEAD of the document.
             * @param {window} [refWin=window] Window which will accept this stylesheet
             * @param {String} cssText The text containing the css rules
             * @param {String} [id] An id to add to the stylesheet for later removal
             */
            addStyleSheet:function (refWin, cssText, id) {
                refWin = refWin || WINDOW;
                if (S.isString(refWin)) {
                    id = cssText;
                    cssText = refWin;
                    refWin = WINDOW;
                }
                refWin = DOM.get(refWin);
                var win = DOM._getWin(refWin),
                    doc = win.document,
                    elem;

                if (id && (id = id.replace('#', EMPTY))) {
                    elem = DOM.get('#' + id, doc);
                }

                // 仅添加一次，不重复添加
                if (elem) {
                    return;
                }

                elem = DOM.create('<style>', { id:id }, doc);

                // 先添加到 DOM 树中，再给 cssText 赋值，否则 css hack 会失效
                DOM.get('head', doc).appendChild(elem);

                if (elem.styleSheet) { // IE
                    elem.styleSheet.cssText = cssText;
                } else { // W3C
                    elem.appendChild(doc.createTextNode(cssText));
                }
            },