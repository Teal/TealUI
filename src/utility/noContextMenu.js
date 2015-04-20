/**
 * @author xuld
 */


function noContextMenu() {
    document.oncontextmenu = document.onselectstart = function () {
        return false;
    };
};
