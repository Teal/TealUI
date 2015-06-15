/** * @author  xuld */// #require ../control/base/** * 一个标签选择器。 */var TagChooser = Control.extend({    _eachTags: function(callback) {
        var result = [], next = this.elem;
        for (; (next = next.nextElementSibling) && next.classList.contains('x-tagchooser');) {
            callback(next);
        }
    },	    onTargetChange: function () {
        var values = this.elem.value.split(/\s+/);        this._eachTags(function (elem) {
            elem.classList[values.indexOf(elem.textContent) < 0 ? 'remove' : 'add']('x-tagchooser-selected');
        });	},		onTagClick: function(tag, e){	    var values = this.elem.value.split(/\s+/),	        value = tag.textContent,	        index = values.indexOf(value);	    if (index < 0) {
	        values.push(value)
	    } else {
	        values.splice(index, 1);
	    }
	    this.elem.value = values.join(' ');
	    this.onTargetChange();
	},		init: function(target, tags, prefix){			    var me = this;

	    me.elem.on('keyup', me.onTargetChange, me);	    me.elem.on('change', me.onTargetChange, me);
	    me._eachTags(function(elem) {
	        elem.on('click', function(e) {
	            me.onTagClick(this, e);
	        });
	    });
	    me.onTargetChange();	}});