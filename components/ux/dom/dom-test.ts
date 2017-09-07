// import * as assert from "assert";
// import * as dom from "./dom";

// export function beforeEach() {
//     document.getElementById("qunit-fixture")!.innerHTML = `<p id="firstp">See <a id="simon1" href="http://simon.incutio.com/archive/2003/03/25/#getElementsBySelector" rel="bookmark">this blog entry</a> for more information.</p>
// 		<p id="ap">
// 			Here are some links in a normal paragraph: <a id="google" href="http://www.google.com/" title="Google!">Google</a>,
// 			<a id="groups" href="http://groups.google.com/" class="GROUPS">Google Groups (Link)</a>.
// 			This link has <code><a href="http://smin" id="anchor1">class="blog"</a></code>:
// 			<a href="http://diveintomark.org/" class="blog" hreflang="en" id="mark">diveintomark</a>

// 		</p>
// 		<div id="foo">
// 			<p id="sndp">Everything inside the red border is inside a div with <code>id="foo"</code>.</p>
// 			<p lang="en" id="en">This is a normal link: <a id="yahoo" href="http://www.yahoo.com/" class="blogTest">Yahoo</a></p>
// 			<p id="sap">This link has <code><a href="#2" id="anchor2">class="blog"</a></code>: <a href="http://simon.incutio.com/" class="blog link" id="simon">Simon Willison's Weblog</a></p>

// 		</div>
// 		<span id="name+value"></span>
// 		<p id="first">Try them out:</p>
// 		<ul id="firstUL"></ul>
// 		<ol id="empty"></ol>
// 		<form id="form" action="formaction">
// 			<label for="action" id="label-for">Action:</label>
// 			<input type="text" name="action" value="Test" id="text1" maxlength="30"/>
// 			<input type="text" name="text2" value="Test" id="text2" disabled="disabled"/>
// 			<input type="radio" name="radio1" id="radio1" value="on"/>

// 			<input type="radio" name="radio2" id="radio2" checked="checked"/>
// 			<input type="checkbox" name="check" id="check1" checked="checked"/>
// 			<input type="checkbox" id="check2" value="on"/>

// 			<input type="hidden" name="hidden" id="hidden1"/>
// 			<input type="text" style="display:none;" name="foo[bar]" id="hidden2"/>

// 			<input type="text" id="name" name="name" value="name" />
// 			<input type="search" id="search" name="search" value="search" />

// 			<button id="button" name="button" type="button">Button</button>

// 			<textarea id="area1" maxlength="30">foobar</textarea>

// 			<select name="select1" id="select1">
// 				<option id="option1a" class="emptyopt" value="">Nothing</option>
// 				<option id="option1b" value="1">1</option>
// 				<option id="option1c" value="2">2</option>
// 				<option id="option1d" value="3">3</option>
// 			</select>
// 			<select name="select2" id="select2">
// 				<option id="option2a" class="emptyopt" value="">Nothing</option>
// 				<option id="option2b" value="1">1</option>
// 				<option id="option2c" value="2">2</option>
// 				<option id="option2d" selected="selected" value="3">3</option>
// 			</select>
// 			<select name="select3" id="select3" multiple="multiple">
// 				<option id="option3a" class="emptyopt" value="">Nothing</option>
// 				<option id="option3b" selected="selected" value="1">1</option>
// 				<option id="option3c" selected="selected" value="2">2</option>
// 				<option id="option3d" value="3">3</option>
// 				<option id="option3e">no value</option>
// 			</select>
// 			<select name="select4" id="select4" multiple="multiple">
// 				<optgroup disabled="disabled">
// 					<option id="option4a" class="emptyopt" value="">Nothing</option>
// 					<option id="option4b" disabled="disabled" selected="selected" value="1">1</option>
// 					<option id="option4c" selected="selected" value="2">2</option>
// 				</optgroup>
// 				<option selected="selected" disabled="disabled" id="option4d" value="3">3</option>
// 				<option id="option4e">no value</option>
// 			</select>
// 			<select name="select5" id="select5">
// 				<option id="option5a" value="3">1</option>
// 				<option id="option5b" value="2">2</option>
// 				<option id="option5c" value="1">3</option>
// 			</select>

// 			<object id="object1" codebase="stupid">
// 				<param name="p1" value="x1" />
// 				<param name="p2" value="x2" />
// 			</object>

// 			<span id="台北Táiběi"></span>
// 			<span id="台北" lang="中文"></span>
// 			<span id="utf8class1" class="台北Táiběi 台北"></span>
// 			<span id="utf8class2" class="台北"></span>
// 			<span id="foo:bar" class="foo:bar"></span>
// 			<span id="test.foo[5]bar" class="test.foo[5]bar"></span>

// 			<foo_bar id="foobar">test element</foo_bar>
// 		</form>
// 		<b id="floatTest">Float test.</b>
// 		<iframe id="iframe" name="iframe"></iframe>
// 		<form id="lengthtest">
// 			<input type="text" id="length" name="test"/>
// 			<input type="text" id="idTest" name="id"/>
// 		</form>
// 		<table id="table"></table>

// 		<form id="name-tests">
// 			<!-- Inputs with a grouped name attribute. -->
// 			<input name="types[]" id="types_all" type="checkbox" value="all" />
// 			<input name="types[]" id="types_anime" type="checkbox" value="anime" />
// 			<input name="types[]" id="types_movie" type="checkbox" value="movie" />
// 		</form>

// 		<form id="testForm" action="#" method="get">
// 			<textarea name="T3" rows="2" cols="15">?\nZ</textarea>
// 			<input type="hidden" name="H1" value="x" />
// 			<input type="hidden" name="H2" />
// 			<input name="PWD" type="password" value="" />
// 			<input name="T1" type="text" />
// 			<input name="T2" type="text" value="YES" readonly="readonly" />
// 			<input type="checkbox" name="C1" value="1" />
// 			<input type="checkbox" name="C2" />
// 			<input type="radio" name="R1" value="1" />
// 			<input type="radio" name="R1" value="2" />
// 			<input type="text" name="My Name" value="me" />
// 			<input type="reset" name="reset" value="NO" />
// 			<select name="S1">
// 				<option value="abc">ABC</option>
// 				<option value="abc">ABC</option>
// 				<option value="abc">ABC</option>
// 			</select>
// 			<select name="S2" multiple="multiple" size="3">
// 				<option value="abc">ABC</option>
// 				<option value="abc">ABC</option>
// 				<option value="abc">ABC</option>
// 			</select>
// 			<select name="S3">
// 				<option selected="selected">YES</option>
// 			</select>
// 			<select name="S4">
// 				<option value="" selected="selected">NO</option>
// 			</select>
// 			<input type="submit" name="sub1" value="NO" />
// 			<input type="submit" name="sub2" value="NO" />
// 			<input type="image" name="sub3" value="NO" />
// 			<button name="sub4" type="submit" value="NO">NO</button>
// 			<input name="D1" type="text" value="NO" disabled="disabled" />
// 			<input type="checkbox" checked="checked" disabled="disabled" name="D2" value="NO" />
// 			<input type="radio" name="D3" value="NO" checked="checked" disabled="disabled" />
// 			<select name="D4" disabled="disabled">
// 				<option selected="selected" value="NO">NO</option>
// 			</select>
// 			<input id="list-test" type="text" />
// 			<datalist id="datalist">
// 				<option value="option"></option>
// 			</datalist>
// 		</form>
// 		<div id="moretests">
// 			<form>
// 				<div id="checkedtest" style="display:none;">
// 					<input type="radio" name="checkedtestradios" checked="checked"/>
// 					<input type="radio" name="checkedtestradios" value="on"/>
// 					<input type="checkbox" name="checkedtestcheckboxes" checked="checked"/>
// 					<input type="checkbox" name="checkedtestcheckboxes" />
// 				</div>
// 			</form>
// 			<div id="nonnodes"><span>hi</span> there <!-- mon ami --></div>
// 			<div id="t2037">
// 				<div><div class="hidden">hidden</div></div>
// 			</div>
// 			<div id="t6652">
// 				<div></div>
// 			</div>
// 			<div id="no-clone-exception"><object><embed></embed></object></div>
// 		</div>

// 		<div id="tabindex-tests">
// 			<ol id="listWithTabIndex" tabindex="5">
// 				<li id="foodWithNegativeTabIndex" tabindex="-1">Rice</li>
// 				<li id="foodNoTabIndex">Beans</li>
// 				<li>Blinis</li>
// 				<li>Tofu</li>
// 			</ol>

// 			<div id="divWithNoTabIndex">I'm hungry. I should...</div>
// 			<span>...</span><a href="#" id="linkWithNoTabIndex">Eat lots of food</a><span>...</span> |
// 			<span>...</span><a href="#" id="linkWithTabIndex" tabindex="2">Eat a little food</a><span>...</span> |
// 			<span>...</span><a href="#" id="linkWithNegativeTabIndex" tabindex="-1">Eat no food</a><span>...</span>
// 			<span>...</span><a id="linkWithNoHrefWithNoTabIndex">Eat a burger</a><span>...</span>
// 			<span>...</span><a id="linkWithNoHrefWithTabIndex" tabindex="1">Eat some funyuns</a><span>...</span>
// 			<span>...</span><a id="linkWithNoHrefWithNegativeTabIndex" tabindex="-1">Eat some funyuns</a><span>...</span>
// 		</div>

// 		<div id="liveHandlerOrder">
// 			<span id="liveSpan1"><a href="#" id="liveLink1"></a></span>
// 			<span id="liveSpan2"><a href="#" id="liveLink2"></a></span>
// 		</div>

// 		<div id="siblingTest">
// 			<em id="siblingfirst">1</em>
// 			<em id="siblingnext">2</em>
// 		</div>
//         </div>
//         </dl>
//         <div id="fx-test-group" style="position:absolute;width:1px;height:1px;overflow:hidden;">
// 		<div id="fx-queue" name="test">
// 			<div id="fadein" class='chain test' name='div'>fadeIn<div>fadeIn</div></div>
// 			<div id="fadeout" class='chain test out'>fadeOut<div>fadeOut</div></div>

// 			<div id="show" class='chain test'>show<div>show</div></div>
// 			<div id="hide" class='chain test out'>hide<div>hide</div></div>

// 			<div id="togglein" class='chain test'>togglein<div>togglein</div></div>
// 			<div id="toggleout" class='chain test out'>toggleout<div>toggleout</div></div>


// 			<div id="slideup" class='chain test'>slideUp<div>slideUp</div></div>
// 			<div id="slidedown" class='chain test out'>slideDown<div>slideDown</div></div>

// 			<div id="slidetogglein" class='chain test'>slideToggleIn<div>slideToggleIn</div></div>
// 			<div id="slidetoggleout" class='chain test out'>slideToggleOut<div>slideToggleOut</div></div>

// 			<div id="fadetogglein" class='chain test'>fadeToggleIn<div>fadeToggleIn</div></div>
// 			<div id="fadetoggleout" class='chain test out'>fadeToggleOut<div>fadeToggleOut</div></div>

// 			<div id="fadeto" class='chain test'>fadeTo<div>fadeTo</div></div>
// 		</div>

// 		<div id="fx-tests"></div>`
// }

// export function afterEach() {
//     document.getElementById("qunit-fixture")!.innerHTML = "";
// }

// export function parseTest() {
//     assert.strictEqual(dom.parse("<span><div></div><hr/><code></code><b></b></span>").childNodes.length, 4, "节点个数");
//     assert.strictEqual(dom.parse("<input type='text' value='TEST' />").value, "TEST", "默认值");
//     assert.strictEqual(dom.parse("<div/>").tagName, 'DIV', "确保空白被删除");
//     assert.strictEqual(dom.parse("<span>a<div></div>b</span>").childNodes.length, 3, "确保空白被删除");
//     assert.strictEqual(dom.parse("<div>\r\nsome text\n<p>some p</p>\nmore text\r\n</div>").nodeName.toUpperCase(), "DIV", "Make sure we're getting a div.");
//     assert.strictEqual(dom.parse("<div>\r\nsome text\n<p>some p</p>\nmore text\r\n</div>").firstChild!.nodeType, 3, "Text node.");
//     assert.strictEqual(dom.parse("<div>\r\nsome text\n<p>some p</p>\nmore text\r\n</div>").lastChild!.nodeType, 3, "Text node.");
//     assert.strictEqual(dom.parse("<div>\r\nsome text\n<p>some p</p>\nmore text\r\n</div>").childNodes[1].nodeType, 1, "Paragraph.");
//     assert.strictEqual(dom.parse("<div>\r\nsome text\n<p>some p</p>\nmore text\r\n</div>").childNodes[1].firstChild!.nodeType, 3, "Paragraph text.");

//     assert.ok(dom.parse("<link rel='stylesheet'/>"), "Creating a link");
//     assert.ok(dom.parse("<input/>"), "Create an input and set the type.");

//     assert.ok(dom.parse("<div><span>hi</span> there <!-- mon ami --></div>").childNodes.length >= 2, "Check node,textnode,comment creation (some browsers delete comments)");

//     assert.ok(!(dom.parse("<option>test</option>") as HTMLOptionElement).selected, "Make sure that options are auto-selected");

//     assert.ok(dom.parse("<div></div>"), "Create a div with closing tag.");
//     assert.ok(dom.parse("<table></table>"), "Create a table with closing tag.");

//     assert.strictEqual(dom.parse("<ul></ul>").nodeName.toUpperCase(), "UL");
//     assert.strictEqual(dom.parse("<ul><li></li></ul>").firstChild!.nodeName.toUpperCase(), "LI");
//     let large = "";
//     for (let i = 0; i < 50000; i++) {
//         large += `<li>${i}</li>`;
//     }
//     assert.strictEqual(dom.parse(`<ul>${large}</ul>`).childNodes.length, 50000);

//     assert.strictEqual(dom.parse("<span/>", dom.parse("<div/>").ownerDocument).tagName, 'SPAN', "Verify a span created with a div context works");

// }

// export function queryTest() {
//     assert.strictEqual(dom.query("#foo .blogTest")[0].innerHTML, "Yahoo", "Check for find");
//     assert.deepEqual(dom.query("#qunit-fixture > div")[0], document.getElementById("foo"), "find child elements");
//     assert.deepEqual(dom.query("#qunit-fixture > div")[1], document.getElementById("moretests"), "find child elements");
//     assert.deepEqual(dom.query("#qunit-fixture > div")[2], document.getElementById("tabindex-tests"), "find child elements");
//     assert.deepEqual(dom.query("#qunit-fixture > div")[3], document.getElementById("liveHandlerOrder"), "find child elements");
//     assert.deepEqual(dom.query("#qunit-fixture > div")[4], document.getElementById("siblingTest"), "find child elements");
//     assert.deepEqual(dom.query("#qunit-fixture > div")[5], document.getElementById("fx-test-group"), "find child elements");
//     assert.deepEqual(dom.query("#qunit-fixture > div").length, 6, "find child elements");
//     assert.deepEqual(dom.query("#qunit-fixture > #foo > p").length, 3, "find child elements");
//     assert.deepEqual(dom.query("#qunit-fixture > #foo > p")[0], document.getElementById("sndp"), "find child elements");
//     assert.deepEqual(dom.query("#qunit-fixture > #foo > p")[1], document.getElementById("en"), "find child elements");
//     assert.deepEqual(dom.query("#qunit-fixture > #foo > p")[2], document.getElementById("sap"), "find child elements");
//     assert.deepEqual(dom.query("> #foo > p", document.getElementById("qunit-fixture")!)[0], document.getElementById("sndp"), "find child elements");
//     assert.deepEqual(dom.query("> #foo > p", document.getElementById("qunit-fixture")!)[2], document.getElementById("sap"), "find child elements");
// }

