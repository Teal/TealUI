//===========================================
//  对象扩展     
//===========================================
/** * @author  */Object.map("Array Date RegExp", function (nativeType) {
    window[nativeType].prototype.xtype = nativeType.toLowerCase();
});/** * 返回一个变量的类型的字符串形式。 * @param {Object} obj 变量。 * @return {String} 所有可以返回的字符串： string number boolean undefined null *         array function element class date regexp object。 * @example <code>  * Object.type(null); // "null" * Object.type(); // "undefined" * Object.type(new Function); // "function" * Object.type(+'a'); // "number" * Object.type(/a/); // "regexp" * Object.type([]); // "array" * </code> */Object.type = function (obj) {    // 获得类型 。    var typeName = typeof obj;    return typeName === "object" ?		obj === null ?					"null" :					obj.xtype || (						typeof obj.nodeType === "number" ? "node" :						typeName					)		: typeName;
}/**
 * @author  xuld
 */

/**
 * 一次性为一个对象设置属性。
 * @param {Object} obj 目标对象。将对这个对象设置属性。
 * @param {Object} options 要设置的属性列表。 函数会自动分析 *obj*, 以确认一个属性的设置方式。
 * 比如设置 obj 的 key 属性为 值 value 时，系统会依次检测:
 *
 * - 尝试调用 obj.setKey(value)。
 * - 尝试调用 obj.key(value)
 * - 尝试调用 obj.key.set(value)
 * - 尝试调用 obj.set(key, value)
 * - 最后调用 obj.key = value
 *
 * @example <pre>
 * var target = {
 *
 * 		setA: function (value) {
 * 			assert.log("1");
 * 			trace("设置 a =  ", value);
 *		},
 *
 * 		b: function (value) {
 * 			trace(value);
 *		}
 *
 * };
 *
 * Object.set(target, {a: 8, b: 6, c: 4});
 *
 * </pre>
 */
Object.set = function (obj, options) {

    assert.notNull(obj, "Object.set(obj, options): {obj} ~");

    var key, value, setter;

    for (key in options) {

        value = options[key],
			    setter = 'set' + key.capitalize();

        // obj.setKey(value)
        if (Object.isFunction(obj[setter]))
            obj[setter](value);

        else if (key in obj) {

            setter = obj[key];

            // obj.key(value)
            if (Object.isFunction(setter))
                obj[key](value);

                // obj.key.set(value)
            else if (setter && setter.set)
                setter.set(value);

                // obj.key = value
            else
                obj[key] = value;

            // obj.set(key, value)
        } else if (obj.set)
            obj.set(key, value);

            // obj.key = value
        else
            obj[key] = value;

    }

    return obj;

};

