/**
 * @author 
 */



/**
 * @author chunterg
 */

var Starrating = {
    init: function () {
        var me = this;
        me.setRate();
        if (Dom.query('.ui-starrating-do').getAttr('read-only') == "") {
            Dom.query('.ui-starrating-do-ul a').on('click', function () {
                me.setRate(this.getAttr('data-rate'), true, this.getAttr('title'));
            }).on('mouseenter', function () {
                me.setRate(this.getAttr('data-rate'), false, this.getAttr('title'));
            }).on('mouseout', function () {
                me.setRate();
            })
        } else {
            Dom.query('.ui-starrating-do span.ui-left').setText('���Ѿ���������');
            Dom.query('.ui-starrating-readonly').setStyle('z-index', 10);
        }
    },
    setRate: function (rate, isClick, grade) {
        var current = Dom.query('.ui-starrating-current');
        if (rate && isClick) {
            Dom.get('ui-starrating-do-result').setText(rate);
            Dom.get('ui-starrating-do-result').setAttr('data-grade', grade);
            Dom.get('ui-starrating-grade').setText(grade);
            //current.setWidth(rate+'%');
        } else if (rate) {
            current.setWidth(0);
            Dom.query('#ui-starrating-grade').setText(grade);
        } else {
            var currentRate = Dom.get('ui-starrating-do-result').getText() || 0;
            current.setWidth(currentRate + '%');
            if (currentRate) {
                Dom.get('ui-starrating-grade').setText(Dom.get('ui-starrating-do-result').getAttr('data-grade'));
            } else {
                Dom.get('ui-starrating-grade').setText('');
            }
        }

    }
}