// export function findTest() {
//     assert.strictEqual(dom.find("#foo .blogTest")!.innerHTML, "Yahoo", "Check for find");
//     assert.deepEqual(dom.find("#qunit-fixture > div"), document.getElementById("foo"), "find child elements");
//     assert.deepEqual(dom.find("#qunit-fixture > #foo > p"), document.getElementById("sndp"), "find child elements");
//     assert.deepEqual(dom.find("> #foo > p", document.getElementById("qunit-fixture")!), document.getElementById("sndp"), "find child elements");
// }

// export function matchTest() {
//     assert.ok(dom.match(document.getElementById("form")!, "form"), "Check for element: A form must be a form");
//     assert.ok(!dom.match(document.getElementById("form")!, "div"), "Check for element: A form is not a div");
//     assert.ok(dom.match(document.getElementById("mark")!, ".blog"), "Check for class: Expected class 'blog'");
//     assert.ok(!dom.match(document.getElementById("mark")!, ".link"), "Check for class: Did not expect class 'link'");
//     assert.ok(dom.match(document.getElementById("simon")!, ".blog.link"), "Check for multiple classes: Expected classes 'blog' and 'link'");
//     assert.ok(!dom.match(document.getElementById("simon")!, ".blogTest"), "Check for multiple classes: Expected classes 'blog' and 'link', but not 'blogTest'");
//     assert.ok(dom.match(document.getElementById("en")!, "[lang=\"en\"]"), "Check for attribute: Expected attribute lang to be 'en'");
//     assert.ok(!dom.match(document.getElementById("en")!, "[lang=\"de\"]"), "Check for attribute: Expected attribute lang to be 'en', not 'de'");
//     assert.ok(dom.match(document.getElementById("text1")!, "[type=\"text\"]"), "Check for attribute: Expected attribute type to be 'text'");
//     assert.ok(!dom.match(document.getElementById("text1")!, "[type=\"radio\"]"), "Check for attribute: Expected attribute type to be 'text', not 'radio'");
//     assert.ok(dom.match(document.getElementById("text2")!, ":disabled"), "Check for pseudoclass: Expected to be disabled");
//     assert.ok(!dom.match(document.getElementById("text1")!, ":disabled"), "Check for pseudoclass: Expected not disabled");
//     assert.ok(dom.match(document.getElementById("radio2")!, ":checked"), "Check for pseudoclass: Expected to be checked");
//     assert.ok(!dom.match(document.getElementById("radio1")!, ":checked"), "Check for pseudoclass: Expected not checked");

//     // test is() with comma-seperated expressions
//     assert.ok(dom.match(document.getElementById("en")!, "[lang=\"en\"],[lang=\"de\"]"), "Comma-seperated; Check for lang attribute: Expect en or de");
//     assert.ok(dom.match(document.getElementById("en")!, "[lang=\"de\"],[lang=\"en\"]"), "Comma-seperated; Check for lang attribute: Expect en or de");
//     assert.ok(dom.match(document.getElementById("en")!, "[lang=\"en\"] , [lang=\"de\"]"), "Comma-seperated; Check for lang attribute: Expect en or de");
//     assert.ok(dom.match(document.getElementById("en")!, "[lang=\"de\"] , [lang=\"en\"]"), "Comma-seperated; Check for lang attribute: Expect en or de");

//     assert.ok(dom.match(document.getElementById("option1b")!, "#select1 option:not(:first-child)"), "POS inside of :not() (#10970)");
// }

// export function firstTest() {
//     assert.strictEqual(dom.first(document.getElementById("qunit-fixture")!)!.id, "firstp");
//     assert.strictEqual(dom.first(document.getElementById("qunit-fixture")!, "#ap")!.id, "ap");
// }

// export function lastTest() {
//     assert.strictEqual(dom.last(document.getElementById("qunit-fixture")!)!.id, "fx-test-group");
//     assert.strictEqual(dom.last(document.getElementById("qunit-fixture")!, "#fx-test-group")!.id, "fx-test-group");
// }

// export function nextTest() {
//     assert.strictEqual(dom.next(document.getElementById("ap")!)!.id, "foo", "Simple next check");
//     assert.strictEqual(dom.next(document.getElementById("ap")!, "div")!.id, "foo", "Simple next check");
//     assert.strictEqual(dom.next(document.getElementById("ap")!, "aside"), null, "Filtered next check, no match");
//     assert.strictEqual(dom.next(document.getElementById("ap")!, "div, p")!.id, "foo", "Multiple filters");
// }

// export function prevTest() {
//     assert.strictEqual(dom.prev(document.getElementById("foo")!)!.id, "ap", "Simple prev check");
//     assert.strictEqual(dom.prev(document.getElementById("foo")!, "p")!.id, "ap", "Simple prev check");
//     assert.strictEqual(dom.prev(document.getElementById("foo")!, "aside"), null, "Filtered prev check, no match");
//     assert.strictEqual(dom.prev(document.getElementById("foo")!, "p, div")!.id, "ap", "Multiple filters");
// }

// export function parentTest() {
//     assert.strictEqual(dom.parent(document.getElementById("groups")!)!.id, "ap", "Simple parent check");
//     assert.strictEqual(dom.parent(document.getElementById("groups")!, "p")!.id, "ap", "Filtered parent check");
//     assert.strictEqual(dom.parent(document.getElementById("groups")!, "div2"), null, "Filtered parent check, no match");
//     assert.strictEqual(dom.parent(document.getElementById("groups")!, "div, p")!.id, "ap", "Check for multiple filters");
// }

// export function closestTest() {
//     assert.deepEqual(dom.closest(document.body, "body"), document.body, "closest(body)");
//     assert.deepEqual(dom.closest(document.body, "html"), document.documentElement, "closest(html)");
//     assert.deepEqual(dom.closest(document.body, "div"), null, "closest(div)");
//     assert.deepEqual(dom.closest(document.getElementById("qunit-fixture")!, "span,html"), document.documentElement, "closest(span,html)");

//     assert.deepEqual(dom.closest(dom.find("#qunit-fixture div:nth-child(2)")!, "div:first-child"), null, "closest(div:first-child)");
//     assert.deepEqual(dom.closest(dom.find("div")!, "body:first-child div:last-child"), dom.find("fx-tests"), "closest(body:first-child div:last-child)");

//     // Test .closest() limited by the context
//     assert.deepEqual(dom.closest(document.getElementById("#nothiddendivchild")!, "html", document.body), null, "Context limited.");
//     assert.deepEqual(dom.closest(document.getElementById("#nothiddendivchild")!, "body", document.body), null, "Context limited.");
//     assert.deepEqual(dom.closest(document.getElementById("#nothiddendivchild")!, "#nothiddendiv", document.body), document.getElementById("nothiddendiv"), "Context not reached.");

//     //Test that .closest() returns unique'd set
//     assert.deepEqual(dom.closest(dom.find("#qunit-fixture p")!, "#qunit-fixture"), document.getElementById('qunit-fixture'), "Closest should return a unique set");

//     // Test on disconnected node
//     assert.strictEqual(dom.closest(dom.find("p", dom.parse("<div><p></p></div>"))!, "table"), null, "Make sure disconnected closest work.");

//     // Bug #7369
//     assert.strictEqual(!dom.parse("<div foo='bar'></div>").closest("[foo]"), false, "Disconnected nodes with attribute selector");
//     assert.strictEqual(dom.parse("<div>text</div>").closest("[lang]"), null, "Disconnected nodes with text and non-existent attribute selector");
// }

// export function childrenTest() {
//     assert.deepEqual(dom.children(document.getElementById("foo")!).length, 3, "Check for children");
//     assert.deepEqual(dom.children(document.getElementById("foo")!)[0].id, "sndp", "Check for children");
//     assert.deepEqual(dom.children(document.getElementById("foo")!)[1].id, "en", "Check for children");
//     assert.deepEqual(dom.children(document.getElementById("foo")!)[2].id, "sap", "Check for children");
//     assert.deepEqual(dom.children(document.getElementById("foo")!, "#en, #sap").length, 2, "Check for children");
//     assert.deepEqual(dom.children(document.getElementById("foo")!, "#en, #sap")[0].id, "en", "Check for children");
//     assert.deepEqual(dom.children(document.getElementById("foo")!, "#en, #sap")[1].id, "sap", "Check for children");
// }

// export function indexTest() {
//     assert.strictEqual(dom.index(document.getElementById("text2")!), 2, "Returns the index of a child amongst its siblings");
//     assert.strictEqual(dom.index(dom.parse("<div/>")), 0, "Node without parent returns 0");
// }

// export function containsTest() {
//     assert.strictEqual(dom.contains(document.body, document.body), true);
//     assert.strictEqual(dom.contains(document.body, document.getElementById("qunit-fixture")!), true);
//     assert.strictEqual(dom.contains(document.getElementById("qunit-fixture")!, document.body), false);
// }

// export function appendTest() {
//     dom.append(document.getElementById("yahoo")!, "<b>buga</b>");
//     assert.strictEqual(document.getElementById("en")!.textContent!.replace(/[\r\n]/g, ""), "This is a normal link: Yahoobuga", "Insert String after");

//     afterEach();
//     beforeEach();
//     dom.append(document.getElementById("yahoo")!, document.getElementById("first")!);
//     assert.strictEqual(document.getElementById("en")!.textContent!.replace(/[\r\n]/g, ""), "This is a normal link: YahooTry them out:", "Insert element after");

//     afterEach();
//     beforeEach();
//     dom.append(document.getElementById("yahoo")!, document.getElementById("mark")!);
//     assert.strictEqual(document.getElementById("en")!.textContent!.replace(/[\r\n]/g, ""), "This is a normal link: Yahoodiveintomark", "Insert dom after");

//     const div = dom.parse("<div/>");
//     dom.append(div, "<span></span><span>test</span>");
//     assert.strictEqual(div.lastChild!.nodeName.toLowerCase(), "span", "Insert the element after the disconnected node.");

//     assert.strictEqual((dom.append(document.getElementById("select3")!, "<option value='appendTest'>Append Test</option>") as HTMLSelectElement).value, "appendTest", "Appending html options to select element");

//     afterEach();
//     beforeEach();
//     dom.append(document.getElementById("sap")!, document.getElementById("first")!);
//     assert.strictEqual(document.getElementById("sap")!.textContent!.replace(/[\r\n]/g, '').replace("hasclass", "has class"), "This link has class=\"blog\": Simon Willison's WeblogTry them out:", "Check for appending of element");

//     afterEach();
//     beforeEach();
//     dom.append(document.getElementById("sap")!, " text with spaces ");
//     assert.ok(document.getElementById("sap")!.innerHTML.match(/ text with spaces $/), "Check for appending text with spaces");

//     afterEach();
//     beforeEach();
//     assert.ok(dom.append(document.getElementById("sap")!, ""), "Check for appending an empty string.");

//     afterEach();
//     beforeEach();
//     dom.append(document.getElementById("form")!, "<input name='radiotest' type='radio' checked='checked' />");
//     assert.ok((dom.find("input[name=radiotest]", document.getElementById("form")!) as HTMLInputElement).checked, "Append checked radio");

//     afterEach();
//     beforeEach();
//     dom.append(document.getElementById("form")!, "<input name='radiotest' type='radio' checked    =   'checked' />");
//     assert.ok((dom.find("input[name=radiotest]", document.getElementById("form")!) as HTMLInputElement).checked, "Append checked radio");

//     afterEach();
//     beforeEach();
//     dom.append(document.getElementById("form")!, "<input name='radiotest' type='radio' checked />");
//     assert.ok((dom.find("input[name=radiotest]", document.getElementById("form")!) as HTMLInputElement).checked, "Append HTML5-formated checked radio");

//     afterEach();
//     beforeEach();
//     dom.append(document.getElementById("sap")!, document.getElementById("form")!);
//     assert.strictEqual(!dom.find('form', document.getElementById("sap")!), false, "Check for appending a form"); // Bug #910

//     afterEach();
//     beforeEach();
//     let pass = true;
//     try {
//         const body = (document.getElementById("iframe") as HTMLIFrameElement).contentWindow.document.body;
//         if (body !== null) {
//             pass = false;
//             dom.append(body, "<div>test</div>");
//         }
//         pass = true;
//     } catch (e) { }

//     assert.ok(pass, "Test for appending a DOM node to the contents of an IFrame");

//     afterEach();
//     beforeEach();
//     dom.append(document.getElementById("select1")!, "<OPTION>Test</OPTION>");
//     assert.strictEqual(dom.last(document.getElementById("select1")!, 'option')!.textContent, "Test", "Appending <OPTION> (all caps)");

//     var colgroup = dom.append(document.getElementById("table")!, "<colgroup></colgroup>");
//     assert.strictEqual((document.getElementById("table")!.lastChild as HTMLElement).tagName.toLowerCase(), "colgroup", "Append colgroup");

//     dom.append(colgroup, "<col/>");
//     assert.strictEqual(dom.last(colgroup)!.tagName, "COL", "Append col");

//     afterEach();
//     beforeEach();
//     dom.append(document.getElementById("table")!, "<caption></caption>");
//     assert.strictEqual(dom.first(document.getElementById("table")!)!.tagName.toLowerCase(), "caption", "Append caption");

//     afterEach();
//     beforeEach();
//     const prev = dom.children(document.getElementById("sap")!).length;
//     dom.append(document.getElementById("sap")!, "<span></span><span></span><span></span>");
//     assert.strictEqual(dom.children(document.getElementById("sap")!).length, prev + 3, "Make sure that multiple arguments works.");
// }

// export function prependTest() {
//     dom.prepend(document.getElementById("first")!, "<b>buga</b>");
//     assert.strictEqual(document.getElementById("first")!.textContent, "bugaTry them out:", "Check if text prepending works");
//     assert.strictEqual((dom.prepend(document.getElementById("select3")!, "<option value='prependTest'>Prepend Test</option>") as HTMLOptionElement).value, "prependTest", "Prepending html options to select element");

//     afterEach();
//     beforeEach();
//     var expected = "Try them out:This link has class=\"blog\": Simon Willison's Weblog";
//     dom.prepend(document.getElementById("sap")!, document.getElementById("first")!);
//     assert.strictEqual(document.getElementById("sap")!.textContent!.replace(/[\r\n]/g, "").replace("hasclass", "has class"), expected, "Check for prepending of element");

//     afterEach();
//     beforeEach();
//     expected = "YahooThis link has class=\"blog\": Simon Willison's Weblog";
//     dom.prepend(document.getElementById("sap")!, document.getElementById("yahoo")!);
//     assert.strictEqual(document.getElementById("sap")!.textContent!.replace(/[\r\n]/g, "").replace("hasclass", "has class"), expected, "Check for prepending of dom.parse object");
// }

// export function beforeTest() {
//     var expected = "This is a normal link: bugaYahoo";
//     dom.before(document.getElementById("yahoo")!, "<b>buga</b>");
//     assert.strictEqual(document.getElementById("en")!.textContent!.replace(/[\r\n]/g, ""), expected, "Insert String before");

//     afterEach();
//     beforeEach();
//     expected = "This is a normal link: Try them out:Yahoo";
//     dom.before(document.getElementById("yahoo")!, document.getElementById("first")!);

//     // !Safari
//     assert.strictEqual(document.getElementById("en")!.textContent!.replace(/[\r\n]/g, "").replace("link:T", "link: T"), expected, "Insert element before");

//     afterEach();
//     beforeEach();
//     expected = "This is a normal link: diveintomarkYahoo";
//     dom.before(document.getElementById("yahoo")!, document.getElementById("mark")!);
//     assert.strictEqual(document.getElementById("en")!.textContent!.replace(/[\r\n]/g, ""), expected, "Insert dom.parse before");
// }

