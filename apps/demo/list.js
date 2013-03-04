

/**
 * 将 Articles 转为瀑布流。
 * @param {Integer} column 列号。
 */
Demo.waterFall = function (column) {

    var articles = document.getElementsByTagName("ARTICLE"),
        articlesIndex,
        sections,
        len,
        heights = [],
        section,
        min,
        minIndex,
        baseHeight = 14,
        marginRight = 10,
        marginBottom = 25,
		eachWidth,
        columnWidth,
        i,
        j;

    // 每个 ARTICLE 分开处理。
    for (articlesIndex = 0; articles[articlesIndex]; articlesIndex++) {

    	// 获取内部 SECTION 的数目。
    	sections = articles[articlesIndex].getElementsByTagName("SECTION");
    	len = sections.length;

    	// 如果确实存在一个 SECTION， 且 SECTION.className === "demo"，说明此 ARTICLE 内需要重新布局为瀑布流。
    	if (len) {

    		articles[articlesIndex].style.position = 'relative';

    		var eachWidth = (articles[articlesIndex].offsetWidth - marginRight * (column - 1) - 1) / column;

    		heights.length = 0;
    		columnWidth = eachWidth + marginRight;

            // 第一行不处理。
            for (i = 0; i < column; i++) {
            	if (section = sections[i]) {
            		section.style.cssText = 'float:left;width:' + eachWidth + 'px;margin-right:' + (i == column - 1 ? 0 : marginRight) + 'px;margin-top:' + baseHeight + 'px';
            		heights[i] = baseHeight + section.offsetHeight + marginBottom;
                }
            }

            // 每个块依次选择合适的位置。
            for (i = column; i < len; i++) {
                min = Infinity;
                for (j = heights.length; --j >= 0;) {
                    if (min >= heights[j]) {
                        minIndex = j;
                        min = heights[j];
                    }
                }

                section = sections[i];
                section.style.cssText = 'position:absolute;width:' + eachWidth + 'px;top:' + min + 'px;left:' + minIndex * columnWidth + 'px';

                heights[minIndex] += section.offsetHeight + marginBottom;
            }

            max = 0;
            for (j = heights.length; --j >= 0;) {
                if (max < heights[j]) {
                    max = heights[j];
                }
            }

            articles[articlesIndex].style.height = max - marginBottom - baseHeight + 'px';
        }

    }

};

Demo.writeList = function (list, column) {

	var html = '', data, name;

	var isFirst = true;

    for (name in list) {
    	data = list[name];

    	if (isFirst) {
    		isFirst = false;
    		if (data === "-") {
    			html += '<section class="demo"><h3 class="demo" style="margin-top:0;">' + name + '</h3><ul class="demo demo-plain">';
    			continue;
    		}
    		html += '<section class="demo"><h3 class="demo" style="margin-top:0;">列表</h3><ul class="demo list">';
    	}

    	if (data === "-") {
    		html += '</ul></section>';
    		html += '<section class="demo"><h3 class="demo" style="margin-top:0;">' + name + '</h3><ul class="demo demo-plain">';
    	} else {
    		html += '<li style="margin:0;list-style:disc inside;color:#E2E2EB;font-size:14px;line-height:24px;height:24px;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;"><a class="demo" href="' + data.replace(/^~\//, Demo.baseUrl) + '" title="' + name + '"' + (/http\s?:\/\//i.test(data) ? ' target="_blank"' : '') + '>' + name + '</a></li>';

    		// <small style="color: #999999;"> - ' + name + '</small>
    	}
    }

    html += '</ul></section>';
    document.write(html);

    if (column) {
    	Demo.waterFall(column);
    }
};
