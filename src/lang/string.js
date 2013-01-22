//===========================================
//  字符串     
//===========================================

,
		  	
/**
		 * 将字符串限定在指定长度内，超出部分用 ... 代替。
		 * @param {String} value 要处理的字符串。
		 * @param {Number} length 需要的最大长度。
		 * @example 
		 * <pre>
	     * String.ellipsis("1234567", 6); //   "123..."
	     * String.ellipsis("1234567", 9); //   "1234567"
	     * </pre>
		 */
ellipsis: function(value, length) {
	assert.isString(value, "String.ellipsis(value, length): 参数  {value} ~");
	assert.isNumber(length, "String.ellipsis(value, length): 参数  {length} ~");
	return value.length > length ? value.substr(0, length - 3) + "..." : value;
}

/**
 * @class String
 */
String.implementIf({
	
	/**
	 * 字符串正则测试。
	 * @param {RegExp,params}RegExp:正则，params：i,g,m匹配方式。
	 * @return {String} 返回是否匹配结果 true or false。
	 */
	test: function(regex, params){
		return ((typeOf(regex) == 'regexp') ? regex : new RegExp('' + regex, params)).test(this);
	},

	clean: function(){
		return this.replace(/\s+/g, ' ').trim();
	},
	
	/**
	 * 去除字符串左边空格。
	 * @param none。
	 * @return {String} 格式化后的字符串。
	 */
	trimLeft:function(){
		return this.replace(/^\s+/,'');
	},
	
	/**
	 * 去除字符串右边空格。
	 * @param none。
	 * @return {String} 格式化后的字符串。
	 */
	trimRight:function(){
		return this.replace(/\s+$/,'')
	},

	/**
	 * 字符串是否以某个特定字符串开头。
	 * @param {String}开头的字符串。
	 * @return {String} 返回是否匹配结果 true or false。
	 */
	startWith:function(str){
		return this.substr(0,value.length) == value;
	},
	
	/**
	 * 字符串是否以某个特定字符串结尾。
	 * @param {String}结尾的字符串。
	 * @return {String} 返回是否匹配结果 true or false。
	 */
	endWith:function(str){
		return this.substr(this.length - value.length) == value;
	},
	
	/**
	 * 字符串是否包含某个特定字符串。
	 * @param {String}要包含的字符串。
	 * @return {String} 返回是否匹配结果 true or false。
	 */
	contains:function(str,separator){
		return (separator?(separator+this+separator):this).indexOf(str)>-1;
	},
	
	///	<summary>
	/// 获得长度,中文算2个字符。
	/// </summary>
	///	<returns type="Number" >长度值</returns>
	/// <examples>"中文".wLength();  //  4</examples>
	wLength : function(){
		
		var arr=this.match(/[^\x00-\xff]/ig);
		
		return this.length + (arr==null ? 0 : arr.length);
	},
	
	/**
	 * 将字符串中的重复单词去掉。
	 * @param {}。
	 * @return {String} 返回重复单词去掉后的字符串。
	 */
	unique:function(){
		return this.replace(/(^|\s)(\S+)(?=\s(?:\S+\s)*\2(?:\s|$))/g,'');
	},
	times:function(n){
		return new Array(n+1).join(this);
	} ,
	
	/**
	 * 首字母小写。
	 */
	uncapitalize: function(){
		
	},
	
	left : function(length) {
        ///<summary>获取字符串左边 length 长度的子字符串。语法：left(length)</summary>
        ///<param name="length" type="int">要获取的子字符串长度。</param>
        ///<returns type="string">返回字符串左边 length 长度的子字符串。</returns>
            return this.substr(0, length);
        },

	
	/**
	 * @param 
	 */
    right : function(length) {
        ///<summary>获取字符串右边 length 长度的子字符串。语法：right(length)</summary>
        ///<param name="length" type="int">要获取的子字符串长度。</param>
        ///<returns type="string">返回字符串右边 length 长度的子字符串。</returns>
            return this.substr(this.length - length, length);
        },
		
		
	/// <summary>
	/// 对齐
	/// </summary>
	///	<param name="length" type="Number" > 长度 </param>
	///	<param name="sub" type="String" > 填补空白的字符 </param>
	///	<returns type="String" > 字符串 </returns>
	padLeft : function(totalWidth, chr) {
        ///<summary>向字符串左端追加一定数量的字符并返回。语法：padLeft(totalWidth, chr)</summary>
        ///<param name="totalWidth" type="int">追加字符后要达到的总长度。</param>
        ///<param name="chr" type="char">要追加的字符。</param>
        ///<returns type="string">返回追加字符后的字符串。</returns>
        var str = "";
        for (var i = 0; i < totalWidth - this.length; i++) {
            str += chr;
        }

        return str + this;
    },


    padRight : function(totalWidth, chr) {
        ///<summary>向字符串右端追加一定数量的字符并返回。语法：padRight(totalWidth, chr)</summary>
        ///<param name="totalWidth" type="int">追加字符后要达到的总长度。</param>
        ///<param name="chr" type="char">要追加的字符。</param>
        ///<returns type="string">返回追加字符后的字符串。</returns>
        var str = "";
        for (var i = 0; i < totalWidth - this.length; i++) {
            str += chr;
        }

        return this + str;
    }
	
	
});