// export function afterTest() {
//     var expected = "This is a normal link: Yahoobuga";
//     dom.after(document.getElementById("yahoo")!, "<b>buga</b>");
//     assert.strictEqual(document.getElementById("en")!.textContent!.replace(/[\r\n]/g, ""), expected, "Insert String after");

//     afterEach();
//     beforeEach();
//     expected = "This is a normal link: YahooTry them out:";
//     dom.after(document.getElementById("yahoo")!, document.getElementById("first")!);
//     assert.strictEqual(document.getElementById("en")!.textContent!.replace(/[\r\n]/g, ""), expected, "Insert element after");

//     afterEach();
//     beforeEach();
//     expected = "This is a normal link: Yahoodiveintomark";
//     dom.after(document.getElementById("yahoo")!, document.getElementById("mark")!);
//     assert.strictEqual(document.getElementById("en")!.textContent!.replace(/[\r\n]/g, ""), expected, "Insert dom.parse after");
// }

// export function removeTest() {
//     dom.remove(document.getElementById("ap"));
//     assert.ok(!document.getElementById("ap"));
// }

// export function cloneTest() {
//     assert.strictEqual(dom.clone(document.getElementById("qunit-fixture")!).childNodes.length, document.getElementById("qunit-fixture")!.childNodes.length, "Simple child length to ensure a large dom tree copies correctly");
// }

// export function getAttrTest() {
//     assert.strictEqual(dom.getAttr(document.getElementById("text1")!, "type"), "text", "Check for type attribute");
//     assert.strictEqual(dom.getAttr(document.getElementById("radio1")!, "type"), "radio", "Check for type attribute");
//     assert.strictEqual(dom.getAttr(document.getElementById("check1")!, "type"), "checkbox", "Check for type attribute");
//     assert.strictEqual(dom.getAttr(document.getElementById("simon1")!, "rel"), "bookmark", "Check for rel attribute");
//     assert.strictEqual(dom.getAttr(document.getElementById("google")!, "title"), "Google!", "Check for title attribute");
//     assert.strictEqual(dom.getAttr(document.getElementById("mark")!, "hreflang"), "en", "Check for hreflang attribute");
//     assert.strictEqual(dom.getAttr(document.getElementById("en")!, "lang"), "en", "Check for lang attribute");
//     assert.strictEqual(dom.getAttr(document.getElementById("simon")!, "class"), "blog link", "Check for class attribute");
//     assert.strictEqual(dom.getAttr(document.getElementById("name")!, "name"), "name", "Check for name attribute");
//     assert.strictEqual(dom.getAttr(document.getElementById("text1")!, "name"), "action", "Check for name attribute");
//     assert.ok(dom.getAttr(document.getElementById("form")!, "action")!.indexOf("formaction") >= 0, "Check for action attribute");
//     dom.setAttr(document.getElementById("text1")!, "value", "t");
//     assert.strictEqual(dom.getAttr(document.getElementById("text1")!, "value"), "t", "Check setting the value attribute");
//     assert.strictEqual(dom.getAttr(dom.parse("<div value='t'></div>")!, "value"), "t", "Check setting custom attr named 'value' on a div");
//     dom.setAttr(document.getElementById("form")!, "blah", "blah");
//     assert.strictEqual(dom.getAttr(document.getElementById("form")!, "blah"), "blah", "Set non-existant attribute on a form");
//     assert.strictEqual(dom.getAttr(document.getElementById("foo")!, "height"), undefined, "Non existent height attribute should return undefined");

//     // [7472] & [3113] (form contains an input with name="action" or name="id")
//     var extras = document.getElementById("testForm")!.appendChild(dom.parse("<input name='id' name='name' /><input id='target' name='target' />"));
//     dom.setAttr(document.getElementById("form")!, "action", "newformaction");
//     assert.strictEqual(dom.getAttr(document.getElementById("form")!, "action"), "newformaction", "Check that action attribute was changed");
//     // assert.strictEqual(dom.getAttr(document.getElementById("testForm")!, "target", 1), null, "Retrieving target does not equal the input with name=target");

//     dom.setAttr(document.getElementById("testForm")!, "target", "newTarget");
//     assert.strictEqual(dom.getAttr(document.getElementById("testForm")!, "target"), "newTarget", "Set target successfully on a form");
//     dom.setAttr(document.getElementById("testForm")!, "id", null);
//     assert.strictEqual(dom.getAttr(document.getElementById("testForm")!, "id"), null, "Retrieving id does not equal the input with name=id after id is removed [#7472]");
//     // Bug #3685 (form contains input with name="name")
//     assert.strictEqual(dom.getAttr(document.getElementById("testForm")!, "name"), null, "Retrieving name does not retrieve input with name=name");
//     (extras as any).remove();

//     assert.strictEqual(dom.getAttr(document.getElementById("text1")!, "maxlength"), "30", "Check for maxlength attribute");
//     assert.strictEqual(dom.getAttr(document.getElementById("text1")!, "maxLength"), "30", "Check for maxLength attribute");
//     assert.strictEqual(dom.getAttr(document.getElementById("area1")!, "maxLength"), "30", "Check for maxLength attribute");

//     // using innerHTML in IE causes href attribute to be serialized to the full path
//     document.getElementById("qunit-fixture")!.appendChild(dom.parse("<a id='tAnchor5' href='#5'/>"));
//     assert.strictEqual(dom.getAttr(document.getElementById("tAnchor5")!, "href"), "#5", "Check for non-absolute href (an anchor)");

//     // list attribute is readonly by default in browsers that support it
//     dom.setAttr(document.getElementById("list-test")!, "list", "datalist");
//     assert.strictEqual(dom.getAttr(document.getElementById("list-test")!, "list"), "datalist", "Check setting list attribute");

//     // Related to [5574] and [5683]
//     assert.strictEqual(dom.getAttr(document.body, "foo2"), null, "Make sure that a non existent attribute returns null");

//     document.body.setAttribute("foo", "baz");
//     assert.strictEqual(dom.getAttr(document.body, "foo"), "baz", "Make sure the dom attribute is retrieved when no expando is found");

//     dom.setAttr(document.body, "foo", "cool");
//     assert.strictEqual(dom.getAttr(document.body, "foo"), "cool", "Make sure that setting works well when both expando and dom attribute are available");

//     document.body.removeAttribute("foo"); // Cleanup

//     var select = document.createElement("select"), optgroup = document.createElement("optgroup"), option = document.createElement("option");
//     optgroup.appendChild(option);
//     select.appendChild(optgroup);

//     assert.strictEqual(dom.getAttr(option, "selected"), "selected", "Make sure that a single option is selected, even when in an optgroup.");

//     var $img = document.appendChild(dom.parse("<img style='display:none' width='215' height='53' src='../../assets/resources/userface.png'/>")) as HTMLElement;
//     assert.strictEqual(dom.getAttr($img, "width"), "215", "Retrieve width attribute an an element with display:none.");
//     assert.strictEqual(dom.getAttr($img, "height"), "53", "Retrieve height attribute an an element with display:none.");

//     // Check for style support
//     assert.ok(!!~dom.getAttr(document.getElementById("dl")!, "style")!.indexOf("position"), "Check style attribute getter, also normalize css props to lowercase");
//     dom.setAttr(document.getElementById("foo")!, "style", "position:absolute;");
//     assert.ok(!!~dom.getAttr(document.getElementById("foo")!, "style")!.indexOf("position"), "Check style setter");

//     // Check value on button element (#1954)
//     const $button = dom.after(document.getElementById("button")!, "<button value='foobar'>text</button>") as HTMLElement;
//     assert.strictEqual(dom.getAttr($button, "value"), "foobar", "Value retrieval on a button does not return innerHTML");
//     dom.setAttr($button, "value", "baz");
//     assert.strictEqual($button.innerHTML, "text", "Setting the value does not change innerHTML");

//     // Attributes with a colon on a table element (#1591)
//     assert.strictEqual(dom.getAttr(document.getElementById("table")!, "test:attrib"), undefined, "Retrieving a non-existent attribute on a table with a colon does not throw an error.");
//     dom.setAttr(document.getElementById("table")!, "test:attrib", "foobar");
//     assert.strictEqual(dom.getAttr(document.getElementById("table")!, "test:attrib"), "foobar", "Setting an attribute on a table with a colon does not throw an error.");

//     var $form = document.getElementById("qunit-fixture")!.appendChild(dom.parse("<form class='something'></form>")) as HTMLElement;
//     assert.strictEqual(dom.getAttr($form, "class"), "something", "Retrieve the class attribute on a form.");

//     var $a = document.getElementById("qunit-fixture")!.appendChild(dom.parse("<a href='#' onclick='something()'>Click</a>")) as HTMLElement;
//     assert.strictEqual(dom.getAttr($a, "onclick"), "something()", "Retrieve ^on attribute without anonymous function wrapper.");

//     assert.strictEqual(dom.getAttr(dom.parse("<div/>"), "doesntexist"), null, "Make sure null is returned when no attribute is found.");
//     assert.strictEqual(dom.getAttr(dom.parse("<div/>"), "title"), null, "Make sure null is returned when no attribute is found.");
//     const div = dom.parse("<div/>");
//     dom.setAttr(div, "title", "something");
//     assert.strictEqual(dom.getAttr(div, "title"), "something", "Set the title attribute.");
//     assert.strictEqual(dom.getAttr(dom.parse("<div/>"), "value"), null, "An unset value on a div returns undefined.");
//     assert.strictEqual(dom.getAttr(dom.parse("<input/>"), "value"), "", "An unset value on an input returns current value.");

//     dom.setAttr(document.getElementById("form")!, "enctype", "multipart/form-data");
//     assert.strictEqual(dom.getAttr(document.getElementById("form")!, "enctype"), "multipart/form-data", "Set the enctype of a form (encoding in IE6/7 #6743)");
// }

// export function setAttrTest() {

//     const div = document.getElementById("div")!;
//     dom.setAttr(div, "foo", "bar");
//     assert.strictEqual(div.getAttribute("foo"), "bar", "Set Attribute");

//     assert.ok(dom.setAttr(document.getElementById("foo")!, "width", null), "Try to set an attribute to nothing");

//     dom.setAttr(document.getElementById("name")!, "name", "something");
//     assert.strictEqual(dom.getAttr(document.getElementById("name")!, "name"), "something", "Set name attribute");
//     dom.setAttr(document.getElementById("name")!, "name", null);
//     assert.strictEqual(dom.getAttr(document.getElementById("name")!, "name"), null, "Remove name attribute");
//     assert.strictEqual(dom.getAttr(dom.parse("<input name=something>"), "name"), "something", "Check element creation gets/sets the name attribute.");


//     dom.setAttr(document.getElementById("check2")!, "checked", null);
//     assert.strictEqual((document.getElementById("check2") as HTMLInputElement).checked, false, "Set checked attribute");
//     assert.strictEqual(dom.getAttr(document.getElementById("check2")!, "checked"), null, "Set checked attribute");
//     dom.setAttr(document.getElementById("text1")!, "readonly", "readonly");
//     assert.strictEqual((document.getElementById("text1") as HTMLInputElement).readOnly, true, "Set readonly attribute");
//     assert.strictEqual(dom.getAttr(document.getElementById("text1")!, "readonly"), true, "Set readonly attribute");
//     // document.getElementById("text1").setAttr("readonly", false);
//     // assert.strictEqual(document.getElementById("text1").readOnly, false, "Set readonly attribute");
//     // assert.strictEqual(document.getElementById("text1").getAttr("readonly"), false, "Set readonly attribute");

//     // document.getElementById("check2").dom.checked = true;
//     // assert.strictEqual(document.getElementById("check2").checked, true, "Set checked attribute");
//     // assert.strictEqual(document.getElementById("check2").getAttr("checked"), true, "Set checked attribute");
//     // document.getElementById("check2").dom.checked = false;
//     // assert.strictEqual(document.getElementById("check2").checked, false, "Set checked attribute");
//     // assert.strictEqual(document.getElementById("check2").getAttr("checked"), false, "Set checked attribute");

//     // document.getElementById("check2").setAttr("checked", "checked");
//     // assert.strictEqual(document.getElementById("check2").checked, true, "Set checked attribute with 'checked'");
//     // assert.strictEqual(document.getElementById("check2").getAttr("checked"), true, "Set checked attribute");

//     // document.getElementById("text1").dom.readOnly = true;
//     // assert.strictEqual(document.getElementById("text1").readOnly, true, "Set readonly attribute");
//     // assert.strictEqual(document.getElementById("text1").getAttr("readOnly"), true, "Set readonly attribute");

//     // document.getElementById("text1").dom.readOnly = false;
//     // assert.strictEqual(document.getElementById("text1").readOnly, false, "Set readonly attribute");
//     // assert.strictEqual(document.getElementById("text1").getAttr("readOnly"), false, "Set readonly attribute");

//     // document.getElementById("name").setAttr("maxlength", "5");
//     // assert.strictEqual(document.getElementById("name").maxLength, 5, "Set maxlength attribute");
//     // document.getElementById("name").setAttr("maxLength", "10");
//     // assert.strictEqual(document.getElementById("name").maxLength, 10, "Set maxlength attribute");

//     // // HTML5 boolean attributes
//     // var $text = document.getElementById("text1").setAttr("autofocus", true).setAttr("required", true);
//     // assert.strictEqual($text.getAttr("autofocus"), true, "Set boolean attributes to the same name");
//     // assert.strictEqual($text.setAttr("autofocus", false).getAttr("autofocus"), false, "Setting autofocus attribute to false removes it");
//     // assert.strictEqual($text.getAttr("required"), true, "Set boolean attributes to the same name");
//     // assert.strictEqual($text.setAttr("required", false).getAttr("required"), false, "Setting required attribute to false removes it");

//     // var $details = dom.parse("<details open></details>");

//     // $details = $details.first() || $details;
//     // $details.appendTo("qunit-fixture");
//     // //assert.strictEqual( !$details.getAttr("open"), true, "open attribute presense indicates true" );
//     // assert.strictEqual($details.setAttr("open", false).getAttr("open"), false, "Setting open attribute to false removes it");

//     // $text.setAttr("data-something", true);
//     // assert.strictEqual($text.getAttr("data-something"), "true", "Set data attributes");
//     // assert.strictEqual($text.getAttr("something"), null, "Setting data attributes are not affected by boolean settings");
//     // $text.setAttr("data-another", false);
//     // assert.strictEqual($text.getAttr("data-another"), "false", "Set data attributes");
//     // //assert.strictEqual( $text.data("another"), false, "Setting data attributes are not affected by boolean settings" );
//     // assert.strictEqual($text.setAttr("aria-disabled", false).getAttr("aria-disabled"), "false", "Setting aria attributes are not affected by boolean settings");

//     // document.getElementById("foo").setAttr("contenteditable", true);
//     // assert.strictEqual(document.getElementById("foo").getAttr("contenteditable"), "true", "Enumerated attributes are set properly");

//     // assert.strictEqual(dom.document.getAttr("nonexisting"), null, "attr works correctly for non existing attributes.");
//     // assert.strictEqual(dom.document.setAttr("something", "foo").getAttr("something"), "foo", "attr falls back to prop on unsupported arguments");

//     // var table = document.getElementById("table");

//     // table.append("<tr><td>cell</td></tr><tr><td>cell</td><td>cell</td></tr><tr><td>cell</td><td>cell</td></tr>");


//     // var td = table.find("td");
//     // td.setAttr("rowspan", "2");

