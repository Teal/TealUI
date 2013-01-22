//===========================================
//  颜色         color.js         A
//  By  Valerio Proietti  ( Mootools-more) MIT License
//===========================================




namespace(".Color", Class({
	
	
	
	constructor:  function(color, type) {
		
		if (arguments.length >= 3){
			type = 'rgb'; color = Array.slice(arguments, 0, 3);
		} else if (typeof color == 'string'){
			if (color.match(/rgb/)) color = color.rgbToHex().hexToRgb(true);
			else if (color.match(/hsb/)) color = color.hsbToRgb();
			else color = color.hexToRgb(true);
		}
		type = type || 'rgb';
		switch (type){
			case 'hsb':
				var old = color;
				color = color.hsbToRgb();
				color.hsb = old;
			break;
			case 'hex': color = color.hexToRgb(true); break;
		}
		color.rgb = color.slice(0, 3);
		color.hsb = color.hsb || color.rgbToHsb();
		color.hex = color.rgbToHex();
		return Object.append(color, this);
		
	},
	
	mix: function(){
		var colors = Array.slice(arguments);
		var alpha = (typeOf(colors.getLast()) == 'number') ? colors.pop() : 50;
		var rgb = this.slice();
		colors.each(function(color){
			color = new Color(color);
			for (var i = 0; i < 3; i++) rgb[i] = Math.round((rgb[i] / 100 * (100 - alpha)) + (color[i] / 100 * alpha));
		});
		return new Color(rgb, 'rgb');
	},

	invert: function(){
		return new Color(this.map(function(value){
			return 255 - value;
		}));
	},

	setHue: function(value){
		return new Color([value, this.hsb[1], this.hsb[2]], 'hsb');
	},

	setSaturation: function(percent){
		return new Color([this.hsb[0], percent, this.hsb[2]], 'hsb');
	},

	setBrightness: function(percent){
		return new Color([this.hsb[0], this.hsb[1], percent], 'hsb');
	}
		
}));


Object.extend(Array,  {
	
	rgbToHsb: function(){
		var red = this[0],
				green = this[1],
				blue = this[2],
				hue = 0;
		var max = Math.max(red, green, blue),
				min = Math.min(red, green, blue);
		var delta = max - min;
		var brightness = max / 255,
				saturation = (max != 0) ? delta / max : 0;
		if (saturation != 0){
			var rr = (max - red) / delta;
			var gr = (max - green) / delta;
			var br = (max - blue) / delta;
			if (red == max) hue = br - gr;
			else if (green == max) hue = 2 + rr - br;
			else hue = 4 + gr - rr;
			hue /= 6;
			if (hue < 0) hue++;
		}
		return [Math.round(hue * 360), Math.round(saturation * 100), Math.round(brightness * 100)];
	},

	hsbToRgb: function(){
		var br = Math.round(this[2] / 100 * 255);
		if (this[1] == 0){
			return [br, br, br];
		} else {
			var hue = this[0] % 360;
			var f = hue % 60;
			var p = Math.round((this[2] * (100 - this[1])) / 10000 * 255);
			var q = Math.round((this[2] * (6000 - this[1] * f)) / 600000 * 255);
			var t = Math.round((this[2] * (6000 - this[1] * (60 - f))) / 600000 * 255);
			switch (Math.floor(hue / 60)){
				case 0: return [br, t, p];
				case 1: return [q, br, p];
				case 2: return [p, br, t];
				case 3: return [p, q, br];
				case 4: return [t, p, br];
				case 5: return [br, p, q];
			}
		}
		return false;
	}
	
	
});


Object.extend(JPlus.Color, {
	
	rgb: function(r, g, b){
		return new Color([r, g, b], 'rgb');
	},
	
	hsb:  function(h, s, b){
		return new Color([h, s, b], 'hsb');
	},
	
	hex: function(hex){
		return new Color(hex, 'hex');
	}
	
	
});




//===========================================
//  设置或获取   color.js    A
//===========================================




using("System.Dom.Base");


Element.implement({


	getColor: function(attr, defaultValue, prefix) {
		var v = this.getStyle(attr);
		if (!v || v == "transparent" || v == "inherit") {
			return defaultValue;
		}
		var color = typeof prefix == "undefined" ? "#" : prefix;
		if (v.substr(0, 4) == "rgb(") {
			var rvs = v.slice(4, v.length - 1).split(",");
			for (var i = 0; i < 3; i++) {
				var h = parseInt(rvs[i]).toString(16);
				if (h < 16) {
					h = "0" + h;
				}
				color += h;
			}
		} else {
			if (v.substr(0, 1) == "#") {
				if (v.length == 4) {
					for (var i = 1; i < 4; i++) {
						var c = v.charAt(i);
						color += c + c;
					}
				} else if (v.length == 7) {
					color += v.substr(1);
				}
			}
		}
		return (color.length > 5 ? color.toLowerCase() : defaultValue);
	},

	setColor: function(value) {
















	}

});



