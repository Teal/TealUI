/**
 * @author xuld
 */

// #require ../control/base

var CharCounter = Control.extend({

    maxLength: 300,

    target: null,

    init: function() {
        var me = this;
        me.target = document.query(me.target);
        me.tpl = me.elem.innerHTML;
        me.target.on('keyup', me.update, me);
        me.update();
    },

	update: function () {
	    var me = this,
            length = me.target.value.length,
	        left = me.maxLength - length;

	    me.elem.classList[left >= 0 ? 'remove' : 'add']('x-tip-error');
	    me.elem.innerHTML = me.tpl.replace('{input}', length).replace('{total}', me.maxLength).replace('{left}', left);

    }

});
