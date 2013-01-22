



using("System.Browser.Base");



Browser.pngFix = navigator.isIE6 ? function () {

	var images = document.images;

	for (var i = 0; i < images.length; i++) {
		var img = images[i];
		var imgName = img.src.toUpperCase();
		if (imgName.substring(imgName.length - 3, imgName.length) == "PNG") {
			var imgID = (img.id) ? "id='" + img.id + "' " : "";
			var imgClass = (img.className) ? "class='" + img.className + "' " : "";
			var imgTitle = (img.title) ? "title='" + img.title + "' " : "title='" + img.alt + "' ";
			var imgStyle = "display:inline-block;" + img.style.cssText;
			if (img.pin == "left")
				imgStyle = "float:left;" + imgStyle;
			if (img.pin == "right")
				imgStyle = "float:right;" + imgStyle;
			if (img.parentElement.href)
				imgStyle = "cursor:hand;" + imgStyle;
			var strNewHTML = "<span " + imgID + imgClass + imgTitle +
				" style=\"" +
				"width:" +
				img.width +
				"px; margin:6px; height:" +
				img.height +
				"px;" +
				imgStyle +
				";" +
				"filter:progid:DXImageTransform.Microsoft.AlphaImageLoader" +
				"(src=\'" +
				img.src +
				"\', sizingMethod='scale');\"></span>";
			img.outerHTML = strNewHTML;
			i = i - 1;
		}
	}

} : Function.empty;