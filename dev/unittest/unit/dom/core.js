module("dom/base:core", { teardown: moduleTeardown });

test("Basic requirements", function () {
	expect(9);
	ok(window.Dom, "Dom");


	var el = new Dom(document.getElementsByTagName('span'));
	var length = el.length;
	equal(length > 0, true, "可以获取长度");

	el.push(document.body);
	equal(el.length, length + 1, "push() 增加长度");
	equal(el[length], document.body, "push() 添加到最后一个元素");

	deepEqual(el.filter(function () { return true }).length, el.length, "filter() 返回");

	deepEqual(el.filter(function () { return false }).length, 0, "filter() 返回");

	equal(el.indexOf(document), -1, "indexOf() 返回");

	el.each(function (node) { node.foo = "zoo"; });
	var pass = true;
	for (var i = 0; i < el.length; i++) {
		if (el[i].foo != "zoo") pass = false;
	}
	ok(pass, "each() 执行");

	equal(el.item(-1)[0], el[el.length - 1], "item(-1) 返回最后的节点。");
});

test("Dom.get", function () {
	Dom.parse('<div id="a"></div>').appendTo("#qunit-fixture");
	var el = Dom.get('a');
	equal(el.length, 1, "length");
	equal(el[0].tagName, 'DIV', "成功创建");
	equal(el.append, Dom.prototype.append, "包括 Dom 方法");
});

test("Dom.query", function () {
	
});

test("Dom.find", function () {

});

test("Dom.parse", function () {
	expect(32);

	var html, nodes;

	equal(Dom.parse().length, 0, "Nothing in, null out.");
	equal(Dom.parse(null).length, 0, "Null in, null out.");
	equal(Dom.parse(false).length, 0, "Empty string in, null out.");

	nodes = Dom.parse(Dom.get('qunit').parent().getHtml());
	ok(nodes.length > 4, "Parse a large html string");

	html = "<script>undefined()</script>";
	equal(Dom.parse(html)[0].nodeName.toLowerCase(), "script", "Preserve scripts when requested");

	html += "<div></div>";
	equal(Dom.parse(html)[0].nodeName.toLowerCase(), "script", "Preserve script position");
	equal(Dom.parse(html)[1].nodeName.toLowerCase(), "div", "Preserve script position");

	equal(Dom.parse("text")[0].nodeType, 3, "Parsing text returns a text node");
	equal(Dom.parse("\t<div></div>")[0].nodeName.toLowerCase(), "div", "Remove leading whitespace");

	equal(Dom.parse(" <div/> ").length, 1, "Leading spaces are removed");

	html = Dom.parse("<div>test div</div>");

	equal(html[0].parentNode, null, "parentNode should not exists");
	equal(html[0].innerHTML, "test div", "Content should be preserved");

	equal(Dom.parse("<span><span>").length, 1, "Incorrect html-strings should not break anything");
	equal(Dom.parse("<td><td>").length, 2,
		"parentNode should be documentFragment for wrapMap (variable in manipulation module) elements too");



	var elem = Dom.parse("<div/><hr/><code/><b/>");
	equal(elem.length, 4, "Multi parse");

	for (var i = 0; i < 3; ++i) {
		elem = Dom.parse("<input type='text' value='TEST' />");
	}
	equal(elem[0].value, "TEST", "Default Value");

	elem.remove();

	equal(Dom.parse(" <div/> ")[0].tagName, 'DIV', "Leading spaces are removed");
	equal(Dom.parse(" a<div/>b ").length, 3, "Leading spaces are removed");

	var long1 = "";
	for (var i = 0; i < 128; i++) {
		long1 += "12345678";
	}

	// Test multi-line HTML
	var div = Dom.parse("<div>\r\nsome text\n<p>some p</p>\nmore text\r\n</div>")[0];
	equal(div.nodeName.toUpperCase(), "DIV", "Make sure we're getting a div.");
	equal(div.firstChild.nodeType, 3, "Text node.");
	equal(div.lastChild.nodeType, 3, "Text node.");
	equal(div.childNodes[1].nodeType, 1, "Paragraph.");
	equal(div.childNodes[1].firstChild.nodeType, 3, "Paragraph text.");

	QUnit.reset();
	ok(Dom.parse("<link rel='stylesheet'/>"), "Creating a link");

	var j = Dom.parse("<span>hi</span> there <!-- mon ami -->");
	ok(j.length >= 2, "Check node,textnode,comment creation (some browsers delete comments)");

	ok(!Dom.parse("<option>test</option>")[0].selected, "Make sure that options are auto-selected");

	ok(Dom.parse("<div></div>")[0], "Create a div with closing tag.");
	ok(Dom.parse("<table></table>")[0], "Create a table with closing tag.");

	// Test very large html string
	var i;
	var li = "<li>very large html string</li>";
	var html = ["<ul>"];
	for (i = 0; i < 50000; i += 1) {
		html.push(li);
	}
	html.push("</ul>");
	html = Dom.parse(html.join(""))[0];
	equal(html.nodeName.toUpperCase(), "UL");
	equal(html.firstChild.nodeName.toUpperCase(), "LI");
	equal(html.childNodes.length, 50000);


	var div = Dom.parse("<div/>")[0];
	var span = Dom.parse("<span/>", div)[0];
	equal(span.tagName, 'SPAN', "Verify a span created with a div context works");

});

test("Dom.create", function () {
	expect(2);

	var el = Dom.create('div');
	equal(el[0].tagName.toUpperCase(), 'DIV', "成功创建");
	equal(el.append, Dom.prototype.append, "包括 Dom 方法");
});

test("Dom.camelCase()", function () {

	var tests = {
		"foo-bar": "fooBar",
		"foo-bar-baz": "fooBarBaz",
		"girl-u-want": "girlUWant",
		"the-4th-dimension": "the4thDimension",
		"-o-tannenbaum": "OTannenbaum",
		"-moz-illa": "MozIlla",
		"ms-take": "msTake"
	};

	expect(7);

	Object.each(tests, function (val, key) {
		equal(Dom.camelCase(key), val, "Converts: " + key + " => " + val);
	});
});
