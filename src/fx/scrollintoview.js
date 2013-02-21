


//#include dom/base.js

Dom.implement({

	scrollIntoView: function (container, hscroll) {
	if (typeof container == 'boolean') {
		this.node.scrollIntoView(container);
	} else {
		container = Dom.get(container) || document;
		hscroll = hscroll === undefined ? true : hscroll;

		//子区域渲染后在屏幕上和父区域视窗的左边距和上边距，
		//为负时，表示子区域有上部分在父区域视窗上面，如第三种情况
		var o = this.getPosition().sub(container.getPosition()),

        //分别计算子区域相对父区域结点的坐标（不是父区域视窗）
            l = o[0] + c.scrollLeft,
            t = o[1] + c.scrollTop,
            b = t + el.offsetHeight,
            r = l + el.offsetWidth;

		var ch = c.clientHeight;
		var ct = parseInt(c.scrollTop, 10);
		var cl = parseInt(c.scrollLeft, 10);
		var cb = ct + ch;
		var cr = cl + c.clientWidth;


		//二三种情况，如果子区域比父区域视窗还高或者，
		//区域有上部分在父区域视窗上面，就把子区域顶部和父区域视窗顶部对齐
		//注意：子区域比父区域视窗还高，优先显示子区域顶部部分内容，比较合理。
		if (el.offsetHeight > ch || t < ct) {

			c.scrollTop = t;


		} else

			//第一种情况，如果子区域在父区域视窗下面，或者有下部分在父区域视窗下面，
			//且子区域没有父区域视窗高，就把子区域底部和父区域视窗底部对齐
			if (b > cb) {
				c.scrollTop = b - ch;
			}
	}

	return this;
},

/**
 * 滚动控件到指定视图
 * @param {DOMElement|CC.CBase} ct 指定滚动到视图的结点
 * @param {Boolean} hscroll 是否水平滚动,默认只垂直滚动
 * @return {Object} this
 */
    scrollIntoView : function(ct, hscroll){
      var c = ct?ct.view||ct:CC.$body.view;
        var off = this.getHiddenAreaOffsetVeti(c);
        if(off !== false)
          c.scrollTop = off;
        //c.scrollTop = c.scrollTop;

        if(hscroll){
          off = this.getHiddenAreaOffsetHori(ct);
          if(off !== false)
          c.scrollLeft = off;
        }

        return this;
    },
/**
 * 滚动指定控件到当前视图
 * @param {DOMElement|CC.CBase} child 指定滚动到视图的结点
 * @param {Boolean} hscroll 是否水平滚动,默认只垂直滚动
 * @return {Object} this
 */
    scrollChildIntoView : function(child, hscroll){
        this.fly(child).scrollIntoView(this.view, hscroll).unfly();
        return this;
    },

  /**
   * 检测元素是否在某个容器的可见区域内.
   * <br>如果在可见区域内,返回false,
   * 否则返回元素偏离容器的scrollTop,利用该scrollTop可将容器可视范围滚动到元素处。
   * @param {DOMElement|CC.Base} [container]
   * @return {Boolean}
   */
  getHiddenAreaOffsetVeti : function(ct){
        var c = ct.view || ct;
        var el = this.view;

        var o = this.offsetsTo(c),
            ct = parseInt(c.scrollTop, 10),
            //相对ct的'offsetTop'
            t = o[1] + ct,
            eh = el.offsetHeight,
            //相对ct的'offsetHeight'
            b = t+eh,

            ch = c.clientHeight,
            //scrollTop至容器可见底高度
            cb = ct + ch;
        if(eh > ch || t < ct){
          return t;
        }else if(b > cb){
            b -= ch;
            if(ct != b){
          return b;
            }
        }

    return false;
  },
  /**
   * 检测元素是否在某个容器的可见区域内.
   * <br>如果在可见区域内，返回false,
   * 否则返回元素偏离容器的scrollLeft,利用该scrollLeft可将容器可视范围滚动到元素处。
   * @param {DOMElement|CC.Base} [container]
   * @return {Boolean}
   */
  getHiddenAreaOffsetHori : function(ct){
    var c = ct.view || ct;
    var el = this.view;
        var cl = parseInt(c.scrollLeft, 10),
        o = this.offsetsTo(c),
            l = o[0] + cl,
            ew = el.offsetWidth,
            cw = c.clientWidth,
            r = l+ew,
            cr = cl + cw;
    if(ew > cw || l < cl){
        return l;
    }else if(r > cr){
        r -= cw;
        if(r != cl){
          return r;
         }
    }
    return false;
  }
	
});





            /**
             * Makes the first of matched elements visible in the container
             * @param {HTMLElement[]|String|HTMLElement} selector Matched elements
             * @param {String|HTMLElement|Document} [container=window] Container element
             * @param {Boolean} [top=true] Whether align with top of container.
             * @param {Boolean} [hscroll=true] Whether trigger horizontal scroll.
             * @param {Boolean} [auto=false] Whether adjust element automatically
             * (only scrollIntoView when element is out of view)
             * @see http://www.w3.org/TR/2009/WD-html5-20090423/editing.html#scrollIntoView
             *        http://www.sencha.com/deploy/dev/docs/source/Element.scroll-more.html#scrollIntoView
             *        http://yiminghe.javaeye.com/blog/390732
             */
            scrollIntoView:function (selector, container, top, hscroll, auto) {
                var elem;

                if (!(elem = DOM.get(selector))) {
                    return;
                }

                if (container) {
                    container = DOM.get(container);
                }

                if (!container) {
                    container = elem.ownerDocument;
                }

                if (auto !== true) {
                    hscroll = hscroll === undefined ? true : !!hscroll;
                    top = top === undefined ? true : !!top;
                }

                // document 归一化到 window
                if (container.nodeType == DOM.DOCUMENT_NODE) {
                    container = getWin(container);
                }

                var isWin = !!getWin(container),
                    elemOffset = DOM.offset(elem),
                    eh = DOM.outerHeight(elem),
                    ew = DOM.outerWidth(elem),
                    containerOffset,
                    ch,
                    cw,
                    containerScroll,
                    diffTop,
                    diffBottom,
                    win,
                    winScroll,
                    ww,
                    wh;

                if (isWin) {
                    win = container;
                    wh = DOM.height(win);
                    ww = DOM.width(win);
                    winScroll = {
                        left:DOM.scrollLeft(win),
                        top:DOM.scrollTop(win)
                    };
                    // elem 相对 container 可视视窗的距离
                    diffTop = {
                        left:elemOffset[LEFT] - winScroll[LEFT],
                        top:elemOffset[TOP] - winScroll[TOP]
                    };
                    diffBottom = {
                        left:elemOffset[LEFT] + ew - (winScroll[LEFT] + ww),
                        top:elemOffset[TOP] + eh - (winScroll[TOP] + wh)
                    };
                    containerScroll = winScroll;
                }
                else {
                    containerOffset = DOM.offset(container);
                    ch = container.clientHeight;
                    cw = container.clientWidth;
                    containerScroll = {
                        left:DOM.scrollLeft(container),
                        top:DOM.scrollTop(container)
                    };
                    // elem 相对 container 可视视窗的距离
                    // 注意边框 , offset 是边框到根节点
                    diffTop = {
                        left:elemOffset[LEFT] - containerOffset[LEFT] -
                            (PARSEINT(DOM.css(container, 'borderLeftWidth')) || 0),
                        top:elemOffset[TOP] - containerOffset[TOP] -
                            (PARSEINT(DOM.css(container, 'borderTopWidth')) || 0)
                    };
                    diffBottom = {
                        left:elemOffset[LEFT] + ew -
                            (containerOffset[LEFT] + cw +
                                (PARSEINT(DOM.css(container, 'borderRightWidth')) || 0)),
                        top:elemOffset[TOP] + eh -
                            (containerOffset[TOP] + ch +
                                (PARSEINT(DOM.css(container, 'borderBottomWidth')) || 0))
                    };
                }

                if (diffTop.top < 0 || diffBottom.top > 0) {
                    // 强制向上
                    if (top === true) {
                        DOM.scrollTop(container, containerScroll.top + diffTop.top);
                    } else if (top === false) {
                        DOM.scrollTop(container, containerScroll.top + diffBottom.top);
                    } else {
                        // 自动调整
                        if (diffTop.top < 0) {
                            DOM.scrollTop(container, containerScroll.top + diffTop.top);
                        } else {
                            DOM.scrollTop(container, containerScroll.top + diffBottom.top);
                        }
                    }
                }

                if (hscroll) {
                    if (diffTop.left < 0 || diffBottom.left > 0) {
                        // 强制向上
                        if (top === true) {
                            DOM.scrollLeft(container, containerScroll.left + diffTop.left);
                        } else if (top === false) {
                            DOM.scrollLeft(container, containerScroll.left + diffBottom.left);
                        } else {
                            // 自动调整
                            if (diffTop.left < 0) {
                                DOM.scrollLeft(container, containerScroll.left + diffTop.left);
                            } else {
                                DOM.scrollLeft(container, containerScroll.left + diffBottom.left);
                            }
                        }
                    }
                }
            },