/** * @author xuld */

Dom.ctrlEnter = function(elem, callback) {
    Dom.on(elem, 'keypress', function (e) {
        if (e.ctrlKey && (e.which == 13 || e.which == 10)) {
            return callback.call(this, e);
        }
    });
};