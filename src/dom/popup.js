/**
 * @author xuld
 */


include("dom/base.js");


Dom.implement({
	
    /**
     * 定义一个菜单的弹出层。
     */
	popup: function(options){
		
		if(options.constructor !== Object){
			options = {target: Dom.get(options)};
		}
		
        // 浮层首先是隐藏的。
		options.target.hide();

        // 默认事件是 mouseenter
		options.event = options.event || 'mouseenter';
		
		var me = this, timer, atPopup, atTarget;

		if (/^mouse(enter|over)\b/.test(options.event)) {

		    options.delay = options.delay || 300;

		    options.target
                .on('mouseenter', function () {
                    atPopup = true;
                })
                .on('mouseleave', function () {
                    atPopup = false;
                });
		    
		    me.bind(options.event, function (e) {
		        
		        var target = this;

		        atTarget = true;

		        if (timer) {
		            clearTimeout(timer);
		        }
		        
		        timer = setTimeout(function () {

		            timer = 0;
		            
		            toggle('show', target);

		        }, options.delay);

		    });

		    me.bind(/^mouseenter/.test(options.event) ? options.event.replace('enter', 'leave') : options.event.replace('over', 'out'), function (e) {

		        var target = this;

		        atTarget = false;

		        if (timer) {
		            clearTimeout(timer);
		        }

		        timer = setTimeout(function () {

		            timer = 0;

		            if (!atTarget) {

		                if (!atPopup) {
		                    toggle('hide', target);

		                } else {
		                    setTimeout(arguments.callee, options.delay);
		                }

		            }

		        }, options.delay);

		    });

            // 点击后直接显示。
		    me.bind(options.event.replace(/^\w+/, "click"), function (e) {

		        e.preventDefault();

		        if (timer) {
		            clearTimeout(timer);
		        }

		        toggle('show', this);

		    })

		} else if (/'focus(in)?\b/.test(options.event)) {

		    me.bind(options.event, function (e) {
		        toggle('show', this);
		    });

		    me.bind(/'focusin/.test(options.event) ? options.event.replace('focusin', 'focusout') : options.event.replace('focus', 'blur'), function (e) {
		        toggle('hide', this);
		    });

		} else {

		    me.bind(options.event, function (e) {

		        e.preventDefault();

	            var target = this;

	            toggle('show', target);

                // 绑定 click 后隐藏菜单。
                document.on('click', function (e) {
                    
                    // 如果事件发生在弹窗上，忽略。
                    if (options.target.has(e.target, true)) {
                        return;
                    }

                    toggle('hide', target);

                    // 删除 click 事件回调。
                    document.un('click', arguments.callee);

                });
            
	            return false;

		    });

		}

		function toggle(showOrHide, target) {

		    // 显示或隐藏浮层。
		    options.target[showOrHide]();

		    // 回调。
		    if (options[showOrHide]) {
		        options[showOrHide](target);
		    }


		}
		
		return me;
		
	}

});