/**
 * @author xuld
 */


//#include core/base.js

/**
 * 时间。
 * @class Date
 */
Object.extend(Date.prototype, {
	
	/**
	 * 改写 Date.toString。实现支持   yyyymmdd hhmmss 。
	 * @param {String} format 格式。
	 * @return {String} 字符串。
	 */
	toString : function(){
		var args = {
				"d" : 'getDate',
				"h" : 'getHours',
				"m" :'getMinutes',
				"s" : 'getSeconds'
			},
			rDate = /(yy|M|d|h|m|s)\1?/g,
			toString = Date.prototype.toString;
			
		
		
		
		return function(format){
			
			var me = this;
			
			if(!format) return toString.call(me);
			
			return format.replace(rDate, function replace(key, reg){
				var l = key != reg, t;
				switch(reg){
					case 'yy':
						t = me.getFullYear();
						return l && t || ( t % 100 );
					case 'M':
						t = me.getMonth() + 1;
						break;
					default:
						t = me[args[reg]]();
				}
				return l && t <= 9 && ( "0" + t ) || t;
			});
		}
	}(),
	
	/**
	 * 计算和当前日期到指定日期的天数。
	 * @param {Number} month 月份。
	 * @param {Number} day 天。
	 * @return {Number} 天数。
	 */
	dayDiff : function(month, day){
		var me = this,
			x = Date.compare(new Date([me.getFullYear(), me.getMonth() + 1, me.getDate()].join('/')),  new Date([me.getFullYear(), month, day].join('/')));
		return (x < 0 ? ( me.getMonth() < 2 && Date.isLeapYear(me.getFullYear()) ? 366 : 365) : 0 ) + x; 
	},
	
	clone: function(){
		return new Date(this.getTime());
	},
	
	addDay: function(value){
		this.setDate(this.getDate() + value);
		return this;
	},

	addWeek: function(value){
		return this.addDay(value * 7);
	},

	addMonth: function(value){
		this.setMonth(this.getMonth() + value);
		return this;
	},

	addYear: function(value){
		this.setFullYear(parseInt(this.getFullYear()) + value);
		return this;
	}

});

Object.extendIf(Date, {

	/**
	 * 比较2个日期，返回差别。
	 * @param {Date} date1 日期
	 * @param {Date} date2 日期
	 * @param {Boolean} on 严格时间差.加上后效率会减小。
	 * @return {Number} 天。
	 */
	compare : function(date1, date2, on){
		var a;
		if(on)
			a = new Date(date2.toString()) - new Date(date1.toString());
		else
			a = date2 - date1;
		return parseInt(a/86400000 );
	},
	
	/**
	 * 判断指定的年份是否是闰年。
	 * @param {Object} year 要进行判断的年份。
	 * @return {Boolean} 指定的年份是闰年，则返回 true，否则返回 false。
	 */
	isLeapYear : function(year) {
		return ((year % 4 == 0 && year % 100 != 0) || year % 400 == 0);
	},
	
	_dayInMonth: [30, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
	
	/**
	 * 获取指定年的指定月有多少天。
	 * @param {Number} year 指定的年。
	 * @param {Number} month 指定的月。
	 * @return {Number} 返回指定年的指定月的天数。
	 */
	getDayInMonth : function(year, month) {
	    if(month == 2)
			return Date.isLeapYear(year) ? 29 : 28;
		return _dayInMonth[month] ;
	}
});