//     // // FIXME:  why  ?
//     // // assert.strictEqual( td.rowSpan, 2, "Check rowspan is correctly set" );
//     // //    td.setAttr("colspan", "2");
//     // //    assert.strictEqual( td.colSpan, 2, "Check colspan is correctly set" );
//     // table.setAttr("cellspacing", "2");
//     // assert.strictEqual(table.dom.cellSpacing, "2", "Check cellspacing is correctly set");
//     // assert.strictEqual(document.getElementById("area1").getAttr("value"), "foobar", "Value attribute retrieves the property for backwards compatibility.");

//     // // for #1070
//     // document.getElementById("name").setAttr("someAttr", "0");
//     // assert.strictEqual(document.getElementById("name").getAttr("someAttr"), "0", "Set attribute to a string of \"0\"");
//     // document.getElementById("name").setAttr("someAttr", 0);
//     // assert.strictEqual(document.getElementById("name").getAttr("someAttr"), "0", "Set attribute to the number 0");
//     // document.getElementById("name").setAttr("someAttr", 1);
//     // assert.strictEqual(document.getElementById("name").getAttr("someAttr"), "1", "Set attribute to the number 1");

//     // afterEach(); beforeEach();

//     // // Type
//     // var type = document.getElementById("check2").getAttr("type");
//     // try {
//     //     document.getElementById("check2").setAttr("type", "hidden");
//     // } catch (e) {

//     // }
//     // assert.ok(true, "Exception thrown when trying to change type property");
//     // // assert.strictEqual( type, document.getElementById("check2").getAttr("type"), "Verify that you can't change the type of an input element" );

//     // var check = dom.create("input");
//     // //var thrown = true;
//     // try {
//     //     check.setAttr("type", "checkbox");
//     // } catch (e) {
//     //     //thrown = false;
//     // }
//     // assert.ok(true, "Exception thrown when trying to change type property");
//     // //assert.strictEqual( "checkbox", check.getAttr("type"), "Verify that you can change the type of an input element that isn't in the DOM" );

//     // var check = dom.parse("<input />");
//     // //var thrown = true;
//     // try {
//     //     check.setAttr("type", "checkbox");
//     // } catch (e) {
//     //     //thrown = false;
//     // }
//     // assert.ok(true, "Exception thrown when trying to change type property");
//     // //assert.strictEqual( "checkbox", check.getAttr("type"), "Verify that you can change the type of an input element that isn't in the DOM" );

//     // var button = document.getElementById("button");
//     // //var thrown = false;
//     // try {
//     //     button.setAttr("type", "submit");
//     // } catch (e) {
//     //     //thrown = true;
//     // }
//     // assert.ok(true, "Exception thrown when trying to change type property");
//     // //assert.strictEqual( "button", button.getAttr("type"), "Verify that you can't change the type of a button element" );

//     // var $radio = dom.parse("<input value='sup' type='radio'>").appendTo("testForm");

//     // assert.strictEqual($radio!.textContent!, "sup", "Value is not reset when type is set after value on a radio");
//     // // Setting attributes on svg element
//     // var $svg = dom.parse("<svg xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' version='1.1' baseProfile='full' width='200' height='200'>"
//     //     + "<circle cx='200' cy='200' r='150' />"
//     //     + "</svg>");

//     // if ($svg.first().dom.tagName == "SVG") {
//     //     $svg = $svg.first();
//     // }




//     // $svg.appendTo();
//     // assert.strictEqual($svg.setAttr("cx", 100).getAttr("cx"), "100", "Set attribute on svg element");
//     // $svg.remove();
// }

// // var bareObj = function (value) { return value; };
// // var functionReturningObj = function (value) { return (function () { return value; }); };

// export function getTextTest() {

//     var expected = "This link has class=\"blog\": Simon Willison's Weblog";
//     assert.strictEqual(document.getElementById("sap")!.textContent!.replace(/[\r\n]/g, "").replace("hasclass", "has class"), expected, "Check for merged text of more then one element.");

//     // Check serialization of text values
//     assert.strictEqual(document.createTextNode("foo")!.textContent!, "foo", "Text node was retreived from !.textContent!.");

//     var val = "<div><b>Hello</b> cruel world!</div>";
//     dom.setText(document.getElementById("foo")!, val);
//     assert.strictEqual(document.getElementById("foo")!.innerHTML.replace(/>/g, "&gt;"), "&lt;div&gt;&lt;b&gt;Hello&lt;/b&gt; cruel world!&lt;/div&gt;", "Check escaped text");

//     (document.getElementById("text1") as HTMLInputElement).value = "bla";
//     assert.strictEqual(document.getElementById("text1")!.textContent!, "bla", "Check for modified value of input element");

//     afterEach();
//     beforeEach();

//     assert.strictEqual(document.getElementById("text1")!.textContent!, "Test", "Check for value of input element");
//     // ticket #1714 this caused a JS error in IE
//     assert.strictEqual(document.getElementById("first")!.textContent!, "Try them out:", "Check a paragraph element to see if it has a value");

//     assert.strictEqual(document.getElementById("select2")!.textContent!, "3", "Call getText() on a single=\"single\" select");

//     //assert.deepEqual( document.getElementById("select3")!.textContent!, "1,2", "Call getText() on a multiple=\"multiple\" select" );

//     assert.strictEqual(document.getElementById("option3c")!.textContent!, "2", "Call getText() on a option element with value");

//     //assert.strictEqual( document.getElementById("option3a")!.textContent!, "Nothing", "Call getText() on a option element with empty value" );

//     assert.strictEqual(document.getElementById("option3e")!.textContent!, "no value", "Call getText() on a option element with no value attribute");

//     //assert.strictEqual( document.getElementById("option3a")!.textContent!, "Nothing", "Call getText() on a option element with no value attribute" );

//     // IE6 fails in this case. Just ignore it.
//     dom.setText(document.getElementById("select3")!, "");
//     assert.deepEqual(document.getElementById("select3")!.textContent!, "", "Call getText() on a multiple=\"multiple\" select");
//     //assert.deepEqual( document.getElementById("select4")!.textContent!, "1,2,3", "Call getText() on multiple=\"multiple\" select with all disabled options" );

//     dom.setAttr(document.getElementById("select4")!, "disabled", "disabled");
//     //assert.deepEqual( document.getElementById("select4")!.textContent!, "1,2,3", "Call getText() on disabled multiple=\"multiple\" select" );

//     assert.strictEqual(document.getElementById("select5")!.textContent!, "3", "Check value on ambiguous select.");

//     dom.setText(document.getElementById("select5")!, "1");
//     assert.strictEqual(document.getElementById("select5")!.textContent!, "1", "Check value on ambiguous select.");

//     dom.setText(document.getElementById("select5")!, "3");
//     assert.strictEqual(document.getElementById("select5")!.textContent!, "3", "Check value on ambiguous select.");

//     // var checks = dom.parse("<input type='checkbox' name='test' value='1'/><input type='checkbox' name='test' value='2'/><input type='checkbox' name='test' value=''/><input type='checkbox' name='test'/>").appendTo("#form");
//     // 
//     // assert.deepEqual( checks!.textContent!, "", "Get unchecked values." );
//     // 
//     // assert.strictEqual( checks.eq(3)!.textContent!, "on", "Make sure a value of 'on' is provided if none is specified." );
//     // 
//     // checks.setText("2");
//     // assert.deepEqual( checks.serialize(), "test=2", "Get a single checked value." );
//     // 
//     // checks.setText(",1");
//     // assert.deepEqual( checks.serialize(), "test=1&test=", "Get multiple checked values." );
//     // 
//     // checks.setText(",2");
//     // assert.deepEqual( checks.serialize(), "test=2&test=", "Get multiple checked values." );
//     // 
//     // checks.setText("1,on");
//     // assert.deepEqual( checks.serialize(), "test=1&test=on", "Get multiple checked values." );

//     //   checks.remove();

//     var button = dom.after(document.getElementById("button")!, "<button value='foobar'>text</button>");
//     assert.strictEqual(button!.textContent!, "text", "Value retrieval on a button does not return innerHTML");
//     assert.strictEqual(button.setText("baz").getHtml(), "baz", "Setting the value does not change innerHTML");

//     //   assert.strictEqual( dom.parse("<option/>").setText("test").getAttr("value"), "test", "Setting value sets the value attribute" );
// }

// // export function cloneTest() {
// //     assert.strictEqual("This is a normal link: Yahoo", document.getElementById("en")!.textContent!, "Assert text for #en");
// //     var clone = document.getElementById("yahoo").clone();
// //     document.getElementById("first").append(clone);
// //     assert.strictEqual("Try them out:Yahoo", document.getElementById("first")!.textContent!, "Check for clone");
// //     assert.strictEqual("This is a normal link: Yahoo", document.getElementById("en")!.textContent!, "Reassert text for #en");

// //     var cloneTags = [
// //         "<table/>", "<tr/>", "<td/>", "<div/>",
// //         "<button/>", "<ul/>", "<ol/>", "<li/>",
// //         "<input type='checkbox' />", "<select/>", "<option/>", "<textarea/>",
// //         "<tbody/>", "<thead/>", "<tfoot/>", "<iframe/>"
// //     ];
// //     for (var i = 0; i < cloneTags.length; i++) {
// //         var j = dom.parse(cloneTags[i]);
// //         assert.strictEqual(j.dom.tagName, j.clone().dom.tagName, "Clone a " + cloneTags[i]);
// //     }

// //     var div = dom.parse("<div><ul><li>test</li></ul></div>").on('click', function () {
// //         assert.ok(true, "Bound event still exists.");
// //     });

// //     clone = div.clone(true);

// //     // manually clean up detached elements
// //     div.remove();

// //     div = clone.clone(true);

// //     // manually clean up detached elements
// //     clone.remove();

// //     assert.strictEqual(div.dom.nodeName.toUpperCase(), "DIV", "DIV element cloned");
// //     div.trigger("click");

// //     // manually clean up detached elements
// //     div.remove();

// //     div = dom.parse("<div/>");
// //     div.append(document.createElement("table"));
// //     div.find("table").on('click', function () {
// //         assert.ok(true, "Bound event still exists.");
// //     });

// //     clone = div.clone(true);
// //     assert.strictEqual(clone.dom.nodeName.toUpperCase(), "DIV", "DIV element cloned");
// //     clone.find("table").trigger("click");

// //     // manually clean up detached elements
// //     div.remove();
// //     clone.remove();

// //     var divEvt = dom.parse("<div><ul><li>test</li></ul></div>").on('click', function () {
// //         assert.ok(false, "Bound event still exists after .clone().");
// //     }),
// //         cloneEvt = divEvt.clone(true, false);

// //     // Make sure that doing .clone() doesn't clone events
// //     cloneEvt.trigger("click");

// //     cloneEvt.remove();
// //     divEvt.remove();

// //     // this is technically an invalid object, but because of the special
// //     // classid instantiation it is the only kind that IE has trouble with,
// //     // so let's test with it too.
// //     div = dom.parse("<div/>").setHtml("<object height='355' width='425' classid='clsid:D27CDB6E-AE6D-11cf-96B8-444553540000'>  <param name='movie' value='http://www.youtube.com/v/3KANI2dpXLw&amp;hl=en'>  <param name='wmode' value='transparent'> </object>");

// //     // !IE9
// //     //clone = div.clone(true);
// //     //assert.strictEqual( clone.getHtml(), div.getHtml(), "Element contents cloned" );
// //     //assert.strictEqual( clone.nodeName.toUpperCase(), "DIV", "DIV element cloned" );

// //     // and here's a valid one.
// //     div = dom.parse("<div/>").setHtml("<object height='355' width='425' type='application/x-shockwave-flash' data='http://www.youtube.com/v/3KANI2dpXLw&amp;hl=en'>  <param name='movie' value='http://www.youtube.com/v/3KANI2dpXLw&amp;hl=en'>  <param name='wmode' value='transparent'> </object>");

// //     clone = div.clone(true);
// //     assert.strictEqual(clone.getHtml(), div.getHtml(), "Element contents cloned");
// //     assert.strictEqual(clone.dom.nodeName.toUpperCase(), "DIV", "DIV element cloned");

// //     // manually clean up detached elements
// //     div.remove();
// //     clone.remove();

// //     var form = document.createElement("form");
// //     form.action = "/test/";
// //     var div = document.createElement("div");
// //     div.appendChild(document.createTextNode("test"));
// //     form.appendChild(div);

// //     assert.strictEqual(document.getElementById(form).clone().children().length, 1, "Make sure we just get the form back.");

// //     //assert.strictEqual( document.find("body").clone().tagName, "BODY", "Make sure cloning body works" );
// // }

// // test("clone(form element) (Bug #3879, #6655)Test() {
// //     var element = dom.parse("<select><option>Foo</option><option selected>Bar</option></select>");

// //     assert.strictEqual(element.clone().find(":selected")!.textContent!, element.find(":selected")!.textContent!, "Selected option cloned correctly");

// //     element = dom.parse("<input type='checkbox' value='foo'>").setAttr("checked", "checked");
// //     clone = element.clone();

// //     assert.strictEqual(clone.dom.defaultValue, "foo", "Checked input defaultValue cloned correctly");

// //     // defaultChecked also gets set now due to setAttribute in attr, is this check still valid?
// //     // assert.strictEqual( clone[0].defaultChecked, !dom.parse.support.noCloneChecked, "Checked input defaultChecked cloned correctly" );

// //     // element = dom.parse("<input type='text' value='foo'>");
// //     // clone = element.clone();
// //     // assert.strictEqual( clone.defaultValue, "foo", "Text input defaultValue cloned correctly" );

// //     // element = dom.parse("<textarea>foo</textarea>");
// //     // clone = element.clone();
// //     // assert.strictEqual( clone.defaultValue, "foo", "Textarea defaultValue cloned correctly" );
// // });

// // test("clone(multiple selected options)Test() {
// //     expect(1);
// //     var element = dom.parse("<select><option>Foo</option><option selected>Bar</option><option selected>Baz</option></select>");

// //     assert.strictEqual(element.clone().query(":selected").length, element.query(":selected").length, "Multiple selected options cloned correctly");

// // });

// export function setHtmlTest() {

//     dom.parse.scriptorder = 0;

//     var div = document.query("#qunit-fixture > div");
//     div.setHtml("<b>test</b>");
//     var pass = true;
//     for (var i = 0; i < div.length; i++) {
//         if (div[i].childNodes.length != 1) pass = false;
//     }
//     assert.ok(pass, "Set HTML");

//     div = dom.parse("<div/>").setHtml("<div id='parent_1'><div id='child_1'/></div><div id='parent_2'/>");

//     assert.strictEqual(div.children().length, 2, "Make sure two child nodes exist.");
//     assert.strictEqual(div.children().children().length, 1, "Make sure that a grandchild exists.");

//     var space = dom.parse("<div/>").setHtml("&#160;").dom.innerHTML;
//     assert.ok(/^\xA0$|^&nbsp;$/.test(space), "Make sure entities are passed through correctly.");
//     assert.strictEqual(dom.parse("<div/>").setHtml("&amp;").dom.innerHTML, "&amp;", "Make sure entities are passed through correctly.");

//     document.getElementById("qunit-fixture").setHtml("<style>.foobar{color:green;}</style>");

//     assert.strictEqual(document.getElementById("qunit-fixture").children().length, 1, "Make sure there is a child element.");
//     assert.strictEqual(document.getElementById("qunit-fixture").children()[0].nodeName.toUpperCase(), "STYLE", "And that a style element was inserted.");

//     //afterEach();beforeEach();
//     //document.getElementById("qunit-fixture").setHtml( "<select/>" );
//     //document.find("#qunit-fixture select").setHtml( "<option>O1</option><option selected='selected'>O2</option><option>O3</option>" );
//     //assert.strictEqual( document.find("#qunit-fixture select")!.textContent!, "O2", "Selected option correct" );

