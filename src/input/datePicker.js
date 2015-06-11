/**
 * @author xuld
 */

// #require ../partial/icon
// #require picker
// #require ../form/calender

var DatePicker = Picker.extend({
	
    dropDownWidth: 'auto',
	
	initDropDown: function () {
	    var me = this;
	    me.dropDown.elem.classList.add('x-calender');
	    me.calender = Control.get(me.dropDown.elem, 'calender').on('select', function (value) {
	        me.onCalenderSelect(value);
	        return false;
	    }).on('change', function () {
	        me.setValue(this.getValue());
	    });
	},

	setFormat: function (value) {
	    this.calender.setFormat(value);
    },

    setNow: function (value) {
        this.calender.setNow(value);
    },

	updateDropDown: function () {
	    var me = this,
            d = Date.from(me.getInput().value, me.calender.format);
	    if (d && !isNaN(d.getYear()))
	        me.calender.setValue(d);
	},

	onCalenderSelect: function(value) {
	    this.setValue(value);
	    this.dropDown.hide();
	},
	
	getValue: function() {
	    return Date.from(this.getInput().value);
	},
	
	setValue: function (value) {
	    if (this.getValue() !== value) {
	        this.getInput().value = value.format(this.calender.format);
	        this.trigger('change');
	    }
		return this;
	}

});
