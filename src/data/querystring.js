/**
 * @author 
 */


using("System.Ajax.Base");


var QueryString = QueryString || {};


QueryString.parse = function (value) {
	var r = {};
	if (value) {
		if (value.charAt(0) == '?') value = value.substr(1);
		value.split('&').each(function(value, key) {
			value = value.split('=');
			key = decodeURIComponent(value[0]);
			try {
				r[key] = decodeURIComponent(value[1]);
			} catch (e) {
				r[key] = value[1];
			}
		});
	}


	return r;
};

/**
 * <p>Converts an arbitrary value to a Query String representation.</p>
 *
 * <p>Objects with cyclical references will trigger an exception.</p>
 *
 * @method stringify
 * @param obj {Variant} any arbitrary value to convert to query string
 * @param sep {String} (optional) Character that should join param k=v pairs together. Default: "&"
 * @param eq  {String} (optional) Character that should join keys to their values. Default: "="
 * @param name {String} (optional) Name of the current key, for handling children recursively.
 * @static
 */
QueryString.stringify = Ajax.param;


//function (obj, name, stack) {
//	switch (typeof obj) {
//		case 'object':
//			if (obj) {
//				stack = stack || [];
//				if(stack.indexOf(obj) >= 0) {
//					throw new Error("QueryString.stringify. Cyclical reference");
//				}
//				if (Array.isArray(obj)) {
//					var s = [];
//					name = name + '[]';
//					for (var i = 0, l = obj.length; i < l; i++) {
//						s.push(QueryString.stringify(obj[i], name, sep, eq));
//					}
//					return s.join(sep);
//				}

//				var s = [];
//				var begin = name ? name + '[' : '';
//				var end = name ? ']' : '';
//				for (var i in obj) if (obj.hasOwnProperty(i)) {
//					var n = begin + i + end;
//					s.push(QueryString.stringify(obj[i], sep, eq, n));
//				}


//				s = s.join(sep);
//				if (!s && name) return name + "=";
//				return s;
//			}
//		default:
//			return encodeURIComponent(name) + "=" + encodeURIComponent(obj);


//	}
//};







