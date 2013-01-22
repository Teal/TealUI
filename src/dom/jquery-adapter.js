

include("core/class.js");

var Dom = (function($){

    var Dom = Class.Native(function(selector, context){

    });

    Dom.prototype = $();

})(jQuery);

Class.Native(function (selector, context) {
    return new jQuery.fn.init(selector, context, rootjQuery);
});