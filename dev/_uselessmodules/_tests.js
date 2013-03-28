
// test("Object.type", function() {
// 
// equal( Object.type(null), "null", "null" );
// equal( Object.type(undefined), "undefined", "undefined" );
// equal( Object.type(true), "boolean", "Boolean" );
// equal( Object.type(false), "boolean", "Boolean" );
// equal( Object.type(Boolean(true)), "boolean", "Boolean" );
// equal( Object.type(0), "number", "Number" );
// equal( Object.type(1), "number", "Number" );
// equal( Object.type(Number(1)), "number", "Number" );
// equal( Object.type(""), "string", "String" );
// equal( Object.type("a"), "string", "String" );
// equal( Object.type(String("a")), "string", "String" );
// equal( Object.type({}), "object", "Object" );
// equal( Object.type(/foo/), "regexp", "RegExp" );
// equal( Object.type(new RegExp("asdf")), "regexp", "RegExp" );
// equal( Object.type([1]), "array", "Array" );
// equal( Object.type(new Date()), "date", "Date" );
// equal( Object.type(new Function("return;")), "function", "Function" );
// equal( Object.type(function(){}), "function", "Function" );
// equal( Object.type(window), "object", "Window" );
// equal( Object.type(document), "control", "Document" );
// equal( Object.type(Dom.get(document.body)), "control", "Element" );
// equal( Object.type(document.createTextNode("foo")), "object", "TextNode" );
// 	
// // !Safari
// //equal( Object.type(document.getElementsByTagName("*")), "object", "DomList" );
// });



//test("Object.isFunction", function() {
//	expect(19);

//	// Make sure that false values return false
//	ok( !Object.isFunction(), "No Value" );
//	ok( !Object.isFunction( null ), "null Value" );
//	ok( !Object.isFunction( undefined ), "undefined Value" );
//	ok( !Object.isFunction( "" ), "Empty String Value" );
//	ok( !Object.isFunction( 0 ), "0 Value" );

//	// Check built-ins
//	// Safari uses "(Internal Function)"
//	ok( Object.isFunction(String), "String Function("+String+")" );
//	ok( Object.isFunction(Array), "Array Function("+Array+")" );
//	ok( Object.isFunction(Object), "Object Function("+Object+")" );
//	ok( Object.isFunction(Function), "Function Function("+Function+")" );

//	// When stringified, this could be misinterpreted
//	var mystr = "function";
//	ok( !Object.isFunction(mystr), "Function String" );

//	// When stringified, this could be misinterpreted
//	var myarr = [ "function" ];
//	ok( !Object.isFunction(myarr), "Function Array" );

//	// When stringified, this could be misinterpreted
//	var myfunction = { "function": "test" };
//	ok( !Object.isFunction(myfunction), "Function Object" );

//	// Make sure normal functions still work
//	var fn = function(){};
//	ok( Object.isFunction(fn), "Normal Function" );

//	var obj = document.createElement("object");

//	// Firefox says this is a function
//	ok( !Object.isFunction(obj), "Object Element" );

//	// IE says this is an object
//	// Since 1.3, this isn't supported (#2968)
//	//ok( Object.isFunction(obj.getAttribute), "getAttribute Function" );

//	var nodes = document.body.childNodes;

//	// Safari says this is a function
//	ok( !Object.isFunction(nodes), "childNodes Property" );

//	var first = document.body.firstChild;

//	// Normal elements are reported ok everywhere
//	ok( !Object.isFunction(first), "A normal DOM Element" );

//	var input = document.createElement("input");
//	input.type = "text";
//	document.body.appendChild( input );

//	// IE says this is an object
//	// Since 1.3, this isn't supported (#2968)
//	//ok( Object.isFunction(input.focus), "A default function property" );

//	document.body.removeChild( input );

//	var a = document.createElement("a");
//	a.href = "some-function";
//	document.body.appendChild( a );

//	// This serializes with the word 'function' in it
//	ok( !Object.isFunction(a), "Anchor Element" );

//	document.body.removeChild( a );

//	// Recursive function calls have lengths and array-like properties
//	function callme(callback){
//		function fn(response){
//			callback(response);
//		}

//		ok( Object.isFunction(fn), "Recursive Function Call" );

//		fn({ some: "data" });
//	};

//	callme(function(){
//		callme(function(){});
//	});
//});


// test("Array.create", function(){
// 
// // equal( Array.create(document.findAll("head")[0]s)[0].nodeName.toUpperCase(), "HEAD", "Pass makeArray a List object" );
// 
// // equal( Array.create(document.getElementsByName("PWD")).slice(0,1)[0].name, "PWD", "Pass makeArray a nodelist" );
// 
// equal( (function(){ return Array.create(arguments); })(1,2).join(""), "12", "Pass makeArray an arguments array" );
// 
// equal( Array.create([1,2,3]).join(""), "123", "Pass makeArray a real array" );
// 
// equal( Array.create().length, 0, "Pass nothing to makeArray and expect an empty array" );
// 
// equal( Array.create( [0] )[0], 0 , "Pass makeArray a number" );
// 	
// equal( Array.create( {length:2, 0:"a", 1:"b"} ).join(""), "ab", "Pass makeArray an array like map (with length)" );
// 
// // ok( !!Array.create( document.documentElement.childNodes ).slice(0,1)[0].nodeName, "Pass makeArray a childNodes array" );
// 
// // ok( Array.create(document.getElementById("form")).length >= 13, "Pass makeArray a form (treat as elements)" );
// 
// deepEqual( Array.create({length: "0"}), [], "Make sure object is coerced properly.");
// });



test("String.prototype.toCamelCase", function () {

	var tests = {
		"foo-bar": "fooBar",
		"foo-bar-baz": "fooBarBaz",
		"girl-u-want": "girlUWant",
		"the-4th-dimension": "the4thDimension",
		"-o-tannenbaum": "OTannenbaum",
		"-moz-illa": "MozIlla"
	};

	expect(6);

	Object.each(tests, function (val, key) {
		equal(key.toCamelCase(), val, "Converts: " + key + " => " + val);
	});
});

