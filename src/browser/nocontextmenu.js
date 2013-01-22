/**
 * @author 
 */




include("browser/base.js");


Browser.noContextMenu = function () {
    document.oncontextmenu = document.onselectstart = function () {
        return false;
    };
};