Object.extend(String, {
	
	quote:function(str){
		var  metaObject = {
                    '\b': '\\b',
                    '\t': '\\t',
                    '\n': '\\n',
                    '\f': '\\f',
                    '\r': '\\r',
                    '\\': '\\\\'
                },
		str = this.replace(/[\x00-\x1f\\]/g, function (chr) {
                            var special = metaObject[chr];
                            return special ? special : '\\u' + ('0000' + chr.charCodeAt(0).toString(16)).slice(-4)
                        });
        return '"' + str.replace(/"/g, '\\"') + '"';
	},
	
	encodeJs : function (str) {
		
		// TODO  效率不高
		
	    return this.replace(/\\/g,"\\\\").replace(/\"/g,"\\\"").replace(/\'/,"\\'");
	},
	
    /**
     * Convert certain characters (&, <, >, and ') to their HTML character equivalents for literal display in web pages.
     * @param {String} value The string to encode
     * @return {String} The encoded text
     * @method
     */
    encodeHtml: (function() {
        var entities = {
            '&': '&amp;',
            '>': '&gt;',
            '<': '&lt;',
            '"': '&quot;'
        }, keys = [], p, regex;
        
        for (p in entities) {
            keys.push(p);
        }
        
        regex = new RegExp('(' + keys.join('|') + ')', 'g');
        
        return function(value) {
            return (!value) ? value : String(value).replace(regex, function(match, capture) {
                return entities[capture];    
            });
        };
    })(),

    /**
     * Convert certain characters (&, <, >, and ') from their HTML character equivalents.
     * @param {String} value The string to decode
     * @return {String} The decoded text
     * @method
     */
    decodeHtml: (function() {
        var entities = {
            '&amp;': '&',
            '&gt;': '>',
            '&lt;': '<',
            '&quot;': '"'
        }, keys = [], p, regex;
        
        for (p in entities) {
            keys.push(p);
        }
        
        regex = new RegExp('(' + keys.join('|') + '|&#[0-9]{1,5};' + ')', 'g');
        
        return function(value) {
            return (!value) ? value : String(value).replace(regex, function(match, capture) {
                if (capture in entities) {
                    return entities[capture];
                } else {
                    return String.fromCharCode(parseInt(capture.substr(2), 10));
                }
            });
        };
    })(),

    /**
     * Appends content to the query string of a URL, handling logic for whether to place
     * a question mark or ampersand.
     * @param {String} url The URL to append to.
     * @param {String} string The content to append to the URL.
     * @return (String) The resulting URL
     */
    urlAppend : function(url, string) {
        if (!Ext.isEmpty(string)) {
            return url + (url.indexOf('?') === -1 ? '?' : '&') + string;
        }

        return url;
    },
	
	/**
	 * 将字符串转为指定长度。超出部分用 ... 表示， 这个函数分割单词。
	 */
	ellipsisByWord: function(str, len){
		if (str.length > len) {
			var p = value.indexOf(' ', len);
			if (p !== -1 && p - len > 15) len = p;
			
			str = str.substr(0, len) + '...';
		}
          
		return str;
	},
	
	removeHtml : function(str) {
        ///<summary>去除字符串中的 HTML 标签并返回。语法：removeHtml()</summary>
        ///<returns type="string">返回去除了 HTML 标签的字符串。</returns>
        return str.replace(/<(.|\n)+?>/g, "");
    },
	
	removeRepeats: function (value) {
		return value.replace(/(\w)(?=.*\1)/g, "");
	},

    /**
     * Utility function that allows you to easily switch a string between two alternating values.  The passed value
     * is compared to the current string, and if they are equal, the other value that was passed in is returned.  If
     * they are already different, the first value passed in is returned.  Note that this method returns the new value
     * but does not change the current string.
     * <pre><code>
    // alternate sort directions
    sort = Ext.String.toggle(sort, 'ASC', 'DESC');

    // instead of conditional logic:
    sort = (sort == 'ASC' ? 'DESC' : 'ASC');
       </code></pre>
     * @param {String} string The current string
     * @param {String} value The value to compare to the current string
     * @param {String} other The new value to use if the string already equals the first value passed in
     * @return {String} The new value
     */
    toggle: function(string, value, other) {
        return string === value ? other : value;
    },
    
	/**
	 * 使  HTML 代码更标准，比如添加注释。
	 */
	toXHTML: function (value) {
		return value.replace(/( [^\=]*\=)(\s?[^\"\s\>]*)/ig,function(a,b,c,d,e){return (c)?(new RegExp("<[^>]*"+c.replace(/(\^|\(|\)|\[|\]|\{|\}|\?|\-|\\|\/|\||\$)/g,'\\$1')+"[^>]*>","i").test(e))?b+'"'+c+'"':b+c:b});
	},
	
	compare: function (a, b) {
 if(a.length==b.length) return a.split("").sort().join("")==b.split("").sort().join("");
    a = a.split("").sort().join("").replace(/(.)\1+/g,"$1");
    b = b.split("").sort().join("").replace(/(.)\1+/g,"$1");
    var arr = a.split("");
    var re = new RegExp(arr.join("|"),"g");
    return (b.length - b.replace(re,"").length == a.length || b.replace(re,"").length==0)
	},
	
	stripScripts:  function(exec){
		var scripts = '';
		var text = this.replace(/<script[^>]*>([\s\S]*?)<\/script>/gi, function(all, code){
			scripts += code + '\n';
			return '';
		});
		if (exec === true) Browser.exec(scripts);
		else if (typeOf(exec) == 'function') exec(scripts, text);
		return text;
	}
	
	
});

