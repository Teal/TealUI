//===========================================
//  框架               iframe.js       A
//===========================================
//#include controls/control.js

///**
// * IFrame
// * @class IFrame
// */
//var IFrame = JPlus.Control.extend({
	
//	xtype: 'iframe',
	
//	tpl: '<iframe src="about:blank"></iframe>',
	
//	doReady: function(fn){
//		var me = this;
//		me.update();
//		me.isReady = true;
//	},
	
//	onReady: function (fn) {
		
//	},
	
//	init: function(){
//		var elem = this;
//		this.node.renderTo(true);
//		if(navigator.isStd){
//			setTimeout(function(){
//				if (elem.node.contentWindow.document.URL != 'about:blank')
//					elem.onReady();
//				else
//					setTimeout(arguments.callee, 10);
//			}, 20);
//		} else {
//				elem.on('load', elem.onReady);
//		}
//	},
	
//	getDom: function(){
//		return this.node.contentWindow.document;
//	},
	
//	update: function(){
//		var me = this;
//		JPlus.setupWindow(me.window = me.node.contentWindow);
		
//		if(eval("!-[1,]")){
//			me.window.document.getDom = function(){
//				return this.body;
//			};
//		}
//		return me;
//	}

//});
	
	
