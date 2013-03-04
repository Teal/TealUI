

(function () {

	var Dom = window.Dom,

		dp = Dom.prototype;
	
	/**
	 * ���� Dom ���󣬲���ÿ��Ԫ��ִ�� setter��
	 */
	dp.access = function (getter, setter, args, valueIndex, emptyGet) {

		// ����������������������ԣ�����Ϊ��ȡ���ԡ�
		if (args.length > valueIndex) {
			for (var i = 0, len = this.length; i < len; i++) {
				setter(this[i], args[0], args[1])
			}
			return this;
		}

		return this.length ? getter(this[0], args[0], args[1]) : emptyGet;
	};

	dp.check = function (fn, args) {
		var ret = new this.constructor(), t;
		for (var i = 0 ; i < this.length; i++) {
			if (fn(this[i], args)) {
				return true;
			}
		}
		return false;
	};

	Object.map("on un trigger addClass removeClass toggleClass empty remove dispose", function (funcName) {
		dp[funcName] = function () {
			return this.iterate(Dom[funcName], arguments);
		};
	});

	dp.style = function () {
		return this.access(Dom.getStyle, Dom.setStyle, arguments, 1);
	};

	dp.attr = function () {
		return this.access(Dom.getAttr, Dom.setAttr, arguments, 1);
	};

	Object.map('Text Html Size Width Height Offset Position Scroll', function (funcName) {
		dp[funcName.toLowerCase()] = function () {
			return this.access(Dom['get' + funcName], Dom['set' + funcName], arguments, 0);
		};
	});

	Object.map('closest parent prev next child first last parents prevAll nextAll children offsetParent clone', function (funcName) {
		dp[funcName] = function (filter) {
			return this.map(Dom[funcName], filter);
		};
	});

	dp.hasClass = function (filter) {
		return this.check(Dom.hasClass, filter);
	};

	Object.map('append prepend after before', function (funcName) {
		dp[funcName] = function (html) {

			if (typeof html === 'string') {
				this.iterate(Dom[funcName], arguments);
			} else if (this.length) {

				Dom[funcName](this[0], html);

				for (var i = 1; i < this.length; i++) {
					Dom[funcName](this[i], html instanceof Dom ? html.clone() : Dom.clone(html));
				}

			}

			return this;
		};
	});

	dp.appendTo = function (parent) {
		Dom.query(parent).append(this);
		return this;
	};

})();
