//===========================================
//  日期扩展       
//===========================================






Date.implement({

	getTimezone: function(){
		return this.toString()
			.replace(/^.*? ([A-Z]{3}).[0-9]{4}.*$/, '$1')
			.replace(/^.*?\(([A-Z])[a-z]+ ([A-Z])[a-z]+ ([A-Z])[a-z]+\)$/, '$1$2$3');
	},
	
	getGMTOffset: function() {
	    return (this.getTimezoneOffset() > 0 ? "-" : "+")
	        + String.leftPad(Math.floor(this.getTimezoneOffset() / 60), 2, "0")
	        + String.leftPad(this.getTimezoneOffset() % 60, 2, "0");
	},
	
	getFirstDay: function() {
	    var day = (this.getDay() - (this.getDate() - 1)) % 7;
	    return (day < 0) ? (day + 7) : day;
	},
	
	
	getLastDay: function() {
	    var day = (this.getDay() + (Date.daysInMonth[this.getMonth()] - this.getDate())) % 7;
	    return (day < 0) ? (day + 7) : day;
	},

	isPM: function(){
		return (this.get('hr') >= 12);
	},
	
	clearTime: function(){
	    this.setHours(0);
	    this.setMinutes(0);
	    this.setSeconds(0);
	    this.setMilliseconds(0);
	},
	
	/**
	 * 转到本月第一天。
	 */
	clearDay: function(){
		
	},
	
	

	setPM: function(value){
		var hr = this.get('hr');
		if (hr > 11 && ampm == 'AM') return this.decrement('hour', 12);
		else if (hr < 12 && ampm == 'PM') return this.increment('hour', 12);
		return this;
	},
	
	toISOString: function(){
		
	}
});


Object.extend(Date, {
	
	parse: function(str, format){
		
	},
	
	getDayInYear: function(year) {
	    var num = 0;
	    Date.daysInMonth[1] = this.isLeapYear() ? 29 : 28;
	    for (var i = 0; i < this.getMonth(); ++i) {
	        num += Date.daysInMonth[i];
	    }
	    return num + this.getDate() - 1;
	},
	
	getWeekOfYear: function(year, day) {
	    
	    var now = this.getDayOfYear() + (4 - this.getDay());
	    
	    var jan1 = new Date(this.getFullYear(), 0, 1);
	    var then = (7 - jan1.getDay() + 4);
	    return ((now - then) / 7) + 1;
	},

    /**
     * Checks if the passed Date parameters will cause a javascript Date "rollover".
     * @param {Number} year 4-digit year
     * @param {Number} month 1-based month-of-year
     * @param {Number} day Day of month
     * @param {Number} hour (optional) Hour
     * @param {Number} minute (optional) Minute
     * @param {Number} second (optional) Second
     * @param {Number} millisecond (optional) Millisecond
     * @return {Boolean} true if the passed parameters do not cause a Date "rollover", false otherwise.
     * @static
     */
    isValid : function(y, m, d, h, i, s, ms) {
        // setup defaults
        h = h || 0;
        i = i || 0;
        s = s || 0;
        ms = ms || 0;

        // Special handling for year < 100
        var dt = utilDate.add(new Date(y < 100 ? 100 : y, m - 1, d, h, i, s, ms), utilDate.YEAR, y < 100 ? y - 100 : 0);

        return y == dt.getFullYear() &&
            m == dt.getMonth() + 1 &&
            d == dt.getDate() &&
            h == dt.getHours() &&
            i == dt.getMinutes() &&
            s == dt.getSeconds() &&
            ms == dt.getMilliseconds();
    },
	

    /**
     * Checks if the current date is affected by Daylight Saving Time (DST).
     * @param {Date} date The date
     * @return {Boolean} True if the current date is affected by DST.
     */
    isDST : function(date) {
        // adapted from http://sencha.com/forum/showthread.php?p=247172#post247172
        // courtesy of @geoffrey.mcgill
        return new Date(date.getFullYear(), 0, 1).getTimezoneOffset() != date.getTimezoneOffset();
    },
	
    /**
     * Checks if a date falls on or between the given start and end dates.
     * @param {Date} date The date to check
     * @param {Date} start Start date
     * @param {Date} end End date
     * @return {Boolean} true if this date falls on or between the given start and end dates.
     */
    between : function(date, start, end) {
        var t = date.getTime();
        return start.getTime() <= t && t <= end.getTime();
    },

});
	
