/**
 * @author xuld
 */




Dom.implement({

	/**
	 * 将当前 Dom 对象置于指定 Dom 对象的上层。
	 * @param {Dom} [target] 如果指定了参 Dom 对象， Dom 对象将位于指定 Dom 对象之上。
	 * @return this
	 * @remark 此函数是通过设置 css的 z-index 属性实现的。
	 */
	bringToFront: function(target) {
		assert(!target || (target.node && target.node.style), "Dom.prototype.bringToFront(elem): {elem} 必须为 空或允许使用样式 Dom 对象。", target);

		var elem = this.node,
				targetZIndex = target && (parseInt(Dom.styleString(target.node, 'zIndex')) + 1) || (Dom.zIndex ? Dom.zIndex++ : (Dom.zIndex = 10000));

		// 如果当前元素的 z-index 未超过目标值，则设置
		if (!(Dom.styleString(elem, 'zIndex') > targetZIndex))
			elem.style.zIndex = targetZIndex;

		return this;

	}

});