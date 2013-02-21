


//#include core/base.js

/**
 * 提供解析 JSON 的函数。
 */
var JSON = JSON || {};
	
Object.extend(JSON, {
	
	specialChars: {'\b': '\\b', '\t': '\\t', '\n': '\\n', '\f': '\\f', '\r': '\\r', '"' : '\\"', '\\': '\\\\'},

	replaceChars: function(chr){
		return JSON.specialChars[chr] || '\\u00' + Math.floor(chr.charCodeAt() / 16).toString(16) + (chr.charCodeAt() % 16).toString(16);
	},

	encode: function(obj){
		switch (typeof obj){
			case 'string':
				return '"' + obj.replace(/[\x00-\x1f\\"]/g, JSON.replaceChars) + '"';
			case 'object':
				if (obj) {
					if (Array.isArray(obj)) {
						return '[' + String(Object.map(obj, JSON.encode, [])) + ']';
					}
					var s = [];
					for (var key in obj) {
						s.push(JSON.encode(key) + ':' + JSON.encode(obj[key]));
					}
					return '{' + s + '}';
				}
			default:
				return String(obj);
		}
	},

	decode: function(string){
		if (typeof string != 'string' || !string.length) return null;
		
		// 摘自 json2.js
		if (/^[\],:{}\s]*$/
                    .test(string.replace(/\\(?:["\\\/bfnrt]|u[\da-fA-F]{4})/g, '@')
                        .replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']')
                        .replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {

        	return new Function('return ' + string)();
        	
        }
        
        throw new SyntaxError('JSON.parse: unexpected character\n' + value);
	}

});

Object.extendIf(JSON, {
	stringify: JSON.encode,
	parse: JSON.decode
});