//     var div = dom.parse("<div />");
//     assert.strictEqual(div.setHtml(5).getHtml(), "5", "Setting a number as html");
//     assert.strictEqual(div.setHtml(0).getHtml(), "0", "Setting a zero as html");

//     var div2 = dom.parse("<div/>"), insert = "&lt;div&gt;hello1&lt;/div&gt;";
//     assert.strictEqual(div2.setHtml(insert).getHtml().replace(/>/g, "&gt;"), insert, "Verify escaped insertion.");
//     assert.strictEqual(div2.setHtml("x" + insert).getHtml().replace(/>/g, "&gt;"), "x" + insert, "Verify escaped insertion.");
//     // assert.strictEqual( div2.setHtml(" " + insert).getHtml().replace(/>/g, "&gt;"), " " + insert, "Verify escaped insertion." );

//     var map = dom.parse("<map/>").setHtml("<area id='map01' shape='rect' coords='50,50,150,150' href='http://www.jquery.com/' alt='dom.parse'>");

//     assert.strictEqual(map.dom.childNodes.length, 1, "The area was inserted.");
//     assert.strictEqual(map.dom.firstChild.nodeName.toLowerCase(), "area", "The area was inserted.");

//     afterEach(); beforeEach();

//     document.getElementById("qunit-fixture").setHtml("<script type='something/else'>assert.ok( false, 'Non-script evaluated.' );</script><script type='text/javascript'>assert.ok( true, 'text/javascript is evaluated.' );</script><script>assert.ok( true, 'No type is evaluated.' );</script><div><script type='text/javascript'>assert.ok( true, 'Inner text/javascript is evaluated.' );</script><script>assert.ok( true, 'Inner No type is evaluated.' );</script><script type='something/else'>assert.ok( false, 'Non-script evaluated.' );</script></div>");

//     var child = document.getElementById("qunit-fixture").query("script");

//     assert.strictEqual(child.length, 6, "Make sure that two non-JavaScript script tags are left.");
//     assert.strictEqual(child.item(0).dom.type, "something/else", "Verify type of script tag.");
//     assert.strictEqual(child.item(-1).dom.type, "something/else", "Verify type of script tag.");

//     document.getElementById("qunit-fixture").setHtml("<script>assert.ok( true, 'Test repeated injection of script.' );</script>");
//     document.getElementById("qunit-fixture").setHtml("<script>assert.ok( true, 'Test repeated injection of script.' );</script>");
//     document.getElementById("qunit-fixture").setHtml("<script>assert.ok( true, 'Test repeated injection of script.' );</script>");

//     document.getElementById("qunit-fixture").setHtml("<script type='text/javascript'>assert.ok( true, 'dom.parse().getHtml().evalScripts() Evals Scripts Twice in Firefox, see #975 (1)' );</script>");

//     document.getElementById("qunit-fixture").setHtml("foo <form><script type='text/javascript'>assert.ok( true, 'dom.parse().getHtml().evalScripts() Evals Scripts Twice in Firefox, see #975 (2)' );</script></form>");

//     document.getElementById("qunit-fixture").setHtml("<script>assert.strictEqual(dom.parse.scriptorder++, 0, 'Script is executed in order');assert.strictEqual(dom.query('#scriptorder').length, 1,'Execute after html (even though appears before)')<\/script><span id='scriptorder'><script>assert.strictEqual(dom.parse.scriptorder++, 1, 'Script (nested) is executed in order');assert.strictEqual(dom.query('#scriptorder').length, 1,'Execute after html')<\/script></span><script>assert.strictEqual(dom.parse.scriptorder++, 2, 'Script (unnested) is executed in order');assert.strictEqual(dom.query('#scriptorder').length, 1,'Execute after html')<\/script>");
// }

// //export function emptyTest() {
// //     assert.strictEqual(document.getElementById("ap").children().empty()!.textContent!.length, 0, "Check text is removed");
// //     assert.strictEqual(document.getElementById("ap").children().length, 4, "Check elements are not removed");

// // });

// // test("clone - no exceptions for object elements #9587Test() {
// //     expect(1);

// //     try {
// //         document.getElementById("no-clone-exception").clone();
// //         assert.ok(true, "cloned with no exceptions");
// //     } catch (e) {
// //         assert.ok(false, e.message);
// //     }
// // });
// // module("Attributes");

// // var bareObj = function (value) { return value; };
// // var functionReturningObj = function (value) { return (function () { return value; }); };

// //export function getAttr('tabindex')Test() {
// //     expect(8);

// //     // elements not natively tabbable
// //     assert.strictEqual(document.getElementById("listWithTabIndex").getAttr("tabindex"), "5", "not natively tabbable, with tabindex set to 0");
// //     assert.strictEqual(document.getElementById("divWithNoTabIndex").getAttr("tabindex", 1), undefined, "not natively tabbable, no tabindex set");

// //     // anchor with href
// //     assert.strictEqual(document.getElementById("linkWithNoTabIndex").getAttr("tabindex", 1), undefined, "anchor with href, no tabindex set");
// //     assert.strictEqual(document.getElementById("linkWithTabIndex").getAttr("tabindex", 1), "2", "anchor with href, tabindex set to 2");
// //     assert.strictEqual(document.getElementById("linkWithNegativeTabIndex").getAttr("tabindex", 1), "-1", "anchor with href, tabindex set to -1");

// //     // anchor without href
// //     assert.strictEqual(document.getElementById("linkWithNoHrefWithNoTabIndex").getAttr("tabindex", 1), undefined, "anchor without href, no tabindex set");
// //     assert.strictEqual(document.getElementById("linkWithNoHrefWithTabIndex").getAttr("tabindex", 1), "1", "anchor without href, tabindex set to 2");
// //     assert.strictEqual(document.getElementById("linkWithNoHrefWithNegativeTabIndex").getAttr("tabindex", 1), "-1", "anchor without href, no tabindex set");
// // });

// //export function setAttr('tabindex', value)Test() {
// //     expect(9);

// //     var element = document.getElementById("divWithNoTabIndex");
// //     assert.strictEqual(element.getAttr("tabindex", 1), undefined, "start with no tabindex");

// //     // set a positive string
// //     element.setAttr("tabindex", "1");
// //     assert.strictEqual(element.getAttr("tabindex"), "1", "set tabindex to 1 (string)");

// //     // set a zero string
// //     element.setAttr("tabindex", "0");
// //     assert.strictEqual(element.getAttr("tabindex"), "0", "set tabindex to 0 (string)");

// //     // set a negative string
// //     element.setAttr("tabindex", "-1");
// //     assert.strictEqual(element.getAttr("tabindex"), "-1", "set tabindex to -1 (string)");

// //     // set a positive number
// //     element.setAttr("tabindex", 1);
// //     assert.strictEqual(element.getAttr("tabindex"), "1", "set tabindex to 1 (number)");

// //     // set a zero number
// //     element.setAttr("tabindex", 0);
// //     assert.strictEqual(element.getAttr("tabindex"), "0", "set tabindex to 0 (number)");

// //     // set a negative number
// //     element.setAttr("tabindex", -1);
// //     assert.strictEqual(element.getAttr("tabindex"), "-1", "set tabindex to -1 (number)");

// //     element = document.getElementById("linkWithTabIndex");
// //     assert.strictEqual(element.getAttr("tabindex"), "2", "start with tabindex 2");

// //     element.setAttr("tabindex", -1);
// //     assert.strictEqual(element.getAttr("tabindex"), "-1", "set negative tabindex");
// // });

// //export function setAttr(String, null)Test() {
// //     expect(12);
// //     var $first;

// //     assert.strictEqual(document.getElementById("mark").setAttr("class", null).getAttr("class"), undefined, "remove class");
// //     assert.strictEqual(document.getElementById("form").setAttr("id", null).getAttr("id"), undefined, "Remove id");
// //     assert.strictEqual(document.getElementById("foo").setAttr("style", "position:absolute;").setAttr("style", null).getAttr("style"), undefined, "Check removing style attribute");
// //     assert.strictEqual(document.getElementById("form").setAttr("style", "position:absolute;").setAttr("style", null).getAttr("style"), undefined, "Check removing style attribute on a form");
// //     assert.strictEqual(dom.parse("<div style='position: absolute'></div>").appendTo("foo").setAttr("style", null).node.style.cssText, "", "Check removing style attribute (#9699 Webkit)");
// //     assert.strictEqual(dom.find("#fx-test-group").setAttr("height", "3px").setAttr("height", null).dom.style.height, "1px", "Removing height attribute has no effect on height set with style attribute");

// //     document.getElementById("check1").setAttr("checked", null).setAttr("checked", true).setAttr("checked", null);
// //     assert.strictEqual(document.getElementById("check1").checked, false, "removeAttr sets boolean properties to false");
// //     document.getElementById("text1").setAttr("readOnly", true).setAttr("readonly", null);
// //     assert.strictEqual(document.getElementById("text1").readOnly, false, "removeAttr sets boolean properties to false");

// //     document.getElementById("option2c").setAttr("selected", null);
// //     assert.strictEqual(document.getElementById("option2d").getAttr("selected", 1), "selected", "Removing `selected` from an option that is not selected does not remove selected from the currently selected option (#10870)");

// //     try {
// //         $first = document.getElementById("first").setAttr("contenteditable", "true").setAttr("contenteditable", null);
// //         assert.strictEqual($first.getAttr('contenteditable'), undefined, "Remove the contenteditable attribute");
// //     } catch (e) {
// //         assert.ok(false, "Removing contenteditable threw an error (#10429)");
// //     }

// //     $first = dom.parse("<div Case='mixed'></div>");
// //     assert.strictEqual($first.getAttr("Case"), "mixed", "case of attribute doesn't matter");
// //     $first.setAttr("Case", null);
// //     // IE 6/7 return empty string here, not undefined
// //     assert.ok(!$first.getAttr("Case"), "mixed-case attribute was removed");
// // });

// // if ("value" in document.createElement("meter") &&
// //     "value" in document.createElement("progress")) {

// //     test("getText() respects numbers without exception (Bug #9319)Test() {

// //         var $meter = dom.parse("<meter min='0' max='10' value='5.6'></meter>"),
// //             $progress = dom.parse("<progress max='10' value='1.5'></progress>");

// //         //try {
// //         assert.strictEqual(typeof $meter!.textContent!, "string", "meter, returns a number and does not throw exception");
// //         // assert.strictEqual( $meter!.textContent!, $meter.value, "meter, api matches host and does not throw exception" );

// //         assert.strictEqual(typeof $progress!.textContent!, "string", "progress, returns a number and does not throw exception");
// //         //  assert.strictEqual( $progress!.textContent!, $progress.value, "progress, api matches host and does not throw exception" );

// //         //} catch(e) {}

// //         $meter.remove();
// //         $progress.remove();
// //     });
// // }

// // // testing if a form.reset() breaks a subsequent call to a select element's !.textContent! (in IE only)
// // test("setText(select) after form.reset()Test() {

// //     dom.parse("<form id='kk' name='kk'><select id='kkk'><option value='cf'>cf</option><option 	value='gf'>gf</option></select></form>").appendTo("qunit-fixture");

// //     document.getElementById("kkk").setText("gf");

// //     document.kk.reset();

// //     assert.strictEqual(document.getElementById("kkk").dom.value, "cf", "Check value of select after form reset.");
// //     assert.strictEqual(document.getElementById("kkk")!.textContent!, "cf", "Check value of select after form reset.");

// //     // re-verify the multi-select is not broken (after form.reset) by our fix for single-select
// //     //assert.deepEqual( document.getElementById("select3")!.textContent!.split(','), ["1", "2"], "Call getText() on a multiple=\"multiple\" select" );

// //     document.getElementById("kk").remove();
// // });

// export function addClassTest() {

//     var div = document.query("div");
//     div.addClass("test");
//     var pass = true;
//     for (var i = 0; i < div.length; i++) {
//         if (!~div[i].className.indexOf("test")) {
//             pass = false;
//         }
//     }
//     assert.ok(pass, "Add Class");

//     div = dom.parse("<div/>");

//     div.addClass("test");
//     assert.strictEqual(div.getAttr("class"), "test", "Make sure there's no extra whitespace.");

//     // div.setAttr("class", " foo");
//     // div.addClass( "test" );
//     // assert.strictEqual( div.getAttr("class"), "foo test", "Make sure there's no extra whitespace." );

//     div.setAttr("class", "foo");
//     div.addClass("bar baz");
//     assert.strictEqual(div.getAttr("class"), "foo bar baz", "Make sure there isn't too much trimming.");

//     div.removeClass();
//     div.addClass("foo").addClass("foo")
//     assert.strictEqual(div.getAttr("class"), "foo", "Do not add the same class twice in separate calls.");

//     div.addClass("fo");
//     assert.strictEqual(div.getAttr("class"), "foo fo", "Adding a similar class does not get interrupted.");
//     div.removeClass().addClass("wrap2");
//     assert.ok(div.addClass("wrap").hasClass("wrap"), "Can add similarly named classes");

//     div.removeClass();
//     div.addClass("bar bar");
//     assert.strictEqual(div.getAttr("class"), "bar", "Do not add the same class twice in the same call.");

// });

// export function removeClassTest() {

//     var $divs = document.query("div");

//     $divs.addClass("test").removeClass("test");

//     assert.ok(!$divs.item(0).hasClass("test"), "Remove Class");

//     afterEach(); beforeEach();
//     $divs = document.query("div");

//     $divs.addClass("test").addClass("foo").addClass("bar");
//     $divs.removeClass("test").removeClass("bar").removeClass("foo");

//     assert.ok(!$divs.item(0).hasClass("bar"), "Remove multiple classes");

//     afterEach(); beforeEach();
//     $divs = document.query("div");

//     // Make sure that a null value doesn't cause problems
//     // $divs[0].addClass("test").removeClass( null );
//     // assert.ok( $divs[0].hasClass("test"), "Null value passed to removeClass" );

//     //$divs[0].addClass("test").removeClass( "" );
//     //assert.ok( $divs[0].hasClass("test"), "Empty string passed to removeClass" );

//     var div = document.createElement("div");
//     div.className = " test foo ";

//     document.getElementById(div).removeClass("foo");
//     assert.strictEqual(div.className, "test", "Make sure remaining className is trimmed.");

//     div.className = " test ";

//     document.getElementById(div).removeClass("test");
//     assert.strictEqual(div.className, "", "Make sure there is nothing left after everything is removed.");
// }

// export function toggleClassTest() {

//     var e = document.getElementById("firstp")!;
//     assert.ok(!dom.hasClass(e, "test"), "Assert class not present");
//     dom.toggleClass(e, "test");
//     assert.ok(dom.hasClass(e, "test"), "Assert class present");
//     dom.toggleClass(e, "test");
//     assert.ok(!dom.hasClass(e, "test"), "Assert class not present");

//     // class name with a boolean
//     dom.toggleClass(e, "test", false);
//     assert.ok(!dom.hasClass(e, "test"), "Assert class not present");
//     dom.toggleClass(e, "test", true);
//     assert.ok(dom.hasClass(e, "test"), "Assert class present");
//     dom.toggleClass(e, "test", false);
//     assert.ok(!dom.hasClass(e, "test"), "Assert class not present");

//     // // multiple class names
//     // dom.addClass(e, "testA testB");
//     // assert.ok((dom.hasClass(e, "testA")), "Assert 2 different classes present");
//     // // e.toggleClass( "testB testC" );
//     // // assert.ok( (e.hasClass("testA") && !e.is(".testB")), "Assert 1 class added, 1 class removed, and 1 class kept" );
//     // // e.toggleClass( "testA testC" );
//     // // assert.ok( (!e.hasClass("testA") && !e.hasClass("testB") && !e.hasClass("testC")), "Assert no class present" );

