/**
 * @author [作者]
 */



include("ui/core/base.js");

var Suggest1 = Control.extend({

	tpl: '<div></div>',

	// 下面 2 个函数在 Control 已经定义好了。
	//constructor: function () {
	//	this.dom = $(this.tpl);
	//},
	//t: function () {
	//	this.dom.appendTo('body');
	//}

	init: function (options) {

		alert('初始化了');
		//this.find('div').item(0).html('test');
	},
});