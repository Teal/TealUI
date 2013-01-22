/**
 * @author 
 */




using("System.Browser.Base");


Browser.noContextMenu = function () {
    document.oncontextmenu = document.onselectstart = function () {
        return false;
    };
};
