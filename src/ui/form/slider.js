/** * @author xuld */using("System.Dom.Drag");var Slider = Control.extend({

    tpl: '<div class="x-slider">\
                <div class="x-slider-range"></div>\
                <a href="javascript:;" class="x-slider-handle"></a>\
            </div>',
    init: function () {
        this.query('.x-slider-handle').draggable();
    },    setValue: function (value) {
        this.find('.x-slider-range').setWidth(value + '%');
        return this;
    },    getValue: function () {
        return parseInt(this.find('.x-slider-range').getWidth());
    }});