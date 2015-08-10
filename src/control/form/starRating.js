/**
 * @author chunterg, xuld
 */

var Starrating = Control.extend({
	
	cssClass: 'x-starrating',
	
    init: function () {
        var me = this;
        me.setRate();
        if (Dom.query('.x-starrating-do').getAttr('read-only') == "") {
            Dom.query('.x-starrating-do-ul a').on('click', function () {
                me.setRate(this.getAttr('x-rate'), true, this.getAttr('title'));
            }).on('mouseenter', function () {
                me.setRate(this.getAttr('x-rate'), false, this.getAttr('title'));
            }).on('mouseout', function () {
                me.setRate();
            })
        } else {
            Dom.query('.x-starrating-do span.x-left').setText('���Ѿ���������');
            Dom.query('.x-starrating-readonly').setStyle('z-index', 10);
        }
    },
    
    setRate: function (rate, isClick, grade) {
        var current = Dom.query('.x-starrating-current');
        if (rate && isClick) {
            Dom.get('x-starrating-do-result').setText(rate);
            Dom.get('x-starrating-do-result').setAttr('x-grade', grade);
            Dom.get('x-starrating-grade').setText(grade);
            //current.setWidth(rate+'%');
        } else if (rate) {
            current.setWidth(0);
            Dom.query('#x-starrating-grade').setText(grade);
        } else {
            var currentRate = Dom.get('x-starrating-do-result').getText() || 0;
            current.setWidth(currentRate + '%');
            if (currentRate) {
                Dom.get('x-starrating-grade').setText(Dom.get('x-starrating-do-result').getAttr('x-grade'));
            } else {
                Dom.get('x-starrating-grade').setText('');
            }
        }

    }
});
