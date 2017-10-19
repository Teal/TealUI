/**
 * @author xuld
 */

typeof include === "function" && include("../core/control
");

var Placeholder = Control.extend({

    role: "placeholder",

    init: function () {
        var dom = this.dom;
        dom.next().on("focus", function () {
            dom.hide();
        }).on("blur", function() {
            Dom(this).text() || dom.show();
        });
    }

});