/**
 * @author  xuld
 */
include("ui/form/radiobutton.css");
include("ui/core/base.js");
include("ui/core/iinput.js");


var RadioButton = Control.extend(IInput).implement({

    xtype: 'radiobutton',

    tpl: '<input type="radio" class="ui-control">'

});
