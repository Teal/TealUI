module("core/base:core", { teardown: moduleTeardown });

test("Basic requirements", function () {
	expect(5);
	ok(Array.prototype.push, "Array.push()");
	ok(Function.prototype.apply, "Function.apply()");
	ok(document.getElementById, "getElementById");
	ok(document.getElementsByTagName, "getElementsByTagName");
	ok(RegExp, "RegExp");
});

test("execScript", function() {

	expect( 3 );

	execScript( "globalEvalTest = 1;" );
	equal(window.globalEvalTest, 1, "Test variable declarations are global");

	execScript("var globalEvalTest = 2;");
	ok( window.globalEvalTest, "Test variable assignments are global" );

	execScript( "this.globalEvalTest = 3;" );
	equal(window.globalEvalTest, 3, "Test context (this) is the window object");

	window.globalEvalTest = undefined;
});

test("Object.extend", function() {

	var target = { toString: 1 },
		expected ={ toString: 2};

	Object.extend(target, expected);
	deepEqual(target, expected, "Check if extended");

});

test("Object.each", function() {
	expect(13);
	Object.each( [0,1,2], function(n, i){
		equal( i, n, "Check array iteration" );
	});

	Object.each( [5,6,7], function(n, i){
		equal( i, n - 5, "Check array iteration" );
	});

	Object.each( { name: "name", lang: "lang" }, function(n, i){
		equal( i, n, "Check object iteration" );
	});

	var total = 0;
	Object.each([1,2,3], function(v, i){ total += v; });
	equal( total, 6, "Looping over an array" );
	total = 0;
	Object.each([1,2,3], function(v, i){ total += v; if ( i == 1 ) return false; });
	equal( total, 3, "Looping over an array, with break" );
	total = 0;
	Object.each({"a":1,"b":2,"c":3}, function(v, i){ total += v; });
	equal( total, 6, "Looping over an object" );
	total = 0;
	Object.each({"a":3,"b":3,"c":3}, function(v, i){ total += v; return false; });
	equal( total, 3, "Looping over an object, with break" );

	//var f = function(){};
	//f.foo = "bar";
	//Object.each(f, function(v, i){
	//	f[i] = "baz";
	//});
	//equal( "baz", f.foo, "Loop over a function" );

	var stylesheet_count = 0;
	Object.each(document.styleSheets, function(i){
		stylesheet_count++;
	});
	ok(stylesheet_count, "should not throw an error in IE while looping over document.styleSheets and return proper amount");

});

test("Array.isArray", function() {
	expect(17);

	// Make sure that false values return false
	ok( !Array.isArray(), "No Value" );
	ok( !Array.isArray( null ), "null Value" );
	ok( !Array.isArray( undefined ), "undefined Value" );
	ok( !Array.isArray( "" ), "Empty String Value" );
	ok( !Array.isArray( 0 ), "0 Value" );

	// Check built-ins
	// Safari uses "(Internal Function)"
	ok( !Array.isArray(String), "String Function("+String+")" );
	ok( !Array.isArray(Array), "Array Function("+Array+")" );
	ok( !Array.isArray(Object), "Object Function("+Object+")" );
	ok( !Array.isArray(Function), "Function Function("+Function+")" );

	// When stringified, this could be misinterpreted
	var mystr = "function";
	ok( !Array.isArray(mystr), "Function String" );

	// When stringified, this could be misinterpreted
	var myarr = [ "function" ];
	ok( Array.isArray(myarr), "Function Array" );

	// When stringified, this could be misinterpreted
	var myArray = { "function": "test", length: 3 };
	ok( !Array.isArray(myArray), "Function Object" );

	// Make sure normal functions still work
	var fn = function(){};
	ok( !Array.isArray(fn), "Normal Function" );

	var obj = document.createElement("object");

	// Firefox says this is a function
	ok( !Array.isArray(obj), "Object Element" );

	// IE says this is an object
	// Since 1.3, this isn't supported (#2968)
	//ok( Array.isArray(obj.getAttribute), "getAttribute Function" );

	var nodes = document.body.childNodes;

	ok( !Array.isArray(nodes), "childNodes Property" );

	var first = document.body.firstChild;

	// Normal elements are reported ok everywhere
	ok( !Array.isArray(first), "A normal DOM Element" );

	var input = document.createElement("input");
	input.type = "text";
	document.body.appendChild( input );

	// IE says this is an object
	// Since 1.3, this isn't supported (#2968)
	//ok( Array.isArray(input.focus), "A default function property" );

	document.body.removeChild( input );

	var a = document.createElement("a");
	a.href = "some-function";
	document.body.appendChild( a );

	// This serializes with the word 'function' in it
	ok( !Array.isArray(a), "Anchor Element" );

	document.body.removeChild( a );
});

test("Function#bind", function(){

	var test = function(){ equal( this, thisObject, "Make sure that scope is set properly." ); };
	var thisObject = { foo: "bar", method: test };

	// Make sure normal works
	test.call( thisObject );

	// Basic scoping
	test.bind( thisObject )();
});

test("String.format", function() {

	var nbsp = String.fromCharCode(160);

	equal( String.format("{0} {1}  {2}", 1, 2 ,3 ), "1 2  3", "Format {Index}" );
	equal(String.format("{a} {b}  {c}", { a: 1, b: 2, c: 3 }), "1 2  3", "Format {Field}");
	equal(String.format("{2} {2}  {2}", 1, 2, 3), "3 3  3", "Format dump fields");
	equal(String.format("{2}"), "", "Format non-exisits field");
	equal(String.format.call(function () { return 3 }, "{0}", 1), "3", "Format custom object");
	equal(String.format("{{}} {0}", 1), "{} 1", "Format { }");
});

test("String#trim", function () {
	expect(8);

	var nbsp = String.fromCharCode(160);

	equal("hello  ".trim(), "hello", "trailing space");
	equal("  hello".trim(), "hello", "leading space");
	equal("  hello   ".trim(), "hello", "space on both sides");
	equal(("  " + nbsp + "hello  " + nbsp + " ").trim(), "hello", "&nbsp;");

	equal(" ".trim(), "", "space should be trimmed");
	equal("ipad\xA0".trim(), "ipad", "nbsp should be trimmed");
	equal("\uFEFF".trim(), "", "zwsp should be trimmed");
	equal("\uFEFF \xA0! | \uFEFF".trim(), "! |", "leading/trailing should be trimmed");
});

