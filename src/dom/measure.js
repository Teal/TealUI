//===========================================
//  测量   measure.js   A
//===========================================

Element.implement({
	
	 beginMeasure : function(){
	     var el = this.node;
        if(el.offsetWidth || el.offsetHeight){
            return this; 
        }
        var changed = [];
        var p = this.node, b = document.body;
        while((!el.offsetWidth && !el.offsetHeight) && p && p.tagName && p != b){
            var pe = Ext.get(p);
            if(pe.getStyle('display') == 'none'){
                changed.push({el: p, visibility: pe.getStyle("visibility")});
                p.style.visibility = "hidden";
                p.style.display = "block";
            }
            p = p.parentNode;
        }
        this._measureChanged = changed;
        return this;
               
    },
    
    
    endMeasure : function(){
        var changed = this._measureChanged;
        if(changed){
            for(var i = 0, len = changed.length; i < len; i++) {
            	var r = changed[i];
            	r.el.style.visibility = r.visibility;
                r.el.style.display = "none";
            }
            this._measureChanged = null;
        }
        return this;
    }
    
	
})
//===========================================
//  元素内容扩展   elementex.js       C
//===========================================


/**
     * Class: Element
     *
     * Element is a global object provided by the mootools library.  The
     * functions documented here are extensions to the Element object provided
     * by Jx to make cross-browser compatibility easier to achieve.  Most of
     * the methods are measurement related.
     *
     * While the code in these methods has been converted to use MooTools
     * methods, there may be better MooTools methods to use to accomplish
     * these things.
     * Ultimately, it would be nice to eliminate most or all of these and find
     * the MooTools equivalent or convince MooTools to add them.
     *
     * NOTE: Many of these methods can be replaced with mootools-more's
     * Element.Measure
     */
