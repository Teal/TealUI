/**
 * 表示一个点。包含 x 坐标和 y 坐标。
 * @class Point
 */
var Point = Class({

	/**
	 * 初始化 Point 的实例。
	 * @param {Number} x X 坐标。
	 * @param {Number} y Y 坐标。
	 * @constructor Point
	 */
	constructor : function(x, y) {
		this.x = x;
		this.y = y;
	},
	
	/**
	 * 将 (x, y) 增值。
	 * @param {Point} p 值。
	 * @return {Point} this
	 */
	add : function(p) {
		assert(p && 'x' in p && 'y' in p, "Point.prototype.add(p): {p} 必须有 'x' 和 'y' 属性。", p);
		return new Point(this.x + p.x, this.y + p.y);
	},
	
	/**
	 * 将一个点坐标减到当前值。
	 * @param {Point} p 值。
	 * @return {Point} this
	 */
	sub : function(p) {
		assert(p && 'x' in p && 'y' in p, "Point.prototype.sub(p): {p} 必须有 'x' 和 'y' 属性。", p);
		return new Point(this.x - p.x, this.y - p.y);
	}
	
});