//     // // toggleClass storage
//     // // e.toggleClass(true);
//     // // assert.ok( e.dom.className === "", "Assert class is empty (data was empty)" );
//     // dom.addClass(e, "testD testE");
//     // assert.ok(dom.hasClass(e, "testD") && dom.hasClass(e, "testE"), "Assert class present");
//     //e.toggleClass(e.dom.className);
//     //assert.ok( !e.hasClass("testD") || !e.hasClass("testE"), "Assert class not present" );
//     //e.toggleClass(e.dom.className);
//     //assert.ok( e.hasClass("testD") && e.hasClass("testE"), "Assert class present (restored from data)" );
//     //e.toggleClass(e.dom.className, false);
//     //assert.ok( !e.hasClass("testD") || !e.hasClass("testE"), "Assert class not present" );
//     //e.toggleClass(e.dom.className, true);
//     //assert.ok( e.hasClass("testD") && e.hasClass("testE"), "Assert class present (restored from data)" );
//     //e.toggleClass(e.dom.className);
//     //e.toggleClass(e.dom.className, false);
//     //e.toggleClass(e.dom.className);
//     //assert.ok( e.hasClass("testD") && e.hasClass("testE"), "Assert class present (restored from data)" );

//     // Cleanup
//     dom.removeClass(e, "testD");
// }

// // test("addClass, removeClass, hasClassTest() {

// //     var x = dom.parse("<p>Hi</p>");

// //     x.addClass("hi");
// //     assert.strictEqual(x.dom.className, "hi", "Check single added class");

// //     x.addClass("foo bar");
// //     assert.strictEqual(x.dom.className, "hi foo bar", "Check more added classes");

// //     x.removeClass();
// //     assert.strictEqual(x.dom.className, "", "Remove all classes");

// //     x.addClass("hi foo bar");
// //     x.removeClass("foo");
// //     assert.strictEqual(x.dom.className, "hi bar", "Check removal of one class");

// //     assert.ok(x.hasClass("hi"), "Check has1");
// //     assert.ok(x.hasClass("bar"), "Check has2");

// //     // var x = dom.parse("<p class='class1\nclass2\tcla.ss3\n\rclass4'></p>");
// //     // assert.ok( x.hasClass("class1"), "Check hasClass with line feed" );
// //     // assert.ok( x.hasClass("class2"), "Check hasClass with tab" );
// //     // assert.ok( x.hasClass("cla"), "Check hasClass with dot" );
// //     // assert.ok( x.hasClass("class4"), "Check hasClass with carriage return" );

// //     x.removeClass("class2");
// //     assert.ok(x.hasClass("class2") == false, "Check the class has been properly removed");
// //     x.removeClass("cla");
// //     assert.ok(!x.hasClass("cla"), "Check the dotted class has not been removed");
// //     x.removeClass("cla");
// //     assert.ok(x.hasClass("cla") == false, "Check the dotted class has been removed");
// //     x.removeClass("class4");
// //     assert.ok(x.hasClass("class4") == false, "Check the class has been properly removed");
// // });


// // module("Dimensions");

// //export function getWidthTest() {
// //     expect(6);

// //     var $div = document.getElementById("nothiddendiv");
// //     $div.setWidth(30);
// //     assert.strictEqual($div.getWidth(), 30, "Test set to 30 correctly");
// //     $div.hide();
// //     assert.strictEqual($div.getWidth(), 30, "Test hidden div");
// //     $div.show();
// //     $div.setWidth(-1); // handle negative numbers by ignoring #1599
// //     assert.strictEqual($div.getWidth(), 0, "负值 转为 0");
// //     $div.setWidth(30);
// //     $div.setStyle("padding", "20px");
// //     assert.strictEqual($div.getWidth(), 30, "Test padding specified with pixels");
// //     $div.setStyle("border", "2px solid #fff");
// //     assert.strictEqual($div.getWidth(), 30, "Test border specified with pixels");

// //     Object.extend($div.dom.style, { display: "", border: "", padding: "" });

// //     Object.extend(document.getElementById("nothiddendivchild").dom.style, { width: '20px', padding: "3px", border: "2px solid #fff" });
// //     assert.strictEqual(document.getElementById("nothiddendivchild").getWidth(), 20, "Test child width with border and padding");
// //     Object.extend(document.getElementById("nothiddendiv").dom.style, { border: "", padding: "", width: "" });
// //     Object.extend(document.getElementById("nothiddendivchild").dom.style, { border: "", padding: "", width: "" });

// //     $div.dom.style.$display = null;
// // });

// //export function getHeightTest() {
// //     expect(6);

// //     var $div = document.getElementById("nothiddendiv");
// //     $div.setHeight(30);
// //     assert.strictEqual($div.getHeight(), 30, "Test set to 30 correctly");
// //     $div.hide();
// //     assert.strictEqual($div.getHeight(), 30, "Test hidden div");
// //     $div.show();
// //     $div.setHeight(-1); // handle negative numbers by ignoring #1599
// //     assert.strictEqual($div.getHeight(), 0, "负值 转为 0");

// //     $div.setHeight(30);
// //     $div.setStyle("padding", "20px");
// //     assert.strictEqual($div.getHeight(), 30, "Test padding specified with pixels");
// //     $div.setStyle("border", "2px solid #fff");
// //     assert.strictEqual($div.getHeight(), 30, "Test border specified with pixels");

// //     Object.extend($div.dom.style, { display: "", border: "", padding: "", height: "1px" });

// //     Object.extend(document.getElementById("nothiddendivchild").dom.style, { height: '20px', padding: "3px", border: "2px solid #fff" });
// //     assert.strictEqual(document.getElementById("nothiddendivchild").getHeight(), 20, "Test child height with border and padding");
// //     Object.extend(document.getElementById("nothiddendiv").dom.style, { border: "", padding: "", height: "" });
// //     Object.extend(document.getElementById("nothiddendivchild").dom.style, { border: "", padding: "", height: "" });

// //     $div.dom.style.$display = null;
// // });

// // test("child of a hidden elem has accurate getWidth()/getHeight()  see #9441 #9300Test() {

// //     // setup html
// //     var $divNormal = dom.parse("<div>").set({ width: "100px", height: "100px", border: "10px solid white", padding: "2px", margin: "3px" }),
// //         $divChild = $divNormal.clone(),
// //         $divHiddenParent = dom.parse("<div>").set("display", "none").append($divChild).appendTo();
// //     $divNormal.appendTo();

// //     // tests that child div of a hidden div works the same as a normal div
// //     assert.strictEqual($divChild.getWidth(), $divNormal.getWidth(), "child of a hidden element getWidth() is wrong see #9441");

// //     assert.strictEqual($divChild.getHeight(), $divNormal.getHeight(), "child of a hidden element getHeight() is wrong see #9441");

// //     // teardown html
// //     $divHiddenParent.remove();
// //     $divNormal.remove();
// // });

// //export function getSizeTest() {

// //     assert.strictEqual(document.getSize().y > 0, true, "Test on document without margin option");

// //     var $div = document.getElementById("nothiddendiv");
// //     $div.set("height", 30);

// //     assert.strictEqual($div.getSize().y, 30, "Test with only width set");
// //     $div.set("padding", "20px");
// //     assert.strictEqual($div.getSize().y, 70, "Test with padding");
// //     $div.set("border", "2px solid #fff");
// //     assert.strictEqual($div.getSize().y, 74, "Test with padding and border");
// //     $div.set("margin", "10px");
// //     assert.strictEqual($div.getSize().y, 74, "Test with padding, border and margin without margin option");
// //     $div.hide();
// //     assert.strictEqual($div.getSize().y, 0, "Test hidden div with padding, border and margin with margin option");

// //     // reset styles
// //     $div.set({ display: "", border: "", padding: "", width: "", height: "" });

// //     var div = dom.parse("<div>");

// //     // Temporarily require 0 for backwards compat - should be auto
// //     assert.strictEqual(div.getSize().y, 0, "Make sure that disconnected nodes are handled.");

// //     div.remove();
// // });
// // module("Offset");

// // test("disconnected nodeTest() {
// //     expect(2);

// //     var result = dom.create("div").getOffset();

// //     assert.strictEqual(result.x, 0, "Check top");
// //     assert.strictEqual(result.y, 0, "Check left");
// // });

// // var supportsScroll = false;

// // testoffset("absolute", function (iframe) {
// //     expect(4);

// //     var document = iframe.document, tests;

// //     // force a scroll value on the main window
// //     // this insures that the results will be wrong
// //     // if the offset method is using the scroll offset
// //     // of the parent window
// //     var forceScroll = dom.parse("<div style='width: 2000px, height: 2000px'>", iframe).appendTo();
// //     iframe.scrollTo(200, 200);

// //     if (document.documentElement.scrollTop || document.body.scrollTop) {
// //         supportsScroll = true;
// //     }

// //     iframe.scrollTo(1, 1);


// //     assert.strictEqual(getDom(document, "absolute-1").getPosition().x, 1, "getDom(document, 'absolute-1').getPosition().x");
// //     assert.strictEqual(getDom(document, "absolute-1").getPosition().y, 1, "getDom(document, 'absolute-1').getPosition().y");


// //     assert.strictEqual(getDom(document, "absolute-1").getOffset().x, 0, "getDom(document, 'absolute-1').getOffset().x");
// //     assert.strictEqual(getDom(document, "absolute-1").getOffset().y, 0, "getDom(document, 'absolute-1').getOffset().y");

// //     forceScroll.remove();
// // });

// // testoffset("absolute", function (iframe) {

// //     var document = iframe.document;

// //     // get offset tests
// //     var tests = [
// //         { id: "absolute-1", x: 1, y: 1 },
// //         { id: "absolute-1-1", x: 5, y: 5 },
// //         { id: "absolute-1-1-1", x: 9, y: 9 },
// //         { id: "absolute-2", x: 20, y: 20 }
// //     ];
// //     Object.each(tests, function (test) {
// //         assert.strictEqual(getDom(document, test.id).getPosition().x, test.x, "getDom(document, '" + test.id + "').getPosition().x");
// //         assert.strictEqual(getDom(document, test.id).getPosition().x, test.y, "getDom(document, '" + test.id + "').getPosition().y");
// //     });


// //     // get position
// //     tests = [
// //         { id: "absolute-1", y: 0, x: 0 },
// //         { id: "absolute-1-1", y: 1, x: 1 },
// //         { id: "absolute-1-1-1", y: 1, x: 1 },
// //         { id: "absolute-2", y: 19, x: 19 }
// //     ];
// //     Object.each(tests, function (test) {
// //         assert.strictEqual(getDom(document, test.id).getOffset().y, test.y, "getDom(document, '" + test.id + "').getOffset().y");
// //         assert.strictEqual(getDom(document, test.id).getOffset().x, test.x, "getDom(document, '" + test.id + "').getOffset().x");
// //     });

// //     // test #5781
// //     var offset = getDom(document, "positionTest").setOffset({ y: 10, x: 10 }).getPosition();
// //     assert.strictEqual(offset.y, 10, "Setting offset on element with position absolute but 'auto' values.")
// //     assert.strictEqual(offset.x, 10, "Setting offset on element with position absolute but 'auto' values.")


// //     // set offset
// //     tests = [
// //         { id: "absolute-2", y: 30, x: 30 },
// //         { id: "absolute-2", y: 10, x: 10 },
// //         { id: "absolute-2", y: -1, x: -1 },
// //         { id: "absolute-2", y: 19, x: 19 },
// //         { id: "absolute-1-1-1", y: 15, x: 15 },
// //         { id: "absolute-1-1-1", y: 5, x: 5 },
// //         { id: "absolute-1-1-1", y: -1, x: -1 },
// //         { id: "absolute-1-1-1", y: 9, x: 9 },
// //         { id: "absolute-1-1", y: 10, x: 10 },
// //         { id: "absolute-1-1", y: 0, x: 0 },
// //         { id: "absolute-1-1", y: -1, x: -1 },
// //         { id: "absolute-1-1", y: 5, x: 5 },
// //         { id: "absolute-1", y: 2, x: 2 },
// //         { id: "absolute-1", y: 0, x: 0 },
// //         { id: "absolute-1", y: -1, x: -1 },
// //         { id: "absolute-1", y: 1, x: 1 }
// //     ];
// //     Object.each(tests, function (test) {
// //         getDom(document, test.id).setPosition({ y: test.y, x: test.x });
// //         assert.strictEqual(getDom(document, test.id).getPosition().y, test.y, "getDom(document, '" + test.id + "').setOffset({ y: " + test.y + " })");
// //         assert.strictEqual(getDom(document, test.id).getPosition().x, test.x, "getDom(document, '" + test.id + "').setOffset({ x: " + test.x + " })");

// //         getDom(document, test.id).setPosition({ x: test.x + 2, y: test.y + 2 })
// //         assert.strictEqual(getDom(document, test.id).getPosition().y, test.y + 2, "Setting one property at a time.");
// //         assert.strictEqual(getDom(document, test.id).getPosition().x, test.x + 2, "Setting one property at a time.");


// //     });


// //     var offsets = getDom(document, 'positionTest').getOffset();
// //     getDom(document, 'positionTest').setOffset(offsets);
// //     assert.strictEqual(getDom(document, 'positionTest').getOffset().y, offsets.y, "getDom(document, 'positionTest').setOffset().getOffset()");
// //     assert.strictEqual(getDom(document, 'positionTest').getOffset().x, offsets.x, "getDom(document, 'positionTest').setOffset().getOffset()");

// //     var position = getDom(document, 'positionTest').getPosition();
// //     getDom(document, 'positionTest').setPosition(position);
// //     assert.strictEqual(getDom(document, 'positionTest').getPosition().y, position.y, "getDom(document, 'positionTest').setPosition().getPosition()");
// //     assert.strictEqual(getDom(document, 'positionTest').getPosition().x, position.x, "getDom(document, 'positionTest').setPosition().getPosition()");
// // });

// // testoffset("relative", function (iframe) {

// //     var document = iframe.document;

// //     // IE is collapsing the top margin of 1px
// //     var ie = navigator.isQuirks;

// //     // get offset
// //     var tests = [
// //         { id: "relative-1", y: ie ? 6 : 7, x: 7 },
// //         { id: "relative-1-1", y: ie ? 13 : 15, x: 15 },
// //         { id: "relative-2", y: ie ? 141 : 142, x: 27 }
// //     ];
// //     Object.each(tests, function (test) {
// //         assert.strictEqual(getDom(document, test.id).getPosition().y, test.y, "getDom(document, '" + test.id + "').getPosition().y");
// //         assert.strictEqual(getDom(document, test.id).getPosition().x, test.x, "getDom(document, '" + test.id + "').getPosition().x");
// //     });


// //     // get position
// //     tests = [
// //         //{ id: "relative-1",   y: ie ?   5 :   6, x:  6 },
// //         //{ id: "relative-1-1", y: ie ?   4 :   5, x:  5 },
// //         //{ id: "relative-2",   y: ie ? 140 : 141, x: 26 }
// //         { id: "relative-1", y: 0, x: 0 },
// //         { id: "relative-1-1", y: 0, x: 0 },
// //         { id: "relative-2", y: 20, x: 20 }
// //     ];
// //     Object.each(tests, function (test) {
// //         assert.strictEqual(getDom(document, test.id).getOffset().y, test.y, "getDom(document, '" + test.id + "').getOffset().y");
// //         assert.strictEqual(getDom(document, test.id).getOffset().x, test.x, "getDom(document, '" + test.id + "').getOffset().x");
// //     });


