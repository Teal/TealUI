
//#include browser/base.js
//#include browser/cookie.js
	
Browser.getSubCookie = function (key, subkey) {
		
};
	
Browser.setSubCookie = function (key, subkey, value, expires, props) {

};

///*
//
//
//
////================================================================================
//
//
//  8 (function(window) {
//  9     var _cql = window.cql,
// 10     _v = window.v,
// 11     _vc = window.vc,
// 12     cql = {};
// 13 
// 14     cql = {
// 15         // encode string
// 16         encode: function(str) {
// 17             return encodeURIComponent(str);
// 18         },
// 19 
// 20         // decode string
// 21         decode: function(str) {
// 22             return decodeURIComponent(str);
// 23         }
// 24     };
// 25 
// 26     /*
// 27     * must give name parameter
// 28     * subItems can be null,string,josn object,array
// 29     * options is optional json object with {expires:new Date("2011/10/20"),path:"/",domain:"localhost",secure:"secure"}
// 30     * example:
// 31     *   1. get cookie:
// 32     *       [cql|vc|v].cookie("cookieName");
// 33     *       if no subCookie then return string, if have return json object with key/value, else return null;
// 34     *       
// 35     *       [cql|vc|v].cookie("cookieName",["subName1","subName2","subName3"]);
// 36     *       if subItems is array, then return json object with key/value
// 37     *
// 38     *
// 39     *   2. set cookie:
// 40     *       [cql|vc|v].cookie("cookieName","cookieValue");
// 41     *       [cql|vc|v].cookie("cookieName",{sub1:"value1",sub2:"value2",sub3:"value3"});
// 42     *       if subItems is string then set the cookie with no subCookie,else set the subCookies,
// 43     *       And have no return value
// 44     *
// 45     *
// 46     *   3. remove cookie:
// 47     *       [cql|vc|v].cookie("cookieName",null);
// 48     *       [cql|vc|v].cookie("cookieName",{sub1:null,sub2:null});
// 49     *       if subItems is null then remove the cookie, if is json object({sub1:null,sub2:null}),
// 50     *       then remove the sub1,sub2 subCookie Items, no return value
// 51     */
// 52     cql.cookie = function(name, subItems, options) {
// 53         // the parameter of name must be specified
// 54         if (!name) {
// 55             return null;
// 56         }
// 57 
// 58         // get all sub cookie value under the name
// 59         if (arguments.length === 1) {
// 60             var cookieName = this.encode(name) + "=",
// 61                 cookieStart = document.cookie.indexOf(cookieName),
// 62                 cookieValue = null,
// 63                 result = {};
// 64 
// 65             if (cookieStart > -1) {
// 66                 cookieStart = cookieStart + cookieName.length;
// 67                 var cookieEnd = document.cookie.indexOf(";", cookieStart);
// 68                 if (cookieEnd === -1) {
// 69                     cookieEnd = document.cookie.length;
// 70                 }
// 71                 cookieValue = document.cookie.substring(cookieStart, cookieEnd);
// 72                 if (cookieValue.length > 0) {
// 73                     if (cookieValue.indexOf("&") === -1) {
// 74                         return this.decode(cookieValue);
// 75                     }
// 76                     var subCookies = cookieValue.split("&");
// 77                     for (var i = 0, len = subCookies.length; i < len; i++) {
// 78                         var parts = subCookies[i].split("=");
// 79                         result[this.decode(parts[0])] = this.decode(parts[1]);
// 80                     }
// 81                     return result;
// 82                 }
// 83             }
// 84             return null;
// 85         }
// 86 
// 87         // get sub cookie value
// 88         if (subItems instanceof Array) {
// 89             var subCookieVal = {},
// 90             cookieItems = this.cookie(name),
// 91             // make sure whether the cookie have sub cookie
// 92             oldItemsVal = (cookieItems instanceof Object ? cookieItems : null) || {};
// 93             $.each(subItems, function(i, val) {
// 94                 subCookieVal[val] = oldItemsVal[val];
// 95             });
// 96             return subCookieVal;
// 97         }
// 98 
// 99         // if subItems is null then remove the cookie,
//100         // if subItems is json set sub cookie into cookie of the name
//101         if (subItems instanceof Object || subItems === null || (subItems.constructor === String)) {
//102             var cookieTxt = this.encode(name) + "=";
//103 
//104             if (subItems === null) {
//105                 cookieTxt += "; expires = " + new Date(0).toGMTString();
//106             }
//107             else {
//108                 var subCookieParts;
//109                 // user only set one cookie no subcookie items
//110                 if ((subItems.constructor === String)) {
//111                     subCookieParts = this.encode(subItems);
//112                 }
//113                 // user set subcookie items
//114                 else {
//115                     // make sure whether the cookie have sub cookie
//116                     cookieItems = this.cookie(name);
//117                     var oldItems = (cookieItems instanceof Object ? cookieItems : null) || {};
//118                     subItems = $.extend(oldItems, subItems);
//119                     subCookieParts = [];
//120                     for (var subName in subItems) {
//121                         if (subName.length > 0 && subItems.hasOwnProperty(subName) && subItems[subName]) {
//122                             subCookieParts.push(this.encode(subName) + "=" + this.encode(subItems[subName]));
//123                         }
//124                     }
//125                 }
//126 
//127                 if (subCookieParts.length > 0) {
//128                     cookieTxt += (subItems.constructor === String) ? subCookieParts : subCookieParts.join("&");
//129 
//130                     if (options && options.length > 0) {
//131                         if (options.expires instanceof Date) {
//132                             cookieTxt += "; expires = " + options.expires.toGMTString();
//133                         }
//134                         if (options.path) {
//135                             cookieTxt += "; path = " + options.path;
//136                         }
//137                         if (options.domain) {
//138                             cookieTxt += "; domain = " + options.domain;
//139                         }
//140                         if (options.secure === "secure") {
//141                             cookieTxt += "; secure";
//142                         }
//143                     }
//144                 }
//145                 else {
//146                     cookieTxt += "; expires = " + new Date(0).toGMTString();
//147                 }
//148             }
//149             document.cookie = cookieTxt;
//150             return;
//151         }
//152     };
//153 
//154     window.cql = window.v = window.vc = cql;
//155 })(window);
//*/