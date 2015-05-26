/**
 * @author xuld
 */

// #require ui/part/icon.css
// #require ui/suggest/picker.js
// #require ui/composite/monthcalender.js

var DatePicker = Picker.extend({
	
    dataStringFormat: 'yyyy/M/d',

    dropDownWidth: 'auto',
	
	menuButtonTpl: '<button class="x-button" type="button"><span class="x-icon x-icon-calendar"></span></button>',
	
	initDropDown: function (dropDown) {
	    var me = this;
	    dropDown.classList.add('x-calender');
	    me.calender = Control.get(dropDown, 'calender').on('selecting', function (value) {
	        me.onItemClick(value);
	    });
	},
	
	onItemClick: function(value) {
		if(this.trigger('selecting', value)) {
			var old = this.getValue();
			this.setValue(value).hideDropDown();
			if(old !== value){
				this.trigger('change');
			}
			
			return;
		}
		
		return false;
	},
	
	selectItem: function (value) {
		this.onItemClick(value);
		return this;
	},
	
	updateDropDown: function(){
	    var d = new Date(this.getInput().value);
		if(!isNaN(d.getYear()))
		    this.calender.setValue(d);
	},
	
	getValue: function(){
		return new Date(Dom.getText(this.input()));
	},
	
	setValue: function(value){
		Dom.setText(this.input(), value.toString(this.dataStringFormat));
		return this;
	}

});
