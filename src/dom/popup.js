/**
 * @author xuld
 */

//#include dom/base.js
//#include fx/animte.js

Dom.popup = function (elem, options) {

	if (options.constructor !== Object) {
		options = { elem: Dom.find(options) };
	}
	// 默认事件是 mouseenter
	options.event = options.event || 'mouseenter';

	var event = options.event,
		selector = options.selector,
		timer, atPopup, atTarget;

	// 浮层首先是隐藏的。
	Dom.hide(options.elem);

	if (/^mouse(enter|over)$/.test(event)) {

		options.delay = options.delay || 300;

		Dom.on(options.elem, 'mouseenter', function () {
			atPopup = true;
		});

		Dom.on(options.elem, 'mouseleave', function () {
			atPopup = false;
		});
		
		Dom.on(elem, event, selector, function (e) {

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

		Dom.on(elem, event.length === 9 ? 'mouseout' : 'mouseleave', selector, function (e) {

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
		Dom.on(elem, "click", selector, function (e) {
			
			e.preventDefault();

			if (timer) {
				clearTimeout(timer);
			}

			toggle('show', this);

		})

	} else if (/^focus(in)?$/.test(event)) {

		Dom.on(elem, event, selector, function (e) {
			toggle('show', this);
		});

		Dom.on(elem, event.length === 5 ? 'blur' : 'focusout', selector, function (e) {
			toggle('hide', this);
		});

	} else {

		Dom.on(elem, event, function (e) {

			var target = this;

			e.preventDefault();

			toggle('show', target);

			// 绑定 click 后隐藏菜单。
			Dom.on(document, 'click', function (e) {

				// 如果事件发生在弹窗上，忽略。
				if (Dom.contains(options.elem, e.target)) {
					return;
				}

				toggle('hide', target);

				// 删除 click 事件回调。
				Dom.un(document, 'click', arguments.callee);

			});

			return false;

		});

	}

	function toggle(showOrHide, target) {

		// 显示或隐藏浮层。
		Dom[showOrHide](options.elem);

		// 回调。
		if (options[showOrHide]) {
			options[showOrHide].call(elem, options.elem, target, options);
		}

	}

};

/**
 * 定义一个菜单的弹出层。
 */
Dom.prototype.popup = function () {
	return this.iterate(Dom.popup, arguments);
};
