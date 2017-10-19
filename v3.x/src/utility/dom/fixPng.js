/**
 * @author xuld
 */

/**
 * 让 IE6 支持透明 PNG。
 * @param {Element} [image] 修复的图片节点。如不指定则修复整个文档的图片。 
 * @example 
 * ##### 修复当前页面的所有图片
 * fixPng()
 * 
 * ##### 修复指定图片
 * fixPng(doument.getElementById("id"))
 */
function fixPng(image) {
    /*@cc_on if(typeof XMLHttpRequest === "undefined" || typeof XMLHttpRequest === "function") {
	if(!image) {
		var images = document.images;
		for (var i = 0; image = images[i]; i++) {
			fixPng(image);
		}
	} else if (/\.png\b/.test(image.src)) {
		var imgID = (image.id) ? "id='" + image.id + "' " : "",
            imgClass = (image.className) ? "class='" + image.className + "' " : "",
		    imgTitle = (image.title) ? "title='" + image.title + "' " : "title='" + image.alt + "' ",
		    imgStyle = "display:inline-block;" + image.style.cssText;

		if (image.pin == "left")
			imgStyle = "float:left;" + imgStyle;
		if (image.pin == "right")
			imgStyle = "float:right;" + imgStyle;
		if (image.parentElement.href)
			imgStyle = "cursor:hand;" + imgStyle;
		image.outerHTML = "<span " + imgID + imgClass + imgTitle +
			" style=\"" +
			"width:" +
			image.width +
			"px; margin:6px; height:" +
			image.height +
			"px;" +
			imgStyle +
			";" +
			"filter:progid:DXImageTransform.Microsoft.AlphaImageLoader" +
			"(src=\'" +
			image.src +
			"\', sizingMethod='scale');\"></span>";
	}
    } @*/
}
