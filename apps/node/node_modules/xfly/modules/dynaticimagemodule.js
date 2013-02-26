

var Canvas = require('../../node/node_modules/canvas');

var defaultConfigs = {
	width: 100,
	height: 100,
	extname: '.jpg',
	color: '234323',
	text: '{width}*{height}'
};

function createImage(context, width, height, extname, color, text){
	console.log(width, height, extname, color, text);
	
	context.response.end();
}

exports.processRequest = function(context){
	var m = /@((\d+)\D+(\d+))?(.*)\.(jpg|png|gif|bmp|ico)$/i.exec(context.request.filePath);
	
	var configs = context.applicationInstance.getConfig('dynaticImage');
	
	if(m) {
		var width = +m[2];
		var height = +m[3];
		var extname = m[5] ? '.' + m[5] : (configs.extname || defaultConfigs.extname);
		var color;
		var text = m[4];
		
		if(text){
			m = /\b([0-9A-Za-z]{6})\b/.exec(text);
			if(m){
				color = m[1];
				text = text.replace(m[0], "");
			} else {
				color =  configs.color || defaultConfigs.color;
			}
			
			text = text.replace(/^[-:,]+|[-:,]+$/g, "");
			
			if(text){
				if(width && height)
					text += ' (' + defaultConfigs.text + ')';
			} else {
				text = configs.text || defaultConfigs.text;
			}
		} else {
			color = configs.color || defaultConfigs.color;
			text = configs.text || defaultConfigs.text;
		}
		
		width = width || configs.width || defaultConfigs.width;
		height = height || configs.height || defaultConfigs.height;
		
		text = text.replace('{width}', width).replace('{height}', height).replace('{extname}', extname);
	
		createImage(
			context,
			width,
			height,
			extname,
			color,
			text
		);
		
		return true;
	}
	
	
	return false;
};
