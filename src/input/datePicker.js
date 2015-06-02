/**
 * @author xuld
 */

// #require ui/part/icon.css
// #require ui/suggest/picker.js
// #require ui/composite/monthcalender.js

var DatePicker = Picker.extend({
	
    format: 'yyyy/M/d',

    dropDownWidth: 'auto',
	
	initDropDown: function (dropDown) {
	    var me = this;
	    dropDown.classList.add('x-calender');
	    me.calender = Control.get(dropDown, 'calender', {
	        format: this.format
	    }).on('select', function (value) {
	        me.onCalenderSelect(value);
	        return false;
	    }).on('change', function () {
	        me.setValue(this.getValue());
	    });
	},
	
	onCalenderSelect: function(value) {
	    this.setValue(value);
	    this.dropDown.hide();
	},
	
	updateDropDown: function(){
	    var d = new Date(this.getInput().value);
		if(!isNaN(d.getYear()))
		    this.calender.setValue(d);
	},
	
	getValue: function() {
	    return Date.from(this.getInput().value);
	},
	
	setValue: function (value) {
	    if (this.getValue() !== value) {
	        this.getInput().value = value.format(this.format);
	        this.trigger('change');
	    }
		return this;
	}

});