// //     // set offset
// //     tests = [
// //         { id: "relative-2", y: 200, x: 50 },
// //         { id: "relative-2", y: 100, x: 10 },
// //         { id: "relative-2", y: -5, x: -5 },
// //         { id: "relative-2", y: 142, x: 27 },
// //         { id: "relative-1-1", y: 100, x: 100 },
// //         { id: "relative-1-1", y: 5, x: 5 },
// //         { id: "relative-1-1", y: -1, x: -1 },
// //         { id: "relative-1-1", y: 15, x: 15 },
// //         { id: "relative-1", y: 100, x: 100 },
// //         { id: "relative-1", y: 0, x: 0 },
// //         { id: "relative-1", y: -1, x: -1 },
// //         { id: "relative-1", y: 7, x: 7 }
// //     ];
// //     Object.each(tests, function (test) {
// //         getDom(document, test.id).setOffset({ y: test.y, x: test.x });
// //         assert.strictEqual(getDom(document, test.id).getOffset().y, test.y, "getDom(document, '" + test.id + "').setOffset({ y: " + test.y + " })");
// //         assert.strictEqual(getDom(document, test.id).getOffset().x, test.x, "getDom(document, '" + test.id + "').setOffset({ x: " + test.x + " })");
// //     });


// //     var offsets = getDom(document, 'positionTest').getOffset();
// //     getDom(document, 'positionTest').setOffset(offsets);
// //     assert.strictEqual(getDom(document, 'positionTest').getOffset().y, offsets.y, "getDom(document, 'positionTest').setOffset().getOffset()");
// //     assert.strictEqual(getDom(document, 'positionTest').getOffset().x, offsets.x, "getDom(document, 'positionTest').setOffset().getOffset()");

// //     var position = getDom(document, 'positionTest').getPosition();
// //     getDom(document, 'positionTest').setPosition(position);
// //     assert.strictEqual(getDom(document, 'positionTest').getPosition().y, position.y, "getDom(document, 'positionTest').setPosition().getPosition()");
// //     assert.strictEqual(getDom(document, 'positionTest').getPosition().x, position.x, "getDom(document, 'positionTest').setPosition().getPosition()");
// // });

// // testoffset("static", function (iframe) {

// //     var document = iframe.document;

// //     // IE is collapsing the top margin of 1px
// //     var ie = navigator.isQuirks;

// //     // get offset
// //     var tests = [
// //         { id: "static-1", y: ie ? 6 : 7, x: 7 },
// //         { id: "static-1-1", y: ie ? 13 : 15, x: 15 },
// //         { id: "static-1-1-1", y: ie ? 20 : 23, x: 23 },
// //         { id: "static-2", y: ie ? 121 : 122, x: 7 }
// //     ];
// //     Object.each(tests, function (test) {
// //         assert.strictEqual(getDom(document, test.id).getPosition().y, test.y, "getDom(document, '" + test.id + "').getPosition().y");
// //         assert.strictEqual(getDom(document, test.id).getPosition().x, test.x, "getDom(document, '" + test.id + "').getPosition().x");
// //     });


// //     // get position
// //     tests = [
// //         //{ id: "static-1",     y: ie ?   5 :   6, x:  6 },
// //         //{ id: "static-1-1",   y: ie ?  12 :  14, x: 14 },
// //         //{ id: "static-1-1-1", y: ie ?  19 :  22, x: 22 },
// //         //{ id: "static-2",     y: ie ? 120 : 121, x:  6 }
// //         { id: "static-1", y: 0, x: 0 },
// //         { id: "static-1-1", y: 0, x: 0 },
// //         { id: "static-1-1-1", y: 0, x: 0 },
// //         { id: "static-2", y: 20, x: 20 }
// //     ];

// //     // !Opera

// //     //Object.each( tests, function(test) {
// //     //	assert.strictEqual( getDom(document,  test.id ).getOffset().y,  test.y,  "getDom(document, '" + test.id  + "').getOffset().y" );
// //     //	assert.strictEqual( getDom(document,  test.id ).getOffset().x, test.x, "getDom(document, '" + test.id +"').getOffset().x" );
// //     //});


// //     // set offset
// //     tests = [
// //         { id: "static-2", y: 200, x: 200 },
// //         { id: "static-2", y: 100, x: 100 },
// //         { id: "static-2", y: -2, x: -2 },
// //         { id: "static-2", y: 121, x: 6 },
// //         { id: "static-1-1-1", y: 50, x: 50 },
// //         { id: "static-1-1-1", y: 10, x: 10 },
// //         { id: "static-1-1-1", y: -1, x: -1 },
// //         { id: "static-1-1-1", y: 22, x: 22 },
// //         { id: "static-1-1", y: 25, x: 25 },
// //         { id: "static-1-1", y: 10, x: 10 },
// //         { id: "static-1-1", y: -3, x: -3 },
// //         { id: "static-1-1", y: 14, x: 14 },
// //         { id: "static-1", y: 30, x: 30 },
// //         { id: "static-1", y: 2, x: 2 },
// //         { id: "static-1", y: -2, x: -2 },
// //         { id: "static-1", y: 7, x: 7 }
// //     ];
// //     Object.each(tests, function (test) {
// //         getDom(document, test.id).setOffset({ y: test.y, x: test.x });
// //         assert.strictEqual(getDom(document, test.id).getOffset().y, test.y, "getDom(document, '" + test.id + "').setOffset({ y: " + test.y + " })");
// //         assert.strictEqual(getDom(document, test.id).getOffset().x, test.x, "getDom(document, '" + test.id + "').setOffset({ x: " + test.x + " })");
// //     });


// //     var offsets = getDom(document, 'positionTest').getOffset();
// //     getDom(document, 'positionTest').setOffset(offsets);
// //     assert.strictEqual(getDom(document, 'positionTest').getOffset().y, offsets.y, "getDom(document, 'positionTest').setOffset().getOffset()");
// //     assert.strictEqual(getDom(document, 'positionTest').getOffset().x, offsets.x, "getDom(document, 'positionTest').setOffset().getOffset()");

// //     var position = getDom(document, 'positionTest').getPosition();
// //     getDom(document, 'positionTest').setPosition(position);
// //     assert.strictEqual(getDom(document, 'positionTest').getPosition().y, position.y, "getDom(document, 'positionTest').setPosition().getPosition()");
// //     assert.strictEqual(getDom(document, 'positionTest').getPosition().x, position.x, "getDom(document, 'positionTest').setPosition().getPosition()");
// // });

// // testoffset("fixed", function (iframe) {


// //     if (navigator.isIE6) {


// //         expect(0);


// //         return

// //     }

// //     var document = iframe.document;

// //     var tests = [
// //         { id: "fixed-1", y: 1001, x: 1001 },
// //         { id: "fixed-2", y: 1021, x: 1021 }
// //     ];

// //     Object.each(tests, function (test) {
// //         assert.strictEqual(getDom(document, test.id).getPosition().y, test.y, "getDom(document, '" + test.id + "').getPosition().y");
// //         assert.strictEqual(getDom(document, test.id).getPosition().x, test.x, "getDom(document, '" + test.id + "').getPosition().x");
// //     });

// //     tests = [
// //         { id: "fixed-1", y: 100, x: 100 },
// //         { id: "fixed-1", y: 0, x: 0 },
// //         { id: "fixed-1", y: -4, x: -4 },
// //         { id: "fixed-2", y: 200, x: 200 },
// //         { id: "fixed-2", y: 0, x: 0 },
// //         { id: "fixed-2", y: -5, x: -5 }
// //     ];

// //     Object.each(tests, function (test) {
// //         getDom(document, test.id).setOffset({ y: test.y, x: test.x });
// //         assert.strictEqual(getDom(document, test.id).getOffset().y, test.y, "getDom(document, '" + test.id + "').setOffset({ y: " + test.y + " })");
// //         assert.strictEqual(getDom(document, test.id).getOffset().x, test.x, "getDom(document, '" + test.id + "').setOffset({ x: " + test.x + " })");
// //     });

// //     // Bug 8316
// //     var noTopLeft = getDom(document, "fixed-no-top-left");
// //     assert.strictEqual(noTopLeft.getPosition().y, 1007, "Check offset top for fixed element with no top set");
// //     assert.strictEqual(noTopLeft.getPosition().x, 1007, "Check offset left for fixed element with no left set");


// //     var offsets = getDom(document, 'positionTest').getOffset();
// //     getDom(document, 'positionTest').setOffset(offsets);
// //     assert.strictEqual(getDom(document, 'positionTest').getOffset().y, offsets.y, "getDom(document, 'positionTest').setOffset().getOffset()");
// //     assert.strictEqual(getDom(document, 'positionTest').getOffset().x, offsets.x, "getDom(document, 'positionTest').setOffset().getOffset()");

// //     var position = getDom(document, 'positionTest').getPosition();
// //     getDom(document, 'positionTest').setPosition(position);
// //     assert.strictEqual(getDom(document, 'positionTest').getPosition().y, position.y, "getDom(document, 'positionTest').setPosition().getPosition()");
// //     assert.strictEqual(getDom(document, 'positionTest').getPosition().x, position.x, "getDom(document, 'positionTest').setPosition().getPosition()");
// // });

// // testoffset("table", function (iframe) {

// //     var document = iframe.document;
// //     expect(4);

// //     assert.strictEqual(getDom(document, "table-1").getPosition().y, 6, "getDom(document, 'table-1').getPosition().y");
// //     assert.strictEqual(getDom(document, "table-1").getPosition().x, 6, "getDom(document, 'table-1').getPosition().x");

// //     assert.strictEqual(getDom(document, "th-1").getPosition().y, 10, "getDom(document, 'th-1').getPosition().y");
// //     assert.strictEqual(getDom(document, "th-1").getPosition().x, 10, "getDom(document, 'th-1').getPosition().x");
// // });

// // testoffset("scroll", function (iframe) {

// //     var document = iframe.document;

// //     var ie = navigator.isQuirks;

// //     // IE is collapsing the top margin of 1px
// //     assert.strictEqual(new Dom(document.getElementById("scroll-1")).getPosition().y, ie ? 6 : 7, "getDom(document, 'scroll-1').getPosition().y");
// //     assert.strictEqual(new Dom(document.getElementById("scroll-1")).getPosition().x, 7, "getDom(document, 'scroll-1').getPosition().x");

// //     // IE is collapsing the top margin of 1px
// //     assert.strictEqual(getDom(document, "scroll-1-1").getPosition().y, ie ? 9 : 11, "getDom(document, 'scroll-1-1').getPosition().y");
// //     assert.strictEqual(getDom(document, "scroll-1-1").getPosition().x, 11, "getDom(document, 'scroll-1-1').getPosition().x");


// //     // scroll offset tests .scrollTop/Left
// //     assert.strictEqual(getDom(document, "scroll-1").getScroll().y, 5, "getDom(document, 'scroll-1').getScroll().y");
// //     assert.strictEqual(getDom(document, "scroll-1").getScroll().x, 5, "getDom(document, 'scroll-1').getScroll().x");

// //     assert.strictEqual(getDom(document, "scroll-1-1").getScroll().y, 0, "getDom(document, 'scroll-1-1').getScroll().y");
// //     assert.strictEqual(getDom(document, "scroll-1-1").getScroll().x, 0, "getDom(document, 'scroll-1-1').getScroll().x");

// //     // assert.strictEqual( document.getElementById(document.body).getScroll().y, 0, "document.getElementById(document.body).getScroll().y" );
// //     // assert.strictEqual( document.getElementById(document.body).getScroll().x, 0, "document.getElementById(document.body).getScroll().y" );

// //     iframe.name = "test";

// //     assert.strictEqual(document.getScroll().y, 1000, "getDom(document, document).getScroll().y");
// //     assert.strictEqual(document.getScroll().x, 1000, "getDom(document, document).getScroll().x");

// //     document.setScroll(0, 0);
// //     assert.strictEqual(document.getScroll().y, 0, "document.getScroll().y other document");
// //     assert.strictEqual(document.getScroll().x, 0, "document.getScroll().x other document");

// //     assert.strictEqual(document.setScroll(null, 100), document, "getDom(document, ).scrollTop(100) testing setter on empty jquery object");
// //     assert.strictEqual(document.setScroll(100, null), document, "getDom(document, ).scrollLeft(100) testing setter on empty jquery object");
// //     assert.strictEqual(document.setScroll(null, null), document, "getDom(document, ).setScroll(null, null) testing setter on empty jquery object");
// //     assert.strictEqual(document.getScroll().y, 100, "getDom(document, ).scrollTop(100) testing setter on empty jquery object");
// //     assert.strictEqual(document.getScroll().x, 100, "getDom(document, ).scrollLeft(100) testing setter on empty jquery object");
// // });

// // testoffset("body", function (iframe) {
// //     expect(2);
// //     assert.strictEqual(document.getElementById(iframe.document.body).getPosition().y, 1, "document.body.getPosition().y");
// //     assert.strictEqual(document.getElementById(iframe.document.body).getPosition().x, 1, "document.body.getPosition().x");
// // });

// // test("offsetParentTest() {

// //     var body = document.getElementById(document.body).offsetParent();
// //     assert.strictEqual(body.dom, document.body, "The body is its own offsetParent.");

// //     var header = getDom(document, "qunit-header").offsetParent();
// //     assert.strictEqual(header.dom, document.body, "The body is the offsetParent.");

// //     var div = getDom(document, "nothiddendivchild").offsetParent();
// //     assert.strictEqual(div.dom, document.body, "The body is the offsetParent.");

// //     getDom(document, "nothiddendiv").setStyle("position", "relative");

// //     div = getDom(document, "nothiddendivchild").offsetParent();
// //     assert.strictEqual(div.dom, getDom(document, "nothiddendiv").dom, "The div is the offsetParent.");

// //     div = document.getElementById(document.body).offsetParent();
// //     assert.strictEqual(div.dom, document.body, "The body is the offsetParent.");
// // });

// // test("fractions (see #7730 and #7885)Test() {
// //     expect(2);

// //     document.getElementById(document.body).append('<div id="fractions"/>');

// //     var expected = { y: 1000, x: 1000 };
// //     var div = getDom(document, 'fractions');

// //     div.setStyle('position', 'absolute');
// //     div.setStyle('left', '1000.7432222px');
// //     div.setStyle('top', '1000.532325px');
// //     div.setStyle('width', 100);
// //     div.setStyle('height', 100);

// //     div.setOffset(expected);

// //     var result = div.getPosition();

// //     assert.strictEqual(result.y, expected.y, "Check top");
// //     assert.strictEqual(result.x, expected.x, "Check left");

// //     div.remove();
// // });

// // function testoffset(name, fn) {

// //     test(name, function () {
// //         // pause execution for now
// //         stop();

// //         // load fixture in iframe
// //         var iframe = loadFixture(),
// //             win = iframe.contentWindow,
// //             interval = setInterval(function () {
// //                 if (win && win.Dom && win.dom.isReady) {
// //                     clearInterval(interval);
// //                     // continue
// //                     start();
// //                     // call actual tests passing the correct jQuery isntance to use
// //                     fn.call(this, win);
// //                     document.body.removeChild(iframe);
// //                     iframe = null;
// //                 }
// //             }, 15);
// //     });

// //     function loadFixture() {
// //         var src = "./data/offset/" + name + ".html?" + parseInt(Math.random() * 1000, 10),
// //             iframe = dom.parse("<iframe />").set({
// //                 width: 500, height: 500, position: "absolute", top: -600, left: -600, visibility: "hidden"
// //             }).appendTo().dom;
// //         iframe.contentWindow.location = src;
// //         return iframe;
// //     }
// // }



