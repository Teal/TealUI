/**
 * @author xuld 
 */


include("dom/base.js");


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
	pin: (function(){

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
		
		function pin(dom, target, position, offsetX, offsetY, enableReset) {
			
			var opt = {
				s: dom.getSize(),
				ts: target.getSize(),
				tp: target.getPosition(),
				ds: Dom.document.getSize(),
				dp: Dom.document.getPosition(),
				ox: offsetX || 0,
				oy: offsetY || 0
			}, r = enableReset === false ? 0 : 2, x, y;
			
			if(position.length <= 1){
				if(position === 'r'){
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
			
			assert(aligners[x] && aligners[y], "Dom#pin(ctrl, position,  offsetX, offsetY): {position} 格式不正确。正确的格式如 lt", position);
			
			aligners[x](opt, r);
			aligners[y](opt, r);
			
			dom.setPosition(opt);
			
		}
	
		return function(target, position, offsetX, offsetY, enableReset) {
					
			assert(position, "Dom#pin(ctrl, position,  offsetX, offsetY): {position} 格式不正确。正确的格式如 lt", position);
			
			target = Dom.query(target);
			
			if(this.length === 1) {
				pin(this, target, position, offsetX, offsetY, enableReset);
				return this;
			}
			
			return Dom.iterate(this, function (elem) {
				return pin(new Dom([elem]), target, position, offsetX, offsetY, enableReset);
			});
			
		};
		
	})()
	
});

