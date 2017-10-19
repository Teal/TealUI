define(["require", "exports", "assert", "./dom"], function (require, exports, assert, dom) {
    Object.defineProperty(exports, "__esModule", { value: true });
    function beforeEach() {
        document.getElementById("qunit-fixture").innerHTML = "<p id=\"firstp\">See <a id=\"simon1\" href=\"http://simon.incutio.com/archive/2003/03/25/#getElementsBySelector\" rel=\"bookmark\">this blog entry</a> for more information.</p>\n\t\t<p id=\"ap\">\n\t\t\tHere are some links in a normal paragraph: <a id=\"google\" href=\"http://www.google.com/\" title=\"Google!\">Google</a>,\n\t\t\t<a id=\"groups\" href=\"http://groups.google.com/\" class=\"GROUPS\">Google Groups (Link)</a>.\n\t\t\tThis link has <code><a href=\"http://smin\" id=\"anchor1\">class=\"blog\"</a></code>:\n\t\t\t<a href=\"http://diveintomark.org/\" class=\"blog\" hreflang=\"en\" id=\"mark\">diveintomark</a>\n\n\t\t</p>\n\t\t<div id=\"foo\">\n\t\t\t<p id=\"sndp\">Everything inside the red border is inside a div with <code>id=\"foo\"</code>.</p>\n\t\t\t<p lang=\"en\" id=\"en\">This is a normal link: <a id=\"yahoo\" href=\"http://www.yahoo.com/\" class=\"blogTest\">Yahoo</a></p>\n\t\t\t<p id=\"sap\">This link has <code><a href=\"#2\" id=\"anchor2\">class=\"blog\"</a></code>: <a href=\"http://simon.incutio.com/\" class=\"blog link\" id=\"simon\">Simon Willison's Weblog</a></p>\n\n\t\t</div>\n\t\t<span id=\"name+value\"></span>\n\t\t<p id=\"first\">Try them out:</p>\n\t\t<ul id=\"firstUL\"></ul>\n\t\t<ol id=\"empty\"></ol>\n\t\t<form id=\"form\" action=\"formaction\">\n\t\t\t<label for=\"action\" id=\"label-for\">Action:</label>\n\t\t\t<input type=\"text\" name=\"action\" value=\"Test\" id=\"text1\" maxlength=\"30\"/>\n\t\t\t<input type=\"text\" name=\"text2\" value=\"Test\" id=\"text2\" disabled=\"disabled\"/>\n\t\t\t<input type=\"radio\" name=\"radio1\" id=\"radio1\" value=\"on\"/>\n\n\t\t\t<input type=\"radio\" name=\"radio2\" id=\"radio2\" checked=\"checked\"/>\n\t\t\t<input type=\"checkbox\" name=\"check\" id=\"check1\" checked=\"checked\"/>\n\t\t\t<input type=\"checkbox\" id=\"check2\" value=\"on\"/>\n\n\t\t\t<input type=\"hidden\" name=\"hidden\" id=\"hidden1\"/>\n\t\t\t<input type=\"text\" style=\"display:none;\" name=\"foo[bar]\" id=\"hidden2\"/>\n\n\t\t\t<input type=\"text\" id=\"name\" name=\"name\" value=\"name\" />\n\t\t\t<input type=\"search\" id=\"search\" name=\"search\" value=\"search\" />\n\n\t\t\t<button id=\"button\" name=\"button\" type=\"button\">Button</button>\n\n\t\t\t<textarea id=\"area1\" maxlength=\"30\">foobar</textarea>\n\n\t\t\t<select name=\"select1\" id=\"select1\">\n\t\t\t\t<option id=\"option1a\" class=\"emptyopt\" value=\"\">Nothing</option>\n\t\t\t\t<option id=\"option1b\" value=\"1\">1</option>\n\t\t\t\t<option id=\"option1c\" value=\"2\">2</option>\n\t\t\t\t<option id=\"option1d\" value=\"3\">3</option>\n\t\t\t</select>\n\t\t\t<select name=\"select2\" id=\"select2\">\n\t\t\t\t<option id=\"option2a\" class=\"emptyopt\" value=\"\">Nothing</option>\n\t\t\t\t<option id=\"option2b\" value=\"1\">1</option>\n\t\t\t\t<option id=\"option2c\" value=\"2\">2</option>\n\t\t\t\t<option id=\"option2d\" selected=\"selected\" value=\"3\">3</option>\n\t\t\t</select>\n\t\t\t<select name=\"select3\" id=\"select3\" multiple=\"multiple\">\n\t\t\t\t<option id=\"option3a\" class=\"emptyopt\" value=\"\">Nothing</option>\n\t\t\t\t<option id=\"option3b\" selected=\"selected\" value=\"1\">1</option>\n\t\t\t\t<option id=\"option3c\" selected=\"selected\" value=\"2\">2</option>\n\t\t\t\t<option id=\"option3d\" value=\"3\">3</option>\n\t\t\t\t<option id=\"option3e\">no value</option>\n\t\t\t</select>\n\t\t\t<select name=\"select4\" id=\"select4\" multiple=\"multiple\">\n\t\t\t\t<optgroup disabled=\"disabled\">\n\t\t\t\t\t<option id=\"option4a\" class=\"emptyopt\" value=\"\">Nothing</option>\n\t\t\t\t\t<option id=\"option4b\" disabled=\"disabled\" selected=\"selected\" value=\"1\">1</option>\n\t\t\t\t\t<option id=\"option4c\" selected=\"selected\" value=\"2\">2</option>\n\t\t\t\t</optgroup>\n\t\t\t\t<option selected=\"selected\" disabled=\"disabled\" id=\"option4d\" value=\"3\">3</option>\n\t\t\t\t<option id=\"option4e\">no value</option>\n\t\t\t</select>\n\t\t\t<select name=\"select5\" id=\"select5\">\n\t\t\t\t<option id=\"option5a\" value=\"3\">1</option>\n\t\t\t\t<option id=\"option5b\" value=\"2\">2</option>\n\t\t\t\t<option id=\"option5c\" value=\"1\">3</option>\n\t\t\t</select>\n\n\t\t\t<object id=\"object1\" codebase=\"stupid\">\n\t\t\t\t<param name=\"p1\" value=\"x1\" />\n\t\t\t\t<param name=\"p2\" value=\"x2\" />\n\t\t\t</object>\n\n\t\t\t<span id=\"\u53F0\u5317Ta\u0301ibe\u030Ci\"></span>\n\t\t\t<span id=\"\u53F0\u5317\" lang=\"\u4E2D\u6587\"></span>\n\t\t\t<span id=\"utf8class1\" class=\"\u53F0\u5317Ta\u0301ibe\u030Ci \u53F0\u5317\"></span>\n\t\t\t<span id=\"utf8class2\" class=\"\u53F0\u5317\"></span>\n\t\t\t<span id=\"foo:bar\" class=\"foo:bar\"></span>\n\t\t\t<span id=\"test.foo[5]bar\" class=\"test.foo[5]bar\"></span>\n\n\t\t\t<foo_bar id=\"foobar\">test element</foo_bar>\n\t\t</form>\n\t\t<b id=\"floatTest\">Float test.</b>\n\t\t<iframe id=\"iframe\" name=\"iframe\"></iframe>\n\t\t<form id=\"lengthtest\">\n\t\t\t<input type=\"text\" id=\"length\" name=\"test\"/>\n\t\t\t<input type=\"text\" id=\"idTest\" name=\"id\"/>\n\t\t</form>\n\t\t<table id=\"table\"></table>\n\n\t\t<form id=\"name-tests\">\n\t\t\t<!-- Inputs with a grouped name attribute. -->\n\t\t\t<input name=\"types[]\" id=\"types_all\" type=\"checkbox\" value=\"all\" />\n\t\t\t<input name=\"types[]\" id=\"types_anime\" type=\"checkbox\" value=\"anime\" />\n\t\t\t<input name=\"types[]\" id=\"types_movie\" type=\"checkbox\" value=\"movie\" />\n\t\t</form>\n\n\t\t<form id=\"testForm\" action=\"#\" method=\"get\">\n\t\t\t<textarea name=\"T3\" rows=\"2\" cols=\"15\">?\nZ</textarea>\n\t\t\t<input type=\"hidden\" name=\"H1\" value=\"x\" />\n\t\t\t<input type=\"hidden\" name=\"H2\" />\n\t\t\t<input name=\"PWD\" type=\"password\" value=\"\" />\n\t\t\t<input name=\"T1\" type=\"text\" />\n\t\t\t<input name=\"T2\" type=\"text\" value=\"YES\" readonly=\"readonly\" />\n\t\t\t<input type=\"checkbox\" name=\"C1\" value=\"1\" />\n\t\t\t<input type=\"checkbox\" name=\"C2\" />\n\t\t\t<input type=\"radio\" name=\"R1\" value=\"1\" />\n\t\t\t<input type=\"radio\" name=\"R1\" value=\"2\" />\n\t\t\t<input type=\"text\" name=\"My Name\" value=\"me\" />\n\t\t\t<input type=\"reset\" name=\"reset\" value=\"NO\" />\n\t\t\t<select name=\"S1\">\n\t\t\t\t<option value=\"abc\">ABC</option>\n\t\t\t\t<option value=\"abc\">ABC</option>\n\t\t\t\t<option value=\"abc\">ABC</option>\n\t\t\t</select>\n\t\t\t<select name=\"S2\" multiple=\"multiple\" size=\"3\">\n\t\t\t\t<option value=\"abc\">ABC</option>\n\t\t\t\t<option value=\"abc\">ABC</option>\n\t\t\t\t<option value=\"abc\">ABC</option>\n\t\t\t</select>\n\t\t\t<select name=\"S3\">\n\t\t\t\t<option selected=\"selected\">YES</option>\n\t\t\t</select>\n\t\t\t<select name=\"S4\">\n\t\t\t\t<option value=\"\" selected=\"selected\">NO</option>\n\t\t\t</select>\n\t\t\t<input type=\"submit\" name=\"sub1\" value=\"NO\" />\n\t\t\t<input type=\"submit\" name=\"sub2\" value=\"NO\" />\n\t\t\t<input type=\"image\" name=\"sub3\" value=\"NO\" />\n\t\t\t<button name=\"sub4\" type=\"submit\" value=\"NO\">NO</button>\n\t\t\t<input name=\"D1\" type=\"text\" value=\"NO\" disabled=\"disabled\" />\n\t\t\t<input type=\"checkbox\" checked=\"checked\" disabled=\"disabled\" name=\"D2\" value=\"NO\" />\n\t\t\t<input type=\"radio\" name=\"D3\" value=\"NO\" checked=\"checked\" disabled=\"disabled\" />\n\t\t\t<select name=\"D4\" disabled=\"disabled\">\n\t\t\t\t<option selected=\"selected\" value=\"NO\">NO</option>\n\t\t\t</select>\n\t\t\t<input id=\"list-test\" type=\"text\" />\n\t\t\t<datalist id=\"datalist\">\n\t\t\t\t<option value=\"option\"></option>\n\t\t\t</datalist>\n\t\t</form>\n\t\t<div id=\"moretests\">\n\t\t\t<form>\n\t\t\t\t<div id=\"checkedtest\" style=\"display:none;\">\n\t\t\t\t\t<input type=\"radio\" name=\"checkedtestradios\" checked=\"checked\"/>\n\t\t\t\t\t<input type=\"radio\" name=\"checkedtestradios\" value=\"on\"/>\n\t\t\t\t\t<input type=\"checkbox\" name=\"checkedtestcheckboxes\" checked=\"checked\"/>\n\t\t\t\t\t<input type=\"checkbox\" name=\"checkedtestcheckboxes\" />\n\t\t\t\t</div>\n\t\t\t</form>\n\t\t\t<div id=\"nonnodes\"><span>hi</span> there <!-- mon ami --></div>\n\t\t\t<div id=\"t2037\">\n\t\t\t\t<div><div class=\"hidden\">hidden</div></div>\n\t\t\t</div>\n\t\t\t<div id=\"t6652\">\n\t\t\t\t<div></div>\n\t\t\t</div>\n\t\t\t<div id=\"no-clone-exception\"><object><embed></embed></object></div>\n\t\t</div>\n\n\t\t<div id=\"tabindex-tests\">\n\t\t\t<ol id=\"listWithTabIndex\" tabindex=\"5\">\n\t\t\t\t<li id=\"foodWithNegativeTabIndex\" tabindex=\"-1\">Rice</li>\n\t\t\t\t<li id=\"foodNoTabIndex\">Beans</li>\n\t\t\t\t<li>Blinis</li>\n\t\t\t\t<li>Tofu</li>\n\t\t\t</ol>\n\n\t\t\t<div id=\"divWithNoTabIndex\">I'm hungry. I should...</div>\n\t\t\t<span>...</span><a href=\"#\" id=\"linkWithNoTabIndex\">Eat lots of food</a><span>...</span> |\n\t\t\t<span>...</span><a href=\"#\" id=\"linkWithTabIndex\" tabindex=\"2\">Eat a little food</a><span>...</span> |\n\t\t\t<span>...</span><a href=\"#\" id=\"linkWithNegativeTabIndex\" tabindex=\"-1\">Eat no food</a><span>...</span>\n\t\t\t<span>...</span><a id=\"linkWithNoHrefWithNoTabIndex\">Eat a burger</a><span>...</span>\n\t\t\t<span>...</span><a id=\"linkWithNoHrefWithTabIndex\" tabindex=\"1\">Eat some funyuns</a><span>...</span>\n\t\t\t<span>...</span><a id=\"linkWithNoHrefWithNegativeTabIndex\" tabindex=\"-1\">Eat some funyuns</a><span>...</span>\n\t\t</div>\n\n\t\t<div id=\"liveHandlerOrder\">\n\t\t\t<span id=\"liveSpan1\"><a href=\"#\" id=\"liveLink1\"></a></span>\n\t\t\t<span id=\"liveSpan2\"><a href=\"#\" id=\"liveLink2\"></a></span>\n\t\t</div>\n\n\t\t<div id=\"siblingTest\">\n\t\t\t<em id=\"siblingfirst\">1</em>\n\t\t\t<em id=\"siblingnext\">2</em>\n\t\t</div>\n        </div>\n        </dl>\n        <div id=\"fx-test-group\" style=\"position:absolute;width:1px;height:1px;overflow:hidden;\">\n\t\t<div id=\"fx-queue\" name=\"test\">\n\t\t\t<div id=\"fadein\" class='chain test' name='div'>fadeIn<div>fadeIn</div></div>\n\t\t\t<div id=\"fadeout\" class='chain test out'>fadeOut<div>fadeOut</div></div>\n\n\t\t\t<div id=\"show\" class='chain test'>show<div>show</div></div>\n\t\t\t<div id=\"hide\" class='chain test out'>hide<div>hide</div></div>\n\n\t\t\t<div id=\"togglein\" class='chain test'>togglein<div>togglein</div></div>\n\t\t\t<div id=\"toggleout\" class='chain test out'>toggleout<div>toggleout</div></div>\n\n\n\t\t\t<div id=\"slideup\" class='chain test'>slideUp<div>slideUp</div></div>\n\t\t\t<div id=\"slidedown\" class='chain test out'>slideDown<div>slideDown</div></div>\n\n\t\t\t<div id=\"slidetogglein\" class='chain test'>slideToggleIn<div>slideToggleIn</div></div>\n\t\t\t<div id=\"slidetoggleout\" class='chain test out'>slideToggleOut<div>slideToggleOut</div></div>\n\n\t\t\t<div id=\"fadetogglein\" class='chain test'>fadeToggleIn<div>fadeToggleIn</div></div>\n\t\t\t<div id=\"fadetoggleout\" class='chain test out'>fadeToggleOut<div>fadeToggleOut</div></div>\n\n\t\t\t<div id=\"fadeto\" class='chain test'>fadeTo<div>fadeTo</div></div>\n\t\t</div>\n\n        <div id=\"fx-tests\"></div>\n        \n        <div id=\"nothiddendiv\">\n            <div id=\"nothiddendivchild\"></div>\n        </div>";
    }
    exports.beforeEach = beforeEach;
    function afterEach() {
        document.getElementById("qunit-fixture").innerHTML = "";
    }
    exports.afterEach = afterEach;
    function parseTest() {
        assert.strictEqual(dom.parse("<span><div></div><hr/><code></code><b></b></span>").childNodes.length, 4, "节点个数");
        assert.strictEqual(dom.parse("<input type='text' value='TEST' />").value, "TEST", "默认值");
        assert.strictEqual(dom.parse("<div/>").tagName, 'DIV', "确保空白被删除");
        assert.strictEqual(dom.parse("<span>a<div></div>b</span>").childNodes.length, 3, "确保空白被删除");
        assert.strictEqual(dom.parse("<div>\r\nsome text\n<p>some p</p>\nmore text\r\n</div>").nodeName.toUpperCase(), "DIV", "Make sure we're getting a div.");
        assert.strictEqual(dom.parse("<div>\r\nsome text\n<p>some p</p>\nmore text\r\n</div>").firstChild.nodeType, 3, "Text node.");
        assert.strictEqual(dom.parse("<div>\r\nsome text\n<p>some p</p>\nmore text\r\n</div>").lastChild.nodeType, 3, "Text node.");
        assert.strictEqual(dom.parse("<div>\r\nsome text\n<p>some p</p>\nmore text\r\n</div>").childNodes[1].nodeType, 1, "Paragraph.");
        assert.strictEqual(dom.parse("<div>\r\nsome text\n<p>some p</p>\nmore text\r\n</div>").childNodes[1].firstChild.nodeType, 3, "Paragraph text.");
        assert.ok(dom.parse("<link rel='stylesheet'/>"), "Creating a link");
        assert.ok(dom.parse("<input/>"), "Create an input and set the type.");
        assert.ok(dom.parse("<div><span>hi</span> there <!-- mon ami --></div>").childNodes.length >= 2, "Check node,textnode,comment creation (some browsers delete comments)");
        assert.ok(!dom.parse("<option>test</option>").selected, "Make sure that options are not auto-selected");
        assert.ok(dom.parse("<div></div>"), "Create a div with closing tag.");
        assert.ok(dom.parse("<table></table>"), "Create a table with closing tag.");
        assert.strictEqual(dom.parse("<ul></ul>").nodeName.toUpperCase(), "UL");
        assert.strictEqual(dom.parse("<ul><li></li></ul>").firstChild.nodeName.toUpperCase(), "LI");
        var large = "";
        for (var i = 0; i < 50000; i++) {
            large += "<li>" + i + "</li>";
        }
        assert.strictEqual(dom.parse("<ul>" + large + "</ul>").childNodes.length, 50000);
        assert.strictEqual(dom.parse("<span/>", dom.parse("<div/>").ownerDocument).tagName, 'SPAN', "Verify a span created with a div context works");
    }
    exports.parseTest = parseTest;
    function queryTest() {
        assert.strictEqual(dom.query("#foo .blogTest")[0].innerHTML, "Yahoo", "Check for find");
        assert.deepEqual(dom.query("#qunit-fixture > div")[0], document.getElementById("foo"), "find child elements");
        assert.deepEqual(dom.query("#qunit-fixture > div")[1], document.getElementById("moretests"), "find child elements");
        assert.deepEqual(dom.query("#qunit-fixture > div")[2], document.getElementById("tabindex-tests"), "find child elements");
        assert.deepEqual(dom.query("#qunit-fixture > div")[3], document.getElementById("liveHandlerOrder"), "find child elements");
        assert.deepEqual(dom.query("#qunit-fixture > div")[4], document.getElementById("siblingTest"), "find child elements");
        assert.deepEqual(dom.query("#qunit-fixture > div")[5], document.getElementById("fx-test-group"), "find child elements");
        assert.deepEqual(dom.query("#qunit-fixture > div").length, 6, "find child elements");
        assert.deepEqual(dom.query("#qunit-fixture > #foo > p").length, 3, "find child elements");
        assert.deepEqual(dom.query("#qunit-fixture > #foo > p")[0], document.getElementById("sndp"), "find child elements");
        assert.deepEqual(dom.query("#qunit-fixture > #foo > p")[1], document.getElementById("en"), "find child elements");
        assert.deepEqual(dom.query("#qunit-fixture > #foo > p")[2], document.getElementById("sap"), "find child elements");
        assert.deepEqual(dom.query(document.getElementById("qunit-fixture"), "#qunit-fixture > #foo > p")[0], document.getElementById("sndp"), "find child elements");
        assert.deepEqual(dom.query(document.getElementById("qunit-fixture"), "#qunit-fixture > #foo > p")[2], document.getElementById("sap"), "find child elements");
    }
    exports.queryTest = queryTest;
    function findTest() {
        assert.strictEqual(dom.find("#foo .blogTest").innerHTML, "Yahoo", "Check for find");
        assert.deepEqual(dom.find("#qunit-fixture > div"), document.getElementById("foo"), "find child elements");
        assert.deepEqual(dom.find("#qunit-fixture > #foo > p"), document.getElementById("sndp"), "find child elements");
        assert.deepEqual(dom.find(document.getElementById("qunit-fixture"), "#qunit-fixture > #foo > p"), document.getElementById("sndp"), "find child elements");
    }
    exports.findTest = findTest;
    function matchTest() {
        assert.ok(dom.match(document.getElementById("form"), "form"), "Check for element: A form must be a form");
        assert.ok(!dom.match(document.getElementById("form"), "div"), "Check for element: A form is not a div");
        assert.ok(dom.match(document.getElementById("mark"), ".blog"), "Check for class: Expected class 'blog'");
        assert.ok(!dom.match(document.getElementById("mark"), ".link"), "Check for class: Did not expect class 'link'");
        assert.ok(dom.match(document.getElementById("simon"), ".blog.link"), "Check for multiple classes: Expected classes 'blog' and 'link'");
        assert.ok(!dom.match(document.getElementById("simon"), ".blogTest"), "Check for multiple classes: Expected classes 'blog' and 'link', but not 'blogTest'");
        assert.ok(dom.match(document.getElementById("en"), "[lang=\"en\"]"), "Check for attribute: Expected attribute lang to be 'en'");
        assert.ok(!dom.match(document.getElementById("en"), "[lang=\"de\"]"), "Check for attribute: Expected attribute lang to be 'en', not 'de'");
        assert.ok(dom.match(document.getElementById("text1"), "[type=\"text\"]"), "Check for attribute: Expected attribute type to be 'text'");
        assert.ok(!dom.match(document.getElementById("text1"), "[type=\"radio\"]"), "Check for attribute: Expected attribute type to be 'text', not 'radio'");
        assert.ok(dom.match(document.getElementById("text2"), ":disabled"), "Check for pseudoclass: Expected to be disabled");
        assert.ok(!dom.match(document.getElementById("text1"), ":disabled"), "Check for pseudoclass: Expected not disabled");
        assert.ok(dom.match(document.getElementById("radio2"), ":checked"), "Check for pseudoclass: Expected to be checked");
        assert.ok(!dom.match(document.getElementById("radio1"), ":checked"), "Check for pseudoclass: Expected not checked");
        // test match() with comma-seperated expressions
        assert.ok(dom.match(document.getElementById("en"), "[lang=\"en\"],[lang=\"de\"]"), "Comma-seperated; Check for lang attribute: Expect en or de");
        assert.ok(dom.match(document.getElementById("en"), "[lang=\"de\"],[lang=\"en\"]"), "Comma-seperated; Check for lang attribute: Expect en or de");
        assert.ok(dom.match(document.getElementById("en"), "[lang=\"en\"] , [lang=\"de\"]"), "Comma-seperated; Check for lang attribute: Expect en or de");
        assert.ok(dom.match(document.getElementById("en"), "[lang=\"de\"] , [lang=\"en\"]"), "Comma-seperated; Check for lang attribute: Expect en or de");
        assert.ok(dom.match(document.getElementById("option1b"), "#select1 option:not(:first-child)"), "POS inside of :not() (#10970)");
    }
    exports.matchTest = matchTest;
    function firstTest() {
        assert.strictEqual(dom.first(document.getElementById("qunit-fixture")).id, "firstp");
        assert.strictEqual(dom.first(document.getElementById("qunit-fixture"), "#ap").id, "ap");
    }
    exports.firstTest = firstTest;
    function lastTest() {
        assert.strictEqual(dom.last(document.getElementById("qunit-fixture")).id, "fx-test-group");
        assert.strictEqual(dom.last(document.getElementById("qunit-fixture"), "#fx-test-group").id, "fx-test-group");
    }
    exports.lastTest = lastTest;
    function nextTest() {
        assert.strictEqual(dom.next(document.getElementById("ap")).id, "foo", "Simple next check");
        assert.strictEqual(dom.next(document.getElementById("ap"), "div").id, "foo", "Simple next check");
        assert.strictEqual(dom.next(document.getElementById("ap"), "aside"), null, "Filtered next check, no match");
        assert.strictEqual(dom.next(document.getElementById("ap"), "div, p").id, "foo", "Multiple filters");
    }
    exports.nextTest = nextTest;
    function prevTest() {
        assert.strictEqual(dom.prev(document.getElementById("foo")).id, "ap", "Simple prev check");
        assert.strictEqual(dom.prev(document.getElementById("foo"), "p").id, "ap", "Simple prev check");
        assert.strictEqual(dom.prev(document.getElementById("foo"), "aside"), null, "Filtered prev check, no match");
        assert.strictEqual(dom.prev(document.getElementById("foo"), "p, div").id, "ap", "Multiple filters");
    }
    exports.prevTest = prevTest;
    function parentTest() {
        assert.strictEqual(dom.parent(document.getElementById("groups")).id, "ap", "Simple parent check");
        assert.strictEqual(dom.parent(document.getElementById("groups"), "p").id, "ap", "Filtered parent check");
        assert.strictEqual(dom.parent(document.getElementById("groups"), "div2"), null, "Filtered parent check, no match");
        assert.strictEqual(dom.parent(document.getElementById("groups"), "div, p").id, "ap", "Check for multiple filters");
    }
    exports.parentTest = parentTest;
    function closestTest() {
        assert.deepEqual(dom.closest(document.body, "body"), document.body, "closest(body)");
        assert.deepEqual(dom.closest(document.body, "html"), document.documentElement, "closest(html)");
        assert.deepEqual(dom.closest(document.body, "div"), null, "closest(div)");
        assert.deepEqual(dom.closest(document.getElementById("qunit-fixture"), "span,html"), document.documentElement, "closest(span,html)");
        assert.deepEqual(dom.closest(dom.find("#qunit-fixture div:nth-child(2)"), "div:first-child"), null, "closest(div:first-child)");
        assert.deepEqual(dom.closest(dom.find("div"), "body:first-child div:last-child"), dom.find("fx-tests"), "closest(body:first-child div:last-child)");
        // Test .closest() limited by the context
        assert.deepEqual(dom.closest(document.getElementById("nothiddendivchild"), "html", document.body), null, "Context limited.");
        assert.deepEqual(dom.closest(document.getElementById("nothiddendivchild"), "body", document.body), null, "Context limited.");
        assert.deepEqual(dom.closest(document.getElementById("nothiddendivchild"), "#nothiddendiv", document.body), document.getElementById("nothiddendiv"), "Context not reached.");
        // Test that .closest() returns unique'd set
        assert.deepEqual(dom.closest(dom.find("#qunit-fixture p"), "#qunit-fixture"), document.getElementById('qunit-fixture'), "Closest should return a unique set");
        // Test on disconnected node
        assert.strictEqual(dom.closest(dom.find(dom.parse("<div><p></p></div>"), "p"), "table"), null, "Make sure disconnected closest work.");
        // Bug #7369
        assert.strictEqual(!dom.closest(dom.parse("<div foo='bar'></div>"), "[foo]"), false, "Disconnected nodes with attribute selector");
        assert.strictEqual(dom.closest(dom.parse("<div>text</div>"), "[lang]"), null, "Disconnected nodes with text and non-existent attribute selector");
    }
    exports.closestTest = closestTest;
    function childrenTest() {
        assert.deepEqual(dom.children(document.getElementById("foo")).length, 3, "Check for children");
        assert.deepEqual(dom.children(document.getElementById("foo"))[0].id, "sndp", "Check for children");
        assert.deepEqual(dom.children(document.getElementById("foo"))[1].id, "en", "Check for children");
        assert.deepEqual(dom.children(document.getElementById("foo"))[2].id, "sap", "Check for children");
        assert.deepEqual(dom.children(document.getElementById("foo"), "#en, #sap").length, 2, "Check for children");
        assert.deepEqual(dom.children(document.getElementById("foo"), "#en, #sap")[0].id, "en", "Check for children");
        assert.deepEqual(dom.children(document.getElementById("foo"), "#en, #sap")[1].id, "sap", "Check for children");
    }
    exports.childrenTest = childrenTest;
    function containsTest() {
        assert.strictEqual(dom.contains(document.body, document.body), true);
        assert.strictEqual(dom.contains(document.body, document.getElementById("qunit-fixture")), true);
        assert.strictEqual(dom.contains(document.getElementById("qunit-fixture"), document.body), false);
    }
    exports.containsTest = containsTest;
    function indexTest() {
        assert.strictEqual(dom.index(document.getElementById("text2")), 2, "Returns the index of a child amongst its siblings");
        assert.strictEqual(dom.index(dom.parse("<div/>")), 0, "Node without parent returns 0");
    }
    exports.indexTest = indexTest;
    function appendTest() {
        dom.append(document.getElementById("yahoo"), "<b>buga</b>");
        assert.strictEqual(document.getElementById("en").textContent.replace(/[\r\n]/g, ""), "This is a normal link: Yahoobuga", "Insert String after");
        afterEach();
        beforeEach();
        dom.append(document.getElementById("yahoo"), document.getElementById("first"));
        assert.strictEqual(document.getElementById("en").textContent.replace(/[\r\n]/g, ""), "This is a normal link: YahooTry them out:", "Insert element after");
        afterEach();
        beforeEach();
        dom.append(document.getElementById("yahoo"), document.getElementById("mark"));
        assert.strictEqual(document.getElementById("en").textContent.replace(/[\r\n]/g, ""), "This is a normal link: Yahoodiveintomark", "Insert dom after");
        var div = dom.parse("<div/>");
        dom.append(div, "<span></span><span>test</span>");
        assert.strictEqual(div.lastChild.nodeName.toLowerCase(), "span", "Insert the element after the disconnected node.");
        assert.strictEqual(dom.append(document.getElementById("select3"), "<option value='appendTest'>Append Test</option>").value, "appendTest", "Appending html options to select element");
        afterEach();
        beforeEach();
        dom.append(document.getElementById("sap"), document.getElementById("first"));
        assert.strictEqual(document.getElementById("sap").textContent.replace(/[\r\n]/g, '').replace("hasclass", "has class"), "This link has class=\"blog\": Simon Willison's WeblogTry them out:", "Check for appending of element");
        afterEach();
        beforeEach();
        dom.append(document.getElementById("sap"), " text with spaces ");
        assert.ok(document.getElementById("sap").innerHTML.match(/ text with spaces $/), "Check for appending text with spaces");
        afterEach();
        beforeEach();
        var old = document.getElementById("sap").innerHTML;
        dom.append(document.getElementById("sap"), "");
        assert.equal(document.getElementById("sap").innerHTML, old, "Check for appending an empty string.");
        afterEach();
        beforeEach();
        dom.append(document.getElementById("form"), "<input name='radiotest' type='radio' checked='checked' />");
        assert.ok(dom.find(document.getElementById("form"), "input[name=radiotest]").checked, "Append checked radio");
        afterEach();
        beforeEach();
        dom.append(document.getElementById("form"), "<input name='radiotest' type='radio' checked    =   'checked' />");
        assert.ok(dom.find(document.getElementById("form"), "input[name=radiotest]").checked, "Append checked radio");
        afterEach();
        beforeEach();
        dom.append(document.getElementById("form"), "<input name='radiotest' type='radio' checked />");
        assert.ok(dom.find(document.getElementById("form"), "input[name=radiotest]").checked, "Append HTML5-formated checked radio");
        afterEach();
        beforeEach();
        dom.append(document.getElementById("sap"), document.getElementById("form"));
        assert.strictEqual(!dom.find(document.getElementById("sap"), 'form'), false, "Check for appending a form"); // Bug #910
        afterEach();
        beforeEach();
        var pass = true;
        try {
            var body = document.getElementById("iframe").contentWindow.document.body;
            if (body !== null) {
                pass = false;
                dom.append(body, "<div>test</div>");
            }
            pass = true;
        }
        catch (e) { }
        assert.ok(pass, "Test for appending a DOM node to the contents of an IFrame");
        afterEach();
        beforeEach();
        dom.append(document.getElementById("select1"), "<OPTION>Test</OPTION>");
        assert.strictEqual(dom.last(document.getElementById("select1"), 'option').textContent, "Test", "Appending <OPTION> (all caps)");
        var colgroup = dom.append(document.getElementById("table"), "<colgroup></colgroup>");
        assert.strictEqual(document.getElementById("table").lastChild.tagName.toLowerCase(), "colgroup", "Append colgroup");
        dom.append(colgroup, "<col/>");
        assert.strictEqual(dom.last(colgroup).tagName, "COL", "Append col");
        afterEach();
        beforeEach();
        dom.append(document.getElementById("table"), "<caption></caption>");
        assert.strictEqual(dom.first(document.getElementById("table")).tagName.toLowerCase(), "caption", "Append caption");
        afterEach();
        beforeEach();
        var prev = dom.children(document.getElementById("sap")).length;
        dom.append(document.getElementById("sap"), "<span></span><span></span><span></span>");
        assert.strictEqual(dom.children(document.getElementById("sap")).length, prev + 3, "Make sure that multiple arguments works.");
    }
    exports.appendTest = appendTest;
    function prependTest() {
        dom.prepend(document.getElementById("first"), "<b>buga</b>");
        assert.strictEqual(document.getElementById("first").textContent, "bugaTry them out:", "Check if text prepending works");
        assert.strictEqual(dom.prepend(document.getElementById("select3"), "<option value='prependTest'>Prepend Test</option>").value, "prependTest", "Prepending html options to select element");
        afterEach();
        beforeEach();
        var expected = "Try them out:This link has class=\"blog\": Simon Willison's Weblog";
        dom.prepend(document.getElementById("sap"), document.getElementById("first"));
        assert.strictEqual(document.getElementById("sap").textContent.replace(/[\r\n]/g, "").replace("hasclass", "has class"), expected, "Check for prepending of element");
        afterEach();
        beforeEach();
        expected = "YahooThis link has class=\"blog\": Simon Willison's Weblog";
        dom.prepend(document.getElementById("sap"), document.getElementById("yahoo"));
        assert.strictEqual(document.getElementById("sap").textContent.replace(/[\r\n]/g, "").replace("hasclass", "has class"), expected, "Check for prepending of dom.parse object");
    }
    exports.prependTest = prependTest;
    function beforeTest() {
        var expected = "This is a normal link: bugaYahoo";
        dom.before(document.getElementById("yahoo"), "<b>buga</b>");
        assert.strictEqual(document.getElementById("en").textContent.replace(/[\r\n]/g, ""), expected, "Insert String before");
        afterEach();
        beforeEach();
        expected = "This is a normal link: Try them out:Yahoo";
        dom.before(document.getElementById("yahoo"), document.getElementById("first"));
        // !Safari
        assert.strictEqual(document.getElementById("en").textContent.replace(/[\r\n]/g, "").replace("link:T", "link: T"), expected, "Insert element before");
        afterEach();
        beforeEach();
        expected = "This is a normal link: diveintomarkYahoo";
        dom.before(document.getElementById("yahoo"), document.getElementById("mark"));
        assert.strictEqual(document.getElementById("en").textContent.replace(/[\r\n]/g, ""), expected, "Insert dom.parse before");
    }
    exports.beforeTest = beforeTest;
    function afterTest() {
        var expected = "This is a normal link: Yahoobuga";
        dom.after(document.getElementById("yahoo"), "<b>buga</b>");
        assert.strictEqual(document.getElementById("en").textContent.replace(/[\r\n]/g, ""), expected, "Insert String after");
        afterEach();
        beforeEach();
        expected = "This is a normal link: YahooTry them out:";
        dom.after(document.getElementById("yahoo"), document.getElementById("first"));
        assert.strictEqual(document.getElementById("en").textContent.replace(/[\r\n]/g, ""), expected, "Insert element after");
        afterEach();
        beforeEach();
        expected = "This is a normal link: Yahoodiveintomark";
        dom.after(document.getElementById("yahoo"), document.getElementById("mark"));
        assert.strictEqual(document.getElementById("en").textContent.replace(/[\r\n]/g, ""), expected, "Insert dom.parse after");
    }
    exports.afterTest = afterTest;
    function removeTest() {
        dom.remove(document.getElementById("ap"));
        assert.ok(!document.getElementById("ap"));
    }
    exports.removeTest = removeTest;
    function cloneTest() {
        assert.strictEqual(dom.clone(document.getElementById("qunit-fixture")).childNodes.length, document.getElementById("qunit-fixture").childNodes.length, "Simple child length to ensure a large dom tree copies correctly");
        assert.strictEqual("This is a normal link: Yahoo", document.getElementById("en").textContent, "Assert text for #en");
        var clone = dom.clone(document.getElementById("yahoo"));
        dom.append(document.getElementById("first"), clone);
        assert.strictEqual("Try them out:Yahoo", document.getElementById("first").textContent, "Check for clone");
        assert.strictEqual("This is a normal link: Yahoo", document.getElementById("en").textContent, "Reassert text for #en");
        var cloneTags = [
            "<table/>", "<tr/>", "<td/>", "<div/>",
            "<button/>", "<ul/>", "<ol/>", "<li/>",
            "<input type='checkbox' />", "<select/>", "<option/>", "<textarea/>",
            "<tbody/>", "<thead/>", "<tfoot/>", "<iframe/>"
        ];
        for (var i = 0; i < cloneTags.length; i++) {
            var j = dom.parse(cloneTags[i]);
            assert.strictEqual(j.tagName, dom.clone(j).tagName, "Clone a " + cloneTags[i]);
        }
        // var div = dom.parse("<div><ul><li>test</li></ul></div>") as HTMLElement;
        // dom.on(div, 'click', function () {
        //     assert.ok(true, "Bound event still exists.");
        // });
        // clone = dom.clone(div) as HTMLElement;
        // // manually clean up detached elements
        // dom.remove(div);
        // div = dom.clone(clone);
        // // manually clean up detached elements
        // dom.remove(clone);
        // assert.strictEqual(div.nodeName.toUpperCase(), "DIV", "DIV element cloned");
        // dom.trigger(div, "click");
        // // manually clean up detached elements
        // div.remove();
        var div = dom.parse("<div/>");
        dom.append(div, document.createElement("table"));
        dom.on(dom.find("table"), 'click', function () {
            assert.ok(true, "Bound event still exists.");
        });
        clone = dom.clone(div);
        assert.strictEqual(clone.nodeName.toUpperCase(), "DIV", "DIV element cloned");
        // dom.trigger(dom.find(clone, "table")!, "click");
        // manually clean up detached elements
        dom.remove(div);
        dom.remove(clone);
        var divEvt = dom.parse("<div><ul><li>test</li></ul></div>");
        dom.on(divEvt, 'click', function () {
            assert.ok(false, "Bound event still exists after .clone().");
        });
        var cloneEvt = dom.clone(divEvt);
        // Make sure that doing .clone() doesn't clone events
        dom.trigger(cloneEvt, "click");
        dom.remove(cloneEvt);
        dom.remove(divEvt);
        // this is technically an invalid object, but because of the special
        // classid instantiation it is the only kind that IE has trouble with,
        // so let's test with it too.
        div = dom.parse("<div/>");
        dom.setHtml(div, "<object height='355' width='425' classid='clsid:D27CDB6E-AE6D-11cf-96B8-444553540000'>  <param name='movie' value='http://www.youtube.com/v/3KANI2dpXLw&amp;hl=en'>  <param name='wmode' value='transparent'> </object>");
        // !IE9
        clone = dom.clone(div);
        assert.strictEqual(dom.getHtml(clone), dom.getHtml(div), "Element contents cloned");
        assert.strictEqual(clone.nodeName.toUpperCase(), "DIV", "DIV element cloned");
        // and here's a valid one.
        div = dom.parse("<div/>");
        dom.setHtml(div, "<object height='355' width='425' type='application/x-shockwave-flash' data='http://www.youtube.com/v/3KANI2dpXLw&amp;hl=en'>  <param name='movie' value='http://www.youtube.com/v/3KANI2dpXLw&amp;hl=en'>  <param name='wmode' value='transparent'> </object>");
        clone = dom.clone(div);
        assert.strictEqual(dom.getHtml(clone), dom.getHtml(div), "Element contents cloned");
        assert.strictEqual(clone.nodeName.toUpperCase(), "DIV", "DIV element cloned");
        // manually clean up detached elements
        div.remove();
        clone.remove();
        var form = document.createElement("form");
        form.action = "/test/";
        var div = document.createElement("div");
        div.appendChild(document.createTextNode("test"));
        form.appendChild(div);
        assert.strictEqual(dom.children(dom.clone(form)).length, 1, "Make sure we just get the form back.");
        assert.strictEqual(dom.clone(document.body).tagName, "BODY", "Make sure cloning body works");
        // clone(form element) (Bug #3879, #6655)
        var element = dom.parse("<select><option>Foo</option><option selected>Bar</option></select>");
        assert.strictEqual(dom.find(dom.clone(element), "[selected]").textContent, dom.find(element, "[selected]").textContent, "Selected option cloned correctly");
        element = dom.parse("<input type='checkbox' value='foo'>");
        dom.setAttr(element, "checked", "checked");
        clone = dom.clone(element);
        assert.strictEqual(clone.defaultValue, "foo", "Checked input defaultValue cloned correctly");
        // defaultChecked also gets set now due to setAttribute in attr, is this check still valid?
        // assert.strictEqual( clone.defaultChecked, !noCloneChecked, "Checked input defaultChecked cloned correctly" );
        element = dom.parse("<input type='text' value='foo'>");
        clone = dom.clone(element);
        assert.strictEqual(clone.defaultValue, "foo", "Text input defaultValue cloned correctly");
        element = dom.parse("<textarea>foo</textarea>");
        clone = dom.clone(element);
        assert.strictEqual(clone.defaultValue, "foo", "Textarea defaultValue cloned correctly");
        // clone(multiple selected options
        element = dom.parse("<select><option>Foo</option><option selected>Bar</option><option selected>Baz</option></select>");
        clone = dom.clone(element);
        assert.strictEqual(dom.query(clone, "[selected]").length, dom.query(element, "[selected]").length, "Multiple selected options cloned correctly");
        // clone - no exceptions for object elements #9587
        try {
            dom.clone(document.getElementById("no-clone-exception"));
            assert.ok(true, "cloned with no exceptions");
        }
        catch (e) {
            assert.ok(false, e.message);
        }
    }
    exports.cloneTest = cloneTest;
    function getAttrTest() {
        assert.strictEqual(dom.getAttr(document.getElementById("text1"), "type"), "text", "Check for type attribute");
        assert.strictEqual(dom.getAttr(document.getElementById("radio1"), "type"), "radio", "Check for type attribute");
        assert.strictEqual(dom.getAttr(document.getElementById("check1"), "type"), "checkbox", "Check for type attribute");
        assert.strictEqual(dom.getAttr(document.getElementById("simon1"), "rel"), "bookmark", "Check for rel attribute");
        assert.strictEqual(dom.getAttr(document.getElementById("google"), "title"), "Google!", "Check for title attribute");
        assert.strictEqual(dom.getAttr(document.getElementById("mark"), "hreflang"), "en", "Check for hreflang attribute");
        assert.strictEqual(dom.getAttr(document.getElementById("en"), "lang"), "en", "Check for lang attribute");
        assert.strictEqual(dom.getAttr(document.getElementById("simon"), "class"), "blog link", "Check for class attribute");
        assert.strictEqual(dom.getAttr(document.getElementById("name"), "name"), "name", "Check for name attribute");
        assert.strictEqual(dom.getAttr(document.getElementById("text1"), "name"), "action", "Check for name attribute");
        // assert.ok(dom.getAttr(document.getElementById("form")!, "action")!.indexOf("formaction") >= 0, "Check for action attribute");
        dom.setAttr(document.getElementById("text1"), "value", "t");
        assert.strictEqual(dom.getAttr(document.getElementById("text1"), "value"), "t", "Check setting the value attribute");
        assert.strictEqual(dom.getAttr(dom.parse("<div value='t'></div>"), "value"), "t", "Check setting custom attr named 'value' on a div");
        dom.setAttr(document.getElementById("form"), "blah", "blah");
        assert.strictEqual(dom.getAttr(document.getElementById("form"), "blah"), "blah", "Set non-existant attribute on a form");
        assert.strictEqual(dom.getAttr(document.getElementById("foo"), "height"), null, "Non existent height attribute should return null");
        // [7472] & [3113] (form contains an input with name="action" or name="id")
        // var extras = document.getElementById("testForm")!.appendChild(dom.parse("<input name='id' name='name' /><input id='target' name='target' />"));
        // dom.setAttr(document.getElementById("form")!, "action", "newformaction");
        // assert.strictEqual(dom.getAttr(document.getElementById("form")!, "action"), "newformaction", "Check that action attribute was changed");
        // assert.strictEqual(dom.getAttr(document.getElementById("testForm")!, "target", 1), null, "Retrieving target does not equal the input with name=target");
        // dom.setAttr(document.getElementById("testForm")!, "target", "newTarget");
        // assert.strictEqual(dom.getAttr(document.getElementById("testForm")!, "target"), "newTarget", "Set target successfully on a form");
        // const testForm = document.getElementById("testForm")!;
        // dom.setAttr(testForm, "id", null);
        // assert.strictEqual(dom.getAttr(testForm, "id"), null, "Retrieving id does not equal the input with name=id after id is removed [#7472]");
        // Bug #3685 (form contains input with name="name")
        // assert.strictEqual(dom.getAttr(testForm, "name"), null, "Retrieving name does not retrieve input with name=name");
        //  (extras as any).remove();
        assert.equal(dom.getAttr(document.getElementById("text1"), "maxlength"), "30", "Check for maxlength attribute");
        assert.equal(dom.getAttr(document.getElementById("text1"), "maxLength"), "30", "Check for maxLength attribute");
        assert.equal(dom.getAttr(document.getElementById("area1"), "maxLength"), "30", "Check for maxLength attribute");
        // using innerHTML in IE causes href attribute to be serialized to the full path
        document.getElementById("qunit-fixture").appendChild(dom.parse("<a id='tAnchor5' href='#5'/>"));
        assert.ok(dom.getAttr(document.getElementById("tAnchor5"), "href").indexOf("#5") >= 0, "Check for non-absolute href (an anchor)");
        // // list attribute is readonly by default in browsers that support it
        // dom.setAttr(document.getElementById("list-test")!, "list", "datalist");
        // assert.strictEqual(dom.getAttr(document.getElementById("list-test")!, "list"), "datalist", "Check setting list attribute");
        // Related to [5574] and [5683]
        assert.strictEqual(dom.getAttr(document.body, "foo2"), null, "Make sure that a non existent attribute returns null");
        document.body.setAttribute("foo", "baz");
        assert.strictEqual(dom.getAttr(document.body, "foo"), "baz", "Make sure the dom attribute is retrieved when no expando is found");
        dom.setAttr(document.body, "foo", "cool");
        assert.strictEqual(dom.getAttr(document.body, "foo"), "cool", "Make sure that setting works well when both expando and dom attribute are available");
        document.body.removeAttribute("foo"); // Cleanup
        // var select = document.createElement("select"), optgroup = document.createElement("optgroup"), option = document.createElement("option");
        // optgroup.appendChild(option);
        // select.appendChild(optgroup);
        // assert.strictEqual(dom.getAttr(option, "selected"), true, "Make sure that a single option is selected, even when in an optgroup.");
        var $img = document.body.appendChild(dom.parse("<img style='display:none' width='215' height='53' src='../../assets/resources/userface.png' />"));
        assert.strictEqual(dom.getAttr($img, "width"), 215, "Retrieve width attribute an an element with display:none.");
        assert.strictEqual(dom.getAttr($img, "height"), 53, "Retrieve height attribute an an element with display:none.");
        // Check for style support
        // assert.ok(!!~dom.getAttr(document.getElementById("dl")!, "style")!.indexOf("position"), "Check style attribute getter, also normalize css props to lowercase");
        // dom.setAttr(document.getElementById("foo")!, "style", "position:absolute;");
        // assert.ok(document.getElementById("foo")!.style.cssText.indexOf("position") >= 0, "Check style setter");
        // Check value on button element (#1954)
        var $button = dom.after(document.getElementById("button"), "<button value='foobar'>text</button>");
        assert.strictEqual(dom.getAttr($button, "value"), "foobar", "Value retrieval on a button does not return innerHTML");
        dom.setAttr($button, "value", "baz");
        assert.strictEqual($button.innerHTML, "text", "Setting the value does not change innerHTML");
        // Attributes with a colon on a table element (#1591)
        // assert.strictEqual(dom.getAttr(document.getElementById("table")!, "test:attrib"), null, "Retrieving a non-existent attribute on a table with a colon does not throw an error.");
        dom.setAttr(document.getElementById("table"), "test:attrib", "foobar");
        assert.strictEqual(dom.getAttr(document.getElementById("table"), "test:attrib"), "foobar", "Setting an attribute on a table with a colon does not throw an error.");
        var $form = document.getElementById("qunit-fixture").appendChild(dom.parse("<form class='something'></form>"));
        assert.strictEqual(dom.getAttr($form, "class"), "something", "Retrieve the class attribute on a form.");
        var $a = document.getElementById("qunit-fixture").appendChild(dom.parse("<a href='#' onclick='return 1'>Click</a>"));
        assert.strictEqual(dom.getAttr($a, "onclick")(), 1, "Retrieve ^on attribute without anonymous function wrapper.");
        assert.strictEqual(dom.getAttr(dom.parse("<div/>"), "doesntexist"), null, "Make sure null is returned when no attribute is found.");
        assert.strictEqual(dom.getAttr(dom.parse("<div/>"), "title"), "", "Make sure null is returned when no attribute is found.");
        var div = dom.parse("<div/>");
        dom.setAttr(div, "title", "something");
        assert.strictEqual(dom.getAttr(div, "title"), "something", "Set the title attribute.");
        assert.strictEqual(dom.getAttr(dom.parse("<div/>"), "value"), null, "An unset value on a div returns undefined.");
        assert.strictEqual(dom.getAttr(dom.parse("<input/>"), "value"), "", "An unset value on an input returns current value.");
        dom.setAttr(document.getElementById("form"), "enctype", "multipart/form-data");
        assert.strictEqual(dom.getAttr(document.getElementById("form"), "enctype"), "multipart/form-data", "Set the enctype of a form (encoding in IE6/7 #6743)");
        // elements not natively tabbable
        assert.strictEqual(dom.getAttr(document.getElementById("listWithTabIndex"), "tabindex"), "5", "not natively tabbable, with tabindex set to 0");
        assert.strictEqual(dom.getAttr(document.getElementById("divWithNoTabIndex"), "tabindex"), null, "not natively tabbable, no tabindex set");
        // anchor with href
        assert.strictEqual(dom.getAttr(document.getElementById("linkWithNoTabIndex"), "tabindex"), null, "anchor with href, no tabindex set");
        assert.strictEqual(dom.getAttr(document.getElementById("linkWithTabIndex"), "tabindex"), "2", "anchor with href, tabindex set to 2");
        assert.strictEqual(dom.getAttr(document.getElementById("linkWithNegativeTabIndex"), "tabindex"), "-1", "anchor with href, tabindex set to -1");
        // anchor without href
        assert.strictEqual(dom.getAttr(document.getElementById("linkWithNoHrefWithNoTabIndex"), "tabindex"), null, "anchor without href, no tabindex set");
        assert.strictEqual(dom.getAttr(document.getElementById("linkWithNoHrefWithTabIndex"), "tabindex"), "1", "anchor without href, tabindex set to 2");
        assert.strictEqual(dom.getAttr(document.getElementById("linkWithNoHrefWithNegativeTabIndex"), "tabindex"), "-1", "anchor without href, no tabindex set");
    }
    exports.getAttrTest = getAttrTest;
    function setAttrTest() {
        var div = document.getElementById("foo");
        dom.setAttr(div, "foo", "bar");
        assert.strictEqual(div.getAttribute("foo"), "bar", "Set Attribute");
        dom.setAttr(document.getElementById("foo"), "width", null);
        dom.setAttr(document.getElementById("name"), "name", "something");
        assert.strictEqual(dom.getAttr(document.getElementById("name"), "name"), "something", "Set name attribute");
        // dom.setAttr(document.getElementById("name")!, "name", null);
        // assert.strictEqual(dom.getAttr(document.getElementById("name")!, "name"), null, "Remove name attribute");
        assert.strictEqual(dom.getAttr(dom.parse("<input name=something>"), "name"), "something", "Check element creation gets/sets the name attribute.");
        dom.setAttr(document.getElementById("check2"), "checked", null);
        assert.strictEqual(document.getElementById("check2").checked, false, "Set checked attribute");
        assert.strictEqual(dom.getAttr(document.getElementById("check2"), "checked"), false, "Set checked attribute");
        dom.setAttr(document.getElementById("text1"), "readonly", "readonly");
        assert.strictEqual(document.getElementById("text1").readOnly, true, "Set readonly attribute");
        assert.strictEqual(dom.getAttr(document.getElementById("text1"), "readonly"), "readonly", "Set readonly attribute");
        dom.setAttr(document.getElementById("text1"), "readOnly", false);
        assert.strictEqual(document.getElementById("text1").readOnly, false, "Set readonly attribute");
        assert.strictEqual(dom.getAttr(document.getElementById("text1"), "readOnly"), false, "Set readonly attribute");
        document.getElementById("check2").checked = true;
        assert.strictEqual(document.getElementById("check2").checked, true, "Set checked attribute");
        assert.strictEqual(dom.getAttr(document.getElementById("check2"), "checked"), true, "Set checked attribute");
        document.getElementById("check2").checked = false;
        assert.strictEqual(document.getElementById("check2").checked, false, "Set checked attribute");
        assert.strictEqual(dom.getAttr(document.getElementById("check2"), "checked"), false, "Set checked attribute");
        dom.setAttr(document.getElementById("check2"), "checked", "checked");
        assert.strictEqual(document.getElementById("check2").checked, true, "Set checked attribute with 'checked'");
        assert.strictEqual(dom.getAttr(document.getElementById("check2"), "checked"), true, "Set checked attribute");
        document.getElementById("text1").readOnly = true;
        assert.strictEqual(document.getElementById("text1").readOnly, true, "Set readonly attribute");
        assert.strictEqual(dom.getAttr((document.getElementById("text1")), "readOnly"), true, "Set readonly attribute");
        document.getElementById("text1").readOnly = false;
        assert.strictEqual(document.getElementById("text1").readOnly, false, "Set readonly attribute");
        assert.strictEqual(dom.getAttr((document.getElementById("text1")), "readOnly"), false, "Set readonly attribute");
        dom.setAttr(document.getElementById("name"), "maxlength", "5");
        assert.strictEqual(document.getElementById("name").maxLength, 5, "Set maxlength attribute");
        dom.setAttr(document.getElementById("name"), "maxLength", "10");
        assert.strictEqual(document.getElementById("name").maxLength, 10, "Set maxlength attribute");
        // HTML5 boolean attributes
        var $text = document.getElementById("text1");
        dom.setAttr($text, "autofocus", true);
        dom.setAttr($text, "required", true);
        assert.strictEqual(dom.getAttr($text, "autofocus"), true, "Set boolean attributes to the same name");
        dom.setAttr($text, "autofocus", false);
        assert.strictEqual(dom.getAttr($text, "autofocus"), false, "Setting autofocus attribute to false removes it");
        assert.strictEqual(dom.getAttr($text, "required"), true, "Set boolean attributes to the same name");
        dom.setAttr($text, "required", false);
        assert.strictEqual(dom.getAttr($text, "required"), false, "Setting required attribute to false removes it");
        var $details = dom.parse("<details open></details>");
        $details = dom.first($details) || $details;
        document.getElementById("qunit-fixture").appendChild($details);
        // assert.strictEqual( !$details.getAttr("open"), true, "open attribute presense indicates true" );
        dom.setAttr($details, "open", false);
        assert.strictEqual(dom.getAttr($details, "open"), false, "Setting open attribute to false removes it");
        dom.setAttr($text, "data-something", true);
        assert.strictEqual(dom.getAttr($text, "data-something"), true, "Set data attributes");
        assert.strictEqual(dom.getAttr($text, "something"), null, "Setting data attributes are not affected by boolean settings");
        dom.setAttr($text, "data-another", false);
        assert.strictEqual(dom.getAttr($text, "data-another"), false, "Set data attributes");
        //assert.strictEqual( $text.data("another"), false, "Setting data attributes are not affected by boolean settings" );
        dom.setAttr($text, "aria-disabled", false);
        assert.strictEqual(dom.getAttr($text, "aria-disabled"), false, "Setting aria attributes are not affected by boolean settings");
        dom.setAttr(document.getElementById("foo"), "contenteditable", true);
        assert.strictEqual(dom.getAttr(document.getElementById("foo"), "contenteditable"), true, "Enumerated attributes are set properly");
        // assert.strictEqual(dom.getAttr(document, "nonexisting"), null, "attr works correctly for non existing attributes.");
        // dom.setAttr(document, "something", "foo");
        // assert.strictEqual(dom.getAttr(document, "something"), "foo", "attr falls back to prop on unsupported arguments");
        var table = document.getElementById("table");
        dom.append(table, "<tr><td>cell</td></tr><tr><td>cell</td><td>cell</td></tr><tr><td>cell</td><td>cell</td></tr>");
        var td = dom.find(table, "td");
        dom.setAttr(td, "rowspan", "2");
        assert.strictEqual(td.rowSpan, 2, "Check rowspan is correctly set");
        dom.setAttr(td, "colspan", "2");
        assert.strictEqual(td.colSpan, 2, "Check colspan is correctly set");
        dom.setAttr(table, "cellspacing", "2");
        assert.strictEqual(table.cellSpacing, "2", "Check cellspacing is correctly set");
        assert.strictEqual(dom.getAttr(document.getElementById("area1"), "value"), "foobar", "Value attribute retrieves the property for backwards compatibility.");
        // for #1070
        dom.setAttr(document.getElementById("name"), "someAttr", "0");
        assert.strictEqual(dom.getAttr(document.getElementById("name"), "someAttr"), "0", "Set attribute to a string of \"0\"");
        dom.setAttr(document.getElementById("name"), "someAttr", 0);
        assert.strictEqual(dom.getAttr(document.getElementById("name"), "someAttr"), 0, "Set attribute to the number 0");
        dom.setAttr(document.getElementById("name"), "someAttr", 1);
        assert.strictEqual(dom.getAttr(document.getElementById("name"), "someAttr"), 1, "Set attribute to the number 1");
        afterEach();
        beforeEach();
        // // Type
        // var type = dom.getAttr(document.getElementById("check2")!, "type");
        // try {
        //     document.getElementById("check2").setAttr("type", "hidden");
        // } catch (e) {
        // }
        // assert.ok(true, "Exception thrown when trying to change type property");
        // // assert.strictEqual( type, document.getElementById("check2").getAttr("type"), "Verify that you can't change the type of an input element" );
        // var check = document.createElement("input");
        // //var thrown = true;
        // try {
        //     dom.setAttr(check, "type", "checkbox");
        // } catch (e) {
        //     //thrown = false;
        // }
        // assert.ok(true, "Exception thrown when trying to change type property");
        // assert.strictEqual( "checkbox", check.getAttr("type"), "Verify that you can change the type of an input element that isn't in the DOM" );
        // var check = dom.parse("<input />")!;
        // //var thrown = true;
        // try {
        //     dom.setAttr(check, "type", "checkbox");
        // } catch (e) {
        //     //thrown = false;
        // }
        // assert.ok(true, "Exception thrown when trying to change type property");
        // assert.strictEqual( "checkbox", check.getAttr("type"), "Verify that you can change the type of an input element that isn't in the DOM" );
        // var button = document.getElementById("button")!;
        // //var thrown = false;
        // try {
        //     dom.setAttr(button, "type", "submit");
        // } catch (e) {
        //     //thrown = true;
        // }
        // assert.ok(true, "Exception thrown when trying to change type property");
        // assert.strictEqual( "button", button.getAttr("type"), "Verify that you can't change the type of a button element" );
        var $radio = document.getElementById("testForm").appendChild(dom.parse("<input value='sup' type='radio'>"));
        assert.strictEqual($radio.value, "sup", "Value is not reset when type is set after value on a radio");
        // Setting attributes on svg element
        var $svg = dom.parse("<svg xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' version='1.1' baseProfile='full' width='200' height='200'>\n                <circle cx='200' cy='200' r='150' />\n            </svg>");
        dom.setAttr($svg, "cx", 100);
        assert.strictEqual(dom.getAttr($svg, "cx"), 100, "Set attribute on svg element");
        var element = document.getElementById("divWithNoTabIndex");
        assert.strictEqual(dom.getAttr(element, "tabindex"), null, "start with no tabindex");
        // set a positive string
        dom.setAttr(element, "tabindex", "1");
        assert.strictEqual(dom.getAttr(element, "tabindex"), "1", "set tabindex to 1 (string)");
        // set a zero string
        dom.setAttr(element, "tabindex", "0");
        assert.strictEqual(dom.getAttr(element, "tabindex"), "0", "set tabindex to 0 (string)");
        // set a negative string
        dom.setAttr(element, "tabindex", "-1");
        assert.strictEqual(dom.getAttr(element, "tabindex"), "-1", "set tabindex to -1 (string)");
        // // set a positive number
        // dom.setAttr(element, "tabindex", 1);
        // assert.strictEqual(dom.getAttr(element, "tabindex"), "1", "set tabindex to 1 (number)");
        // // set a zero number
        // dom.setAttr(element, "tabindex", 0);
        // assert.strictEqual(dom.getAttr(element, "tabindex"), "0", "set tabindex to 0 (number)");
        // // set a negative number
        // dom.setAttr(element, "tabindex", -1);
        // assert.strictEqual(dom.getAttr(element, "tabindex"), "-1", "set tabindex to -1 (number)");
        element = document.getElementById("linkWithTabIndex");
        assert.strictEqual(dom.getAttr(element, "tabindex"), "2", "start with tabindex 2");
        // dom.setAttr(element, "tabindex", -1);
        // assert.strictEqual(dom.getAttr(element, "tabindex"), "-1", "set negative tabindex");
        dom.setAttr(document.getElementById("mark"), "class", null);
        assert.strictEqual(dom.getAttr(document.getElementById("mark"), "class"), null, "remove class");
        var form = document.getElementById("form");
        dom.setAttr(form, "id", null);
        assert.strictEqual(dom.getAttr(form, "id"), "", "Remove id");
        dom.setAttr(form, "id", "form");
        dom.setAttr(document.getElementById("foo"), "style", "position:absolute;");
        dom.setAttr(document.getElementById("foo"), "style", null);
        assert.notEqual(dom.getStyle(document.getElementById("foo"), "position"), "absolute", "Check removing style attribute");
        dom.setAttr(document.getElementById("form"), "style", "position:absolute;");
        dom.setAttr(document.getElementById("form"), "style", null);
        assert.notEqual(dom.getStyle(document.getElementById("foo"), "position"), "absolute", "Check removing style attribute on a form");
        var elem = dom.parse("<div style='position: absolute'></div>");
        dom.setAttr(elem, "style", null);
        assert.strictEqual(elem.style.cssText, "", "Check removing style attribute (#9699 Webkit)");
        var elem = dom.find("#fx-test-group");
        dom.setAttr(elem, "height", "3px");
        dom.setAttr(elem, "height", null);
        assert.strictEqual(elem.style.height, "1px", "Removing height attribute has no effect on height set with style attribute");
        dom.setAttr(document.getElementById("check1"), "checked", null);
        dom.setAttr(document.getElementById("check1"), "checked", true);
        dom.setAttr(document.getElementById("check1"), "checked", null);
        assert.strictEqual(document.getElementById("check1").checked, false, "removeAttr sets boolean properties to false");
        dom.setAttr(document.getElementById("text1"), "readOnly", true);
        dom.setAttr(document.getElementById("text1"), "readonly", null);
        assert.strictEqual(document.getElementById("text1").readOnly, false, "removeAttr sets boolean properties to false");
        dom.setAttr(document.getElementById("option2c"), "selected", null);
        assert.strictEqual(dom.getAttr(document.getElementById("option2d"), "selected"), true, "Removing `selected` from an option that is not selected does not remove selected from the currently selected option (#10870)");
        try {
            var $first = document.getElementById("first");
            dom.setAttr($first, "contenteditable", "true");
            dom.setAttr($first, "contenteditable", null);
            assert.strictEqual(dom.getAttr($first, 'contenteditable'), null, "Remove the contenteditable attribute");
        }
        catch (e) {
            assert.ok(false, "Removing contenteditable threw an error (#10429)");
        }
        var $first = dom.parse("<div Case='mixed'></div>");
        assert.strictEqual(dom.getAttr($first, "Case"), "mixed", "case of attribute doesn't matter");
        dom.setAttr($first, "Case", null);
        // IE 6/7 return empty string here, not undefined
        assert.ok(!dom.getAttr($first, "Case"), "mixed-case attribute was removed");
        // // getText() respects numbers without exception (Bug #9319)
        // if ("value" in document.createElement("meter") &&
        //     "value" in document.createElement("progress")) {
        //     var $meter = dom.parse("<meter min='0' max='10' value='5.6'></meter>") as HTMLMeterElement,
        //         $progress = dom.parse("<progress max='10' value='1.5'></progress>") as HTMLProgressElement;
        //     assert.strictEqual(typeof dom.getText($meter), "string", "meter, returns a number and does not throw exception");
        //     assert.strictEqual(dom.getText($meter), $meter.value, "meter, api matches host and does not throw exception");
        //     assert.strictEqual(typeof dom.getText($progress)!, "string", "progress, returns a number and does not throw exception");
        //     assert.strictEqual(dom.getText($progress)!, $progress.value, "progress, api matches host and does not throw exception");
        // }
        // setText(select) after form.reset()
        // testing if a form.reset() breaks a subsequent call to a select element's !.textContent! (in IE only)
        document.getElementById("qunit-fixture").appendChild(dom.parse("<form id='kk' name='kk'><select id='kkk'><option value='cf'>cf</option><option 	value='gf'>gf</option></select></form>"));
        dom.setText(document.getElementById("kkk"), "gf");
        document.getElementById("kk").reset();
        assert.strictEqual(document.getElementById("kkk").value, "cf", "Check value of select after form reset.");
        assert.strictEqual(dom.getText(document.getElementById("kkk")), "cf", "Check value of select after form reset.");
        // // re-verify the multi-select is not broken (after form.reset) by our fix for single-select
        // assert.deepEqual(dom.getText(document.getElementById("select3")!).split(','), ["1", "2"], "Call getText() on a multiple=\"multiple\" select");
        dom.remove(document.getElementById("kk"));
    }
    exports.setAttrTest = setAttrTest;
    // // var bareObj = function (value) { return value; };
    // // var functionReturningObj = function (value) { return (function () { return value; }); };
    function getTextTest() {
        var expected = "This link has class=\"blog\": Simon Willison's Weblog";
        assert.strictEqual(dom.getText(document.getElementById("sap")).replace(/[\r\n]/g, "").replace("hasclass", "has class"), expected, "Check for merged text of more then one element.");
        // // Check serialization of text values
        // assert.strictEqual(dom.getText(document.getElementById("foo")!), "foo", "Text node was retreived from elem.textContent!.");
        var val = "<div><b>Hello</b> cruel world!</div>";
        dom.setText(document.getElementById("foo"), val);
        assert.strictEqual(document.getElementById("foo").innerHTML.replace(/>/g, "&gt;"), "&lt;div&gt;&lt;b&gt;Hello&lt;/b&gt; cruel world!&lt;/div&gt;", "Check escaped text");
        document.getElementById("text1").value = "bla";
        assert.strictEqual(dom.getText(document.getElementById("text1")), "bla", "Check for modified value of input element");
        afterEach();
        beforeEach();
        assert.strictEqual(dom.getText(document.getElementById("text1")), "Test", "Check for value of input element");
        // ticket #1714 this caused a JS error in IE
        assert.strictEqual(dom.getText(document.getElementById("first")), "Try them out:", "Check a paragraph element to see if it has a value");
        assert.strictEqual(dom.getText(document.getElementById("select2")), "3", "Call getText() on a single=\"single\" select");
        // assert.deepEqual(dom.getText(document.getElementById("select3")!), "1,2", "Call getText() on a multiple=\"multiple\" select");
        assert.strictEqual(dom.getText(document.getElementById("option3c")), "2", "Call getText() on a option element with value");
        assert.strictEqual(dom.getText(document.getElementById("option3a")), "Nothing", "Call getText() on a option element with empty value");
        assert.strictEqual(dom.getText(document.getElementById("option3e")), "no value", "Call getText() on a option element with no value attribute");
        assert.strictEqual(dom.getText(document.getElementById("option3a")), "Nothing", "Call getText() on a option element with no value attribute");
        // IE6 fails in this case. Just ignore it.
        dom.setText(document.getElementById("select3"), "");
        assert.deepEqual(dom.getText(document.getElementById("select3")), "", "Call getText() on a multiple=\"multiple\" select");
        // assert.deepEqual(document.getElementById("select4")!.textContent!, "1,2,3", "Call getText() on multiple=\"multiple\" select with all disabled options");
        dom.setAttr(document.getElementById("select4"), "disabled", "disabled");
        // assert.deepEqual(document.getElementById("select4")!.textContent!, "1,2,3", "Call getText() on disabled multiple=\"multiple\" select");
        assert.strictEqual(dom.getText(document.getElementById("select5")), "3", "Check value on ambiguous select.");
        dom.setText(document.getElementById("select5"), "1");
        assert.strictEqual(dom.getText(document.getElementById("select5")), "1", "Check value on ambiguous select.");
        dom.setText(document.getElementById("select5"), "3");
        assert.strictEqual(dom.getText(document.getElementById("select5")), "3", "Check value on ambiguous select.");
        var check = document.getElementById("form").appendChild(dom.parse("<input type='checkbox' name='test' value='1'/>"));
        assert.deepEqual(dom.getText(check), "1", "Get unchecked values.");
        dom.setText(check, "2");
        assert.deepEqual(dom.getText(check), "2", "Get a single checked value.");
        document.getElementById("form").removeChild(check);
        var button = dom.after(document.getElementById("button"), "<button value='foobar'>text</button>");
        assert.strictEqual(button.textContent, "text", "Value retrieval on a button does not return innerHTML");
        dom.setText(button, "baz");
        assert.strictEqual(dom.getHtml(button), "baz", "Setting the value does not change innerHTML");
    }
    exports.getTextTest = getTextTest;
    function setTextTest() {
        var option = dom.parse("<option/>");
        dom.setText(option, "test");
        assert.strictEqual(dom.getAttr(option, "value"), "test", "Setting value sets the value attribute");
    }
    exports.setTextTest = setTextTest;
    function getHtmlTest() {
        assert.equal(dom.getHtml(document.getElementById("foo")), document.getElementById("foo").innerHTML);
    }
    exports.getHtmlTest = getHtmlTest;
    function setHtmlTest() {
        var div = dom.find("#qunit-fixture > div");
        dom.setHtml(div, "<b>test</b>");
        assert.ok(div.childNodes.length === 1, "Set HTML");
        div = dom.parse("<div/>");
        dom.setHtml(div, "<div id='parent_1'><div id='child_1'></div></div><div id='parent_2'></div>");
        assert.strictEqual(dom.children(div).length, 2, "Make sure two child nodes exist.");
        assert.strictEqual(dom.children(dom.first(div)).length, 1, "Make sure that a grandchild exists.");
        var space = dom.parse("<div/>");
        dom.setHtml(space, "&#160;");
        assert.ok(/^\xA0$|^&nbsp;$/.test(space.innerHTML), "Make sure entities are passed through correctly.");
        var div3 = dom.parse("<div/>");
        dom.setHtml(div3, "&amp;");
        assert.strictEqual(div3.innerHTML, "&amp;", "Make sure entities are passed through correctly.");
        dom.setHtml(document.getElementById("qunit-fixture"), "<style>.foobar{color:green;}</style>");
        assert.strictEqual(dom.children(document.getElementById("qunit-fixture")).length, 1, "Make sure there is a child element.");
        assert.strictEqual(dom.children(document.getElementById("qunit-fixture"))[0].nodeName.toUpperCase(), "STYLE", "And that a style element was inserted.");
        afterEach();
        beforeEach();
        dom.setHtml(document.getElementById("qunit-fixture"), "<select/>");
        // document.find("#qunit-fixture select").setHtml( "<option>O1</option><option selected='selected'>O2</option><option>O3</option>" );
        // assert.strictEqual( document.find("#qunit-fixture select")!.textContent!, "O2", "Selected option correct" );
        var div4 = dom.parse("<div />");
        dom.setHtml(div4, 5);
        assert.strictEqual(dom.getHtml(div4), "5", "Setting a number as html");
        dom.setHtml(div, 0);
        assert.strictEqual(dom.getHtml(div), "0", "Setting a zero as html");
        var div2 = dom.parse("<div/>"), insert = "&lt;div&gt;hello1&lt;/div&gt;";
        dom.setHtml(div2, insert);
        assert.strictEqual(dom.getHtml(div2).replace(/>/g, "&gt;"), insert, "Verify escaped insertion.");
        dom.setHtml(div2, "x" + insert);
        assert.strictEqual(dom.getHtml(div2).replace(/>/g, "&gt;"), "x" + insert, "Verify escaped insertion.");
        // assert.strictEqual( div2.setHtml(" " + insert).getHtml().replace(/>/g, "&gt;"), " " + insert, "Verify escaped insertion." );
        var map = dom.parse("<map/>");
        dom.setHtml(map, "<area id='map01' shape='rect' coords='50,50,150,150' href='http://www.jquery.com/' alt='dom.parse'>");
        assert.strictEqual(map.childNodes.length, 1, "The area was inserted.");
        assert.strictEqual(map.firstChild.nodeName.toLowerCase(), "area", "The area was inserted.");
        afterEach();
        beforeEach();
        dom.setHtml(document.getElementById("qunit-fixture"), "<script type='something/else'>assert.ok( false, 'Non-script evaluated.' );</script><script type='text/javascript'>assert.ok( true, 'text/javascript is evaluated.' );</script><script>assert.ok( true, 'No type is evaluated.' );</script><div><script type='text/javascript'>assert.ok( true, 'Inner text/javascript is evaluated.' );</script><script>assert.ok( true, 'Inner No type is evaluated.' );</script><script type='something/else'>assert.ok( false, 'Non-script evaluated.' );</script></div>");
        var child = dom.query(document.getElementById("qunit-fixture"), "script");
        assert.strictEqual(child.length, 6, "Make sure that two non-JavaScript script tags are left.");
        assert.strictEqual(child[0].type, "something/else", "Verify type of script tag.");
        assert.strictEqual(child[child.length - 1].type, "something/else", "Verify type of script tag.");
        dom.setHtml(document.getElementById("qunit-fixture"), "<script>assert.ok( true, 'Test repeated injection of script.' );</script>");
        dom.setHtml(document.getElementById("qunit-fixture"), "<script>assert.ok( true, 'Test repeated injection of script.' );</script>");
        dom.setHtml(document.getElementById("qunit-fixture"), "<script>assert.ok( true, 'Test repeated injection of script.' );</script>");
        dom.setHtml(document.getElementById("qunit-fixture"), "<script type='text/javascript'>assert.ok( true, 'dom.parse().getHtml().evalScripts() Evals Scripts Twice in Firefox, see #975 (1)' );</script>");
        dom.setHtml(document.getElementById("qunit-fixture"), "foo <form><script type='text/javascript'>assert.ok( true, 'dom.parse().getHtml().evalScripts() Evals Scripts Twice in Firefox, see #975 (2)' );</script></form>");
        dom.setHtml(document.getElementById("qunit-fixture"), "<script>assert.strictEqual(dom.parse.scriptorder++, 0, 'Script is executed in order');assert.strictEqual(dom.query('#scriptorder').length, 1,'Execute after html (even though appears before)')<\/script><span id='scriptorder'><script>assert.strictEqual(dom.parse.scriptorder++, 1, 'Script (nested) is executed in order');assert.strictEqual(dom.query('#scriptorder').length, 1,'Execute after html')<\/script></span><script>assert.strictEqual(dom.parse.scriptorder++, 2, 'Script (unnested) is executed in order');assert.strictEqual(dom.query('#scriptorder').length, 1,'Execute after html')<\/script>");
    }
    exports.setHtmlTest = setHtmlTest;
    // // var bareObj = function (value) { return value; };
    // // var functionReturningObj = function (value) { return (function () { return value; }); };
    function hasClassTest() {
        var x = dom.parse("<p>Hi</p>");
        dom.addClass(x, "hi");
        assert.strictEqual(x.className, "hi", "Check single added class");
        dom.addClass(x, "foo bar");
        assert.strictEqual(x.className, "hi foo bar", "Check more added classes");
        // dom.removeClass(x);
        // assert.strictEqual(x.className, "", "Remove all classes");
        dom.addClass(x, "hi foo bar");
        dom.removeClass(x, "foo");
        assert.strictEqual(x.className, "hi bar", "Check removal of one class");
        assert.ok(dom.hasClass(x, "hi"), "Check has1");
        assert.ok(dom.hasClass(x, "bar"), "Check has2");
        // var x = dom.parse("<p class='class1\nclass2\tcla.ss3\n\rclass4'></p>") as HTMLElement;
        // assert.ok(dom.hasClass(x, "class1"), "Check hasClass with line feed");
        // assert.ok(dom.hasClass(x, "class2"), "Check hasClass with tab");
        // assert.ok(dom.hasClass(x, "cla"), "Check hasClass with dot");
        // assert.ok(dom.hasClass(x, "class4"), "Check hasClass with carriage return");
        dom.removeClass(x, "class2");
        assert.ok(dom.hasClass(x, "class2") == false, "Check the class has been properly removed");
        dom.removeClass(x, "cla");
        assert.ok(!dom.hasClass(x, "cla"), "Check the dotted class has not been removed");
        dom.removeClass(x, "cla");
        assert.ok(dom.hasClass(x, "cla") == false, "Check the dotted class has been removed");
        dom.removeClass(x, "class4");
        assert.ok(dom.hasClass(x, "class4") == false, "Check the class has been properly removed");
    }
    exports.hasClassTest = hasClassTest;
    function addClassTest() {
        var div = document.getElementById("foo");
        dom.addClass(div, "test");
        assert.ok(div.className.indexOf("test") >= 0, "Add Class");
        div = dom.parse("<div/>");
        dom.addClass(div, "test");
        assert.strictEqual(dom.getAttr(div, "class"), "test", "Make sure there's no extra whitespace.");
        dom.setAttr(div, "class", " foo");
        dom.addClass(div, "test");
        assert.strictEqual(dom.getAttr(div, "class"), " foo test", "Make sure there's no extra whitespace.");
        // dom.setAttr(div, "class", "foo");
        // dom.addClass(div, "bar baz");
        // assert.strictEqual(dom.getAttr(div, "class"), "foo bar baz", "Make sure there isn't too much trimming.");
        div.className = "";
        dom.addClass(div, "foo");
        dom.addClass(div, "foo");
        assert.strictEqual(dom.getAttr(div, "class"), "foo", "Do not add the same class twice in separate calls.");
        dom.addClass(div, "fo");
        assert.strictEqual(dom.getAttr(div, "class"), "foo fo", "Adding a similar class does not get interrupted.");
        div.className = "";
        dom.addClass(div, "wrap2");
        dom.addClass(div, "wrap");
        assert.ok(dom.hasClass(div, "wrap"), "Can add similarly named classes");
        // div.className = "";
        // dom.addClass(div, "bar bar");
        // assert.strictEqual(dom.getAttr(div, "class"), "bar", "Do not add the same class twice in the same call.");
    }
    exports.addClassTest = addClassTest;
    function removeClassTest() {
        var div = document.getElementById("foo");
        dom.addClass(div, "test");
        dom.removeClass(div, "test");
        assert.ok(!dom.hasClass(div, "test"), "Remove Class");
        div = document.getElementById("foo");
        dom.addClass(div, "test");
        dom.addClass(div, "foo");
        dom.addClass(div, "bar");
        dom.removeClass(div, "test");
        dom.removeClass(div, "bar");
        dom.removeClass(div, "foo");
        assert.ok(!dom.hasClass(div, "bar"), "Remove multiple classes");
        // Make sure that a null value doesn't cause problems
        // $divs[0].addClass("test").removeClass( null );
        // assert.ok( $divs[0].hasClass("test"), "Null value passed to removeClass" );
        // $divs[0].addClass("test").removeClass( "" );
        // assert.ok( $divs[0].hasClass("test"), "Empty string passed to removeClass" );
        div = document.createElement("div");
        div.className = " test foo ";
        dom.removeClass(div, "foo");
        assert.strictEqual(div.className, "test", "Make sure remaining className is trimmed.");
        div.className = " test ";
        dom.removeClass(div, "test");
        assert.strictEqual(div.className, "", "Make sure there is nothing left after everything is removed.");
    }
    exports.removeClassTest = removeClassTest;
    function toggleClassTest() {
        var e = document.getElementById("firstp");
        assert.ok(!dom.hasClass(e, "test"), "Assert class not present");
        dom.toggleClass(e, "test");
        assert.ok(dom.hasClass(e, "test"), "Assert class present");
        dom.toggleClass(e, "test");
        assert.ok(!dom.hasClass(e, "test"), "Assert class not present");
        // class name with a boolean
        dom.toggleClass(e, "test", false);
        assert.ok(!dom.hasClass(e, "test"), "Assert class not present");
        dom.toggleClass(e, "test", true);
        assert.ok(dom.hasClass(e, "test"), "Assert class present");
        dom.toggleClass(e, "test", false);
        assert.ok(!dom.hasClass(e, "test"), "Assert class not present");
        // multiple class names
        dom.addClass(e, "testA testB");
        assert.ok((dom.hasClass(e, "testA")), "Assert 2 different classes present");
        //  dom.addClass(e,  "testB testC" );
        // assert.ok( (dom.hasClass(e, "testA") && !dom.match(e, ".testB")), "Assert 1 class added, 1 class removed, and 1 class kept" );
        //  dom.addClass(e,  "testA testC" );
        // assert.ok( (!dom.hasClass(e, "testA") && !dom.hasClass(e, "testB") && !dom.hasClass(e, "testC")), "Assert no class present" );
        // toggleClass storage
        //  dom.addClass(e, true);
        // assert.ok( e.dom.className === "", "Assert class is empty (data was empty)" );
        dom.addClass(e, "testD testE");
        assert.ok(dom.hasClass(e, "testD") && dom.hasClass(e, "testE"), "Assert class present");
        dom.toggleClass(e, e.className);
        assert.ok(!dom.hasClass(e, "testD") || !dom.hasClass(e, "testE"), "Assert class not present");
        dom.toggleClass(e, e.className);
        // assert.ok(dom.hasClass(e, "testD") && dom.hasClass(e, "testE"), "Assert class present (restored from data)");
        // dom.toggleClass(e, e.className, false);
        // assert.ok(!dom.hasClass(e, "testD") || !dom.hasClass(e, "testE"), "Assert class not present");
        // dom.toggleClass(e, e.className, true);
        // assert.ok(dom.hasClass(e, "testD") && dom.hasClass(e, "testE"), "Assert class present (restored from data)");
        // dom.toggleClass(e, e.className);
        // dom.toggleClass(e, e.className, false);
        // dom.toggleClass(e, e.className);
        // assert.ok(dom.hasClass(e, "testD") && dom.hasClass(e, "testE"), "Assert class present (restored from data)");
        // Cleanup
        dom.removeClass(e, "testD");
    }
    exports.toggleClassTest = toggleClassTest;
    function vendorTest() {
        assert.equal(dom.vendor("color"), "color");
    }
    exports.vendorTest = vendorTest;
    function getStyleTest() {
        assert.strictEqual(dom.getStyle(document.getElementById("qunit-fixture"), "display"), "block", "Check for css property \"display\"");
        assert.ok(!dom.isHidden(document.getElementById("nothiddendiv")), "Modifying CSS display: Assert element is visible");
        dom.setStyle(document.getElementById("nothiddendiv"), 'display', "none");
        assert.ok(dom.isHidden(document.getElementById("nothiddendiv")), "Modified CSS display: Assert element is hidden");
        dom.setStyle(document.getElementById("nothiddendiv"), 'display', "block");
        assert.ok(!dom.isHidden(document.getElementById("nothiddendiv")), "Modified CSS display: Assert element is visible");
        var div = dom.parse("<div>");
        // These should be "auto" (or some better value)
        // temporarily provide "0px" for backwards compat
        assert.strictEqual(dom.getRect(div).width, 0, "Width on disconnected node.");
        assert.strictEqual(dom.getRect(div).height, 0, "Height on disconnected node.");
        // dom.setStyle(div, 'width', 4);
        // dom.setStyle(div, 'height', 4);
        // assert.strictEqual(dom.getStyle(div, "width"), "4px", "Width on disconnected node.");
        // assert.strictEqual(dom.getStyle(div, "height"), "4px", "Height on disconnected node.");
        var div2 = dom.parse("<div style='display:none;'><input type='text' style='height:20px;'/><textarea style='height:20px;'></textarea><div style='height:20px;'></div></div>");
        document.body.appendChild(div2);
        assert.strictEqual(dom.getStyle(dom.find(div2, "input"), "height"), "20px", "Height on hidden input.");
        assert.strictEqual(dom.getStyle(dom.find(div2, "textarea"), "height"), "20px", "Height on hidden textarea.");
        assert.strictEqual(dom.getStyle(dom.find(div2, "div"), "height"), "20px", "Height on hidden textarea.");
        document.body.removeChild(div2);
        // handle negative numbers by ignoring #1599, #4216
        dom.setStyle(document.getElementById("nothiddendiv"), "width", 1);
        dom.setStyle(document.getElementById("nothiddendiv"), "height", 1);
        var width = parseFloat(dom.getStyle(document.getElementById("nothiddendiv"), "width")), height = parseFloat(dom.getStyle(document.getElementById("nothiddendiv"), "height"));
        dom.setStyle(document.getElementById("nothiddendiv"), "width", -1);
        dom.setStyle(document.getElementById("nothiddendiv"), "height", -1);
        // assert.strictEqual(dom.getStyle(dom.parse("<div style='display: none;'>") as HTMLElement, "display"), "none", "Styles on disconnected nodes");
        dom.setStyle(document.getElementById("floatTest"), "float", "right");
        assert.strictEqual(dom.getStyle(document.getElementById("floatTest"), "float"), "right", "Modified CSS float using \"float\": Assert float is right");
        dom.setStyle(document.getElementById("floatTest"), "font-size", "30px");
        assert.strictEqual(dom.getStyle(document.getElementById("floatTest"), "font-size"), "30px", "Modified CSS font-size: Assert font-size is 30px");
        "0 0.25 0.5 0.75 1".split(" ").forEach(function (n, i) {
            dom.setStyle(document.getElementById("foo"), 'opacity', n);
            assert.strictEqual(dom.getStyle(document.getElementById("foo"), "opacity"), n, "Assert opacity is " + n + " as a String");
            dom.setStyle(document.getElementById("foo"), 'opacity', parseFloat(n));
            assert.strictEqual(dom.getStyle(document.getElementById("foo"), "opacity"), n, "Assert opacity is " + parseFloat(n) + " as a Number");
        });
        dom.setStyle(document.getElementById("foo"), 'opacity', "");
        assert.strictEqual(dom.getStyle(document.getElementById("foo"), "opacity"), "1", "Assert opacity is 1 when set to an empty String");
        dom.setStyle(document.getElementById("empty"), 'opacity', "1");
        assert.strictEqual(dom.getStyle(document.getElementById("empty"), "opacity"), "1", "Assert opacity is taken from style attribute when set vs stylesheet in IE with filters");
        eval("-[1,]") ?
            assert.ok(true, "Requires the same number of tests") :
            assert.ok(~document.getElementById("empty").currentStyle.filter.indexOf("gradient"), "Assert setting opacity doesn't overwrite other filters of the stylesheet in IE");
        var div = document.getElementById("nothiddendiv"), child = document.getElementById("nothiddendivchild");
        assert.strictEqual(parseInt(dom.getStyle(div, "fontSize")), 16, "Verify fontSize px set.");
        assert.strictEqual(parseInt(dom.getStyle(div, "font-size")), 16, "Verify fontSize px set.");
        assert.strictEqual(parseInt(dom.getStyle(child, "fontSize")), 16, "Verify fontSize px set.");
        assert.strictEqual(parseInt(dom.getStyle(child, "font-size")), 16, "Verify fontSize px set.");
        dom.setStyle(child, "height", "100%");
        assert.strictEqual(child.style.height, "100%", "Make sure the height is being set correctly.");
        // dom.setAttr(child, "class", "em");
        // assert.strictEqual(parseInt(dom.getStyle(child, "fontSize")), 32, "Verify fontSize em set.");
        // Have to verify this as the r depends upon the browser's CSS
        // support for font-size percentages
        dom.setAttr(child, "class", "prct");
        var prctval = parseInt(dom.getStyle(child, "fontSize")), checkval = 0;
        if (prctval === 16 || prctval === 24) {
            checkval = prctval;
        }
        assert.strictEqual(prctval, checkval, "Verify fontSize % set.");
        assert.strictEqual(typeof dom.getStyle(child, "width"), "string", "Make sure that a string width is returned from css('width').");
        var old = child.style.height;
        // Test NaN
        dom.setStyle(child, "height", parseFloat("zoo"));
        assert.strictEqual(child.style.height, old, "Make sure height isn't changed on NaN.");
        // // Test null
        // dom.setStyle(child, "height", null!);
        // assert.strictEqual(child.style.height, old, "Make sure height isn't changed on null.");
        old = child.style.fontSize;
        // Test NaN
        dom.setStyle(child, "font-size", parseFloat("zoo"));
        assert.strictEqual(child.style.fontSize, old, "Make sure font-size isn't changed on NaN.");
        // Test null
        dom.setStyle(child, "font-size", null);
        assert.strictEqual(child.style.fontSize, old, "Make sure font-size isn't changed on null.");
    }
    exports.getStyleTest = getStyleTest;
    function setStyleTest() {
        assert.ok(!dom.isHidden(document.getElementById("nothiddendiv")), "Modifying CSS display: Assert element is visible");
        dom.setStyle(document.getElementById("nothiddendiv"), "display", "none");
        assert.ok(dom.isHidden(document.getElementById("nothiddendiv")), "Modified CSS display: Assert element is hidden");
        dom.setStyle(document.getElementById("nothiddendiv"), "display", "block");
        assert.ok(!dom.isHidden(document.getElementById("nothiddendiv")), "Modified CSS display: Assert element is visible");
        dom.setStyle(document.getElementById("nothiddendiv"), "top", "-1em");
        assert.equal(dom.getStyle(document.getElementById("nothiddendiv"), "top"), -16, "Check negative number in EMs.");
        dom.setStyle(document.getElementById("floatTest"), "float", "left");
        assert.strictEqual(dom.getStyle(document.getElementById("floatTest"), "float"), "left", "Modified CSS float using \"float\": Assert float is left");
        dom.setStyle(document.getElementById("floatTest"), "font-size", "20px");
        assert.strictEqual(dom.getStyle(document.getElementById("floatTest"), "font-size"), "20px", "Modified CSS font-size: Assert font-size is 20px");
        "0 0.25 0.5 0.75 1".split(" ").forEach(function (n, i) {
            dom.setStyle(document.getElementById("foo"), "opacity", n);
            assert.strictEqual(dom.getStyle(document.getElementById("foo"), "opacity"), parseFloat(n), "Assert opacity is " + parseFloat(n) + " as a String");
            dom.setStyle(document.getElementById("foo"), "opacity", parseFloat(n));
            assert.strictEqual(dom.getStyle(document.getElementById("foo"), "opacity"), parseFloat(n), "Assert opacity is " + parseFloat(n) + " as a Number");
        });
        dom.setStyle(document.getElementById("foo"), "opacity", "");
        assert.strictEqual(dom.getStyle(document.getElementById("foo"), "opacity"), "1", "Assert opacity is 1 when set to an empty String");
        // using contents will get comments regular, text, and comment nodes
        var j = document.getElementById("nonnodes");
        dom.setStyle(j, "overflow", "visible");
        assert.strictEqual(dom.getStyle(j, "overflow"), "visible", "Check node,textnode,comment css works");
        // opera sometimes doesn't update 'display' correctly, see #2037
        document.getElementById("t2037").innerHTML = document.getElementById("t2037").innerHTML;
        assert.strictEqual(dom.getStyle(dom.find(document.getElementById("t2037"), ".hidden"), "display"), "none", "Make sure browser thinks it is hidden");
        var div = document.getElementById("nothiddendiv"), display = dom.getStyle(div, "display"), ret = dom.setStyle(div, "display", '');
        assert.strictEqual(ret, div, "Make sure setting undefined returns the original set.");
        assert.strictEqual(dom.getStyle(div, "display"), display, "Make sure that the display wasn't changed.");
        // Test for Bug #5509
        var success = true;
        try {
            dom.setStyle(document.getElementById("foo"), "backgroundColor", "rgba(0, 0, 0, 0.1)");
        }
        catch (e) {
            success = false;
        }
        assert.ok(success, "Setting RGBA values does not throw Error");
        var div = document.getElementById("qunit-fixture").appendChild(dom.parse("<div>"));
        dom.setStyle(div, "fill-opacity", 0);
        dom.setStyle(div, "fill-opacity", 1.0);
        assert.strictEqual(dom.getStyle(div, "fill-opacity"), 1, "Do not append px to 'fill-opacity'");
    }
    exports.setStyleTest = setStyleTest;
    function computeStyleTest() {
    }
    exports.computeStyleTest = computeStyleTest;
    function getScrollTest() {
    }
    exports.getScrollTest = getScrollTest;
    function setScrollTest() {
    }
    exports.setScrollTest = setScrollTest;
    function getOffsetTest() {
    }
    exports.getOffsetTest = getOffsetTest;
    function setOffsetTest() {
    }
    exports.setOffsetTest = setOffsetTest;
    function offsetParentTest() {
        var body = dom.offsetParent(document.body);
        assert.strictEqual(body, document.body, "The body is its own offsetParent.");
        var header = dom.offsetParent(document.getElementById("qunit-header"));
        assert.strictEqual(header, document.body, "The body is the offsetParent.");
        var div = dom.offsetParent(document.getElementById("nothiddendivchild"));
        assert.strictEqual(div, document.body, "The body is the offsetParent.");
        dom.setStyle(document.getElementById("nothiddendiv"), "position", "relative");
        div = dom.offsetParent(document.getElementById("nothiddendivchild"));
        assert.strictEqual(div, document.getElementById("nothiddendiv"), "The div is the offsetParent.");
        div = dom.offsetParent(document.body);
        assert.strictEqual(div, document.body, "The body is the offsetParent.");
        dom.append(document.body, '<div id="fractions"/>');
        var expected = { y: 1000, x: 1000 };
        var div = document.getElementById('fractions');
        dom.setStyle(div, 'position', 'absolute');
        dom.setStyle(div, 'left', '1000.7432222px');
        dom.setStyle(div, 'top', '1000.532325px');
        dom.setStyle(div, 'width', 100);
        dom.setStyle(div, 'height', 100);
        dom.setOffset(div, expected);
        var r = dom.getRect(div);
        assert.strictEqual(r.y, expected.y, "Check top");
        assert.strictEqual(r.x, expected.x, "Check left");
        div.remove();
    }
    exports.offsetParentTest = offsetParentTest;
    function getRectTest() {
        var $div = document.getElementById("nothiddendiv");
        dom.setRect($div, { width: 30 });
        assert.strictEqual(dom.getRect($div).width, 30, "Test set to 30 correctly");
        dom.hide($div);
        assert.strictEqual(dom.getRect($div).width, 30, "Test hidden div");
        dom.show($div);
        dom.setRect($div, { width: -1 }); // handle negative numbers by ignoring #1599
        assert.strictEqual(dom.getRect($div).width, 0, "负值 转为 0");
        dom.setRect($div, { width: 30 });
        dom.setStyle($div, "padding", "20px");
        assert.strictEqual(dom.getRect($div).width, 30, "Test padding specified with pixels");
        dom.setStyle($div, "border", "2px solid #fff");
        assert.strictEqual(dom.getRect($div).width, 30, "Test border specified with pixels");
        Object.assign($div.style, { display: "", border: "", padding: "" });
        Object.assign(document.getElementById("nothiddendivchild").style, { width: '20px', padding: "3px", border: "2px solid #fff" });
        assert.strictEqual(dom.getRect(document.getElementById("nothiddendivchild")).width, 20, "Test child width with border and padding");
        Object.assign(document.getElementById("nothiddendiv").style, { border: "", padding: "", width: "" });
        Object.assign(document.getElementById("nothiddendivchild").style, { border: "", padding: "", width: "" });
        var $div = document.getElementById("nothiddendiv");
        dom.setRect($div, { height: 30 });
        assert.strictEqual(dom.getRect($div).height, 30, "Test set to 30 correctly");
        dom.hide($div);
        assert.strictEqual(dom.getRect($div).height, 30, "Test hidden div");
        dom.show($div);
        dom.setRect($div, { height: -1 }); // handle negative numbers by ignoring #1599
        assert.strictEqual(dom.getRect($div).height, 0, "负值 转为 0");
        dom.setRect($div, { height: 30 });
        dom.setStyle($div, "padding", "20px");
        assert.strictEqual(dom.getRect($div).height, 30, "Test padding specified with pixels");
        dom.setStyle($div, "border", "2px solid #fff");
        assert.strictEqual(dom.getRect($div).height, 30, "Test border specified with pixels");
        Object.assign($div.style, { display: "", border: "", padding: "", height: "1px" });
        Object.assign(document.getElementById("nothiddendivchild").style, { height: '20px', padding: "3px", border: "2px solid #fff" });
        assert.strictEqual(dom.getRect(document.getElementById("nothiddendivchild")).height, 20, "Test child height with border and padding");
        Object.assign(document.getElementById("nothiddendiv").style, { border: "", padding: "", height: "" });
        Object.assign(document.getElementById("nothiddendivchild").style, { border: "", padding: "", height: "" });
    }
    exports.getRectTest = getRectTest;
    function setRectTest() {
        assert.strictEqual(dom.getRect(document).height > 0, true, "Test on document without margin option");
        // var $div = document.getElementById("nothiddendiv")!;
        // dom.setStyle($div, "height", 30);
        // assert.strictEqual(dom.getRect($div).height, 30, "Test with only width set");
        // dom.setStyle($div, "padding", "20px");
        // assert.strictEqual(dom.getRect($div).height, 70, "Test with padding");
        // dom.setStyle($div, "border", "2px solid #fff");
        // assert.strictEqual(dom.getRect($div).height, 74, "Test with padding and border");
        // dom.setStyle($div, "margin", "10px");
        // assert.strictEqual(dom.getRect($div).height, 74, "Test with padding, border and margin without margin option");
        // dom.hide($div);
        // assert.strictEqual(dom.getRect($div).height, 0, "Test hidden div with padding, border and margin with margin option");
        // // reset styles
        // dom.setStyle($div, "display", "");
        // dom.setStyle($div, "border", "");
        // dom.setStyle($div, "padding", "");
        // dom.setStyle($div, "width", "");
        // dom.setStyle($div, "height", "");
        // var div = dom.parse("<div>") as HTMLElement;
        // // Temporarily require 0 for backwards compat - should be auto
        // assert.strictEqual(dom.getRect(div).height, 0, "Make sure that disconnected nodes are handled.");
        // dom.remove(div);
        // var result = dom.getOffset(document.createElement("div"));
        // assert.strictEqual(result.x, 0, "Check top");
        // assert.strictEqual(result.y, 0, "Check left");
        // // setup html
        // var $divNormal = dom.parse("<div>") as HTMLElement;
        // dom.setStyle($divNormal, "width", "100px");
        // dom.setStyle($divNormal, "height", "100px");
        // dom.setStyle($divNormal, "border", "10px solid white");
        // dom.setStyle($divNormal, "padding", "2px");
        // dom.setStyle($divNormal, "margin", "3px");
        // var $divChild = dom.clone($divNormal) as HTMLElement;
        // var $divHiddenParent = dom.parse("<div>") as HTMLElement;
        // dom.setStyle($divHiddenParent, "display", "none");
        // dom.append($divHiddenParent, $divChild);
        // document.body.appendChild($divNormal);
        // // tests that child div of a hidden div works the same as a normal div
        // assert.strictEqual(dom.getRect($divChild).width, dom.getRect($divNormal).width, "child of a hidden element getWidth() is wrong see #9441");
        // assert.strictEqual(dom.getRect($divChild).height, dom.getRect($divNormal).height, "child of a hidden element getHeight() is wrong see #9441");
        // // teardown html
        // $divHiddenParent.removeChild($divChild);
        // document.body.removeChild($divNormal);
        // var supportsScroll = false;
        // testoffset("absolute", function (iframe) {
        //     var document = iframe.document, tests;
        //     // force a scroll value on the main window
        //     // this insures that the results will be wrong
        //     // if the offset method is using the scroll offset
        //     // of the parent window
        //     var forceScroll = dom.parse("<div style='width: 2000px, height: 2000px'>", iframe).appendTo();
        //     iframe.scrollTo(200, 200);
        //     if (document.documentElement.scrollTop || document.body.scrollTop) {
        //         supportsScroll = true;
        //     }
        //     iframe.scrollTo(1, 1);
        //     assert.strictEqual(document.getElementById("absolute-1").getPosition().x, 1, "document.getElementById('absolute-1').getPosition().x");
        //     assert.strictEqual(document.getElementById("absolute-1").getPosition().y, 1, "document.getElementById('absolute-1').getPosition().y");
        //     assert.strictEqual(document.getElementById("absolute-1").getOffset().x, 0, "document.getElementById('absolute-1').getOffset().x");
        //     assert.strictEqual(document.getElementById("absolute-1").getOffset().y, 0, "document.getElementById('absolute-1').getOffset().y");
        //     forceScroll.remove();
        // });
        // testoffset("absolute", function (iframe) {
        //     var document = iframe.document;
        //     // get offset tests
        //     var tests = [
        //         { id: "absolute-1", x: 1, y: 1 },
        //         { id: "absolute-1-1", x: 5, y: 5 },
        //         { id: "absolute-1-1-1", x: 9, y: 9 },
        //         { id: "absolute-2", x: 20, y: 20 }
        //     ];
        //     tests.forEach(function (test) {
        //         assert.strictEqual(document.getElementById(test.id).getPosition().x, test.x, "document.getElementById('" + test.id + "').getPosition().x");
        //         assert.strictEqual(document.getElementById(test.id).getPosition().x, test.y, "document.getElementById('" + test.id + "').getPosition().y");
        //     });
        //     // get position
        //     tests = [
        //         { id: "absolute-1", y: 0, x: 0 },
        //         { id: "absolute-1-1", y: 1, x: 1 },
        //         { id: "absolute-1-1-1", y: 1, x: 1 },
        //         { id: "absolute-2", y: 19, x: 19 }
        //     ];
        //     tests.forEach(function (test) {
        //         assert.strictEqual(document.getElementById(test.id).getOffset().y, test.y, "document.getElementById('" + test.id + "').getOffset().y");
        //         assert.strictEqual(document.getElementById(test.id).getOffset().x, test.x, "document.getElementById('" + test.id + "').getOffset().x");
        //     });
        //     // test #5781
        //     var offset = document.getElementById("positionTest").setOffset({ y: 10, x: 10 }).getPosition();
        //     assert.strictEqual(offset.y, 10, "Setting offset on element with position absolute but 'auto' values.")
        //     assert.strictEqual(offset.x, 10, "Setting offset on element with position absolute but 'auto' values.")
        //     // set offset
        //     tests = [
        //         { id: "absolute-2", y: 30, x: 30 },
        //         { id: "absolute-2", y: 10, x: 10 },
        //         { id: "absolute-2", y: -1, x: -1 },
        //         { id: "absolute-2", y: 19, x: 19 },
        //         { id: "absolute-1-1-1", y: 15, x: 15 },
        //         { id: "absolute-1-1-1", y: 5, x: 5 },
        //         { id: "absolute-1-1-1", y: -1, x: -1 },
        //         { id: "absolute-1-1-1", y: 9, x: 9 },
        //         { id: "absolute-1-1", y: 10, x: 10 },
        //         { id: "absolute-1-1", y: 0, x: 0 },
        //         { id: "absolute-1-1", y: -1, x: -1 },
        //         { id: "absolute-1-1", y: 5, x: 5 },
        //         { id: "absolute-1", y: 2, x: 2 },
        //         { id: "absolute-1", y: 0, x: 0 },
        //         { id: "absolute-1", y: -1, x: -1 },
        //         { id: "absolute-1", y: 1, x: 1 }
        //     ];
        //     tests.forEach(function (test) {
        //         document.getElementById(test.id).setPosition({ y: test.y, x: test.x });
        //         assert.strictEqual(document.getElementById(test.id).getPosition().y, test.y, "document.getElementById('" + test.id + "').setOffset({ y: " + test.y + " })");
        //         assert.strictEqual(document.getElementById(test.id).getPosition().x, test.x, "document.getElementById('" + test.id + "').setOffset({ x: " + test.x + " })");
        //         document.getElementById(test.id).setPosition({ x: test.x + 2, y: test.y + 2 })
        //         assert.strictEqual(document.getElementById(test.id).getPosition().y, test.y + 2, "Setting one property at a time.");
        //         assert.strictEqual(document.getElementById(test.id).getPosition().x, test.x + 2, "Setting one property at a time.");
        //     });
        //     var offsets = document.getElementById('positionTest').getOffset();
        //     document.getElementById('positionTest').setOffset(offsets);
        //     assert.strictEqual(document.getElementById('positionTest').getOffset().y, offsets.y, "document.getElementById('positionTest').setOffset().getOffset()");
        //     assert.strictEqual(document.getElementById('positionTest').getOffset().x, offsets.x, "document.getElementById('positionTest').setOffset().getOffset()");
        //     var position = document.getElementById('positionTest').getPosition();
        //     document.getElementById('positionTest').setPosition(position);
        //     assert.strictEqual(document.getElementById('positionTest').getPosition().y, position.y, "document.getElementById('positionTest').setPosition().getPosition()");
        //     assert.strictEqual(document.getElementById('positionTest').getPosition().x, position.x, "document.getElementById('positionTest').setPosition().getPosition()");
        // });
        // testoffset("relative", function (iframe) {
        //     var document = iframe.document;
        //     // IE is collapsing the top margin of 1px
        //     var ie = navigator.isQuirks;
        //     // get offset
        //     var tests = [
        //         { id: "relative-1", y: ie ? 6 : 7, x: 7 },
        //         { id: "relative-1-1", y: ie ? 13 : 15, x: 15 },
        //         { id: "relative-2", y: ie ? 141 : 142, x: 27 }
        //     ];
        //     tests.forEach(function (test) {
        //         assert.strictEqual(document.getElementById(test.id).getPosition().y, test.y, "document.getElementById('" + test.id + "').getPosition().y");
        //         assert.strictEqual(document.getElementById(test.id).getPosition().x, test.x, "document.getElementById('" + test.id + "').getPosition().x");
        //     });
        //     // get position
        //     tests = [
        //         //{ id: "relative-1",   y: ie ?   5 :   6, x:  6 },
        //         //{ id: "relative-1-1", y: ie ?   4 :   5, x:  5 },
        //         //{ id: "relative-2",   y: ie ? 140 : 141, x: 26 }
        //         { id: "relative-1", y: 0, x: 0 },
        //         { id: "relative-1-1", y: 0, x: 0 },
        //         { id: "relative-2", y: 20, x: 20 }
        //     ];
        //     tests.forEach(function (test) {
        //         assert.strictEqual(document.getElementById(test.id).getOffset().y, test.y, "document.getElementById('" + test.id + "').getOffset().y");
        //         assert.strictEqual(document.getElementById(test.id).getOffset().x, test.x, "document.getElementById('" + test.id + "').getOffset().x");
        //     });
        //     // set offset
        //     tests = [
        //         { id: "relative-2", y: 200, x: 50 },
        //         { id: "relative-2", y: 100, x: 10 },
        //         { id: "relative-2", y: -5, x: -5 },
        //         { id: "relative-2", y: 142, x: 27 },
        //         { id: "relative-1-1", y: 100, x: 100 },
        //         { id: "relative-1-1", y: 5, x: 5 },
        //         { id: "relative-1-1", y: -1, x: -1 },
        //         { id: "relative-1-1", y: 15, x: 15 },
        //         { id: "relative-1", y: 100, x: 100 },
        //         { id: "relative-1", y: 0, x: 0 },
        //         { id: "relative-1", y: -1, x: -1 },
        //         { id: "relative-1", y: 7, x: 7 }
        //     ];
        //     tests.forEach(function (test) {
        //         document.getElementById(test.id).setOffset({ y: test.y, x: test.x });
        //         assert.strictEqual(document.getElementById(test.id).getOffset().y, test.y, "document.getElementById('" + test.id + "').setOffset({ y: " + test.y + " })");
        //         assert.strictEqual(document.getElementById(test.id).getOffset().x, test.x, "document.getElementById('" + test.id + "').setOffset({ x: " + test.x + " })");
        //     });
        //     var offsets = document.getElementById('positionTest').getOffset();
        //     document.getElementById('positionTest').setOffset(offsets);
        //     assert.strictEqual(document.getElementById('positionTest').getOffset().y, offsets.y, "document.getElementById('positionTest').setOffset().getOffset()");
        //     assert.strictEqual(document.getElementById('positionTest').getOffset().x, offsets.x, "document.getElementById('positionTest').setOffset().getOffset()");
        //     var position = document.getElementById('positionTest').getPosition();
        //     document.getElementById('positionTest').setPosition(position);
        //     assert.strictEqual(document.getElementById('positionTest').getPosition().y, position.y, "document.getElementById('positionTest').setPosition().getPosition()");
        //     assert.strictEqual(document.getElementById('positionTest').getPosition().x, position.x, "document.getElementById('positionTest').setPosition().getPosition()");
        // });
        // testoffset("static", function (iframe) {
        //     var document = iframe.document;
        //     // IE is collapsing the top margin of 1px
        //     var ie = navigator.isQuirks;
        //     // get offset
        //     var tests = [
        //         { id: "static-1", y: ie ? 6 : 7, x: 7 },
        //         { id: "static-1-1", y: ie ? 13 : 15, x: 15 },
        //         { id: "static-1-1-1", y: ie ? 20 : 23, x: 23 },
        //         { id: "static-2", y: ie ? 121 : 122, x: 7 }
        //     ];
        //     tests.forEach(function (test) {
        //         assert.strictEqual(document.getElementById(test.id).getPosition().y, test.y, "document.getElementById('" + test.id + "').getPosition().y");
        //         assert.strictEqual(document.getElementById(test.id).getPosition().x, test.x, "document.getElementById('" + test.id + "').getPosition().x");
        //     });
        //     // get position
        //     tests = [
        //         //{ id: "static-1",     y: ie ?   5 :   6, x:  6 },
        //         //{ id: "static-1-1",   y: ie ?  12 :  14, x: 14 },
        //         //{ id: "static-1-1-1", y: ie ?  19 :  22, x: 22 },
        //         //{ id: "static-2",     y: ie ? 120 : 121, x:  6 }
        //         { id: "static-1", y: 0, x: 0 },
        //         { id: "static-1-1", y: 0, x: 0 },
        //         { id: "static-1-1-1", y: 0, x: 0 },
        //         { id: "static-2", y: 20, x: 20 }
        //     ];
        //     // !Opera
        //     //Object.each( tests, function(test) {
        //     //	assert.strictEqual( document.getElementById( test.id ).getOffset().y,  test.y,  "document.getElementById('" + test.id  + "').getOffset().y" );
        //     //	assert.strictEqual( document.getElementById( test.id ).getOffset().x, test.x, "document.getElementById('" + test.id +"').getOffset().x" );
        //     //});
        //     // set offset
        //     tests = [
        //         { id: "static-2", y: 200, x: 200 },
        //         { id: "static-2", y: 100, x: 100 },
        //         { id: "static-2", y: -2, x: -2 },
        //         { id: "static-2", y: 121, x: 6 },
        //         { id: "static-1-1-1", y: 50, x: 50 },
        //         { id: "static-1-1-1", y: 10, x: 10 },
        //         { id: "static-1-1-1", y: -1, x: -1 },
        //         { id: "static-1-1-1", y: 22, x: 22 },
        //         { id: "static-1-1", y: 25, x: 25 },
        //         { id: "static-1-1", y: 10, x: 10 },
        //         { id: "static-1-1", y: -3, x: -3 },
        //         { id: "static-1-1", y: 14, x: 14 },
        //         { id: "static-1", y: 30, x: 30 },
        //         { id: "static-1", y: 2, x: 2 },
        //         { id: "static-1", y: -2, x: -2 },
        //         { id: "static-1", y: 7, x: 7 }
        //     ];
        //     tests.forEach(function (test) {
        //         document.getElementById(test.id).setOffset({ y: test.y, x: test.x });
        //         assert.strictEqual(document.getElementById(test.id).getOffset().y, test.y, "document.getElementById('" + test.id + "').setOffset({ y: " + test.y + " })");
        //         assert.strictEqual(document.getElementById(test.id).getOffset().x, test.x, "document.getElementById('" + test.id + "').setOffset({ x: " + test.x + " })");
        //     });
        //     var offsets = document.getElementById('positionTest').getOffset();
        //     document.getElementById('positionTest').setOffset(offsets);
        //     assert.strictEqual(document.getElementById('positionTest').getOffset().y, offsets.y, "document.getElementById('positionTest').setOffset().getOffset()");
        //     assert.strictEqual(document.getElementById('positionTest').getOffset().x, offsets.x, "document.getElementById('positionTest').setOffset().getOffset()");
        //     var position = document.getElementById('positionTest').getPosition();
        //     document.getElementById('positionTest').setPosition(position);
        //     assert.strictEqual(document.getElementById('positionTest').getPosition().y, position.y, "document.getElementById('positionTest').setPosition().getPosition()");
        //     assert.strictEqual(document.getElementById('positionTest').getPosition().x, position.x, "document.getElementById('positionTest').setPosition().getPosition()");
        // });
        // testoffset("fixed", function (iframe) {
        //     var document = iframe.document;
        //     var tests = [
        //         { id: "fixed-1", y: 1001, x: 1001 },
        //         { id: "fixed-2", y: 1021, x: 1021 }
        //     ];
        //     tests.forEach(function (test) {
        //         assert.strictEqual(document.getElementById(test.id).getPosition().y, test.y, "document.getElementById('" + test.id + "').getPosition().y");
        //         assert.strictEqual(document.getElementById(test.id).getPosition().x, test.x, "document.getElementById('" + test.id + "').getPosition().x");
        //     });
        //     tests = [
        //         { id: "fixed-1", y: 100, x: 100 },
        //         { id: "fixed-1", y: 0, x: 0 },
        //         { id: "fixed-1", y: -4, x: -4 },
        //         { id: "fixed-2", y: 200, x: 200 },
        //         { id: "fixed-2", y: 0, x: 0 },
        //         { id: "fixed-2", y: -5, x: -5 }
        //     ];
        //     tests.forEach(function (test) {
        //         document.getElementById(test.id).setOffset({ y: test.y, x: test.x });
        //         assert.strictEqual(document.getElementById(test.id).getOffset().y, test.y, "document.getElementById('" + test.id + "').setOffset({ y: " + test.y + " })");
        //         assert.strictEqual(document.getElementById(test.id).getOffset().x, test.x, "document.getElementById('" + test.id + "').setOffset({ x: " + test.x + " })");
        //     });
        //     // Bug 8316
        //     var noTopLeft = document.getElementById("fixed-no-top-left");
        //     assert.strictEqual(noTopLeft.getPosition().y, 1007, "Check offset top for fixed element with no top set");
        //     assert.strictEqual(noTopLeft.getPosition().x, 1007, "Check offset left for fixed element with no left set");
        //     var offsets = document.getElementById('positionTest').getOffset();
        //     document.getElementById('positionTest').setOffset(offsets);
        //     assert.strictEqual(document.getElementById('positionTest').getOffset().y, offsets.y, "document.getElementById('positionTest').setOffset().getOffset()");
        //     assert.strictEqual(document.getElementById('positionTest').getOffset().x, offsets.x, "document.getElementById('positionTest').setOffset().getOffset()");
        //     var position = document.getElementById('positionTest').getPosition();
        //     document.getElementById('positionTest').setPosition(position);
        //     assert.strictEqual(document.getElementById('positionTest').getPosition().y, position.y, "document.getElementById('positionTest').setPosition().getPosition()");
        //     assert.strictEqual(document.getElementById('positionTest').getPosition().x, position.x, "document.getElementById('positionTest').setPosition().getPosition()");
        // });
        // testoffset("table", function (iframe) {
        //     var document = iframe.document;
        //     expect(4);
        //     assert.strictEqual(document.getElementById("table-1").getPosition().y, 6, "document.getElementById('table-1').getPosition().y");
        //     assert.strictEqual(document.getElementById("table-1").getPosition().x, 6, "document.getElementById('table-1').getPosition().x");
        //     assert.strictEqual(document.getElementById("th-1").getPosition().y, 10, "document.getElementById('th-1').getPosition().y");
        //     assert.strictEqual(document.getElementById("th-1").getPosition().x, 10, "document.getElementById('th-1').getPosition().x");
        // });
        // testoffset("scroll", function (iframe) {
        //     var document = iframe.document;
        //     var ie = navigator.isQuirks;
        //     // IE is collapsing the top margin of 1px
        //     assert.strictEqual(new Dom(document.getElementById("scroll-1")).getPosition().y, ie ? 6 : 7, "document.getElementById('scroll-1').getPosition().y");
        //     assert.strictEqual(new Dom(document.getElementById("scroll-1")).getPosition().x, 7, "document.getElementById('scroll-1').getPosition().x");
        //     // IE is collapsing the top margin of 1px
        //     assert.strictEqual(document.getElementById("scroll-1-1").getPosition().y, ie ? 9 : 11, "document.getElementById('scroll-1-1').getPosition().y");
        //     assert.strictEqual(document.getElementById("scroll-1-1").getPosition().x, 11, "document.getElementById('scroll-1-1').getPosition().x");
        //     // scroll offset tests .scrollTop/Left
        //     assert.strictEqual(document.getElementById("scroll-1").getScroll().y, 5, "document.getElementById('scroll-1').getScroll().y");
        //     assert.strictEqual(document.getElementById("scroll-1").getScroll().x, 5, "document.getElementById('scroll-1').getScroll().x");
        //     assert.strictEqual(document.getElementById("scroll-1-1").getScroll().y, 0, "document.getElementById('scroll-1-1').getScroll().y");
        //     assert.strictEqual(document.getElementById("scroll-1-1").getScroll().x, 0, "document.getElementById('scroll-1-1').getScroll().x");
        //     // assert.strictEqual( document.body.getScroll().y, 0, "document.body.getScroll().y" );
        //     // assert.strictEqual( document.body.getScroll().x, 0, "document.body.getScroll().y" );
        //     iframe.name = "test";
        //     assert.strictEqual(document.getScroll().y, 1000, "document.getElementById(document).getScroll().y");
        //     assert.strictEqual(document.getScroll().x, 1000, "document.getElementById(document).getScroll().x");
        //     document.setScroll(0, 0);
        //     assert.strictEqual(document.getScroll().y, 0, "document.getScroll().y other document");
        //     assert.strictEqual(document.getScroll().x, 0, "document.getScroll().x other document");
        //     assert.strictEqual(document.setScroll(null, 100), document, "document.getElementById().scrollTop(100) testing setter on empty jquery object");
        //     assert.strictEqual(document.setScroll(100, null), document, "document.getElementById().scrollLeft(100) testing setter on empty jquery object");
        //     assert.strictEqual(document.setScroll(null, null), document, "document.getElementById().setScroll(null, null) testing setter on empty jquery object");
        //     assert.strictEqual(document.getScroll().y, 100, "document.getElementById().scrollTop(100) testing setter on empty jquery object");
        //     assert.strictEqual(document.getScroll().x, 100, "document.getElementById().scrollLeft(100) testing setter on empty jquery object");
        // });
        // testoffset("body", function (iframe) {
        //     expect(2);
        //     assert.strictEqual(document.getElementById(iframe.document.body).getPosition().y, 1, "document.body.getPosition().y");
        //     assert.strictEqual(document.getElementById(iframe.document.body).getPosition().x, 1, "document.body.getPosition().x");
        // });
        // function testoffset(name, fn) {
        //     test(name, function () {
        //         // pause execution for now
        //         stop();
        //         // load fixture in iframe
        //         var iframe = loadFixture(),
        //             win = iframe.contentWindow,
        //             interval = setInterval(function () {
        //                 if (win && win.Dom && win.dom.isReady) {
        //                     clearInterval(interval);
        //                     // continue
        //                     start();
        //                     // call actual tests passing the correct jQuery isntance to use
        //                     fn.call(this, win);
        //                     document.body.removeChild(iframe);
        //                     iframe = null;
        //                 }
        //             }, 15);
        //     });
        //     function loadFixture() {
        //         var src = "./data/offset/" + name + ".html?" + parseInt(Math.random() * 1000, 10),
        //             iframe = dom.parse("<iframe />").set({
        //                 width: 500, height: 500, position: "absolute", top: -600, left: -600, visibility: "hidden"
        //             }).appendTo().dom;
        //         iframe.contentWindow.location = src;
        //         return iframe;
        //     }
        // }
        // if (eval("!-[1,]")) {
        //     test("setOpacity(String, Object) for MSIE", function () {
        //         // for #1438, IE throws JS error when filter exists but doesn't have opacity in it
        //         dom.setStyle(document.getElementById("foo")!, "filter", "progid:DXImageTransform.Microsoft.Chroma(color='red');");
        //         assert.strictEqual(dom.getStyle(document.getElementById("foo")!, "opacity"), "1", "Assert opacity is 1 when a different filter is set in IE, #1438");
        //         var filterVal = "progid:DXImageTransform.Microsoft.Alpha(opacity=30) progid:DXImageTransform.Microsoft.Blur(pixelradius=5)";
        //         var filterVal2 = "progid:DXImageTransform.Microsoft.Alpha(opacity=100) progid:DXImageTransform.Microsoft.Blur(pixelradius=5)";
        //         var filterVal3 = "progid:DXImageTransform.Microsoft.Blur(pixelradius=5)";
        //         dom.setStyle(document.getElementById("foo")!, "filter", filterVal);
        //         assert.strictEqual(dom.getStyle(document.getElementById("foo")!, "filter"), filterVal, "filter works");
        //         dom.setStyle(document.getElementById("foo")!, "opacity", 1);
        //         assert.strictEqual(dom.getStyle(document.getElementById("foo")!, "filter"), filterVal2, "Setting opacity in IE doesn't duplicate opacity filter");
        //         assert.strictEqual(dom.getStyle(document.getElementById("foo")!, "opacity"), "1", "Setting opacity in IE with other filters works");
        //         dom.setStyle(document.getElementById("foo")!, "filter", filterVal3).setStyle("opacity", 1);
        //         assert.ok(dom.getStyle(document.getElementById("foo")!, "filter").indexOf(filterVal3) !== -1, "Setting opacity in IE doesn't clobber other filters");
        //     });
        //     test("Setting opacity to 1 properly removes filter: style", function () {
        //         var rfilter = /filter:[^;]*/i,
        //             test = document.getElementById("t6652").setStyle("opacity", 1),
        //             test2 = test.find("div").setStyle("opacity", 1);
        //         function hasFilter(elem) {
        //             var match = rfilter.exec(elem.dom.style.cssText);
        //             if (match) {
        //                 return true;
        //             }
        //             return false;
        //         }
        //         //   assert.ok( !hasFilter( test ), "Removed filter attribute on element without filter in stylesheet" );
        //         assert.ok(hasFilter(test2), "Filter attribute remains on element that had filter in stylesheet");
        //     });
        // }
        // test("getStyle('height') doesn't clear radio buttons", function () {
        //     expect(4);
        //     var checkedtest = document.getElementById("checkedtest");
        //     // IE6 was clearing "checked" in getStyle("height");
        //     checkedtest.getStyle("height");
        //     assert.ok(checkedtest.find("[type='radio']").dom.checked, "Check first radio still checked.");
        //     assert.ok(!checkedtest.query("[type='radio']").item(-1).dom.checked, "Check last radio still NOT checked.");
        //     assert.ok(checkedtest.find("[type='checkbox']").dom.checked, "Check first checkbox still checked.");
        //     assert.ok(!checkedtest.query("[type='checkbox']").item(-1).dom.checked, "Check last checkbox still NOT checked.");
        // });
        /*
        test(":visible selector works properly on table elements (bug #4512)", function () {
            expect(1);
        
            var table = dom.parse("<table/>").setHtml("<tr><td style='display:none'>cell</td><td>cell</td></tr>");
            assert.strictEqual(table.find('td').isHidden(), true, "hidden cell is not perceived as visible");
        });
    
    
        */
        /*
        
        test(":visible selector works properly on children with a hidden parent", function () {
            expect(1);
            var table = dom.parse("<table/>").setStyle("display", "none").setHtml("<tr><td>cell</td><td>cell</td></tr>");
            assert.strictEqual(table.find('td').isHidden(), true, "hidden cell children not perceived as visible");
        });
        
        
        */
        // internal ref to elem.runtimeStyle
        var result = true;
        try {
            dom.setStyle(document.getElementById("foo"), 'width', "0%");
            dom.getStyle(document.getElementById("foo"), "width");
        }
        catch (e) {
            result = false;
        }
        assert.ok(result, "elem.runtimeStyle does not throw exception");
        var div = document.getElementById("foo");
        dom.setStyle(div, 'width', '1px');
        dom.setStyle(div, 'marginRight', 0);
        assert.strictEqual(dom.getStyle(div, "marginRight"), "0px", "marginRight correctly calculated with a width and display block");
        var div = document.body.appendChild(dom.parse("<div>"));
        div.style.position = "absolute";
        div.style.top = 0;
        div.style.left = "10px";
        assert.strictEqual(dom.getStyle(div, "top"), "10px", "the fixed property is used when accessing the computed style");
        dom.setStyle(div, "top", "100px");
        assert.strictEqual(div.style.left, "100px", "the fixed property is used when setting the style");
        var p = document.getElementById("qunit-fixture").appendChild(dom.parse("<p>"));
        if ("widows" in p.style) {
            dom.setStyle(p, 'widows', 0);
            dom.setStyle(p, 'orphans', 0);
            assert.strictEqual(dom.getStyle(p, "widows"), 0, "widows correctly start with value 0");
            assert.strictEqual(dom.getStyle(p, "orphans"), 0, "orphans correctly start with value 0");
            dom.setStyle(p, 'widows', 3);
            dom.setStyle(p, 'orphans', 3);
            assert.strictEqual(dom.getStyle(p, "widows"), 3, "widows correctly start with value 3");
            assert.strictEqual(dom.getStyle(p, "orphans"), 3, "orphans correctly start with value 3");
        }
        else {
            assert.ok(true, "Does not attempt to test for style props that definitely don't exist in older versions of IE");
        }
    }
    exports.setRectTest = setRectTest;
    function onTest() {
        var div = document.getElementById("foo");
        dom.on(div, "click", function () {
            assert.ok(1);
        });
        dom.off(div, "click");
        dom.trigger(div, "click");
    }
    exports.onTest = onTest;
    function offTest() {
        var div = document.getElementById("foo");
        var fn = function () {
            assert.ok(0);
        };
        dom.on(div, "click", fn);
        dom.off(div, "click", fn);
        dom.trigger(div, "click");
        assert.ok(1);
    }
    exports.offTest = offTest;
    function triggerTest() {
    }
    exports.triggerTest = triggerTest;
    function animateTest() {
    }
    exports.animateTest = animateTest;
    function isHiddenTest() {
        assert.strictEqual(dom.isHidden(document.getElementById("nothiddendiv")), false);
    }
    exports.isHiddenTest = isHiddenTest;
    function showTest() {
    }
    exports.showTest = showTest;
    function hideTest() {
    }
    exports.hideTest = hideTest;
    function toggleTest() {
    }
    exports.toggleTest = toggleTest;
    function readyTest(done) {
        dom.ready(function () {
            assert.ok(document.body);
            done();
        });
    }
    exports.readyTest = readyTest;
});
//# sourceMappingURL=dom-test.js.map