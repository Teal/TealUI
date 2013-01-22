/** * @author  *///===========================================
//  字符串的变换   string.js      A
//===========================================



using("System.Fx.Animate");



/**
 * 文字。
 */
JPlus.Fx.Animate.parses.string = {

	parse: function(value) {
		return typeof value === 'string' && value;
	},

	get: Element.getStyle,

	set: function set(target, from, to, delta) {
		target.style[this.name] = from.substr(0, Fx.compute(from[0], to[0], delta));
	}

};