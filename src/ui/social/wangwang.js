/**
 * @author 
 */

var Wangwang = {

    openIM: function (strPa1, strPa2, strSite, strID, strPa5, strPa6) {

        var arr = new Array;

        arr[0] = "aliim:sendmsg?uid=" + strSite + "&touid=" + strSite;

        arr[1] = strID;

        arr[2] = "&siteid=" + strSite + "&status=1&charset=utf-8&v=1&s=0";

        var url = arr.join("");

        window.location.href = url;

    },

    write: function () {
    
    }


};