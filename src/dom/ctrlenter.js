/**
 * @author xuld
 */

//#include dom/base.js

Dom.defineEvents('ctrlenter', {

	filter: function(target, e){
		return e.ctrlKey && (e.which == 13 || e.which == 10);
	},
	
	bindType: 'keypress'
	
});

Dom.submitOnCtrlEnter = function (dom, check) {
	Dom.on(Dom.find(dom), 'ctrlenter', function () {
		if((!check || check(this.value) !== false) && this.form)
			this.form.submit();
	});
};
