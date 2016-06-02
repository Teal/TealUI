// #todo

/**
 * @author xuld@vip.qq.com
 */

// #require panel

Control.extend({

    role: 'accordion',

    init: function (options) {

        var me = this;

        var panels = me.panels = [];

        var triggerBySelf = false;

        me.dom.children().each(function(panelElem, index) {

            // ��ʼΪ���塣
            var panel = panels[index] = Dom(panelElem).role('panel');

            panel.on('collapsing', function(value) {

                if (triggerBySelf) {
                    return;
                }

                // ��ֹ�۵���ǰ�
                if (value == true || !me.trigger('changing', this)) {
                    return false;
                }

                triggerBySelf = true;

                // չ����ǰ��ͬʱ�۵������
                for (var i = 0; i < panels.length; i++) {
                    if (this !== panels[i]) {
                        panels[i].toggleCollapse(true);
                    }
                }

                triggerBySelf = false;

                me.trigger('change', this);

            });

        });

    }

});
