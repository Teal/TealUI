
	
var QueryString = require('querystring');
	
/**
 * 专用于 HTTP 键值存储格式的集合。
 * @class
 */
function HttpValueCollection(){
}

HttpValueCollection.prototype.fillFromString = function(s){
	var data = QueryString.parse(s);
	for(var key in data){
		this[key] = data[key];
	}
};

HttpValueCollection.prototype.toString = function(){
	return QueryString.stringify(this);
};
	 
module.exports = HttpValueCollection;