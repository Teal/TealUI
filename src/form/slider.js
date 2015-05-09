/** * @author xuld *///#include dom/drag.jsvar Slider = Control.extend({    role: 'slider',        tpl: '<div class="x-slider" data-role="slider">\
            <div class="x-slider-fore" style="{start}"></div>\
            <a href="###" class="x-slider-handle" style="{start}" ondrag="{dragEvent}"></a>\
            <a href="###" class="x-slider-handle" style="left: 76%;" ondrag="{dragEvent}"></a>\
        </div>',    options: {
        step: 1,
        min: 1,
        max: 100
    },    init: function (elem, options) {
        Dom.draggable(elem, {
            onDrag: function(e) {
                
            }
        });    },    getStart: function (value) {
        this.elem.find('.x-slider-handle:first-child').styleNumber('left');        return this;
    },    setStart: function (value) {
        this.elem.find('.x-slider-fore').setStyle('left', value + '%');
        this.elem.find('.x-slider-handle:first-child').setStyle('left', value + '%');        return this;    },    getEnd: function (value) {
        return this;
    },    setEnd: function (value) {
        return this;
    },    getValue: function () {        return parseInt(this.find('.x-slider-range').getWidth());    }});