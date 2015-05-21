/**
 * @author xuld
 */

// #require ../control/base.js

var Accordion = Control.extend({

    role: 'accordion',

    init: function (options) {

        var me = this;

        var panels = this.panels = [];

        var triggerBySelf = false;

	    Dom.each(this.elem.children, function (panelElem, index) {

            // 初始为面板。
	        var panel = panels[index] = Control.get(panelElem, 'panel');

	        panel.on('collapsing', function (value) {

	            if (triggerBySelf) {
	                return;
	            }
	            
	            // 禁止折叠当前项。
	            if (value == true || !me.trigger('changing', this)) {
	                return false;
	            }

	            triggerBySelf = true;
                
	            // 展开当前项同时折叠其它项。
	            for (var i = 0; i < panels.length; i++) {
	                if (this !== panels[i]) {
	                    panels[i].toggleCollapse(true);
	                }
	            }

	            triggerBySelf = false;

	            me.trigger('change', this);

	        });

	    });

	}

});
