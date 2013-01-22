

include("core/class.js");

var Dom = (function($){

    var Dom = Class.Native(function(selector, context){
        return new jQuery.fn.init(selector, context);
    });

    Dom.prototype = $();

    Object.extend(Dom, {

        parse: function () {

        }


    });

    Dom.implement({



    });

})(jQuery);