/*
Date.parseFunctions = {count:0};

Date.parseRegexes = [];

Date.formatFunctions = {count:0};




Date.getFormatCode = function(character) {
    switch (character) {
    case "d":
        return "String.leftPad(this.getDate(), 2, '0') + ";
    case "D":
        return "Date.dayNames[this.getDay()].substring(0, 3) + ";
    case "j":
        return "this.getDate() + ";
    case "l":
        return "Date.dayNames[this.getDay()] + ";
    case "S":
        return "this.getSuffix() + ";
    case "w":
        return "this.getDay() + ";
    case "z":
        return "this.getDayOfYear() + ";
    case "W":
        return "this.getWeekOfYear() + ";
    case "F":
        return "Date.monthNames[this.getMonth()] + ";
    case "m":
        return "String.leftPad(this.getMonth() + 1, 2, '0') + ";
    case "M":
        return "Date.monthNames[this.getMonth()].substring(0, 3) + ";
    case "n":
        return "(this.getMonth() + 1) + ";
    case "t":
        return "this.getDaysInMonth() + ";
    case "L":
        return "(this.isLeapYear() ? 1 : 0) + ";
    case "Y":
        return "this.getFullYear() + ";
    case "y":
        return "('' + this.getFullYear()).substring(2, 4) + ";
    case "a":
        return "(this.getHours() < 12 ? 'am' : 'pm') + ";
    case "A":
        return "(this.getHours() < 12 ? 'AM' : 'PM') + ";
    case "g":
        return "((this.getHours() %12) ? this.getHours() % 12 : 12) + ";
    case "G":
        return "this.getHours() + ";
    case "h":
        return "String.leftPad((this.getHours() %12) ? this.getHours() % 12 : 12, 2, '0') + ";
    case "H":
        return "String.leftPad(this.getHours(), 2, '0') + ";
    case "i":
        return "String.leftPad(this.getMinutes(), 2, '0') + ";
    case "s":
        return "String.leftPad(this.getSeconds(), 2, '0') + ";
    case "O":
        return "this.getGMTOffset() + ";
    case "T":
        return "this.getTimezone() + ";
    case "Z":
        return "(this.getTimezoneOffset() * -60) + ";
    default:
        return "'" + String.escape(character) + "' + ";
    }
};


Date.parseDate = function(input, format) {
    if (Date.parseFunctions[format] == null) {
        Date.createParser(format);
    }
    var func = Date.parseFunctions[format];
    return Date[func](input);
};


Date.createParser = function(format) {
    var funcName = "parse" + Date.parseFunctions.count++;
    var regexNum = Date.parseRegexes.length;
    var currentGroup = 1;
    Date.parseFunctions[format] = funcName;

    var code = "Date." + funcName + " = function(input){\n"
        + "var y = -1, m = -1, d = -1, h = -1, i = -1, s = -1;\n"
        + "var d = new Date();\n"
        + "y = d.getFullYear();\n"
        + "m = d.getMonth();\n"
        + "d = d.getDate();\n"
        + "var results = input.match(Date.parseRegexes[" + regexNum + "]);\n"
        + "if (results && results.length > 0) {";
    var regex = "";

    var special = false;
    var ch = '';
    for (var i = 0; i < format.length; ++i) {
        ch = format.charAt(i);
        if (!special && ch == "\\") {
            special = true;
        }
        else if (special) {
            special = false;
            regex += String.escape(ch);
        }
        else {
            var obj = Date.formatCodeToRegex(ch, currentGroup);
            currentGroup += obj.g;
            regex += obj.s;
            if (obj.g && obj.c) {
                code += obj.c;
            }
        }
    }

    code += "if (y > 0 && m >= 0 && d > 0 && h >= 0 && i >= 0 && s >= 0)\n"
        + "{return new Date(y, m, d, h, i, s);}\n"
        + "else if (y > 0 && m >= 0 && d > 0 && h >= 0 && i >= 0)\n"
        + "{return new Date(y, m, d, h, i);}\n"
        + "else if (y > 0 && m >= 0 && d > 0 && h >= 0)\n"
        + "{return new Date(y, m, d, h);}\n"
        + "else if (y > 0 && m >= 0 && d > 0)\n"
        + "{return new Date(y, m, d);}\n"
        + "else if (y > 0 && m >= 0)\n"
        + "{return new Date(y, m);}\n"
        + "else if (y > 0)\n"
        + "{return new Date(y);}\n"
        + "}return null;}";

    Date.parseRegexes[regexNum] = new RegExp("^" + regex + "$");
    eval(code);
};


Date.formatCodeToRegex = function(character, currentGroup) {
    switch (character) {
    case "D":
        return {g:0,
        c:null,
        s:"(?:Sun|Mon|Tue|Wed|Thu|Fri|Sat)"};
    case "j":
    case "d":
        return {g:1,
            c:"d = parseInt(results[" + currentGroup + "], 10);\n",
            s:"(\\d{1,2})"};
    case "l":
        return {g:0,
            c:null,
            s:"(?:" + Date.dayNames.join("|") + ")"};
    case "S":
        return {g:0,
            c:null,
            s:"(?:st|nd|rd|th)"};
    case "w":
        return {g:0,
            c:null,
            s:"\\d"};
    case "z":
        return {g:0,
            c:null,
            s:"(?:\\d{1,3})"};
    case "W":
        return {g:0,
            c:null,
            s:"(?:\\d{2})"};
    case "F":
        return {g:1,
            c:"m = parseInt(Date.monthNumbers[results[" + currentGroup + "].substring(0, 3)], 10);\n",
            s:"(" + Date.monthNames.join("|") + ")"};
    case "M":
        return {g:1,
            c:"m = parseInt(Date.monthNumbers[results[" + currentGroup + "]], 10);\n",
            s:"(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)"};
    case "n":
    case "m":
        return {g:1,
            c:"m = parseInt(results[" + currentGroup + "], 10) - 1;\n",
            s:"(\\d{1,2})"};
    case "t":
        return {g:0,
            c:null,
            s:"\\d{1,2}"};
    case "L":
        return {g:0,
            c:null,
            s:"(?:1|0)"};
    case "Y":
        return {g:1,
            c:"y = parseInt(results[" + currentGroup + "], 10);\n",
            s:"(\\d{4})"};
    case "y":
        return {g:1,
            c:"var ty = parseInt(results[" + currentGroup + "], 10);\n"
                + "y = ty > Date.y2kYear ? 1900 + ty : 2000 + ty;\n",
            s:"(\\d{1,2})"};
    case "a":
        return {g:1,
            c:"if (results[" + currentGroup + "] == 'am') {\n"
                + "if (h == 12) { h = 0; }\n"
                + "} else { if (h < 12) { h += 12; }}",
            s:"(am|pm)"};
    case "A":
        return {g:1,
            c:"if (results[" + currentGroup + "] == 'AM') {\n"
                + "if (h == 12) { h = 0; }\n"
                + "} else { if (h < 12) { h += 12; }}",
            s:"(AM|PM)"};
    case "g":
    case "G":
    case "h":
    case "H":
        return {g:1,
            c:"h = parseInt(results[" + currentGroup + "], 10);\n",
            s:"(\\d{1,2})"};
    case "i":
        return {g:1,
            c:"i = parseInt(results[" + currentGroup + "], 10);\n",
            s:"(\\d{2})"};
    case "s":
        return {g:1,
            c:"s = parseInt(results[" + currentGroup + "], 10);\n",
            s:"(\\d{2})"};
    case "O":
        return {g:0,
            c:null,
            s:"[+-]\\d{4}"};
    case "T":
        return {g:0,
            c:null,
            s:"[A-Z]{3}"};
    case "Z":
        return {g:0,
            c:null,
            s:"[+-]\\d{1,5}"};
    default:
        return {g:0,
            c:null,
            s:String.escape(character)};
    }
};
 
 

*/
 
  


/*
---

script: Date.js

name: Date

description: Extends the Date native object to include methods useful in managing dates.

license: MIT-style license

authors:
  - Aaron Newton
  - Nicholas Barthelemy - https://svn.nbarthelemy.com/date-js/
  - Harald Kirshner - mail [at] digitarald.de; http://digitarald.de
  - Scott Kyle - scott [at] appden.com; http://appden.com

requires:
  - Core/Array
  - Core/String
  - Core/Number
  - /Locale
  - /Locale.en-US.Date
  - /MooTools.More

provides: [Date]

...
*/

/*
format: function(f){
		if (!this.isValid()) return 'invalid date';
		f = f || '%x %X';
		f = formats[f.toLowerCase()] || f; // replace short-hand with actual format
		var d = this;
		return f.replace(/%([a-z%])/gi,
			function($0, $1){
				switch ($1){
					case 'a': return Date.getMsg('days_abbr')[d.get('day')];
					case 'A': return Date.getMsg('days')[d.get('day')];
					case 'b': return Date.getMsg('months_abbr')[d.get('month')];
					case 'B': return Date.getMsg('months')[d.get('month')];
					case 'c': return d.format('%a %b %d %H:%m:%S %Y');
					case 'd': return pad(d.get('date'), 2);
					case 'e': return pad(d.get('date'), 2, ' ');
					case 'H': return pad(d.get('hr'), 2);
					case 'I': return pad((d.get('hr') % 12) || 12, 2);
					case 'j': return pad(d.get('dayofyear'), 3);
					case 'k': return pad(d.get('hr'), 2, ' ');
					case 'l': return pad((d.get('hr') % 12) || 12, 2, ' ');
					case 'L': return pad(d.get('ms'), 3);
					case 'm': return pad((d.get('mo') + 1), 2);
					case 'M': return pad(d.get('min'), 2);
					case 'o': return d.get('ordinal');
					case 'p': return Date.getMsg(d.get('ampm'));
					case 's': return Math.round(d / 1000);
					case 'S': return pad(d.get('seconds'), 2);
					case 'U': return pad(d.get('week'), 2);
					case 'w': return d.get('day');
					case 'x': return d.format(Date.getMsg('shortDate'));
					case 'X': return d.format(Date.getMsg('shortTime'));
					case 'y': return d.get('year').toString().substr(2);
					case 'Y': return d.get('year');
					
					case 'z': return d.get('GMTOffset');
					case 'Z': return d.get('Timezone');
				}
				return $1;
			}
		);
	},
	
	
	
var formats = {
	db: '%Y-%m-%d %H:%M:%S',
	compact: '%Y%m%dT%H%M%S',
	iso8601: '%Y-%m-%dT%H:%M:%S%T',
	rfc822: '%a, %d %b %Y %H:%M:%S %Z',
	'short': '%d %b %H:%M',
	'long': '%B %d, %Y %H:%M'
};



var parsePatterns = [];
var nativeParse = Date.parse;

var parseWord = function(type, word, num){
	var ret = -1;
	var translated = Date.getMsg(type + 's');
	switch (typeOf(word)){
		case 'object':
			ret = translated[word.get(type)];
			break;
		case 'number':
			ret = translated[word];
			if (!ret) throw new Error('Invalid ' + type + ' index: ' + word);
			break;
		case 'string':
			var match = translated.filter(function(name){
				return this.test(name);
			}, new RegExp('^' + word, 'i'));
			if (!match.length) throw new Error('Invalid ' + type + ' string');
			if (match.length > 1) throw new Error('Ambiguous ' + type);
			ret = match[0];
	}

	return (num) ? translated.indexOf(ret) : ret;
};






*/

 
	 
