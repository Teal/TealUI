

var options = {
	html: 'demo.html',
	time: 1000
};

var framewroks = {
	'jQuery': {
		js: '../../../src/jquery/jquery-1.9.1.js',
		init:  function(window){
			window.el = window.$("#header");
			window.fn = fn;
		}
	},
	'Mootools': {
		js: '../../../src/mootools/mootools-core-1.4.5.js',
		init:  function(window){
			window.el = window.$("header");
			window.fn = fn;
		}
	},
	'jPlusUI': {
		js: [
			'../../../../src/core/core.js',
			'../../../../src/core/class.js',
			'../../../../src/dom/core.js',
			'../../../../src/dom/jquery-style.js'
		],
		init:  function(window){
			window.el = window.Dom.query("#header");
			window.fn = fn;
		}
	}
};

var cases = {
	'文档载入': '-',
	'加载时运行':{
		jPlusUI: 'Dom.ready(fn)',
		Mootools: 'document.addEvent("domready", fn)',
		jQuery: '$(document).ready(fn)'
	},
	'节点': '-',
	'获取一个节点':{
		jPlusUI: 'Dom.query("#header")',
		jQuery: '$("#header")',
		Mootools: '$("#header")'
	},
	'事件 - 添加':{
		jPlusUI: 'el.on("click", function(e){})',
		Mootools: 'el.addEvent("click", function(e){})',
		jQuery: 'el.click(function(e){})'
	},
	'事件 - 触发':{
		jPlusUI: 'el.trigger("click")',
		Mootools: 'el.fireEvent("click")',
		jQuery: 'el.click()'
	},
	'事件 - 删除':{
		jPlusUI: 'el.un("click")',
		Mootools: 'el.removeEvent("click")',
		jQuery: 'el.unbind("click")'
	},
	'事件 - 单一':{
		jPlusUI: 'el.once("click", function(e){})',
		Mootools: '-',
		jQuery: 'el.one("click", function(e){})'
	},
	'属性 - 获取':{
		jPlusUI: 'el.attr("name")',
		Mootools: 'el.getProperty("name")',
		jQuery: 'el.attr("name")'
	},
	'属性 - 设置':{
		jPlusUI: 'el.attr("name", "1")',
		Mootools: 'el.setProperty("name", "1")',
		jQuery: 'el.attr("name", "1")'
	},
	'样式 - 取得':{
		jPlusUI: 'el.style("background-color")',
		Mootools: 'el.getStyle("background-color")',
		jQuery: 'el.css("background-color")'
	},
	'样式 - 设置':{
		jPlusUI: 'el.style("background-color", "green")',
		Mootools: 'el.setStyle("background-color", "green")',
		jQuery: 'el.css("background-color", "green")'
	},
	'文本 - 取得': {
		jPlusUI: 'el.text()',
		Mootools: 'el.get("text")',
		jQuery: 'el.text()'
	},
	'文本 - 设置': {
		jPlusUI: 'el.text("green")',
		Mootools: 'el.set("text", "green")',
		jQuery: 'el.text("green")'
	},
	'类名 - 添加':{
		jPlusUI: 'el.addClass("g")',
		Mootools: 'el.addClass("g")',
		jQuery: 'el.addClass("g")'
	},
	'类名 - 删除类':{
		jPlusUI: 'el.removeClass("g")',
		Mootools: 'el.removeClass("g")',
		jQuery: 'el.removeClass("g")'
	},
	'类名 - 切换': {
		jPlusUI: 'el.toggleClass("g")',
		Mootools: 'el.toggleClass("g")',
		jQuery: 'el.toggleClass("g")'
	},
	'节点 - 插入':{
		jPlusUI: 'el.append("<br>")',
		Mootools: 'new Element("<br>").inject(el)',
		jQuery: 'el.append("<br>")'
	},
	'位置 - 计算':{
		jPlusUI: 'el.position()',
		Mootools: 'el.getPosition()',
		jQuery: 'el.offset()'
	},
	'位置 - 设置':{
		jPlusUI: 'el.position({x:3, y:4})',
		Mootools: '-',
		jQuery: 'el.offset({left:3, top:4})'
	},
	'工具函数': '-',
	'Object - 拷贝': {
		jPlusUI: 'Object.extend({a:1}, {b:2})',
		Mootools: 'Object.append({a:1}, {b:2})',
		jQuery: '$.extend({a:1}, {b:2})'
	},
	'Object - 遍历':{
		jPlusUI: 'Object.each({a:1}, fn)',
		Mootools: 'Object.each({a:1}, fn)',
		jQuery: '$.each({a:1}, function(i, n){fn(n)})'
	},
	'Object - 无成员判断':{
		jPlusUI: '-',
		Mootools: '-',
		jQuery: '$.isEmptyObject({})'
	},
	'Array - 遍历':{
		jPlusUI: '[2,3].forEach(fn)',
		Mootools: '[2,3].forEach(fn)',
		jQuery: '$.each([2,3], function(i, n){fn(n)})'
	},
	'Array - 数组判断':{
		jPlusUI: 'Array.isArray([])',
		Mootools: '-',
		jQuery: '$.isArray([])'
	},
	'Array - 生成':{
		jPlusUI: '-',
		Mootools: 'Array.from([2,3])',
		jQuery: '$.makeArray([2,3])'
	},
	'Array - 过滤':{
		jPlusUI: '[2,3].filter(function(v){return v > 2;})',
		Mootools: '[2,3].filter(function(v){return v > 2;})',
		jQuery: '$.grep([2,3], function(v){return v > 2;})'
	},
	'Array - 匹配':{
		jPlusUI: 'Object.map([2,3], function(v){return v * v;})',
		Mootools: '[2,3].map(function(v){return v * v;})',
		jQuery: '$.map([2,3], function(v){return v * v;})'
	},
	'Array - 查找':{
		jPlusUI: '[2,3].indexOf(3)',
		Mootools: '[2,3].indexOf(3)',
		jQuery: '$.inArray(3, [2,3])'
	},
	'Array - 删除重复':{
		jPlusUI: 'var a = new Array();a.push(2,3,2,4,5);a.unique()',
		Mootools: '-',
		jQuery: '$.unique([2,3,2,4,5])'
	},
	'Function - 空':{
		jPlusUI: 'Function.empty()',
		Mootools: 'Function.from ()()',
		jQuery: '$.noop()'
	},
	'Function - 作用域绑定':{
		jPlusUI: 'fn.bind(this)',
		Mootools: 'Function.from().bind(this)',
		jQuery: '$.proxy(fn, this)'
	},
	'Function - 函数判断':{
		jPlusUI: '-',
		Mootools: 'typeOf(function(){}) == "function"',
		jQuery: '$.isFunction(function(){})'
	},
	'String - trim':{
		jPlusUI: '" s ".trim()',
		Mootools: '" s ".trim()',
		jQuery: '$.trim(" s ")'
	},
	'CSS 选择器': '-',
	'#id': {
		jPlusUI: 'Dom.query("#id")',
		Mootools: '$$("#id")',
		jQuery: '$("#id")'
	},
	'div': {
		jPlusUI: 'Dom.query("div")',
		Mootools: '$$("div")',
		jQuery: '$("div")'
	},
	'.class': {
		jPlusUI: 'Dom.query(".class")',
		Mootools: '$$(".class")',
		jQuery: '$(".class")'
	},
	'div.class': {
		jPlusUI: 'Dom.query("div.class")',
		Mootools: '$$("div.class")',
		jQuery: '$("div.class")'
	},
	'div#id.class': {
		jPlusUI: 'Dom.query("div#id.class")',
		Mootools: '$$("div#id.class")',
		jQuery: '$("div#id.class")'
	},
	'div > div': {
		jPlusUI: 'Dom.query("div > div")',
		Mootools: '$$("div > div")',
		jQuery: '$("div > div")'
	},
	'div:first-child': {
		jPlusUI: 'Dom.query("div:first-child")',
		Mootools: '$$("div:first-child")',
		jQuery: '$("div:first-child")'
	}

};




function fn(){

}


initSpeedMatch(framewroks, cases, options   );




