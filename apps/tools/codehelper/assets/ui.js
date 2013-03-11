
var MySplitButton = SplitButton.extend({

	dropDownWidth: -1

});

Dom.ready(function () {
	Dom.query('.x-splitbutton').each(function (value) {
		new MySplitButton(value);
	});
});

var UI = {

	getValue: function () {
		return Dom.get('code').value;
	},

	setValue: function (value) {
		Dom.get('code').value = value;
	},

	setInfo: function (value) {
		Dom.get('info').innerHTML = value;
	},

	getLanugage: function (value) {
		if (/^\s*\</.test(value)) {
			return "html";
		} else if (/\w+\s*:\s*\w+;/.test(value)) {
			return "css";
		} else {
			return "js";
		}
	},

	format: function () {
		var value = UI.getValue();

		if (!value) {
			return;
		}

		var indent = Dom.get('format-indent').value,
			lang = Dom.get('format-language').value || UI.getLanugage(value),
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

		switch (lang) {
			case "js":
				value = Demo.Beautify.js(value, {
					indent_size: indent_size,
					indent_char: indent_char,
					preserve_newlines: Dom.get('format-preserve-newlines').checked,
					preserve_max_newlines: +Dom.get('format-preserve-max-newlines').value
				});
				break;
			case "html":
				value = Demo.Beautify.html(value, {
					indent_size: indent_size,
					indent_char: indent_char,
					preserve_newlines: Dom.get('format-preserve-newlines').checked,
					max_char: +Dom.get('format-preserve-max-newlines').value
				});
				break;
			case "css":
				value = Demo.Beautify.css(value, {
					indent: indent_size === 1 ? indent_char : indent_size === 2 ? indent_char + indent_char : indent_size === 4 ? indent_char + indent_char + indent_char + indent_char : (indent_char + indent_char + indent_char + indent_char + indent_char + indent_char)
				});
				break;
		}

		UI.setValue(value);
	},

	packer: function () {

		var value = UI.getValue();

		if (!value) {
			return;
		}

		var oldValue = value;
		var lang = Dom.get('packer-language').value || UI.getLanugage(value);

		switch (lang) {

			case "js":

				if (Dom.get('packer-uglifyjs').checked) {
					var ast = parse(value);
					ast.figure_out_scope();
					// https://github.com/mishoo/UglifyJS2#compressor-options
					ast.transform(Compressor());
					ast.figure_out_scope();
					ast.compute_char_frequency();
					ast.mangle_names();
					value = ast.print_to_string();

				} else {
					value = new Packer().pack(value, Dom.get('packer-base62').checked, Dom.get('packer-shrink').checked);
				}

				break;

			case "css":
				value = cssmin(value);
				break;

			case "html":
				value = value.replace(/\n+\s+/, "");
				break;


		}


		UI.setValue(value);
		UI.setInfo(String.format("压缩率: {0}/{1} = {2}%", value.length, oldValue.length, (value.length * 100 / oldValue.length).toFixed(3)));



	},

	obfuscator: function (deobfuscator) {
		var value = UI.getValue();

		var oldValue = value;

		if (!value) {
			return;
		}

		if (deobfuscator) {
			if (/^eval\b/.test(value)) {
				value = eval(value.substring(4));
			}
		} else {
			value = pack(value, Dom.get("obfuscator-ascii-encoding").value, Dom.get("obfuscator-fast-decode").checked, Dom.get("obfuscator-special-chars").checked);
		}

		UI.setValue(value);
		UI.setInfo(String.format("压缩率: {0}/{1} = {2}%", value.length, oldValue.length, (value.length * 100 / oldValue.length).toFixed(3)));

	},

	string: function () {

		var value = UI.getValue();
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


		UI.setValue(value);
	},

	jjencode: function () {
		var value = UI.getValue();

		value = jjencode(Dom.get('jjencode-varname').value, value);

		if (Dom.get('jjencode-palindrome').checked) {
			value = value.replace(/[,;]$/, "");
			value = "\"\'\\\"+\'+\"," + value + ",\'," + value.split("").reverse().join("") + ",\"+\'+\"\\\'\"";
		}

		UI.setValue(value);
	},

	encode: function () {
		var value = UI.getValue();
		value = encodeURIComponent(value);
		UI.setValue(value);
	},

	decode: function () {
		var value = UI.getValue();
		value = decodeURIComponent(value);
		UI.setValue(value);
	},

	escape: function () {
		var value = UI.getValue();
		value = escape(value);
		UI.setValue(value);
	},

	unescape: function () {
		var value = UI.getValue();
		value = unescape(value);
		UI.setValue(value);
	},

	escapeJs: function () {
		this.unescapeJs();
		var value = UI.getValue();
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
		UI.setValue(value);
	},

	unescapeJs: function () {
		var value = UI.getValue();
		value = value.replace(/([\\%]u)(\w{4})/gi, function ($0) {
			return (String.fromCharCode(parseInt((escape($0).replace(/(%5Cu)(\w{4})/g, "$2")), 16)));
		}).replace(/(&#x)(\w{4});/gi, function ($0) {
			return String.fromCharCode(parseInt(escape($0).replace(/(%26%23x)(\w{4})(%3B)/g, "$2"), 16));
		});
		UI.setValue(value);
	}

};
