
/**
 * @author 
 */

var WangWang = {

	link: "aliim:sendmsg?uid={wangWangId}&touid={wangWangId}&siteid={siteId}&status=1&charset=utf-8&v=1&s=0",

	image: "http://amos.im.alisoft.com/online.aw?v=1&uid={wangWangId}&site={siteId}&s=1$charset=utf-8",

    openIM: function (strPa1, strPa2, strSite, strID, strPa5, strPa6) {

        var arr = new Array;

        arr[0] = "aliim:sendmsg?uid=" + strSite + "&touid=" + strSite;

        arr[1] = strID;

        arr[2] = "&siteid=" + strSite + "&status=1&charset=utf-8&v=1&s=0";

        var url = arr.join("");

        window.location.href = url;

    },

    write: function (wangWangId, siteId) {

    	function format(input) {
    		return input.replace(/\{wangWangId\}/ig, wangWangId).replace(/\{siteId\}/ig, siteId || "taobao").replace(/&/g, "&amp;");
    	}

    	document.write('<a href="' + format(WangWang.link) + '"><img border="0" alt="ÍúÍú" src="' + format(WangWang.image) + '" style="vertical-align:-4px"></a>');
    }

};