Object.extend(Object, {

    /**
     * 判断一个变量是否是函数。
     * @param {Object} obj 要判断的变量。
     * @return {Boolean} 如果是函数，返回 true， 否则返回 false。
     * @example
     * <pre>
     * Object.isFunction(function () {}); // true
     * Object.isFunction(null); // false
     * Object.isFunction(new Function); // true
     * </pre>
     */
    isFunction: function (obj) {
        return toString.call(obj) === "[object Function]";
    },

    /**
     * 判断一个变量是否是引用变量。
     * @param {Object} obj 变量。
     * @return {Boolean} 如果 *obj* 是引用变量，则返回 **true**, 否则返回 **false** 。
     * @remark 此函数等效于 `obj !== null && typeof obj === "object"`
     * @example
     * <pre>
     * Object.isObject({}); // true
     * Object.isObject(null); // false
     * </pre>
     */
    isObject: function (obj) {
        // 只检查 null 。
        return obj !== null && typeof obj === "object";
    },

	/**
	 * Get the number of objects in the map
	 *
	 * @param map {Object} the map
	 * @return {Integer} number of objects in the map
	 */
	getLength: ({}).__count__ == 0 ? function(map) {
		return map.__count__;
	}
 : function(map) {
		var length = 0;
		
		for (var key in map) {
			length++;
		}
		
		return length;
	},
	
	/**
	 * 判断一个对象是否空。
	 * @param {Object} object 所有变量，但不允许函数。
	 * @return {Boolean} 除了null, undefined, 空字符数组,其它变量认为不空。
	 */
	isEmpty: function(object) {
	
		assert(!Object.isFunction(object), "Object.isEmpty 不允许函数");
		
		//if (object == null) return true;
		
		//if (typeof object == "object" && !Array.isArray(object)) for (var name in obj) return false;
		
		return object == null || object.length === 0;
	},

	value: function(path, root) {
				
		assert(path, "Object.value(path, root): 参数 path 不能为空。");
		
		// 依次遍历。
		for (var obj = root || w, i = 0, t, n = path.split ? path.split('.') : path; t = n[i]; ++i) {
			
			// 如果对象空。
			if (obj[t] == undefined) {
					
				// 创建空对象，用于下次继续循环。
				obj[t] = {};
			}
			
			// 进行第二次循环。
			obj = obj[t];
		}

		return obj;
	},


    /**
     * Takes an object and converts it to an encoded query string

- Non-recursive:

    Ext.Object.toQueryString({foo: 1, bar: 2}); // returns "foo=1&bar=2"
    Ext.Object.toQueryString({foo: null, bar: 2}); // returns "foo=&bar=2"
    Ext.Object.toQueryString({'some price': '$300'}); // returns "some%20price=%24300"
    Ext.Object.toQueryString({date: new Date(2011, 0, 1)}); // returns "date=%222011-01-01T00%3A00%3A00%22"
    Ext.Object.toQueryString({colors: ['red', 'green', 'blue']}); // returns "colors=red&colors=green&colors=blue"

- Recursive:

    Ext.Object.toQueryString({
        username: 'Jacky',
        dateOfBirth: {
            day: 1,
            month: 2,
            year: 1911
        },
        hobbies: ['coding', 'eating', 'sleeping', ['nested', 'stuff']]
    }, true); // returns the following string (broken down and url-decoded for ease of reading purpose):
              // username=Jacky
              //    &dateOfBirth[day]=1&dateOfBirth[month]=2&dateOfBirth[year]=1911
              //    &hobbies[0]=coding&hobbies[1]=eating&hobbies[2]=sleeping&hobbies[3][0]=nested&hobbies[3][1]=stuff

     *
     * @param {Object} object The object to encode
     * @param {Boolean} recursive (optional) Whether or not to interpret the object in recursive format.
     * (PHP / Ruby on Rails servers and similar). Defaults to false
     * @return {String} queryString
     * @markdown
     */
    toQueryString: function(object, recursive) {
        var paramObjects = [],
            params = [],
            i, j, ln, paramObject, value;

        for (i in object) {
            if (object.hasOwnProperty(i)) {
                paramObjects = paramObjects.concat(ExtObject.toQueryObjects(i, object[i], recursive));
            }
        }

        for (j = 0, ln = paramObjects.length; j < ln; j++) {
            paramObject = paramObjects[j];
            value = paramObject.value;

            if (Ext.isEmpty(value)) {
                value = '';
            }
            else if (Ext.isDate(value)) {
                value = Ext.Date.toString(value);
            }

            params.push(encodeURIComponent(paramObject.name) + '=' + encodeURIComponent(String(value)));
        }

        return params.join('&');
    },

    /**
     * Converts a query string back into an object.
     *
- Non-recursive:

    Ext.Object.fromQueryString(foo=1&bar=2); // returns {foo: 1, bar: 2}
    Ext.Object.fromQueryString(foo=&bar=2); // returns {foo: null, bar: 2}
    Ext.Object.fromQueryString(some%20price=%24300); // returns {'some price': '$300'}
    Ext.Object.fromQueryString(colors=red&colors=green&colors=blue); // returns {colors: ['red', 'green', 'blue']}

- Recursive:

    Ext.Object.fromQueryString("username=Jacky&dateOfBirth[day]=1&dateOfBirth[month]=2&dateOfBirth[year]=1911&hobbies[0]=coding&hobbies[1]=eating&hobbies[2]=sleeping&hobbies[3][0]=nested&hobbies[3][1]=stuff", true);

    // returns
    {
        username: 'Jacky',
        dateOfBirth: {
            day: '1',
            month: '2',
            year: '1911'
        },
        hobbies: ['coding', 'eating', 'sleeping', ['nested', 'stuff']]
    }

     * @param {String} queryString The query string to decode
     * @param {Boolean} recursive (Optional) Whether or not to recursively decode the string. This format is supported by
     * PHP / Ruby on Rails servers and similar. Defaults to false
     * @return {Object}
     */
    fromQueryString: function(queryString, recursive) {
        var parts = queryString.replace(/^\?/, '').split('&'),
            object = {},
            temp, components, name, value, i, ln,
            part, j, subLn, matchedKeys, matchedName,
            keys, key, nextKey;

        for (i = 0, ln = parts.length; i < ln; i++) {
            part = parts[i];

            if (part.length > 0) {
                components = part.split('=');
                name = decodeURIComponent(components[0]);
                value = (components[1] !== undefined) ? decodeURIComponent(components[1]) : '';

                if (!recursive) {
                    if (object.hasOwnProperty(name)) {
                        if (!Ext.isArray(object[name])) {
                            object[name] = [object[name]];
                        }

                        object[name].push(value);
                    }
                    else {
                        object[name] = value;
                    }
                }
                else {
                    matchedKeys = name.match(/(\[):?([^\]]*)\]/g);
                    matchedName = name.match(/^([^\[]+)/);

                    //<debug error>
                    if (!matchedName) {
                        Ext.Error.raise({
                            sourceClass: "Ext.Object",
                            sourceMethod: "fromQueryString",
                            queryString: queryString,
                            recursive: recursive,
                            msg: 'Malformed query string given, failed parsing name from "' + part + '"'
                        });
                    }
                    //</debug>

                    name = matchedName[0];
                    keys = [];

                    if (matchedKeys === null) {
                        object[name] = value;
                        continue;
                    }

                    for (j = 0, subLn = matchedKeys.length; j < subLn; j++) {
                        key = matchedKeys[j];
                        key = (key.length === 2) ? '' : key.substring(1, key.length - 1);
                        keys.push(key);
                    }

                    keys.unshift(name);

                    temp = object;

                    for (j = 0, subLn = keys.length; j < subLn; j++) {
                        key = keys[j];

                        if (j === subLn - 1) {
                            if (Ext.isArray(temp) && key === '') {
                                temp.push(value);
                            }
                            else {
                                temp[key] = value;
                            }
                        }
                        else {
                            if (temp[key] === undefined || typeof temp[key] === 'string') {
                                nextKey = keys[j+1];

                                temp[key] = (Ext.isNumeric(nextKey) || nextKey === '') ? [] : {};
                            }

                            temp = temp[key];
                        }
                    }
                }
            }
        }

        return object;
    },


    /**
     * Merges any number of objects recursively without referencing them or their children.

    var extjs = {
        companyName: 'Ext JS',
        products: ['Ext JS', 'Ext GWT', 'Ext Designer'],
        isSuperCool: true
        office: {
            size: 2000,
            location: 'Palo Alto',
            isFun: true
        }
    };

    var newStuff = {
        companyName: 'Sencha Inc.',
        products: ['Ext JS', 'Ext GWT', 'Ext Designer', 'Sencha Touch', 'Sencha Animator'],
        office: {
            size: 40000,
            location: 'Redwood City'
        }
    };

    var sencha = Ext.Object.merge(extjs, newStuff);

    // extjs and sencha then equals to
    {
        companyName: 'Sencha Inc.',
        products: ['Ext JS', 'Ext GWT', 'Ext Designer', 'Sencha Touch', 'Sencha Animator'],
        isSuperCool: true
        office: {
            size: 30000,
            location: 'Redwood City'
            isFun: true
        }
    }

     * @param {Object} object,...
     * @return {Object} merged The object that is created as a result of merging all the objects passed in.
     * @markdown
     */
    merge: function(source, key, value) {
        if (typeof key === 'string') {
            if (value && value.constructor === Object) {
                if (source[key] && source[key].constructor === Object) {
                    ExtObject.merge(source[key], value);
                }
                else {
                    source[key] = Ext.clone(value);
                }
            }
            else {
                source[key] = value;
            }

            return source;
        }

        var i = 1,
            ln = arguments.length,
            object, property;

        for (; i < ln; i++) {
            object = arguments[i];

            for (property in object) {
                if (object.hasOwnProperty(property)) {
                    ExtObject.merge(source, property, object[property]);
                }
            }
        }

        return source;
    },


    /**
     * Returns the first matching key corresponding to the given value.
     * If no matching value is found, null is returned.

    var person = {
        name: 'Jacky',
        loves: 'food'
    };

    alert(Ext.Object.getKey(sencha, 'loves')); // alerts 'food'

     * @param {Object} object
     * @param {Object} value The value to find
     * @markdown
     */
    getKey: function(object, value) {
        for (var property in object) {
            if (object.hasOwnProperty(property) && object[property] === value) {
                return property;
            }
        }

        return null;
    },
	
	
    /**
     * Gets all values of the given object as an array.

    var values = Ext.Object.getValues({
        name: 'Jacky',
        loves: 'food'
    }); // ['Jacky', 'food']

     * @param {Object} object
     * @return {Array} An array of values from the object
     * @markdown
     */
    getValues: function(object) {
        var values = [],
            property;

        for (property in object) {
            if (object.hasOwnProperty(property)) {
                values.push(object[property]);
            }
        }

        return values;
    },
	

    /**
     * Gets all keys of the given object as an array.

    var values = Ext.Object.getKeys({
        name: 'Jacky',
        loves: 'food'
    }); // ['name', 'loves']

     * @param {Object} object
     * @return {Array} An array of keys from the object
     * @method
     */
    getKeys: ('keys' in Object.prototype) ? Object.keys : function(object) {
        var keys = [],
            property;

        for (property in object) {
            if (object.hasOwnProperty(property)) {
                keys.push(property);
            }
        }

        return keys;
    },
	
	subset: function(object, keys){
		var results = {};
		for (var i = 0, l = keys.length; i < l; i++){
			var k = keys[i];
			if (k in object) results[k] = object[k];
		}
		return results;
	},

	map: function(object, fn, bind){
		var results = {};
		for (var key in object){
			if (hasOwnProperty.call(object, key)) results[key] = fn.call(bind, object[key], key, object);
		}
		return results;
	},

	filter: function(object, fn, bind){
		var results = {};
		for (var key in object){
			var value = object[key];
			if (hasOwnProperty.call(object, key) && fn.call(bind, value, key, object)) results[key] = value;
		}
		return results;
	},

	every: function(object, fn, bind){
		for (var key in object){
			if (hasOwnProperty.call(object, key) && !fn.call(bind, object[key], key)) return false;
		}
		return true;
	},

	some: function(object, fn, bind){
		for (var key in object){
			if (hasOwnProperty.call(object, key) && fn.call(bind, object[key], key)) return true;
		}
		return false;
	},
	//获取第一个不为undefined的值
	pick : function(){ 
		for (var i = 0, l = arguments.length; i < l; i++){
			if (arguments[i] != undefined) return arguments[i];
		}
		return null;
	},
	
	include: function(key, value){
		var found = false;
		this.each(function(value){
			if (value == object) {
				found = true;
				throw $break;
			}
		});
		return found;
	},
	
	removeAt: function(index){
		
	},

	contains: function(object, value){
		return Object.keyOf(object, value) != null;
	}
}); 