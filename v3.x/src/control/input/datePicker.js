/**
 * @author xuld
 */

typeof include === "function" && include("../partial/icon");
typeof include === "function" && include("picker");
typeof include === "function" && include("../form/calender");

var DatePicker = Picker.extend({

    /**
     * 设置下拉菜单的宽度。如果为百分数，则根据目标节点自动调整。
     */
    dropDownWidth: 'auto',

    /**
     * 设置使用的日历组件。
     */
    calenderRole: 'calender',
	
	initDropDown: function () {
	    var me = this;
	    me.dropDown.elem.classList.add('x-calender');
	    me.calender = Control.get(me.dropDown.elem, this.calenderRole).on('select', function (value) {
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
	    if (+d)
	        me.calender.setValue(d);
	},

	onCalenderSelect: function(value) {
	    this.setValue(value);
	    this.dropDown.hide();
	},
	
	getValue: function() {
	    return Date.from(this.getInput().value, this.calender.format);
	},
	
	setValue: function (value) {
	    if (this.getValue() !== value) {
	        this.getInput().value = value.format(this.calender.format);
	        this.trigger('change');
	    }
		return this;
	}

});
