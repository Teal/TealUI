/**
 * @author xuld
 */

//#include ui/part/icon.css
//#include ui/suggest/picker.js
//#include ui/composite/monthcalender.js

var DatePicker = Picker.extend({
	
	dataStringFormat: 'yyyy/M/d',
	
	dropDownWidth: 'auto',
	
	menuButtonTpl: '<button class="x-button" type="button"><span class="x-icon x-icon-calendar"></span></button>',
	
	createDropDown: function(existDom){
		return new MonthCalender(existDom).on('selecting', this.onItemClick, this);
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
		var d = new Date(Dom.getText(this.input()));
		if(!isNaN(d.getYear()))
			this.dropDown.setValue(d);
	},
	
	getValue: function(){
		return new Date(Dom.getText(this.input()));
	},
	
	setValue: function(value){
		Dom.setText(this.input(), value.toString(this.dataStringFormat));
		return this;
	}

});