// // function getDom(document, id) {
// //     return document.getElementById(document.getElementById(id));
// // }
// // module("Styles");

// //export function getStyleTest() {

// //     assert.strictEqual(document.getElementById("qunit-fixture").getStyle("display"), "block", "Check for css property \"display\"");

// //     assert.ok(!dom.isHidden(document.getElementById("nothiddendiv").dom), "Modifying CSS display: Assert element is visible");
// //     document.getElementById("nothiddendiv").setStyle('display', "none");
// //     assert.ok(dom.isHidden(document.getElementById("nothiddendiv").dom), "Modified CSS display: Assert element is hidden");
// //     document.getElementById("nothiddendiv").setStyle('display', "block");
// //     assert.ok(!dom.isHidden(document.getElementById("nothiddendiv").dom), "Modified CSS display: Assert element is visible");

// //     var div = dom.parse("<div>");

// //     // These should be "auto" (or some better value)
// //     // temporarily provide "0px" for backwards compat
// //     assert.strictEqual(div.getWidth(), 0, "Width on disconnected node.");
// //     assert.strictEqual(div.getHeight(), 0, "Height on disconnected node.");

// //     div.setStyle('width', 4).setStyle('height', 4);

// //     assert.strictEqual(div.getStyle("width"), "4px", "Width on disconnected node.");
// //     assert.strictEqual(div.getStyle("height"), "4px", "Height on disconnected node.");

// //     var div2 = dom.parse("<div style='display:none;'><input type='text' style='height:20px;'/><textarea style='height:20px;'/><div style='height:20px;'></div></div>").appendTo();

// //     assert.strictEqual(div2.find("input").getStyle("height"), "20px", "Height on hidden input.");
// //     assert.strictEqual(div2.find("textarea").getStyle("height"), "20px", "Height on hidden textarea.");
// //     assert.strictEqual(div2.find("div").getStyle("height"), "20px", "Height on hidden textarea.");

// //     div2.remove();

// //     // handle negative numbers by ignoring #1599, #4216
// //     document.getElementById("nothiddendiv").setStyle('width', 1).setStyle('height', 1);

// //     var width = parseFloat(document.getElementById("nothiddendiv").getStyle("width")), height = parseFloat(document.getElementById("nothiddendiv").getStyle("height"));
// //     document.getElementById("nothiddendiv").setStyle('width', -1).setStyle('height', -1);

// //     assert.strictEqual(dom.parse("<div style='display: none;'>").getStyle("display"), "none", "Styles on disconnected nodes");

// //     document.getElementById("floatTest").setStyle("float", "right");
// //     assert.strictEqual(document.getElementById("floatTest").getStyle("float"), "right", "Modified CSS float using \"float\": Assert float is right");
// //     document.getElementById("floatTest").setStyle("font-size", "30px");
// //     assert.strictEqual(document.getElementById("floatTest").getStyle("font-size"), "30px", "Modified CSS font-size: Assert font-size is 30px");
// //     Object.map("0 0.25 0.5 0.75 1", function (n, i) {
// //         document.getElementById("foo").setStyle('opacity', n);

// //         assert.strictEqual(document.getElementById("foo").getStyle("opacity"), n, "Assert opacity is " + n + " as a String");
// //         document.getElementById("foo").setStyle('opacity', parseFloat(n));
// //         assert.strictEqual(document.getElementById("foo").getStyle("opacity"), n, "Assert opacity is " + parseFloat(n) + " as a Number");
// //     });
// //     document.getElementById("foo").setStyle('opacity', "");
// //     assert.strictEqual(document.getElementById("foo").getStyle("opacity"), "1", "Assert opacity is 1 when set to an empty String");

// //     document.getElementById("empty").setStyle('opacity', "1");
// //     assert.strictEqual(document.getElementById("empty").getStyle("opacity"), "1", "Assert opacity is taken from style attribute when set vs stylesheet in IE with filters");
// //     eval("-[1,]") ?
// //         assert.ok(true, "Requires the same number of tests") :
// //         assert.ok(~document.getElementById("empty").dom.currentStyle.filter.indexOf("gradient"), "Assert setting opacity doesn't overwrite other filters of the stylesheet in IE");

// //     var div = document.getElementById("nothiddendiv"), child = document.getElementById("nothiddendivchild");

// //     assert.strictEqual(parseInt(div.getStyle("fontSize")), 16, "Verify fontSize px set.");
// //     assert.strictEqual(parseInt(div.getStyle("font-size")), 16, "Verify fontSize px set.");
// //     assert.strictEqual(parseInt(child.getStyle("fontSize")), 16, "Verify fontSize px set.");
// //     assert.strictEqual(parseInt(child.getStyle("font-size")), 16, "Verify fontSize px set.");

// //     child.setStyle("height", "100%");
// //     assert.strictEqual(child.dom.style.height, "100%", "Make sure the height is being set correctly.");

// //     child.setAttr("class", "em");
// //     assert.strictEqual(parseInt(child.getStyle("fontSize")), 32, "Verify fontSize em set.");

// //     // Have to verify this as the result depends upon the browser's CSS
// //     // support for font-size percentages
// //     child.setAttr("class", "prct");
// //     var prctval = parseInt(child.getStyle("fontSize")), checkval = 0;
// //     if (prctval === 16 || prctval === 24) {
// //         checkval = prctval;
// //     }

// //     assert.strictEqual(prctval, checkval, "Verify fontSize % set.");

// //     assert.strictEqual(typeof child.getStyle("width"), "string", "Make sure that a string width is returned from css('width').");

// //     var old = child.dom.style.height;

// //     // Test NaN
// //     //child.setStyle("height", parseFloat("zoo"));
// //     //assert.strictEqual( child.style.height, old, "Make sure height isn't changed on NaN." );

// //     // Test null
// //     //child.setStyle("height", null);
// //     //assert.strictEqual( child.style.height, old, "Make sure height isn't changed on null." );

// //     old = child.dom.style.fontSize;

// //     // Test NaN
// //     //child.setStyle("font-size", parseFloat("zoo"));
// //     //assert.strictEqual( child.style.fontSize, old, "Make sure font-size isn't changed on NaN." );

// //     // Test null
// //     child.setStyle("font-size", null);
// //     assert.strictEqual(child.dom.style.fontSize, old, "Make sure font-size isn't changed on null.");
// // });

// //export function setStyleTest() {

// //     assert.ok(!dom.isHidden(document.getElementById("nothiddendiv").dom), "Modifying CSS display: Assert element is visible");
// //     document.getElementById("nothiddendiv").setStyle("display", "none");
// //     assert.ok(dom.isHidden(document.getElementById("nothiddendiv").dom), "Modified CSS display: Assert element is hidden");
// //     document.getElementById("nothiddendiv").setStyle("display", "block");
// //     assert.ok(!dom.isHidden(document.getElementById("nothiddendiv").dom), "Modified CSS display: Assert element is visible");

// //     document.getElementById("nothiddendiv").setStyle("top", "-1em");
// //     assert.ok(document.getElementById("nothiddendiv").getStyle("top"), -16, "Check negative number in EMs.");

// //     document.getElementById("floatTest").setStyle("float", "left");
// //     assert.strictEqual(document.getElementById("floatTest").getStyle("float"), "left", "Modified CSS float using \"float\": Assert float is left");
// //     document.getElementById("floatTest").setStyle("font-size", "20px");
// //     assert.strictEqual(document.getElementById("floatTest").getStyle("font-size"), "20px", "Modified CSS font-size: Assert font-size is 20px");

// //     Object.map("0 0.25 0.5 0.75 1", function (n, i) {
// //         document.getElementById("foo").setStyle("opacity", n);
// //         assert.strictEqual(document.getElementById("foo").getStyle("opacity"), parseFloat(n), "Assert opacity is " + parseFloat(n) + " as a String");
// //         document.getElementById("foo").setStyle("opacity", parseFloat(n));
// //         assert.strictEqual(document.getElementById("foo").getStyle("opacity"), parseFloat(n), "Assert opacity is " + parseFloat(n) + " as a Number");
// //     });
// //     document.getElementById("foo").setStyle("opacity", "");
// //     assert.strictEqual(document.getElementById("foo").getStyle("opacity"), "1", "Assert opacity is 1 when set to an empty String");

// //     // using contents will get comments regular, text, and comment nodes
// //     var j = document.getElementById("nonnodes");
// //     j.setStyle("overflow", "visible");
// //     assert.strictEqual(j.getStyle("overflow"), "visible", "Check node,textnode,comment css works");
// //     // opera sometimes doesn't update 'display' correctly, see #2037

// //     document.getElementById("t2037").innerHTML = document.getElementById("t2037").innerHTML;
// //     assert.strictEqual(document.getElementById("t2037").find(".hidden").getStyle("display"), "none", "Make sure browser thinks it is hidden");

// //     var div = document.getElementById("nothiddendiv"),
// //         display = div.getStyle("display"),
// //         ret = div.setStyle("display", '');

// //     assert.strictEqual(ret, div, "Make sure setting undefined returns the original set.");
// //     assert.strictEqual(div.getStyle("display"), display, "Make sure that the display wasn't changed.");

// //     // Test for Bug #5509
// //     //var success = true;
// //     //try {
// //     //	document.getElementById("foo").setStyle("backgroundColor", "rgba(0, 0, 0, 0.1)");
// //     //}
// //     //catch (e) {
// //     //	success = false;
// //     //}
// //     //assert.ok( success, "Setting RGBA values does not throw Error" );


// //     var div = dom.parse("<div>").appendTo("qunit-fixture");

// //     div.setStyle("fill-opacity", 0).setStyle("fill-opacity", 1.0);

// //     assert.strictEqual(div.getStyle("fill-opacity"), 1, "Do not append px to 'fill-opacity'");

// // });

// // if (eval("!-[1,]")) {
// //     test("setOpacity(String, Object) for MSIE", function () {
// //         // for #1438, IE throws JS error when filter exists but doesn't have opacity in it
// //         document.getElementById("foo").setStyle("filter", "progid:DXImageTransform.Microsoft.Chroma(color='red');");
// //         assert.strictEqual(document.getElementById("foo").getStyle("opacity"), "1", "Assert opacity is 1 when a different filter is set in IE, #1438");

// //         var filterVal = "progid:DXImageTransform.Microsoft.Alpha(opacity=30) progid:DXImageTransform.Microsoft.Blur(pixelradius=5)";
// //         var filterVal2 = "progid:DXImageTransform.Microsoft.Alpha(opacity=100) progid:DXImageTransform.Microsoft.Blur(pixelradius=5)";
// //         var filterVal3 = "progid:DXImageTransform.Microsoft.Blur(pixelradius=5)";
// //         document.getElementById("foo").setStyle("filter", filterVal);
// //         assert.strictEqual(document.getElementById("foo").getStyle("filter"), filterVal, "filter works");
// //         document.getElementById("foo").setStyle("opacity", 1);
// //         assert.strictEqual(document.getElementById("foo").getStyle("filter"), filterVal2, "Setting opacity in IE doesn't duplicate opacity filter");
// //         assert.strictEqual(document.getElementById("foo").getStyle("opacity"), "1", "Setting opacity in IE with other filters works");
// //         document.getElementById("foo").setStyle("filter", filterVal3).setStyle("opacity", 1);
// //         assert.ok(document.getElementById("foo").getStyle("filter").indexOf(filterVal3) !== -1, "Setting opacity in IE doesn't clobber other filters");
// //     });

// //     test("Setting opacity to 1 properly removes filter: style", function () {
// //         var rfilter = /filter:[^;]*/i,
// //             test = document.getElementById("t6652").setStyle("opacity", 1),
// //             test2 = test.find("div").setStyle("opacity", 1);

// //         function hasFilter(elem) {
// //             var match = rfilter.exec(elem.dom.style.cssText);
// //             if (match) {
// //                 return true;
// //             }
// //             return false;
// //         }
// //         //   assert.ok( !hasFilter( test ), "Removed filter attribute on element without filter in stylesheet" );
// //         assert.ok(hasFilter(test2), "Filter attribute remains on element that had filter in stylesheet");
// //     });
// // }

// // test("getStyle('height') doesn't clear radio buttons", function () {
// //     expect(4);

// //     var checkedtest = document.getElementById("checkedtest");
// //     // IE6 was clearing "checked" in getStyle("height");
// //     checkedtest.getStyle("height");
// //     assert.ok(checkedtest.find("[type='radio']").dom.checked, "Check first radio still checked.");
// //     assert.ok(!checkedtest.query("[type='radio']").item(-1).dom.checked, "Check last radio still NOT checked.");
// //     assert.ok(checkedtest.find("[type='checkbox']").dom.checked, "Check first checkbox still checked.");
// //     assert.ok(!checkedtest.query("[type='checkbox']").item(-1).dom.checked, "Check last checkbox still NOT checked.");
// // });

// // /*
// // test(":visible selector works properly on table elements (bug #4512)", function () {
// // 	expect(1);

// // 	var table = dom.parse("<table/>").setHtml("<tr><td style='display:none'>cell</td><td>cell</td></tr>");
// // 	assert.strictEqual(table.find('td').isHidden(), true, "hidden cell is not perceived as visible");
// // });


// // */

// // /*

// // test(":visible selector works properly on children with a hidden parent", function () {
// // 	expect(1);
// // 	var table = dom.parse("<table/>").setStyle("display", "none").setHtml("<tr><td>cell</td><td>cell</td></tr>");
// // 	assert.strictEqual(table.find('td').isHidden(), true, "hidden cell children not perceived as visible");
// // });


// // */

// // test("internal ref to elem.runtimeStyle", function () {
// //     expect(1);
// //     var result = true;

// //     try {
// //         document.getElementById("foo").setStyle('width', "0%").getStyle("width");
// //     } catch (e) {
// //         result = false;
// //     }

// //     assert.ok(result, "elem.runtimeStyle does not throw exception");
// // });

// // test("marginRight computed style", function () {
// //     expect(1);

// //     var div = document.getElementById("foo");
// //     div
// //         .setStyle('width', '1px')
// //         .setStyle('marginRight', 0);

// //     assert.strictEqual(div.getStyle("marginRight"), "0px", "marginRight correctly calculated with a width and display block");
// // });


// // /*

// // test("Element.styles behavior", function() {
// // 	var div = dom.parse( "<div>" ).appendTo(document.body).set({
// // 		position: "absolute",
// // 		top: 0,
// // 		left: 10
// // 	});
// // 	Element.styles.top = "left";
// // 	assert.strictEqual( div.getStyle("top"), "10px", "the fixed property is used when accessing the computed style");
// // 	div.setStyle("top", "100px");
// // 	assert.strictEqual( div.style.left, "100px", "the fixed property is used when setting the style");
// // 	Element.styles.top = undefined;
// // });


// // */

// // test("widows & orphans", function () {

// //     var p = dom.parse("<p>").appendTo("qunit-fixture");

// //     if ("widows" in p.dom.style) {
// //         expect(4);
// //         p.setStyle('widows', 0).setStyle('orphans', 0);

// //         assert.strictEqual(p.getStyle("widows"), 0, "widows correctly start with value 0");
// //         assert.strictEqual(p.getStyle("orphans"), 0, "orphans correctly start with value 0");

// //         p.setStyle('widows', 3).setStyle('orphans', 3);

// //         assert.strictEqual(p.getStyle("widows"), 3, "widows correctly start with value 3");
// //         assert.strictEqual(p.getStyle("orphans"), 3, "orphans correctly start with value 3");

// //     } else {

// //         expect(1);
// //         assert.ok(true, "Does not attempt to test for style props that definitely don't exist in older versions of IE");
// //     }


// //     p.remove();
// // });

