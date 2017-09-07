/**
 * @author xuld 
 */

//#include dom/base.js

Dom.pin = (function(){

	var aligners = {
			
		xc: function (opt) {
			opt.x = opt.tp.x + (opt.ts.x - opt.s.x) / 2 + opt.ox;
		},
			
		ll: function(opt, r){
			opt.x = opt.tp.x - opt.s.x - opt.ox;
				
			if(r > 0 && opt.x <= opt.dp.x) {
				aligners.rr(opt, --r);
			}
		},
			
		rr: function(opt, r){
			opt.x = opt.tp.x + opt.ts.x + opt.ox;
				
			if(r > 0 && opt.x + opt.s.x >= opt.dp.x + opt.ds.x) {
				aligners.ll(opt, --r);
			}
		},
			
		lr: function (opt, r) {
			opt.x = opt.tp.x + opt.ox;
				
			if(r > 0 && opt.x + opt.s.x >= opt.dp.x + opt.ds.x) {
				aligners.rl(opt, --r);
			}
		},
			
		rl: function (opt, r) {
			opt.x = opt.tp.x + opt.ts.x - opt.s.x - opt.ox;
				
			if(r > 0 && opt.x <= opt.dp.x) {
				aligners.lr(opt, --r);
			}
		},
			
		yc: function (opt) {
			opt.y = opt.tp.y + (opt.ts.y - opt.s.y) / 2 + opt.oy;
		},
			
		tt: function(opt, r){
			opt.y = opt.tp.y - opt.s.y - opt.oy;
				
			if(r > 0 && opt.y <= opt.dp.y) {
				aligners.bb(opt, --r);
			}
		},
			
		bb: function(opt, r){
			opt.y = opt.tp.y + opt.ts.y + opt.oy;
				
			if(r > 0 && opt.y + opt.s.y >= opt.dp.y + opt.ds.y) {
				aligners.tt(opt, --r);
			}
		},
			
		tb: function (opt, r) {
			opt.y = opt.tp.y + opt.oy;
				
			if(r > 0 && opt.y + opt.s.y >= opt.dp.y + opt.ds.y) {
				aligners.bt(opt, --r);
			}
		},
			
		bt: function (opt, r) {
			opt.y = opt.tp.y + opt.ts.y - opt.s.y - opt.oy;
				
			if(r > 0 && opt.y <= opt.dp.y) {
				aligners.tb(opt, --r);
			}
		}

	};
	
	/*
	 *      tl        tr
	 *      ------------
	 *   lt |          | rt
	 *      |          |
	 *      |    cc    | 
	 *      |          |
	 *   lb |          | rb
	 *      ------------
	 *      bl        br
	 */
	
	return function (elem, target, position, offsetX, offsetY, enableReset) {
					
		//assert(position, "Dom#pin(ctrl, position,  offsetX, offsetY): {position} 格式不正确。正确的格式如 lt", position);
			
		target = Dom.find(target);

		var opt = {
			s: Dom.getSize(elem),
			ts: Dom.getSize(target),
			tp: Dom.getPosition(target),
			ds: Dom.getSize(document),
			dp: Dom.getPosition(document),
			ox: offsetX || 0,
			oy: offsetY || 0
		}, r = enableReset === false ? 0 : 2, x, y;

		if (position.length <= 1) {
			if (position === 'r') {
				x = 'rr';
				y = 'tb';
			} else {
				x = 'lr';
				y = 'bb';
			}
		} else {
			x = position.substr(0, 2);
			y = position.substr(3);
		}

		//assert(aligners[x] && aligners[y], "Dom#pin(ctrl, position,  offsetX, offsetY): {position} 格式不正确。正确的格式如 lt", position);

		aligners[x](opt, r);
		aligners[y](opt, r);

		Dom.setPosition(elem, opt);

	};
		
})();

/**
 * 为控件提供按控件定位的方法。
 * @class Dom
 */
Dom.implement({

	/**
	 * 基于某个控件，设置当前控件的位置。改函数让控件显示都目标的右侧。
	 * @param {Dom} dom 目标的控件。
	 * @param {String} align 设置的位置。如 ll-bb 。完整的说明见备注。
	 * @param {Number} offsetX=0 偏移的X大小。
	 * @param {Number} offsetY=0 偏移的y大小。
	 * @param {Boolean} enableReset=true 如果元素超出屏幕范围，是否自动更新节点位置。
	 */
	pin: function () {

	}
	
});

