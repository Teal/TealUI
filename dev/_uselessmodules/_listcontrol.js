




///**
// * 为非 ListControl 对象扩展 ListControl 的6个方法: add addAt remove removeAt set item
// */
//ListControl.aliasMethods = function (controlClass, targetProperty, removeChildProperty) {
//	controlClass.delegateMethods(targetProperty, 'add addAt removeAt item');

//	removeChildProperty = removeChildProperty || targetProperty;

//	controlClass.prototype.set = function (items) {
//		if (Array.isArray(items)) {

//			// 尝试在代理的列表中删除项。
//			var child = this[removeChildProperty];
//			if (child)
//				child.empty();

//			// 通过 this.add 添加项。
//			this.add.apply(this, items);

//			return this;
//		}

//		return this.base('set');
//	};

//	controlClass.prototype.removeChild = function (childControl) {

//		// 尝试在代理的列表中删除项。
//		var child = this[removeChildProperty];
//		if (child)
//			childControl.remove(childControl);

//		// 尝试在当前节点中正常删除。
//		childControl.detach(this.node);

//		return childControl;
//	};

//};