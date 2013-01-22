/**
 * @author 
 */




Dom.implement({

	/**
	 * 在某个位置插入一个HTML 。
	 * @param {String} where 插入地点。
	 *
	 * - **beforeBegin**: 节点外。
	 * - **beforeEnd** 节点里。
	 * - **afterBegin** 节点外。
	 * - **afterEnd** 节点里。
	 *
	 * @param {String/Node/Dom} html 要插入的内容。
	 * @return {Dom} 返回插入的新节点对象。
	 * 向每个匹配的元素内部前置内容。
	 * @example
	 * 向所有段落中前置一些HTML标记代码。
	 * #####HTML:
	 * <pre lang="htm" format="none">&lt;p&gt;I would like to say: &lt;/p&gt;</pre>
	 * #####JavaScript:
	 * <pre>Dom.query("p").insert("afterBegin","&lt;b&gt;Hello&lt;/b&gt;");</pre>
	 * #####结果:
	 * <pre lang="htm" format="none">[ &lt;p&gt;&lt;b&gt;Hello&lt;/b&gt;I would like to say: &lt;/p&gt; ]</pre>
	 */
	insert: function(where, html) {

		assert(' afterEnd beforeBegin afterBegin beforeEnd '.indexOf(' ' + where + ' ') >= 0, "Dom.prototype.insert(where, html): {where} 必须是 beforeBegin、beforeEnd、afterBegin 或 afterEnd 。", where);

		var me = this,
				parentControl = me,
				refChild = me;

		html = Dom.parse(html, me.node);

		switch (where) {
			case "afterEnd":
				refChild = me.next(null);

				// 继续。
			case "beforeBegin":
				parentControl = me.parent();
				assert(parentControl, "Dom.prototype.insert(where, html): 节点无父节点时无法执行 insert({where})。", where);
				break;
			case "afterBegin":
				refChild = me.first(null);
				break;
			default:
				refChild = null;
				break;
		}

		parentControl.insertBefore(html, refChild);
		return html;
	}

}, 3);