/**
 * @class Ext.Date
 * A set of useful static methods to deal with date
 * Note that if Ext.Date is required and loaded, it will copy all methods / properties to
 * this object for convenience
 *
 * The date parsing and formatting syntax contains a subset of
 * <a href="http://www.php.net/date">PHP's date() function</a>, and the formats that are
 * supported will provide results equivalent to their PHP versions.
 *
 * The following is a list of all currently supported formats:
 * <pre class="">
Format  Description                                                               Example returned values
------  -----------------------------------------------------------------------   -----------------------
  d     Day of the month, 2 digits with leading zeros                             01 to 31
  D     A short textual representation of the day of the week                     Mon to Sun
  j     Day of the month without leading zeros                                    1 to 31
  l     A full textual representation of the day of the week                      Sunday to Saturday
  N     ISO-8601 numeric representation of the day of the week                    1 (for Monday) through 7 (for Sunday)
  S     English ordinal suffix for the day of the month, 2 characters             st, nd, rd or th. Works well with j
  w     Numeric representation of the day of the week                             0 (for Sunday) to 6 (for Saturday)
  z     The day of the year (starting from 0)                                     0 to 364 (365 in leap years)
  W     ISO-8601 week number of year, weeks starting on Monday                    01 to 53
  F     A full textual representation of a month, such as January or March        January to December
  m     Numeric representation of a month, with leading zeros                     01 to 12
  M     A short textual representation of a month                                 Jan to Dec
  n     Numeric representation of a month, without leading zeros                  1 to 12
  t     Number of days in the given month                                         28 to 31
  L     Whether it&#39;s a leap year                                                  1 if it is a leap year, 0 otherwise.
  o     ISO-8601 year number (identical to (Y), but if the ISO week number (W)    Examples: 1998 or 2004
        belongs to the previous or next year, that year is used instead)
  Y     A full numeric representation of a year, 4 digits                         Examples: 1999 or 2003
  y     A two digit representation of a year                                      Examples: 99 or 03
  a     Lowercase Ante meridiem and Post meridiem                                 am or pm
  A     Uppercase Ante meridiem and Post meridiem                                 AM or PM
  g     12-hour format of an hour without leading zeros                           1 to 12
  G     24-hour format of an hour without leading zeros                           0 to 23
  h     12-hour format of an hour with leading zeros                              01 to 12
  H     24-hour format of an hour with leading zeros                              00 to 23
  i     Minutes, with leading zeros                                               00 to 59
  s     Seconds, with leading zeros                                               00 to 59
  u     Decimal fraction of a second                                              Examples:
        (minimum 1 digit, arbitrary number of digits allowed)                     001 (i.e. 0.001s) or
                                                                                  100 (i.e. 0.100s) or
                                                                                  999 (i.e. 0.999s) or
                                                                                  999876543210 (i.e. 0.999876543210s)
  O     Difference to Greenwich time (GMT) in hours and minutes                   Example: +1030
  P     Difference to Greenwich time (GMT) with colon between hours and minutes   Example: -08:00
  T     Timezone abbreviation of the machine running the code                     Examples: EST, MDT, PDT ...
  Z     Timezone offset in seconds (negative if west of UTC, positive if east)    -43200 to 50400
  c     ISO 8601 date
        Notes:                                                                    Examples:
        1) If unspecified, the month / day defaults to the current month / day,   1991 or
           the time defaults to midnight, while the timezone defaults to the      1992-10 or
           browser's timezone. If a time is specified, it must include both hours 1993-09-20 or
           and minutes. The "T" delimiter, seconds, milliseconds and timezone     1994-08-19T16:20+01:00 or
           are optional.                                                          1995-07-18T17:21:28-02:00 or
        2) The decimal fraction of a second, if specified, must contain at        1996-06-17T18:22:29.98765+03:00 or
           least 1 digit (there is no limit to the maximum number                 1997-05-16T19:23:30,12345-0400 or
           of digits allowed), and may be delimited by either a '.' or a ','      1998-04-15T20:24:31.2468Z or
        Refer to the examples on the right for the various levels of              1999-03-14T20:24:32Z or
        date-time granularity which are supported, or see                         2000-02-13T21:25:33
        http://www.w3.org/TR/NOTE-datetime for more info.                         2001-01-12 22:26:34
  U     Seconds since the Unix Epoch (January 1 1970 00:00:00 GMT)                1193432466 or -2138434463
  MS    Microsoft AJAX serialized dates                                           \/Date(1238606590509)\/ (i.e. UTC milliseconds since epoch) or
                                                                                  \/Date(1238606590509+0800)\/
</pre>
 *
 * Example usage (note that you must escape format specifiers with '\\' to render them as character literals):
 * <pre><code>
// Sample date:
// 'Wed Jan 10 2007 15:05:01 GMT-0600 (Central Standard Time)'

var dt = new Date('1/10/2007 03:05:01 PM GMT-0600');
console.log(Ext.Date.format(dt, 'Y-m-d'));                          // 2007-01-10
console.log(Ext.Date.format(dt, 'F j, Y, g:i a'));                  // January 10, 2007, 3:05 pm
console.log(Ext.Date.format(dt, 'l, \\t\\he jS \\of F Y h:i:s A')); // Wednesday, the 10th of January 2007 03:05:01 PM
</code></pre>
 *
 * Here are some standard date/time patterns that you might find helpful.  They
 * are not part of the source of Ext.Date, but to use them you can simply copy this
 * block of code into any script that is included after Ext.Date and they will also become
 * globally available on the Date object.  Feel free to add or remove patterns as needed in your code.
 * <pre><code>
Ext.Date.patterns = {
    ISO8601Long:"Y-m-d H:i:s",
    ISO8601Short:"Y-m-d",
    ShortDate: "n/j/Y",
    LongDate: "l, F d, Y",
    FullDateTime: "l, F d, Y g:i:s A",
    MonthDay: "F d",
    ShortTime: "g:i A",
    LongTime: "g:i:s A",
    SortableDateTime: "Y-m-d\\TH:i:s",
    UniversalSortableDateTime: "Y-m-d H:i:sO",
    YearMonth: "F, Y"
};
</code></pre>
 *
 * Example usage:
 * <pre><code>
var dt = new Date();
console.log(Ext.Date.format(dt, Ext.Date.patterns.ShortDate));
</code></pre>
 * <p>Developer-written, custom formats may be used by supplying both a formatting and a parsing function
 * which perform to specialized requirements. The functions are stored in {@link #parseFunctions} and {@link #formatFunctions}.</p>
 * @singleton
 */

