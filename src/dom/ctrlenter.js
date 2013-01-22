



Dom.addEvents('ctrlenter', {

	initEvent: function(e){
		return e.ctrlKey && (e.which == 13 || e.which == 10);
	},
	
	base: 'keypress'
	
});

Dom.submitOnCtrlEnter = function (dom, check) {
	Dom.get(dom).on('ctrlenter', function () {
		if((!check || check(this.value) !== false) && this.node.form)
			this.form.submit();
	});
};