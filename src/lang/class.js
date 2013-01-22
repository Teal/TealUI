/**
 * @author xuld
 */



include("utils/set.js");

Object.extend(JPlus, {

	classMembers: {

		/**
		 * 扩充类的静态成员。
		 * @param {Object} obj
		 */
		statics: function(obj) {
			assert(obj, "Class.statics(obj): 参数 {obj} 不能为空。", obj);

			return Object.extend(this, obj);
		},

		/**
		 * 扩充类的静态成员。
		 * @param {Object} obj
		 */
		staticsIf: function(obj) {
			assert(obj, "Class.staticsIf(obj): 参数 {obj} 不能为空。", obj);

			return Object.extendIf(this, obj);
		}

	},

	_Native: JPlus.Native,

	Native:  function(constructor) {
		return JPlus._Native(Object.extend(constructor, JPlus.classMembers));
	}

});

[String, Array, Function, Date, Element, Number, JPlus.Base].forEach(JPlus.Native);

JPlus.Base.implement({

	/**
	 * 如果存在，获取属于一个元素的数据。
	 * @method getData
	 * @param {String} type 类型。
	 * @return {Object} 值。
	 */
	getData: function(type) {
		return this.dataField()[type];
	},

	/**
	 * 设置属于一个元素的数据。
	 * @method setData
	 * @param {Object} obj 元素。
	 * @param {Number/String} type 类型。
	 * @param {mixed} data 内容。
	 */
	setData: function(type, data) {
		var field = this.dataField();
		if (data === null)
			delete field[type];
		else
			field[type] = data;
		return data;
	},

	/**
	 * 对当前类扩展属性。
	 * @param {Object} options 配置。
	 */
	setOptions: function(options, value) {
		return Object.set(this, options, value);
	}

});