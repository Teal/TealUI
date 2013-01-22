//===========================================
//  遍历           C
//===========================================




/**
 * Css 选择器。
 * @param {String} selector Css3查询选择器。
 * @param {Boolean} quick 是否快速查找。
 * @return {Array} 元素集合。
 * @author James Donaghue - james.donaghue@gmail.com
 * @fileOverview Peppy - A lightning fast CSS 3 Compliant Selector Engine.
 * @see http://www.w3.org/TR/css3-selectors/#selectors
 */
var Peppy = (function(){

	var doc = document,
	    cache = {},
		persistCache = {},
		
		reg = {
			quickTest: /^[^:\[>+~ ,]+$/,
			typeSelector: /(^[^\[:]+?)(?:\[|\:|$)/,
			tag: /^(\w+|\*)/,
			id: /^(\w*|\*)#/,
			classRE: /^(\w*|\*)\./,
			attributeName: /(\w+)(?:[!+~*\^$|=])|\w+/,
			attributeValue: /(?:[!+~*\^$|=]=*)(.+)(?:\])/, 
			pseudoName:  /(\:[^\(]+)/,
			pseudoArgs: /(?:\()(.+)(?:\))/,				
			nthParts: /([+-]?\d)*(n)([+-]\d+)*/i,		
			combinatorTest: /[+>~ ](?![^\(]+\)|[^\[]+\])/,
			combinator:  /\s*[>~]\s*(?![=])|\s*\+\s*(?![0-9)])|\s+/g, 						
			recursive: /:(not|has)\((\w+|\*)?([#.](\w|\d)+)*(\:(\w|-)+(\([^\)]+\))?|\[[^\}]+\])*(\s*,\s*(\w+|\*)?([#.](\w|\d)+)*(\:(\w|-)+(\([^\)]+\))?|\[[^\}]+\])*)*\)/gi
	    },
		
		map = {
			'class': 'className',
			'for': 'htmlFor'
		},
		
		_uid = 0  ;
	
	// Filters a list of elements for uniqueness.
	function filter( a, tag ){
		var r = [], 
			uids = {};
		if( tag ) tag = new RegExp( "^" + tag + "$", "i" );
		for( var i = 0, ae; ae = a[ i++ ]; ){
			ae.uid = ae.uid || _uid++;
			if( !uids[ae.uid] && (!tag || ae.nodeName.search( tag ) !== -1) )
				r.push( uids[ae.uid] = ae  );
		}
		return r;
	}
	
	// inspired by EXT
	function getAttribute( e, a ){
		e = map[e] || e;	
		return e.getAttribute( a ) || e[a];
	}
	
	function getByClass( selector, selectorRE, root, includeRoot, cacheKey, tag, flat ){
		var result = [];
		
		if( !!flat )
			return selectorRE.test( root.className ) ? [root] : [];
		
		if( root.getElementsByClassName)
		{
			result = root.getElementsByClassName( selector);			
			
			if( includeRoot )
			{
				if( selectorRE.test( root.className ) ) result.push(root);
			}
			
			if( tag != "*" ) result = filter( result, tag );
			cache[ cacheKey ] = result.slice(0);
			return result;
			
		}
		
		var es = (tag == "*" && root.all) ? root.all : root.getElementsByTagName( tag );		
		
		if( includeRoot ) es.push(  root   );		
		
		for( var index = 0, e; e = es[ index++ ]; )
			if( selectorRE.test( e.className ) )
				result.push(  e  );
		
		return result;
	}
	
	function getById( selector, root, includeRoot, cacheKey, tag, flat ){
		var rs, result = [];
		
		if( flat )
			return getAttribute( root, "id" ) === selector ? [root] : result;
		
		if( root.getElementById )
			rs = root.getElementById( selector );
		else
			rs = doc.getElementById( selector );
		
		if( rs && getAttribute( rs, "id" ) === selector )
		{			
			result.push(rs);
			cache[ cacheKey ] = result.slice(0);
			return result;
		}
		
		var es = root.getElementsByTagName( tag );
		
		if( includeRoot ) es.push(root) ;
		
		for( var index = 0, e; e = es[ index++ ]; )
			if( getAttribute( e, "id" ) === selector )
			{
				result.push( e );
				break;
			}
		
		return result;
	};
	
	// TODO: Make use of xpath if available (look at Prototype.js for examples).
	function getContextFromSequenceSelector( selector, roots, includeRoot, flat ){
		var context, 
			tag, 
			contextType = "", 
			result = [], 
			tResult = [], 
			root, 
			rootCount, 
			rootsLength;
			
		reg.id.lastIndex = reg.typeSelector.lastIndex = reg.classRE.lastIndex = 0;
		if( !reg.tag.test( selector ) ) selector = "*" + selector;
		context = reg.typeSelector.exec( selector )[1];
		roots = roots instanceof Array ? roots.slice(0) : [roots];
		rootsLength = roots.length;
		rootCount = rootsLength - 1;
	
		if( reg.id.test( context ) )
		{			
			contextType = "id";
			tag = (tag = context.match( /^\w+/ )) ? tag[0] : "*";
			context = context.replace( reg.id, "");						
		}
		else if( reg.classRE.test( context ) )
		{
			contextType = "class";
			tag = (tag = context.match( reg.tag )) ? tag[0] : "*";
			context = context.replace( reg.tag, "" );
			contextRE = persistCache[context + "RegExp"] || 
						(persistCache[context + "RegExp"] = new RegExp( "(?:^|\\s)" + context.replace( /\./g, "\\s*" ) + "(?:\\s|$)" ));
			context = context.replace( /\./g, " " )
		}			
		
		while( rootCount > -1 ){ 
			root = roots[ rootCount-- ];
			root.uid = root.uid || _uid++;
			var cacheKey = selector + root.uid;
			
			if( cache[ cacheKey ] )
			{
				result = result.concat( cache[ cacheKey ] );
				continue;
			}
			
			if( contextType === "id" )
				tResult = getById( context, root, includeRoot, cacheKey, tag, flat );
			else if( contextType === "class" )
				tResult = getByClass( context, contextRE, root, includeRoot, cacheKey, tag, flat );
			else
			{   /* tagname */
				tResult = Array.create(root.getElementsByTagName( context ));
				if( !!includeRoot && (root.nodeName.toUpperCase() === context.toUpperCase() || context === "*") )
					tResult.push(root);
			}
			
			result = rootsLength > 1 ? result.concat( tResult ) : tResult;
			cache[ cacheKey ] = result.slice(0);
		}
		
		return result;
	};
	
	Object.map("DOMAttrModified DOMNodeInserted DOMNodeRemoved", function(value){
		doc.addEventListener(value, clearCache, false);
	} );
	
	function clearCache(){ cache = {}; }
	
	return {
		
		
		query: function( selectorGroups, root, includeRoot, recursed, flat ){
			var elements = [];
			
					//没有选择器返回
			if( !selectorGroups ) return elements;

			if( !recursed ){  // TODO: try to clean this up. 
				selectorGroups = selectorGroups.trim() // get rid of leading and trailing spaces												 
											   .replace( /(\[)\s+/g, "$1" ) // remove spaces around '['  of attributes
											   .replace( /\s+(\])/g, "$1" ) // remove spaces around ']' of attributes
											   .replace( /(\[[^\] ]+)\s+/g, "$1" ) // remove spaces to the left of operator inside of attributes
											   .replace( /\s+([^ \[]+\])/g, "$1" ) // remove spaces to the right of operator inside of attributes
											   .replace( /(\()\s+/g, "$1") // remove spaces around '(' of pseudos											   
											   .replace( /(\+)(\D)/g, "$1 $2" ) // add space after + combinator
											   .replace( /['"]/g, "") // remove all quotations
											   .replace( /\(\s*even\s*\)/gi, "(2n)" ) // replace (even) with (2n) - pseudo arg (for caching)
											   .replace( /\(\s*odd\s*\)/gi, "(2n+1)" ); // replace (odd) with (2n+1) - pseudo arg (for caching)
			}
			
			//初始化
			if( typeof root === "string" )
				root = (root = getContextFromSequenceSelector( root, doc )).length > 0 ? root : undefined;
			root = root || doc;
			root.uid = root.uid || _uid++;
			//完
			
			var cacheKey = selectorGroups + root.uid;
			if( cache[ cacheKey ] ) return cache[ cacheKey ];
			
			reg.quickTest.lastIndex = 0;
			if( reg.quickTest.test( selectorGroups ) )
			{
				elements = getContextFromSequenceSelector( selectorGroups, root, includeRoot, flat );
				return (cache[ cacheKey ] = elements.slice(0));
			}
			
			var groupsWorker, 
				groups, 
				selector, 
				parts = [], 
				part;
				
			groupsWorker = selectorGroups.split( /\s*,\s*/g ); // 分隔  ,  
			groups = groupsWorker.length > 1 ? [""] : groupsWorker;
			
			// validate groups
			for( var gwi = 0, tc = 0, gi = 0, g; groupsWorker.length > 1 && (g = groupsWorker[ gwi++ ]) !== undefined; )
			{
				tc += (((l = g.match( /\(/g )) ? l.length : 0) - ((r = g.match( /\)/g )) ? r.length : 0));
				groups[gi] = groups[gi] || "";
				groups[gi] += (groups[gi] === "" ? g : "," + g);
				if( tc === 0 ) gi++;
			}
			
			var gCount = 0;				
			while( (selector = groups[gCount++]) !== undefined ){
				reg.quickTest.lastIndex = 0;
				if( reg.quickTest.test( selector ) ){
					result = getContextFromSequenceSelector( selector, root, includeRoot, flat )
					elements = groups.length > 1 ? elements.concat( result ) : result;
					continue;
				}
				reg.combinatorTest.lastIndex = 0;
				if( reg.combinatorTest.test( selector ) ){
					var parts, 
						pLength, 
						pCount = 0, 
						combinators, 
						cLength, 
						cCount = 0, 
						result;
						
					parts = selector.split( reg.combinator );
					pLength = parts.length;
					
					combinators = selector.match( reg.combinator ) || [""];					
					cLength = combinators.length;
					
					while( pCount < pLength ){
						var c = combinators[ cCount++ ].trim(), 
							part1 = result || css3.query( parts[pCount++], root, includeRoot, true, flat ), 
							part2 = css3.query( parts[ pCount++ ], 
											c == "" || c == ">" ? part1 : root, 
											c == "" || c == ">", 
											true,
											flat );
											
						result = css3.queryCombinator( part1, part2, c );
					}
					
					elements = groups.length > 1 ? elements.concat( result ) : result;							   
					result = undefined;
				}else{
					result = css3.querySelector( selector, root, includeRoot );
					elements = groups.length > 1 ? elements.concat( result ) : result;
				}
			}	
			
			if( groups.length > 1 ) elements = filter(elements);
			
			return ( cache[ cacheKey ] = elements.slice(0) );
		},
		
		queryCombinator: function( l, r, c ){
			var result = [], 
				uids = {}, 
				proc = {}, 
				succ = {}, 
				fail = {}, 
				combinatorCheck = css3.simpleSelector.combinator[c];
				
			for( var li = 0, le; le = l[ li++ ]; ){
				le.uid = le.uid || _uid++
				uids[ le.uid ] = le;
			}	
					
			for( var ri = 0, re; re = r[ ri++ ]; ){
				re.uid = re.uid || _uid++; 
				if( !proc[ re.uid ] && combinatorCheck( re, uids, fail, succ ) )
					result.push( re );
				proc[ re.uid ] = re;
			}
			return result;
		},
		
		querySelector : function( selector, root, includeRoot, flat ){
			var context, 
				passed = [],				 
				count, 
				totalCount, 
				e, 
				first = true, 
				localCache = {};
	
			context = getContextFromSequenceSelector( selector, root, includeRoot, flat ); 	
			count = context.length;
			totalCount = count - 1;			
			
			var tests, recursive;
			if( /:(not|has)/i.test( selector ) ){
				recursive = selector.match( reg.recursive );
				selector = selector.replace( reg.recursive, "" );
			}
			
			// Get the tests (if there aren't any just set tests to an empty array).
			if( !(tests = selector.match( /:(\w|-)+(\([^\(]+\))*|\[[^\[]+\]/g )) ) tests = [];	
				
			// If there were any recursive tests put them in the tests array (they were removed above).
			if( recursive ) tests = tests.concat( recursive );			
	
			// Process each tests for all elements.
			var aTest;
			while( (aTest = tests.pop()) !== undefined ){				
				var pc = persistCache[ aTest ], 
					testFuncScope,
					testFunc, 
					testFuncKey,				 	
					testFuncArgs = [],
					isTypeTest = false, 
					isCountTest = false;
					
				passed = [];
				
				if( pc ){
					testFuncKey = pc[ 0 ];
					testFuncScope = pc[ 1 ];					
					testFuncArgs = pc.slice( 2 );
					testFunc = testFuncScope[ testFuncKey ];											
				}else if( !/^:/.test( aTest ) ){ // attribute																
					var n = aTest.match( reg.attributeName );
					var v = aTest.match( reg.attributeValue );
										
					testFuncArgs[ 1 ] = n[ 1 ] || n[ 0 ];
					testFuncArgs[ 2 ] = v ? v[ 1 ] : "";						
					testFuncKey = "" + aTest.match( /[~!+*\^$|=]/ );
					testFuncScope = css3.simpleSelector.attribute;	
					testFunc = testFuncScope[ testFuncKey ];						
					persistCache[ aTest ] = [ testFuncKey, testFuncScope ].concat( testFuncArgs );					
				}else{ // pseudo						
					var pa = aTest.match( reg.pseudoArgs );					
					testFuncArgs[ 1 ] = pa ? pa[ 1 ] : "";						
					testFuncKey = aTest.match( reg.pseudoName )[ 1 ];
					testFuncScope = css3.simpleSelector.pseudos;
					
					if( /nth-(?!.+only)/i.test( aTest ) ){											
						var a, 
							b, 
							nArg = testFuncArgs[ 1 ],
							nArgPC = persistCache[ nArg ];
							
						if( nArgPC ){
							a = nArgPC[ 0 ];
							b = nArgPC[ 1 ];
						}else{								
							var nParts = nArg.match( reg.nthParts );
							if( nParts ){								
								a = parseInt( nParts[1],10 ) || 0;
								b = parseInt( nParts[3],10 ) || 0;
								
								if( /^\+n|^n/i.test( nArg ) )
									a = 1;
								else if( /^-n/i.test( nArg ) )
									a = -1;
								
								testFuncArgs[ 2 ] = a;
								testFuncArgs[ 3 ] = b;
								persistCache[ nArg ] = [a, b];									
							}
						}
					}else if( /^:contains/.test( aTest ) ){
						var cArg = testFuncArgs[1];
						var cArgPC = persistCache[ cArg ];
						
						if( cArgPC )
							testFuncArgs[1] = cArgPC;
						else
							testFuncArgs[1] = persistCache[ cArg ] = new RegExp( cArg );	
					}
					testFunc = testFuncScope[ testFuncKey ];
					persistCache[ aTest ] = [ testFuncKey, testFuncScope ].concat( testFuncArgs );	
				}				
				
				isTypeTest = /:(\w|-)+type/i.test( aTest);
				isCountTest = /^:(nth[^-]|eq|gt|lt|first|last)/i.test( aTest );					
				if( isCountTest ) testFuncArgs[ 3 ] = totalCount;	
				
				// Now run the test on each element (keep only those that pass)								
				var cLength = context.length, cCount = cLength -1;
				while( cCount > -1 ){
					e = context[ cCount-- ];
					if( first )
						e.peppyCount = cCount + 1;
					var pass = true;
					testFuncArgs[ 0 ] = e;
					
					if( isCountTest ) 
						testFuncArgs[2] = e.peppyCount;
	
					if( !testFunc.apply( testFuncScope, testFuncArgs ) )
						pass = false;
					
					if( pass )
						passed.push(e);
				}
				context = passed;
				first = false;
			}
			return passed;
		},
		
		simpleSelector: {
			
			attribute: {
				"null": function( e, a, v ){ return !!getAttribute(e,a); },
				"=": function( e, a, v ){ return getAttribute(e,a) == v; },
				"~": function( e, a, v ){ return getAttribute(e,a).match(new RegExp('\\b'+v+'\\b')) },
				"^": function( e, a, v ){ return getAttribute(e,a).indexOf( v ) === 0; },
				"$": function( e, a, v ){ var attr = getAttribute(e,a); return attr.lastIndexOf( v ) === attr.length - v.length; },
				"*": function( e, a, v ){ return getAttribute(e,a).indexOf( v ) != -1; },
				"|": function( e, a, v ){ return getAttribute(e,a).match( '^'+v+'-?(('+v+'-)*('+v+'$))*' ); },
				"!": function( e, a, v ){ return getAttribute(e,a) !== v; }
			},
			
			pseudos: {
				":root": function( e ){ return e === doc.getElementsByTagName( "html" )[0]; },
				":nth-child": function( e, n, a, b, t ){	
					if( !e.nodeIndex ){
						var node = e.parentNode.firstChild, count = 0, last;
						for( ; node; node = node.nextSibling )
							if( node.nodeType == 1 ){
								last = node;								
								node.nodeIndex = ++count;
							}
						last.IsLastNode = true;
						if( count == 1 ) last.IsOnlyChild = true;
					}
					var position = e.nodeIndex;
					if( n == "first" ) 
						return position == 1;
					if( n == "last" )
						return !!e.IsLastNode;
					if( n == "only" )
						return !!e.IsOnlyChild;
					return (!a && !b && position == n) || 
						   ((a == 0 ? position == b : 
									  a > 0 ? position >= b && (position - b) % a == 0 :
											  position <= b && (position + b) % a == 0));
				},				
				":nth-last-child": function( e, n ){ return this[ ":nth-child" ]( e, n, a, b ); },  // TODO: n is not right.
				":nth-of-type": function( e, n, t ){ return this[ ":nth-child" ]( e, n, a, b, t); },
				":nth-last-of-type": function( e, n, t ){ return this[ ":nth-child" ](e, n, a, b, t ); }, // TODO: n is not right.
				":first-child": function( e ){ return this[ ":nth-child" ]( e, "first" ); },
				":last-child": function( e ){ return this[ ":nth-child" ]( e, "last" ); },
				":first-of-type": function( e, n, t ){ return this[ ":nth-child" ]( e, "first", null, null, t ); },
				":last-of-type": function( e, n, t ){ return this[ ":nth-child" ]( e, "last", null, null, t ); },
				":only-child": function( e ){ return this[ ":nth-child" ]( e, "only" ); },
				":only-of-type": function( e, n, t ){ return this[ ":nth-child" ]( e, "only", null, null, t ); },
				":empty": function( e ) { 
					for( var node = e.firstChild, count = 0; node !== null; node = node.nextSibling )
						if( node.nodeType === 1 || node.nodeType === 3 ) return false;
					return true;
				},
				":not": function( e, s ){ return css3.query( s, e, true, true, true ).length === 0; },
				":has": function( e, s ){ return css3.query( s, e, true, true, true ).length > 0; },
				":selected": function( e ){ return e.selected; },
				":hidden": function( e ){ return e.type === "hidden" || e.style.display === "none"; },
				":visible": function( e ){ return e.type !== "hidden" && e.style.display !== "none"; },
				":input": function( e ){ return e.nodeName.search( /input|select|textarea|button/i ) !== -1; },
				":radio": function( e ){ return e.type === "radio"; },
				":checkbox": function( e ){ return e.type === "checkbox"; },
				":text": function( e ){ return e.type === "text"; },
				":header": function( e ){ return e.nodeName.search( /h\d/i ) !== -1; },
				":enabled": function( e ){ return !e.disabled && e.type !== "hidden"; },
				":disabled": function( e ){ return e.disabled; },
				":checked": function( e ){ return e.checked; },
				":contains": function( e, s ){ return s.test( (e.textContent || e.innerText || "") ); },
				":parent": function( e ){ return !!e.firstChild; },
				":odd": function( e ){ return this[ ":nth-child" ]( e, "2n+2", 2, 2 ); },
				":even": function( e ){ return this[ ":nth-child" ]( e, "2n+1", 2, 1 ); },
				":nth": function( e, s, i ){ return s == i; },
				":eq": function( e, s, i ){ return s == i; },
				":gt": function( e, s, i ){ return i > s; },
				":lt": function( e, s, i ){ return i < s; },
				":first": function( e, s, i ){ return i == 0 },
				":last": function( e, s, i, end ){ return i == end; }
			},
			
			combinator: {
				"": function( r, u, f, s ){
					var rUID = r.uid;
					while( (r = r.parentNode) !== null && !f[ r.uid ])
					{
						if( !!u[ r.uid ] || !!s[ r.uid ] )
							return (s[ rUID ] = true);
					}
					return (f[ rUID ] = false);
				},
				">": function( r, u, f, s ){
					return r.parentNode && u[ r.parentNode.uid ] ;
				},
				"+": function( r, u, f, s ){
					while( (r = r.previousSibling) !== null && !f[ r.uid ] ){
						if( r.nodeType === 1 )
							return r.uid in u;
					}
					return false;
				},
				"~": function( r, u, f, s ){
					var rUID = r.uid;
					while( (r = r.previousSibling) !== null && !f[ r.uid ] ) {
						if( !!u[ r.uid ] || !!s[ r.uid ] )
							return (s[ rUID ] = true);
					}
					return (f[ rUID ] = false);
				}
			}
		}
	};
	
})();