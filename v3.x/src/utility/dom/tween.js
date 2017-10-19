/**
 * @author xuld
 */

typeof include === "function" && include("fx/base.js");
typeof include === "function" && include("dom/dom.js");

/**
 * @namespace Fx
 */
Object.extend(Fx, {
	
	/**
	 * 用于特定 css 补间动画的引擎。 
	 */
	tweeners: {},
	
	/**
	 * 默认的补间动画的引擎。 
	 */
	defaultTweeners: [],
	
	/**
	 * 用于数字的动画引擎。
	 */
	numberTweener: {
	    get: Dom.styleNumber,
				
		/**
		 * 常用计算。
		 * @param {Object} from 开始。
		 * @param {Object} to 结束。
		 * @param {Object} delta 变化。
		 */
		compute: function(from, to, delta){
			return (to - from) * delta + from;
		},
		
		parse: function(value){
			return typeof value == "number" ? value : parseFloat(value);
		},
		
		set: function(elem, name, value){
			elem.style[name] = value;
		}
	},

	/**
	 * 补间动画
	 * @class Fx.Tween
	 * @extends Fx
	 */
	Tween: Fx.extend({
		
		/**
		 * 初始化当前特效。
		 */
		constructor: function(){
			
		},
		
		/**
		 * 根据指定变化量设置值。
		 * @param {Number} delta 变化量。 0 - 1 。
		 * @protected override
		 */
		set: function(delta){
			var options = this.options,
				params = options.params,
				elem = options.elem,
				tweener,
				key,
				value;

			// 对当前每个需要执行的特效进行重新计算并赋值。
			for (key in params) {
				value = params[key];
				tweener = value.tweener;
				tweener.set(elem, key, tweener.compute(value.from, value.to, delta));
			}
		},
		
		/**
		 * 生成当前变化所进行的初始状态。
		 * @param {Object} options 开始。
		 * @protected override
		 */
		init: function (options) {
				
			// 对每个设置属性
			var key,
				tweener,
				part,
				value,
				parsed,
				i,
				// 生成新的 tween 对象。
				params = {};
			
			for (key in options.params) {

				// value
				value = options.params[key];

				// 如果 value 是字符串，判断 += -= 或 a-b
				if (typeof value === 'string' && (part = /^([+-]=|(.+?)-)(.*)$/.exec(value))) {
					value = part[3];
				}

				// 找到用于变化指定属性的解析器。
				tweener = Fx.tweeners[key = Dom.camelCase(key)];
				
				// 已经编译过，直接使用， 否则找到合适的解析器。
				if (!tweener) {
					
					// 如果是纯数字属性，使用 numberParser 。
					if(key in Dom.styleNumbers) {
						tweener = Fx.numberTweener;
					} else {
						
						i = Fx.defaultTweeners.length;
						
						// 尝试使用每个转换器
						while (i-- > 0) {
							
							// 获取转换器
							parsed = Fx.defaultTweeners[i].parse(value, key);
							
							// 如果转换后结果合格，证明这个转换器符合此属性。
							if (parsed || parsed === 0) {
								tweener = Fx.defaultTweeners[i];
								break;
							}
						}

						// 找不到合适的解析器。
						if (!tweener) {
							continue;
						}
						
					}

					// 缓存 tweeners，下次直接使用。
					Fx.tweeners[key] = tweener;
				}
				
				// 如果有特殊功能。 ( += -= a-b)
				if(part){
					parsed = part[2];
					i = parsed ? tweener.parse(parsed) : tweener.get(options.elem, key);
					parsed = parsed ? tweener.parse(value) : (i + parseFloat(part[1] === '+=' ? value : '-' + value));
				} else {
					parsed = tweener.parse(value);
					i = tweener.get(options.elem, key);
				}
				
				params[key] = {
					tweener: tweener,
					from: i,
					to: parsed		
				};
				
				//assert(i !== null && parsed !== null, "Fx.Tween#init(options): 无法正确获取属性 {key} 的值({from} {to})。", key, i, parsed);
				
			}

			options.params = params;
		}
	
	}),
	
	createTweener: function(tweener){
		return Object.extendIf(tweener, Fx.numberTweener);
	}
	
});

Object.each(Dom.styleHooks, function (value, key) {
	Fx.tweeners[key] = this;
}, Fx.createTweener({
	set: function (elem, name, value) {
	    Dom.styleHooks[name].set(elem, value);
	}
}));

Fx.tweeners.scrollTop = Fx.createTweener({
	set: function (elem, name, value) {
	    Dom.setScroll(elem, { y: value });
	},
	get: function (elem) {
	    return Dom.getScroll(elem).y;
	}
});

Fx.tweeners.scrollLeft = Fx.createTweener({
	set: function (elem, name, value) {
	    Dom.setScroll(elem, { x: value });
	},
	get: function (elem) {
	    return Dom.getScroll(elem).x;
	}
});

Fx.defaultTweeners.push(Fx.createTweener({

	set: navigator.isIE678 ? function(elem, name, value) {
		try {
			
			// ie 对某些负属性内容报错
			elem.style[name] = value;
		}catch(e){}
	} : function (elem, name, value) {
		
		elem.style[name] = value + 'px';
	}

}));
