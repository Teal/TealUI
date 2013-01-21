// These functions are taken with permission from
// http://www.JSON.org and http://www.crockford.com/
// and are written by Douglas Crockford <douglas@crockford.com>
// These functions are used to create a text string
// from an object in way that JavaScript can recreate
// the data structure (aka the object) in a native format

function stringify(arg) {
	var i, o, v;
	switch (typeof arg) {
	case 'object':
		if (arg) {
			if (arg.constructor == Array) {
				o = '[';
				for (i = 0; i < arg.length; ++i) {
					v = stringify(arg[i]);
					if (v != 'function' && !isUndefined(v)) {
						o += (o != '[' ? ',\r\n' : '') + v;
					} else {
						o += ',\r\n';
					}
				}
				return o + ']';
			} else if (typeof arg.toString != 'undefined') {
				o = '{';
				for (i in arg) {
					v = stringify(arg[i]);
					if (v != 'function' && !isUndefined(v)) {
						o += (o != '{' ? ',\r\n' : '') +
							i.quote() + ':' + v + '';
					}
				}
				return o + '};\r\n';
			} else {
				return;
			}
		}
		return 'null';
	case 'unknown':
	case 'undefined':
		return;
	case 'string':
		return arg.quote();
	case 'function':
		return 'function';
	default:
		return String(arg);
	}
}
function isUndefined(a) {
	return typeof a == 'undefined';
}
Function.prototype.method = function (name, func) {
	this.prototype[name] = func;
	return this;
};


// Adds/modifies toSource method to ALL objects
// that calls the stringify passing itself as
// as the paramameter
Object.prototype.toSource = function () {return stringify(this);};

// Modified by AMH, added escaping of non-printable characters
// specifically \r, \n, \t
// also added escaping of all quotes,
// and changed the quote used by the function from " to '
// and added carriage returns and linefeeds to make the string version of the object more easily human readable
String.method('quote', function () {var aa = this; aa = aa.replace(/(['"\\])/g, '\\$1');aa = aa.replace(/\t/g,'\\t');aa = aa.replace(/\u000a/g,'\\n');aa = aa.replace(/\r/g,'\\r');return '\'' + aa + '\'';});