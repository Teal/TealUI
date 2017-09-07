


//#include core/base.js
//#include text/querystring.js


// Chrome 23 可能更新 location
// Firefox 无法扩展 location
(!navigator.isFirefox && location.constructor ? location.constructor.prototype : location).query = QueryString.parse(location.search);