Element.implement({
	/**
         * APIMethod: getBoxSizing
         * return the box sizing of an element, one of 'content-box' or
         *'border-box'.
         *
         * Parameters:
         * elem - {Object} the element to get the box sizing of.
         *
         * Returns:
         * {String} the box sizing of the element.
         */
	getBoxSizing: function () {
		var result = 'content-box',
                cm,
                sizing;
		if (Browser.Engine.trident || Browser.Engine.presto) {
			cm = document["compatMode"];
			if (cm == "BackCompat" || cm == "QuirksMode") {
				result = 'border-box';
			} else {
				result = 'content-box';
			}
		} else {
			if (arguments.length === 0) {
				node = document.documentElement;
			}
			sizing = this.getStyle("-moz-box-sizing");
			if (!sizing) {
				sizing = this.getStyle("box-sizing");
			}
			result = (sizing ? sizing : 'content-box');
		}
		return result;
	},
	/**
         * APIMethod: getContentBoxSize
         * return the size of the content area of an element.  This is the
         * size of the element less margins, padding, and borders.
         *
         * Parameters:
         * elem - {Object} the element to get the content size of.
         *
         * Returns:
         * {Object} an object with two properties, width and height, that
         * are the size of the content area of the measured element.
         */
	getContentBoxSize: function () {
		var s = this.getSizes(['padding', 'border']);
		return {
			width: this.offsetWidth - s.padding.left - s.padding.right - s.border.left - s.border.right,
			height: this.offsetHeight - s.padding.bottom - s.padding.top - s.border.bottom - s.border.top
		};
	},
	/**
         * APIMethod: getBorderBoxSize
         * return the size of the border area of an element.  This is the size
         * of the element less margins.
         *
         * Parameters:
         * elem - {Object} the element to get the border sizing of.
         *
         * Returns:
         * {Object} an object with two properties, width and height, that
         * are the size of the border area of the measured element.
         */
	getBorderBoxSize: function () {
		return {
			width: this.offsetWidth,
			height: this.offsetHeight
		};
	},

	/**
         * APIMethod: getMarginBoxSize
         * return the size of the margin area of an element.  This is the size
         * of the element plus margins.
         *
         * Parameters:
         * elem - {Object} the element to get the margin sizing of.
         *
         * Returns:
         * {Object} an object with two properties, width and height, that
         * are the size of the margin area of the measured element.
         */
	getMarginBoxSize: function () {
		var s = this.getSizes(['margin']);
		return {
			width: this.offsetWidth + s.margin.left + s.margin.right,
			height: this.offsetHeight + s.margin.top + s.margin.bottom
		};
	},
	/**
         * APIMethod: getSizes
         * measure the size of various styles on various edges and return
         * the values.
         *
         * Parameters:
         * styles - array, the styles to compute.  By default, this is
         * ['padding', 'border','margin'].  If you don't need all the styles,
         * just request the ones you need to minimize compute time required.
         * edges - array, the edges to compute styles for.  By default,  this
         * is ['top','right','bottom','left'].  If you don't need all the
         * edges, then request the ones you need to minimize compute time.
         *
         * Returns:
         * {Object} an object with one member for each requested style.  Each
         * style member is an object containing members for each requested
         * edge. Values are the computed style for each edge in pixels.
         */
	getSizes: function (which, edges) {
		which = which || ['padding', 'border', 'margin'];
		edges = edges || ['left', 'top', 'right', 'bottom'];
		var result = {},
                e,
                n;
		which.each(function (style) {
			result[style] = {};
			edges.each(function (edge) {
				e = (style == 'border') ? edge + '-width' : edge;
				n = this.getStyle(style + '-' + e);
				result[style][edge] = n === null || isNaN(parseInt(n, 10)) ? 0 : parseInt(n, 10);
			},
                this);
		},
            this);
		return result;
	},
	/**
         * APIMethod: setContentBoxSize
         * set either or both of the width and height of an element to
         * the provided size.  This function ensures that the content
         * area of the element is the requested size and the resulting
         * size of the element may be larger depending on padding and
         * borders.
         *
         * Parameters:
         * elem - {Object} the element to set the content area of.
         * size - {Object} an object with a width and/or height property that
         * is the size to set the content area of the element to.
         */
	setContentBoxSize: function (size) {
		var m,
                width,
                height;
		if (this.getBoxSizing() == 'border-box') {
			m = this.measure(function () {
				return this.getSizes(['padding', 'border']);
			});
			if ($defined(size.width)) {
				width = size.width + m.padding.left + m.padding.right + m.border.left + m.border.right;
				if (width < 0) {
					width = 0;
				}
				this.setStyle('width', width);
			}
			if ($defined(size.height)) {
				height = size.height + m.padding.top + m.padding.bottom + m.border.top + m.border.bottom;
				if (height < 0) {
					height = 0;
				}
				this.setStyle('height', height);
			}
		} else {
			if ($defined(size.width) && size.width >= 0) {
				this.setStyle('width', width);
			}
			if ($defined(size.height) && size.height >= 0) {
				this.setStyle('height', height);
			}
		}
	},
	/**
         * APIMethod: setBorderBoxSize
         * set either or both of the width and height of an element to
         * the provided size.  This function ensures that the border
         * size of the element is the requested size and the resulting
         * content areaof the element may be larger depending on padding and
         * borders.
         *
         * Parameters:
         * elem - {Object} the element to set the border size of.
         * size - {Object} an object with a width and/or height property that
         * is the size to set the content area of the element to.
         */
	setBorderBoxSize: function (size) {
		var m,
                width,
                height;
		if (this.getBoxSizing() == 'content-box') {
			m = this.measure(function () {
				return this.getSizes();
			});

			if ($defined(size.width)) {
				width = size.width - m.padding.left - m.padding.right - m.border.left - m.border.right - m.margin.left - m.margin.right;
				if (width < 0) {
					width = 0;
				}
				this.setStyle('width', width);
			}
			if ($defined(size.height)) {
				height = size.height - m.padding.top - m.padding.bottom - m.border.top - m.border.bottom - m.margin.top - m.margin.bottom;
				if (height < 0) {
					height = 0;
				}
				this.setStyle('height', height);
			}
		} else {
			if ($defined(size.width) && size.width >= 0) {
				this.setStyle('width', width);
			}
			if ($defined(size.height) && size.height >= 0) {
				this.setStyle('height', height);
			}
		}
	},

	/**
         * APIMethod: descendantOf
         * determines if the element is a descendent of the reference node.
         *
         * Parameters:
         * node - {HTMLElement} the reference node
         *
         * Returns:
         * {Boolean} true if the element is a descendent, false otherwise.
         */
	descendantOf: function (node) {
		var parent = document.id(this.parentNode);
		while (parent != node && parent && parent.parentNode && parent.parentNode != parent) {
			parent = document.id(parent.parentNode);
		}
		return parent == node;
	},

	/**
         * APIMethod: findElement
         * search the parentage of the element to find an element of the given
         * tag name.
         *
         * Parameters:
         * type - {String} the tag name of the element type to search for
         *
         * Returns:
         * {HTMLElement} the first node (this one or first parent) with the
         * requested tag name or false if none are found.
         */
	findElement: function (type) {
		var o = this,
                tagName = o.tagName;
		while (o.tagName != type && o && o.parentNode && o.parentNode != o) {
			o = document.id(o.parentNode);
		}
		return o.tagName == type ? o : false;
	}
});