/*
 * Most of the date-formatting functions below are the excellent work of Baron Schwartz.
 * (see http://www.xaprb.com/blog/2005/12/12/javascript-closures-for-runtime-efficiency/)
 * They generate precompiled functions from format patterns instead of parsing and
 * processing each pattern every time a date is formatted. These functions are available
 * on every Date object.
 */

//(function() {
//
//// create private copy of Ext's Ext.util.Format.format() method
//// - to remove unnecessary dependency
//// - to resolve namespace conflict with MS-Ajax's implementation
//function xf(format) {
//    var args = Array.prototype.slice.call(arguments, 1);
//    return format.replace(/\{(\d+)\}/g, function(m, i) {
//        return args[i];
//    });
//}
//
//Ext.Date = {
//    /**
//     * Returns the current timestamp
//     * @return {Date} The current timestamp
//     * @method
//     */
//    now: Date.now || function() {
//        return +new Date();
//    },
//
//    /**
//     * @private
//     * Private for now
//     */
//    toString: function(date) {
//        var pad = Ext.String.leftPad;
//
//        return date.getFullYear() + "-"
//            + pad(date.getMonth() + 1, 2, '0') + "-"
//            + pad(date.getDate(), 2, '0') + "T"
//            + pad(date.getHours(), 2, '0') + ":"
//            + pad(date.getMinutes(), 2, '0') + ":"
//            + pad(date.getSeconds(), 2, '0');
//    },
//
//    /**
//     * Returns the number of milliseconds between two dates
//     * @param {Date} dateA The first date
//     * @param {Date} dateB (optional) The second date, defaults to now
//     * @return {Number} The difference in milliseconds
//     */
//    getElapsed: function(dateA, dateB) {
//        return Math.abs(dateA - (dateB || new Date()));
//    },
//
//    /**
//     * Global flag which determines if strict date parsing should be used.
//     * Strict date parsing will not roll-over invalid dates, which is the
//     * default behaviour of javascript Date objects.
//     * (see {@link #parse} for more information)
//     * Defaults to <tt>false</tt>.
//     * @static
//     * @type Boolean
//    */
//    useStrict: false,
//
//    // private
//    formatCodeToRegex: function(character, currentGroup) {
//        // Note: currentGroup - position in regex result array (see notes for Ext.Date.parseCodes below)
//        var p = utilDate.parseCodes[character];
//
//        if (p) {
//          p = typeof p == 'function'? p() : p;
//          utilDate.parseCodes[character] = p; // reassign function result to prevent repeated execution
//        }
//
//        return p ? Ext.applyIf({
//          c: p.c ? xf(p.c, currentGroup || "{0}") : p.c
//        }, p) : {
//            g: 0,
//            c: null,
//            s: Ext.String.escapeRegex(character) // treat unrecognised characters as literals
//        };
//    },
//
//    /**
//     * <p>An object hash in which each property is a date parsing function. The property name is the
//     * format string which that function parses.</p>
//     * <p>This object is automatically populated with date parsing functions as
//     * date formats are requested for Ext standard formatting strings.</p>
//     * <p>Custom parsing functions may be inserted into this object, keyed by a name which from then on
//     * may be used as a format string to {@link #parse}.<p>
//     * <p>Example:</p><pre><code>
//Ext.Date.parseFunctions['x-date-format'] = myDateParser;
//</code></pre>
//     * <p>A parsing function should return a Date object, and is passed the following parameters:<div class="mdetail-params"><ul>
//     * <li><code>date</code> : String<div class="sub-desc">The date string to parse.</div></li>
//     * <li><code>strict</code> : Boolean<div class="sub-desc">True to validate date strings while parsing
//     * (i.e. prevent javascript Date "rollover") (The default must be false).
//     * Invalid date strings should return null when parsed.</div></li>
//     * </ul></div></p>
//     * <p>To enable Dates to also be <i>formatted</i> according to that format, a corresponding
//     * formatting function must be placed into the {@link #formatFunctions} property.
//     * @property parseFunctions
//     * @static
//     * @type Object
//     */
//    parseFunctions: {
//        "MS": function(input, strict) {
//            // note: the timezone offset is ignored since the MS Ajax server sends
//            // a UTC milliseconds-since-Unix-epoch value (negative values are allowed)
//            var re = new RegExp('\\/Date\\(([-+])?(\\d+)(?:[+-]\\d{4})?\\)\\/');
//            var r = (input || '').match(re);
//            return r? new Date(((r[1] || '') + r[2]) * 1) : null;
//        }
//    },
//    parseRegexes: [],
//
//    /**
//     * <p>An object hash in which each property is a date formatting function. The property name is the
//     * format string which corresponds to the produced formatted date string.</p>
//     * <p>This object is automatically populated with date formatting functions as
//     * date formats are requested for Ext standard formatting strings.</p>
//     * <p>Custom formatting functions may be inserted into this object, keyed by a name which from then on
//     * may be used as a format string to {@link #format}. Example:</p><pre><code>
//Ext.Date.formatFunctions['x-date-format'] = myDateFormatter;
//</code></pre>
//     * <p>A formatting function should return a string representation of the passed Date object, and is passed the following parameters:<div class="mdetail-params"><ul>
//     * <li><code>date</code> : Date<div class="sub-desc">The Date to format.</div></li>
//     * </ul></div></p>
//     * <p>To enable date strings to also be <i>parsed</i> according to that format, a corresponding
//     * parsing function must be placed into the {@link #parseFunctions} property.
//     * @property formatFunctions
//     * @static
//     * @type Object
//     */
//    formatFunctions: {
//        "MS": function() {
//            // UTC milliseconds since Unix epoch (MS-AJAX serialized date format (MRSF))
//            return '\\/Date(' + this.getTime() + ')\\/';
//        }
//    },
//
//    y2kYear : 50,
//
//    /**
//     * Date interval constant
//     * @static
//     * @type String
//     */
//    MILLI : "ms",
//
//    /**
//     * Date interval constant
//     * @static
//     * @type String
//     */
//    SECOND : "s",
//
//    /**
//     * Date interval constant
//     * @static
//     * @type String
//     */
//    MINUTE : "mi",
//
//    /** Date interval constant
//     * @static
//     * @type String
//     */
//    HOUR : "h",
//
//    /**
//     * Date interval constant
//     * @static
//     * @type String
//     */
//    DAY : "d",
//
//    /**
//     * Date interval constant
//     * @static
//     * @type String
//     */
//    MONTH : "mo",
//
//    /**
//     * Date interval constant
//     * @static
//     * @type String
//     */
//    YEAR : "y",
//
//    /**
//     * <p>An object hash containing default date values used during date parsing.</p>
//     * <p>The following properties are available:<div class="mdetail-params"><ul>
//     * <li><code>y</code> : Number<div class="sub-desc">The default year value. (defaults to undefined)</div></li>
//     * <li><code>m</code> : Number<div class="sub-desc">The default 1-based month value. (defaults to undefined)</div></li>
//     * <li><code>d</code> : Number<div class="sub-desc">The default day value. (defaults to undefined)</div></li>
//     * <li><code>h</code> : Number<div class="sub-desc">The default hour value. (defaults to undefined)</div></li>
//     * <li><code>i</code> : Number<div class="sub-desc">The default minute value. (defaults to undefined)</div></li>
//     * <li><code>s</code> : Number<div class="sub-desc">The default second value. (defaults to undefined)</div></li>
//     * <li><code>ms</code> : Number<div class="sub-desc">The default millisecond value. (defaults to undefined)</div></li>
//     * </ul></div></p>
//     * <p>Override these properties to customize the default date values used by the {@link #parse} method.</p>
//     * <p><b>Note: In countries which experience Daylight Saving Time (i.e. DST), the <tt>h</tt>, <tt>i</tt>, <tt>s</tt>
//     * and <tt>ms</tt> properties may coincide with the exact time in which DST takes effect.
//     * It is the responsiblity of the developer to account for this.</b></p>
//     * Example Usage:
//     * <pre><code>
//// set default day value to the first day of the month
//Ext.Date.defaults.d = 1;
//
//// parse a February date string containing only year and month values.
//// setting the default day value to 1 prevents weird date rollover issues
//// when attempting to parse the following date string on, for example, March 31st 2009.
//Ext.Date.parse('2009-02', 'Y-m'); // returns a Date object representing February 1st 2009
//</code></pre>
//     * @property defaults
//     * @static
//     * @type Object
//     */
//    defaults: {},
//
//    /**
//     * An array of textual day names.
//     * Override these values for international dates.
//     * Example:
//     * <pre><code>
//Ext.Date.dayNames = [
//    'SundayInYourLang',
//    'MondayInYourLang',
//    ...
//];
//</code></pre>
//     * @type Array
//     * @static
//     */
//    dayNames : [
//        "Sunday",
//        "Monday",
//        "Tuesday",
//        "Wednesday",
//        "Thursday",
//        "Friday",
//        "Saturday"
//    ],
//
//    /**
//     * An array of textual month names.
//     * Override these values for international dates.
//     * Example:
//     * <pre><code>
//Ext.Date.monthNames = [
//    'JanInYourLang',
//    'FebInYourLang',
//    ...
//];
//</code></pre>
//     * @type Array
//     * @static
//     */
//    monthNames : [
//        "January",
//        "February",
//        "March",
//        "April",
//        "May",
//        "June",
//        "July",
//        "August",
//        "September",
//        "October",
//        "November",
//        "December"
//    ],
//
//    /**
//     * An object hash of zero-based javascript month numbers (with short month names as keys. note: keys are case-sensitive).
//     * Override these values for international dates.
//     * Example:
//     * <pre><code>
//Ext.Date.monthNumbers = {
//    'ShortJanNameInYourLang':0,
//    'ShortFebNameInYourLang':1,
//    ...
//};
//</code></pre>
//     * @type Object
//     * @static
//     */
//    monthNumbers : {
//        Jan:0,
//        Feb:1,
//        Mar:2,
//        Apr:3,
//        May:4,
//        Jun:5,
//        Jul:6,
//        Aug:7,
//        Sep:8,
//        Oct:9,
//        Nov:10,
//        Dec:11
//    },
//    /**
//     * <p>The date format string that the {@link Ext.util.Format#dateRenderer}
//     * and {@link Ext.util.Format#date} functions use.  See {@link Ext.Date} for details.</p>
//     * <p>This defaults to <code>m/d/Y</code>, but may be overridden in a locale file.</p>
//     * @property defaultFormat
//     * @static
//     * @type String
//     */
//    defaultFormat : "m/d/Y",
//    /**
//     * Get the short month name for the given month number.
//     * Override this function for international dates.
//     * @param {Number} month A zero-based javascript month number.
//     * @return {String} The short month name.
//     * @static
//     */
//    getShortMonthName : function(month) {
//        return utilDate.monthNames[month].substring(0, 3);
//    },
//
//    /**
//     * Get the short day name for the given day number.
//     * Override this function for international dates.
//     * @param {Number} day A zero-based javascript day number.
//     * @return {String} The short day name.
//     * @static
//     */
//    getShortDayName : function(day) {
//        return utilDate.dayNames[day].substring(0, 3);
//    },
//
//    /**
//     * Get the zero-based javascript month number for the given short/full month name.
//     * Override this function for international dates.
//     * @param {String} name The short/full month name.
//     * @return {Number} The zero-based javascript month number.
//     * @static
//     */
//    getMonthNumber : function(name) {
//        // handle camel casing for english month names (since the keys for the Ext.Date.monthNumbers hash are case sensitive)
//        return utilDate.monthNumbers[name.substring(0, 1).toUpperCase() + name.substring(1, 3).toLowerCase()];
//    },
//
//    /**
//     * Checks if the specified format contains hour information
//     * @param {String} format The format to check
//     * @return {Boolean} True if the format contains hour information
//     * @static
//     * @method
//     */
//    formatContainsHourInfo : (function(){
//        var stripEscapeRe = /(\\.)/g,
//            hourInfoRe = /([gGhHisucUOPZ]|MS)/;
//        return function(format){
//            return hourInfoRe.test(format.replace(stripEscapeRe, ''));
//        };
//    })(),
//
//    /**
//     * Checks if the specified format contains information about
//     * anything other than the time.
//     * @param {String} format The format to check
//     * @return {Boolean} True if the format contains information about
//     * date/day information.
//     * @static
//     * @method
//     */
//    formatContainsDateInfo : (function(){
//        var stripEscapeRe = /(\\.)/g,
//            dateInfoRe = /([djzmnYycU]|MS)/;
//
//        return function(format){
//            return dateInfoRe.test(format.replace(stripEscapeRe, ''));
//        };
//    })(),
//
//    /**
//     * The base format-code to formatting-function hashmap used by the {@link #format} method.
//     * Formatting functions are strings (or functions which return strings) which
//     * will return the appropriate value when evaluated in the context of the Date object
//     * from which the {@link #format} method is called.
//     * Add to / override these mappings for custom date formatting.
//     * Note: Ext.Date.format() treats characters as literals if an appropriate mapping cannot be found.
//     * Example:
//     * <pre><code>
//Ext.Date.formatCodes.x = "Ext.util.Format.leftPad(this.getDate(), 2, '0')";
//console.log(Ext.Date.format(new Date(), 'X'); // returns the current day of the month
//</code></pre>
//     * @type Object
//     * @static
//     */
//    formatCodes : {
//        d: "Ext.String.leftPad(this.getDate(), 2, '0')",
//        D: "Ext.Date.getShortDayName(this.getDay())", // get localised short day name
//        j: "this.getDate()",
//        l: "Ext.Date.dayNames[this.getDay()]",
//        N: "(this.getDay() ? this.getDay() : 7)",
//        S: "Ext.Date.getSuffix(this)",
//        w: "this.getDay()",
//        z: "Ext.Date.getDayOfYear(this)",
//        W: "Ext.String.leftPad(Ext.Date.getWeekOfYear(this), 2, '0')",
//        F: "Ext.Date.monthNames[this.getMonth()]",
//        m: "Ext.String.leftPad(this.getMonth() + 1, 2, '0')",
//        M: "Ext.Date.getShortMonthName(this.getMonth())", // get localised short month name
//        n: "(this.getMonth() + 1)",
//        t: "Ext.Date.getDaysInMonth(this)",
//        L: "(Ext.Date.isLeapYear(this) ? 1 : 0)",
//        o: "(this.getFullYear() + (Ext.Date.getWeekOfYear(this) == 1 && this.getMonth() > 0 ? +1 : (Ext.Date.getWeekOfYear(this) >= 52 && this.getMonth() < 11 ? -1 : 0)))",
//        Y: "Ext.String.leftPad(this.getFullYear(), 4, '0')",
//        y: "('' + this.getFullYear()).substring(2, 4)",
//        a: "(this.getHours() < 12 ? 'am' : 'pm')",
//        A: "(this.getHours() < 12 ? 'AM' : 'PM')",
//        g: "((this.getHours() % 12) ? this.getHours() % 12 : 12)",
//        G: "this.getHours()",
//        h: "Ext.String.leftPad((this.getHours() % 12) ? this.getHours() % 12 : 12, 2, '0')",
//        H: "Ext.String.leftPad(this.getHours(), 2, '0')",
//        i: "Ext.String.leftPad(this.getMinutes(), 2, '0')",
//        s: "Ext.String.leftPad(this.getSeconds(), 2, '0')",
//        u: "Ext.String.leftPad(this.getMilliseconds(), 3, '0')",
//        O: "Ext.Date.getGMTOffset(this)",
//        P: "Ext.Date.getGMTOffset(this, true)",
//        T: "Ext.Date.getTimezone(this)",
//        Z: "(this.getTimezoneOffset() * -60)",
//
//        c: function() { // ISO-8601 -- GMT format
//            for (var c = "Y-m-dTH:i:sP", code = [], i = 0, l = c.length; i < l; ++i) {
//                var e = c.charAt(i);
//                code.push(e == "T" ? "'T'" : utilDate.getFormatCode(e)); // treat T as a character literal
//            }
//            return code.join(" + ");
//        },
//        /*
//        c: function() { // ISO-8601 -- UTC format
//            return [
//              "this.getUTCFullYear()", "'-'",
//              "Ext.util.Format.leftPad(this.getUTCMonth() + 1, 2, '0')", "'-'",
//              "Ext.util.Format.leftPad(this.getUTCDate(), 2, '0')",
//              "'T'",
//              "Ext.util.Format.leftPad(this.getUTCHours(), 2, '0')", "':'",
//              "Ext.util.Format.leftPad(this.getUTCMinutes(), 2, '0')", "':'",
//              "Ext.util.Format.leftPad(this.getUTCSeconds(), 2, '0')",
//              "'Z'"
//            ].join(" + ");
//        },
//        */
//
//        U: "Math.round(this.getTime() / 1000)"
//    },
//
//    /**
//     * Parses the passed string using the specified date format.
//     * Note that this function expects normal calendar dates, meaning that months are 1-based (i.e. 1 = January).
//     * The {@link #defaults} hash will be used for any date value (i.e. year, month, day, hour, minute, second or millisecond)
//     * which cannot be found in the passed string. If a corresponding default date value has not been specified in the {@link #defaults} hash,
//     * the current date's year, month, day or DST-adjusted zero-hour time value will be used instead.
//     * Keep in mind that the input date string must precisely match the specified format string
//     * in order for the parse operation to be successful (failed parse operations return a null value).
//     * <p>Example:</p><pre><code>
////dt = Fri May 25 2007 (current date)
//var dt = new Date();
//
////dt = Thu May 25 2006 (today&#39;s month/day in 2006)
//dt = Ext.Date.parse("2006", "Y");
//
////dt = Sun Jan 15 2006 (all date parts specified)
//dt = Ext.Date.parse("2006-01-15", "Y-m-d");
//
////dt = Sun Jan 15 2006 15:20:01
//dt = Ext.Date.parse("2006-01-15 3:20:01 PM", "Y-m-d g:i:s A");
//
//// attempt to parse Sun Feb 29 2006 03:20:01 in strict mode
//dt = Ext.Date.parse("2006-02-29 03:20:01", "Y-m-d H:i:s", true); // returns null
//</code></pre>
//     * @param {String} input The raw date string.
//     * @param {String} format The expected date string format.
//     * @param {Boolean} strict (optional) True to validate date strings while parsing (i.e. prevents javascript Date "rollover")
//                        (defaults to false). Invalid date strings will return null when parsed.
//     * @return {Date} The parsed Date.
//     * @static
//     */
//    parse : function(input, format, strict) {
//        var p = utilDate.parseFunctions;
//        if (p[format] == null) {
//            utilDate.createParser(format);
//        }
//        return p[format](input, Ext.isDefined(strict) ? strict : utilDate.useStrict);
//    },
//
//    // Backwards compat
//    parseDate: function(input, format, strict){
//        return utilDate.parse(input, format, strict);
//    },
//
//
//    // private
//    getFormatCode : function(character) {
//        var f = utilDate.formatCodes[character];
//
//        if (f) {
//          f = typeof f == 'function'? f() : f;
//          utilDate.formatCodes[character] = f; // reassign function result to prevent repeated execution
//        }
//
//        // note: unknown characters are treated as literals
//        return f || ("'" + Ext.String.escape(character) + "'");
//    },
//
//    // private
//    createFormat : function(format) {
//        var code = [],
//            special = false,
//            ch = '';
//
//        for (var i = 0; i < format.length; ++i) {
//            ch = format.charAt(i);
//            if (!special && ch == "\\") {
//                special = true;
//            } else if (special) {
//                special = false;
//                code.push("'" + Ext.String.escape(ch) + "'");
//            } else {
//                code.push(utilDate.getFormatCode(ch));
//            }
//        }
//        utilDate.formatFunctions[format] = Ext.functionFactory("return " + code.join('+'));
//    },
//
//    // private
//    createParser : (function() {
//        var code = [
//            "var dt, y, m, d, h, i, s, ms, o, z, zz, u, v,",
//                "def = Ext.Date.defaults,",
//                "results = String(input).match(Ext.Date.parseRegexes[{0}]);", // either null, or an array of matched strings
//
//            "if(results){",
//                "{1}",
//
//                "if(u != null){", // i.e. unix time is defined
//                    "v = new Date(u * 1000);", // give top priority to UNIX time
//                "}else{",
//                    // create Date object representing midnight of the current day;
//                    // this will provide us with our date defaults
//                    // (note: clearTime() handles Daylight Saving Time automatically)
//                    "dt = Ext.Date.clearTime(new Date);",
//
//                    // date calculations (note: these calculations create a dependency on Ext.Number.from())
//                    "y = Ext.Number.from(y, Ext.Number.from(def.y, dt.getFullYear()));",
//                    "m = Ext.Number.from(m, Ext.Number.from(def.m - 1, dt.getMonth()));",
//                    "d = Ext.Number.from(d, Ext.Number.from(def.d, dt.getDate()));",
//
//                    // time calculations (note: these calculations create a dependency on Ext.Number.from())
//                    "h  = Ext.Number.from(h, Ext.Number.from(def.h, dt.getHours()));",
//                    "i  = Ext.Number.from(i, Ext.Number.from(def.i, dt.getMinutes()));",
//                    "s  = Ext.Number.from(s, Ext.Number.from(def.s, dt.getSeconds()));",
//                    "ms = Ext.Number.from(ms, Ext.Number.from(def.ms, dt.getMilliseconds()));",
//
//                    "if(z >= 0 && y >= 0){",
//                        // both the year and zero-based day of year are defined and >= 0.
//                        // these 2 values alone provide sufficient info to create a full date object
//
//                        // create Date object representing January 1st for the given year
//                        // handle years < 100 appropriately
//                        "v = Ext.Date.add(new Date(y < 100 ? 100 : y, 0, 1, h, i, s, ms), Ext.Date.YEAR, y < 100 ? y - 100 : 0);",
//
//                        // then add day of year, checking for Date "rollover" if necessary
//                        "v = !strict? v : (strict === true && (z <= 364 || (Ext.Date.isLeapYear(v) && z <= 365))? Ext.Date.add(v, Ext.Date.DAY, z) : null);",
//                    "}else if(strict === true && !Ext.Date.isValid(y, m + 1, d, h, i, s, ms)){", // check for Date "rollover"
//                        "v = null;", // invalid date, so return null
//                    "}else{",
//                        // plain old Date object
//                        // handle years < 100 properly
//                        "v = Ext.Date.add(new Date(y < 100 ? 100 : y, m, d, h, i, s, ms), Ext.Date.YEAR, y < 100 ? y - 100 : 0);",
//                    "}",
//                "}",
//            "}",
//
//            "if(v){",
//                // favour UTC offset over GMT offset
//                "if(zz != null){",
//                    // reset to UTC, then add offset
//                    "v = Ext.Date.add(v, Ext.Date.SECOND, -v.getTimezoneOffset() * 60 - zz);",
//                "}else if(o){",
//                    // reset to GMT, then add offset
//                    "v = Ext.Date.add(v, Ext.Date.MINUTE, -v.getTimezoneOffset() + (sn == '+'? -1 : 1) * (hr * 60 + mn));",
//                "}",
//            "}",
//
//            "return v;"
//        ].join('\n');
//
//        return function(format) {
//            var regexNum = utilDate.parseRegexes.length,
//                currentGroup = 1,
//                calc = [],
//                regex = [],
//                special = false,
//                ch = "";
//
//            for (var i = 0; i < format.length; ++i) {
//                ch = format.charAt(i);
//                if (!special && ch == "\\") {
//                    special = true;
//                } else if (special) {
//                    special = false;
//                    regex.push(Ext.String.escape(ch));
//                } else {
//                    var obj = utilDate.formatCodeToRegex(ch, currentGroup);
//                    currentGroup += obj.g;
//                    regex.push(obj.s);
//                    if (obj.g && obj.c) {
//                        calc.push(obj.c);
//                    }
//                }
//            }
//
//            utilDate.parseRegexes[regexNum] = new RegExp("^" + regex.join('') + "$", 'i');
//            utilDate.parseFunctions[format] = Ext.functionFactory("input", "strict", xf(code, regexNum, calc.join('')));
//        };
//    })(),
//
//    // private
//    parseCodes : {
//        /*
//         * Notes:
//         * g = {Number} calculation group (0 or 1. only group 1 contributes to date calculations.)
//         * c = {String} calculation method (required for group 1. null for group 0. {0} = currentGroup - position in regex result array)
//         * s = {String} regex pattern. all matches are stored in results[], and are accessible by the calculation mapped to 'c'
//         */
//        d: {
//            g:1,
//            c:"d = parseInt(results[{0}], 10);\n",
//            s:"(\\d{2})" // day of month with leading zeroes (01 - 31)
//        },
//        j: {
//            g:1,
//            c:"d = parseInt(results[{0}], 10);\n",
//            s:"(\\d{1,2})" // day of month without leading zeroes (1 - 31)
//        },
//        D: function() {
//            for (var a = [], i = 0; i < 7; a.push(utilDate.getShortDayName(i)), ++i); // get localised short day names
//            return {
//                g:0,
//                c:null,
//                s:"(?:" + a.join("|") +")"
//            };
//        },
//        l: function() {
//            return {
//                g:0,
//                c:null,
//                s:"(?:" + utilDate.dayNames.join("|") + ")"
//            };
//        },
//        N: {
//            g:0,
//            c:null,
//            s:"[1-7]" // ISO-8601 day number (1 (monday) - 7 (sunday))
//        },
//        S: {
//            g:0,
//            c:null,
//            s:"(?:st|nd|rd|th)"
//        },
//        w: {
//            g:0,
//            c:null,
//            s:"[0-6]" // javascript day number (0 (sunday) - 6 (saturday))
//        },
//        z: {
//            g:1,
//            c:"z = parseInt(results[{0}], 10);\n",
//            s:"(\\d{1,3})" // day of the year (0 - 364 (365 in leap years))
//        },
//        W: {
//            g:0,
//            c:null,
//            s:"(?:\\d{2})" // ISO-8601 week number (with leading zero)
//        },
//        F: function() {
//            return {
//                g:1,
//                c:"m = parseInt(Ext.Date.getMonthNumber(results[{0}]), 10);\n", // get localised month number
//                s:"(" + utilDate.monthNames.join("|") + ")"
//            };
//        },
//        M: function() {
//            for (var a = [], i = 0; i < 12; a.push(utilDate.getShortMonthName(i)), ++i); // get localised short month names
//            return Ext.applyIf({
//                s:"(" + a.join("|") + ")"
//            }, utilDate.formatCodeToRegex("F"));
//        },
//        m: {
//            g:1,
//            c:"m = parseInt(results[{0}], 10) - 1;\n",
//            s:"(\\d{2})" // month number with leading zeros (01 - 12)
//        },
//        n: {
//            g:1,
//            c:"m = parseInt(results[{0}], 10) - 1;\n",
//            s:"(\\d{1,2})" // month number without leading zeros (1 - 12)
//        },
//        t: {
//            g:0,
//            c:null,
//            s:"(?:\\d{2})" // no. of days in the month (28 - 31)
//        },
//        L: {
//            g:0,
//            c:null,
//            s:"(?:1|0)"
//        },
//        o: function() {
//            return utilDate.formatCodeToRegex("Y");
//        },
//        Y: {
//            g:1,
//            c:"y = parseInt(results[{0}], 10);\n",
//            s:"(\\d{4})" // 4-digit year
//        },
//        y: {
//            g:1,
//            c:"var ty = parseInt(results[{0}], 10);\n"
//                + "y = ty > Ext.Date.y2kYear ? 1900 + ty : 2000 + ty;\n", // 2-digit year
//            s:"(\\d{1,2})"
//        },
//        /*
//         * In the am/pm parsing routines, we allow both upper and lower case
//         * even though it doesn't exactly match the spec. It gives much more flexibility
//         * in being able to specify case insensitive regexes.
//         */
//        a: {
//            g:1,
//            c:"if (/(am)/i.test(results[{0}])) {\n"
//                + "if (!h || h == 12) { h = 0; }\n"
//                + "} else { if (!h || h < 12) { h = (h || 0) + 12; }}",
//            s:"(am|pm|AM|PM)"
//        },
//        A: {
//            g:1,
//            c:"if (/(am)/i.test(results[{0}])) {\n"
//                + "if (!h || h == 12) { h = 0; }\n"
//                + "} else { if (!h || h < 12) { h = (h || 0) + 12; }}",
//            s:"(AM|PM|am|pm)"
//        },
//        g: function() {
//            return utilDate.formatCodeToRegex("G");
//        },
//        G: {
//            g:1,
//            c:"h = parseInt(results[{0}], 10);\n",
//            s:"(\\d{1,2})" // 24-hr format of an hour without leading zeroes (0 - 23)
//        },
//        h: function() {
//            return utilDate.formatCodeToRegex("H");
//        },
//        H: {
//            g:1,
//            c:"h = parseInt(results[{0}], 10);\n",
//            s:"(\\d{2})" //  24-hr format of an hour with leading zeroes (00 - 23)
//        },
//        i: {
//            g:1,
//            c:"i = parseInt(results[{0}], 10);\n",
//            s:"(\\d{2})" // minutes with leading zeros (00 - 59)
//        },
//        s: {
//            g:1,
//            c:"s = parseInt(results[{0}], 10);\n",
//            s:"(\\d{2})" // seconds with leading zeros (00 - 59)
//        },
//        u: {
//            g:1,
//            c:"ms = results[{0}]; ms = parseInt(ms, 10)/Math.pow(10, ms.length - 3);\n",
//            s:"(\\d+)" // decimal fraction of a second (minimum = 1 digit, maximum = unlimited)
//        },
//        O: {
//            g:1,
//            c:[
//                "o = results[{0}];",
//                "var sn = o.substring(0,1),", // get + / - sign
//                    "hr = o.substring(1,3)*1 + Math.floor(o.substring(3,5) / 60),", // get hours (performs minutes-to-hour conversion also, just in case)
//                    "mn = o.substring(3,5) % 60;", // get minutes
//                "o = ((-12 <= (hr*60 + mn)/60) && ((hr*60 + mn)/60 <= 14))? (sn + Ext.String.leftPad(hr, 2, '0') + Ext.String.leftPad(mn, 2, '0')) : null;\n" // -12hrs <= GMT offset <= 14hrs
//            ].join("\n"),
//            s: "([+\-]\\d{4})" // GMT offset in hrs and mins
//        },
//        P: {
//            g:1,
//            c:[
//                "o = results[{0}];",
//                "var sn = o.substring(0,1),", // get + / - sign
//                    "hr = o.substring(1,3)*1 + Math.floor(o.substring(4,6) / 60),", // get hours (performs minutes-to-hour conversion also, just in case)
//                    "mn = o.substring(4,6) % 60;", // get minutes
//                "o = ((-12 <= (hr*60 + mn)/60) && ((hr*60 + mn)/60 <= 14))? (sn + Ext.String.leftPad(hr, 2, '0') + Ext.String.leftPad(mn, 2, '0')) : null;\n" // -12hrs <= GMT offset <= 14hrs
//            ].join("\n"),
//            s: "([+\-]\\d{2}:\\d{2})" // GMT offset in hrs and mins (with colon separator)
//        },
//        T: {
//            g:0,
//            c:null,
//            s:"[A-Z]{1,4}" // timezone abbrev. may be between 1 - 4 chars
//        },
//        Z: {
//            g:1,
//            c:"zz = results[{0}] * 1;\n" // -43200 <= UTC offset <= 50400
//                  + "zz = (-43200 <= zz && zz <= 50400)? zz : null;\n",
//            s:"([+\-]?\\d{1,5})" // leading '+' sign is optional for UTC offset
//        },
//        c: function() {
//            var calc = [],
//                arr = [
//                    utilDate.formatCodeToRegex("Y", 1), // year
//                    utilDate.formatCodeToRegex("m", 2), // month
//                    utilDate.formatCodeToRegex("d", 3), // day
//                    utilDate.formatCodeToRegex("h", 4), // hour
//                    utilDate.formatCodeToRegex("i", 5), // minute
//                    utilDate.formatCodeToRegex("s", 6), // second
//                    {c:"ms = results[7] || '0'; ms = parseInt(ms, 10)/Math.pow(10, ms.length - 3);\n"}, // decimal fraction of a second (minimum = 1 digit, maximum = unlimited)
//                    {c:[ // allow either "Z" (i.e. UTC) or "-0530" or "+08:00" (i.e. UTC offset) timezone delimiters. assumes local timezone if no timezone is specified
//                        "if(results[8]) {", // timezone specified
//                            "if(results[8] == 'Z'){",
//                                "zz = 0;", // UTC
//                            "}else if (results[8].indexOf(':') > -1){",
//                                utilDate.formatCodeToRegex("P", 8).c, // timezone offset with colon separator
//                            "}else{",
//                                utilDate.formatCodeToRegex("O", 8).c, // timezone offset without colon separator
//                            "}",
//                        "}"
//                    ].join('\n')}
//                ];
//
//            for (var i = 0, l = arr.length; i < l; ++i) {
//                calc.push(arr[i].c);
//            }
//
//            return {
//                g:1,
//                c:calc.join(""),
//                s:[
//                    arr[0].s, // year (required)
//                    "(?:", "-", arr[1].s, // month (optional)
//                        "(?:", "-", arr[2].s, // day (optional)
//                            "(?:",
//                                "(?:T| )?", // time delimiter -- either a "T" or a single blank space
//                                arr[3].s, ":", arr[4].s,  // hour AND minute, delimited by a single colon (optional). MUST be preceded by either a "T" or a single blank space
//                                "(?::", arr[5].s, ")?", // seconds (optional)
//                                "(?:(?:\\.|,)(\\d+))?", // decimal fraction of a second (e.g. ",12345" or ".98765") (optional)
//                                "(Z|(?:[-+]\\d{2}(?::)?\\d{2}))?", // "Z" (UTC) or "-0530" (UTC offset without colon delimiter) or "+08:00" (UTC offset with colon delimiter) (optional)
//                            ")?",
//                        ")?",
//                    ")?"
//                ].join("")
//            };
//        },
//        U: {
//            g:1,
//            c:"u = parseInt(results[{0}], 10);\n",
//            s:"(-?\\d+)" // leading minus sign indicates seconds before UNIX epoch
//        }
//    },
//
//    //Old Ext.Date prototype methods.
//    // private
//    dateFormat: function(date, format) {
//        return utilDate.format(date, format);
//    },
//
//    /**
//     * Formats a date given the supplied format string.
//     * @param {Date} date The date to format
//     * @param {String} format The format string
//     * @return {String} The formatted date
//     */
//    format: function(date, format) {
//        if (utilDate.formatFunctions[format] == null) {
//            utilDate.createFormat(format);
//        }
//        var result = utilDate.formatFunctions[format].call(date);
//        return result + '';
//    }  
//    })(),
//
//    //Maintains compatibility with old static and prototype window.Date methods.
//    compat: function() {
//        var nativeDate = window.Date,
//            p, u,
//            statics = ['useStrict', 'formatCodeToRegex', 'parseFunctions', 'parseRegexes', 'formatFunctions', 'y2kYear', 'MILLI', 'SECOND', 'MINUTE', 'HOUR', 'DAY', 'MONTH', 'YEAR', 'defaults', 'dayNames', 'monthNames', 'monthNumbers', 'getShortMonthName', 'getShortDayName', 'getMonthNumber', 'formatCodes', 'isValid', 'parseDate', 'getFormatCode', 'createFormat', 'createParser', 'parseCodes'],
//            proto = ['dateFormat', 'format', 'getTimezone', 'getGMTOffset', 'getDayOfYear', 'getWeekOfYear', 'isLeapYear', 'getFirstDayOfMonth', 'getLastDayOfMonth', 'getDaysInMonth', 'getSuffix', 'clone', 'isDST', 'clearTime', 'add', 'between'];
//
//        //Append statics
//        Ext.Array.forEach(statics, function(s) {
//            nativeDate[s] = utilDate[s];
//        });
//
//        //Append to prototype
//        Ext.Array.forEach(proto, function(s) {
//            nativeDate.prototype[s] = function() {
//                var args = Array.prototype.slice.call(arguments);
//                args.unshift(this);
//                return utilDate[s].apply(utilDate, args);
//            };
//        });
//    }
//};
//
//var utilDate = Ext.Date;
//
//})();
//



function formatTime(t) {
		             var nt = (new Date()).getTime(),
		             diff = Math.round((nt-parseInt(t))/1000),
		             mf = Math.floor;
		          var day = mf(diff/60/60/24)==0 ? '' : mf(diff/60/60/24)+'天',
		             hour = mf(diff/60/60%24)==0 ? '' : mf(diff/60/60%24)+'小时',
		             min = mf(diff/60%60)==0 ? '' : mf(diff/60%60)+'分',
		             sec = mf(diff%60)<10?"0"+mf(diff%60)+'秒前':mf(diff%60)+'秒前',
				     res = day+hour+min+sec;
				  return res;
		       }
