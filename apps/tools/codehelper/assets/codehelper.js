




var MySplitButton = SplitButton.extend({

	dropDownWidth: -1

});



Dom.ready(function () {
	Dom.query('.x-splitbutton').each(function (value) {
		new MySplitButton(value);
	});
});


var CodeHelper = {

	getValue: function () {
		return Dom.get('code').getText();
	},

	setValue: function (value) {
		Dom.get('code').setText(value);
	},

	setInfo: function (value) {
		Dom.get('info').setHtml(value);
	},

	format: function () {
		var value = this.getValue();

		var indent = Dom.get('format-indent').getText(),
			lang = Dom.get('format-language').getText(),
			indent_char = '\t',
			indent_size = 1;
		switch (+indent) {
			case 1:
				break;
			case 2:
				indent_char = ' ';
				indent_size = 2;
				break;
			case 3:
				indent_char = ' ';
				indent_size = 4;
				break;
			case 4:
				indent_char = ' ';
				indent_size = 6;
				break;
		}

		if (!lang) {
			if (/^\s*\</.test(value)) {
				lang = "html";
			} else if (/\w+\s*:\s*\w+;/.test(value)) {
				lang = "css";
			} else {
				lang = "js";
			}
		}

		switch (lang) {
			case "js":
				value = Demo.Beautify.js(value, {
					indent_size: indent_size,
					indent_char: indent_char,
					preserve_newlines: Dom.get('format-preserve-newlines').getAttr('checked'),
					preserve_max_newlines: +Dom.get('format-preserve-max-newlines').getText()
				});
				break;
			case "html":
				value = Demo.Beautify.html(value, {
					indent_size: indent_size,
					indent_char: indent_char,
					preserve_newlines: Dom.get('format-preserve-newlines').getAttr('checked'),
					max_char: +Dom.get('format-preserve-max-newlines').getText()
				});
				break;
			case "css":
				value = Demo.Beautify.css(value, {
					indent: indent_size === 1 ? indent_char : indent_size === 2 ? indent_char + indent_char : indent_size === 4 ? indent_char + indent_char + indent_char + indent_char : (indent_char + indent_char + indent_char + indent_char + indent_char + indent_char)
				});
				break;
		}

		this.setValue(value);
	},

	obfuscator: function (deobfuscator) {
		var value = this.getValue();

		var oldValue = value;

		if (deobfuscator) {
			if (/^eval\b/.test(value)) {
				value = eval(value.substring(4));
			}
		} else {
			value = pack(value, Dom.get("obfuscator-ascii-encoding").getText(), Dom.get("obfuscator-fast-decode").getAttr('checked'), Dom.get("obfuscator-special-chars").getAttr('checked'));
		}

		this.setValue(value);
		this.setInfo(String.format("压缩率: {0}/{1} = {2}%", value.length, oldValue.length, (value.length * 100 / oldValue.length).toFixed(3)));

	},

	packer: function () {

		var value = this.getValue();

		var oldValue = value;

		if (Dom.get('packer-uglifyjs').getAttr('checked')) {
			var ast = parse(value);
			ast.figure_out_scope();
			// https://github.com/mishoo/UglifyJS2#compressor-options
			ast.transform(Compressor());
			ast.figure_out_scope();
			ast.compute_char_frequency();
			ast.mangle_names();
			value = ast.print_to_string();

		} else {
			value = new Packer().pack(value, Dom.get('packer-base62').getAttr('checked'), Dom.get('packer-shrink').getAttr('checked'));
		}


		this.setValue(value);
		this.setInfo(String.format("压缩率: {0}/{1} = {2}%", value.length, oldValue.length, (value.length * 100 / oldValue.length).toFixed(3)));



	},

	string: function () {

		var value = this.getValue();
		var firstChar = value.charAt(0);

		function html2js(value) {
			value = value.replace(/^\s+|\s+$/g, '').replace(/\n/g, "\\\n").replace(/'/g, "\\'");
			return "'" + value + "'";
		}

		function js2html(value) {
			return value.replace(/\\\n/g, "\n").replace(/\\'/g, "'").replace(/^'|^"|'$|"$/g, "");
		}

		if (value === '"' || firstChar === "'") {
			value = js2html(value);
		} else {
			value = html2js(value);
		}


		this.setValue(value);
	},

	jjencode: function () {
		var value = this.getValue();

		value = jjencode(Dom.get('jjencode-varname').getText(), value);

		if (Dom.get('jjencode-palindrome').getAttr('checked')) {
			value = value.replace(/[,;]$/, "");
			value = "\"\'\\\"+\'+\"," + value + ",\'," + value.split("").reverse().join("") + ",\"+\'+\"\\\'\"";
		}

		this.setValue(value);
	},

	encode: function () {
		var value = this.getValue();
		value = encodeURIComponent(value);
		this.setValue(value);
	},

	decode: function () {
		var value = this.getValue();
		value = decodeURIComponent(value);
		this.setValue(value);
	},

	escape: function () {
		var value = this.getValue();
		value = escape(value);
		this.setValue(value);
	},

	unescape: function () {
		var value = this.getValue();
		value = unescape(value);
		this.setValue(value);
	},

	escapeJs: function () {
		this.unescapeJs();
		var value = this.getValue();
		var prefix = "\\u$2";
		var node = document.getElementById('cnencode-prefix-1');
		if (node.checked) {
			prefix = node.value;
		} else {
			node = document.getElementById('cnencode-prefix-2');
			if (node.checked) {
				prefix = node.value;
			} else {
				node = document.getElementById('cnencode-prefix-3');
				if (node.checked) {
					prefix = node.value;
				}
			}
		}

		value = value.replace(/[^\u0000-\u00FF]/g, function ($0) { return escape($0).replace(/(%u)(\w{4})/gi, prefix) });
		this.setValue(value);
	},

	unescapeJs: function () {
		var value = this.getValue();
		value = value.replace(/([\\%]u)(\w{4})/gi, function ($0) {
			return (String.fromCharCode(parseInt((escape($0).replace(/(%5Cu)(\w{4})/g, "$2")), 16)));
		}).replace(/(&#x)(\w{4});/gi, function ($0) {
			return String.fromCharCode(parseInt(escape($0).replace(/(%26%23x)(\w{4})(%3B)/g, "$2"), 16));
		});
		this.setValue(value);
	}

};