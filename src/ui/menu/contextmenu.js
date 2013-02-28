/** * @author  *///#include ui/menu/menu.jsvar ContextMenu = Menu.extend({		floating: true,		setContextMenu: function (ctrl) {		Dom.on(ctrl.elem || ctrl, 'contextmenu', this.handlerContextMenu, this);				return this;	},		handlerContextMenu: function (e) {		this.showAt({
			x: e.pageX,
			y: e.pageY
		});		e.preventDefault();		e.stopPropagation();	}	});