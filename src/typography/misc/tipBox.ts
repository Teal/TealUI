
/**
 * 表示一个提示框组件。
 */
Control.extend({

    role: 'tipBox',

    init: function () {
        var me = this;
        this.dom.on('click', '.x-closebutton', function () {
            me.close();
        });
    },

    /**
     * 关闭当前提示框。
     */
    close: function() {
        this.dom.hide('height');
    }

});
