/**
 * @author aki
 */

//#include text/base.js

Object.extend(Text, {
	
	/**
	 * 测试字符串是否为邮箱格式.
	 * @param {String} value
	 * @return {Boolean}
	 */
	isEmail: function (value) {
        return /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/.test(value);
    },
	
	/**
	 * 判断一个值是否为整数。
	 * @param {Object} value
	 */
	isInteger:function(value){
	    return /^[-]?\d+$/.test(value);
	},
	
	isDate: function (value){
   		var result=str.match(/^(\d{4})(-|\/)(\d{1,2})\2(\d{1,2})$/);
   		if(result==null) return false;
   		var d=new Date(result[1], result[3]-1, result[4]);
   		return (d.getFullYear()==result[1] && d.getMonth()+1==result[3] && d.getDate()==result[4]);
	},
	
	isLetterOrDight: function (str){
		var result=str.match(/^[a-zA-Z0-9]+$/);
		if(result==null) return false;
		return true;
	},
	
	isUrl: function(){
		var strRegex = "/^((https|http|ftp|rtsp|mms)?://)" 
			+ "?(([0-9a-z_!~*'().&=+$%-]+: )?[0-9a-z_!~*'().&=+$%-]+@)?"
			+ "(([0-9]{1,3}.){3}[0-9]{1,3}"  
			+ "|" 
			+ "([0-9a-z_!~*'()-]+.)*" 
			+ "([0-9a-z][0-9a-z-]{0,61})?[0-9a-z]." 
			+ "[a-z]{2,6})" 
			+ "(:[0-9]{1,4})?" 
			+ "((/?)|" 
			+ "(/[0-9a-z_!~*'().;?:@&=+$,%#-]+)+/?)$/";
		var re=new RegExp(strRegex);
		return re.test(value); 
	},
	
	/**
	 * 检查一个密码的复杂度。 
	 * @param {Object} value
	 * @return {Number} 数字越大，复杂度越高。 这个数字在 0 - 5 变化。
	 */
	checkLevel: function(value){
		return value.replace(/^(?:(?=.{4})(?=.*([a-z])|.)(?=.*([A-Z])|.)(?=.*(\d)|.)(?=.*(\W)|.).*|.*)$/, "$1$2$3$4").length;
	},

	/**
	 * 检查一个字符串是否为空。 
	 * @param {String} value
	 */
	isNotEmpty: function(value){
		return value.length > 0;
	},

	/**
	 * 判断是否为合法用户名。合法的用户名必须是非数字开头的 字母、_、数字、中文。
	 * @param {Object} value
	 */
	isUserName: function(value){
		return /^[a-zA-Z]{1}([a-zA-Z0-9]|[._]){4,19}$/.test(value);
	},
	
	isIP:function (value) { 
		if(/^(\d+)\.(\d+)\.(\d+)\.(\d+)$/g.test(value)){ 
			if( RegExp.$1 <256 && RegExp.$2<256 && RegExp.$3<256 && RegExp.$4<256) return true; 
		} 
		return false; 
	}
		
}); 
