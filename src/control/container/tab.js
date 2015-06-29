/**
 * @author xuld
 */

// #require ../control/base

/**
 * 表示一个选项卡。
 */
var Tab = Control.extend({

    role: 'tab',

    init: function () {
        var me = this;
        me.elem.on('click', '.x-tab > li', function (e) {
            me.selectTab(this, e);
        });

        // 设置初始选项卡。
        var body = me.getBody();
        if (body) {
            body.style.position = 'relative';
            NodeList.each(body.children, function(elem) {
                elem.hide();
            });
            var content = body.children[me.getActivedIndex()];
            content && content.show();
        }
    },

    /**
     * 模拟用户选择指定的标签页。
     */
    selectTab: function(tab, e) {
        if (this.trigger('select', tab)) {
            this.setActivedIndex(tab.getIndex());
        }
        return this;
    },

    /**
     * 当被子类重写时，负责获取选项卡的主体。
     */
    getBody: function() {
        var body = this.elem.nextElementSibling;
        if (!body.classList.contains('x-tab-body')) {
            body = this.elem.previousElementSibling;
            if (!body.classList.contains('x-tab-body')) {
                body = null;
            }
        }
        return body;
    },

    getActivedIndex: function () {
        var actived = this.elem.querySelector('.x-tab-actived');
        return actived ? actived.getIndex() : 0;
    },

    setActivedIndex: function (index) {

        var oldIndex = this.getActivedIndex(), el;
        if (oldIndex !== index) {

            // 切换高亮标签。
            el = this.elem.children[oldIndex];
            el && el.classList.remove('x-tab-actived');

            el = this.elem.children[index];
            el && el.classList.add('x-tab-actived');

            // 切换主体。
            var body = this.getBody();
            if (body) {

                if (el = body.children[oldIndex]) {
                    el.style.position = 'absolute';
                    var rect = el.getOffset();
                    el.style.left = rect.left + 'px';
                    el.style.top = rect.top + 'px';
                    el.hide('opacity', null, 150);
                }

                if (el = body.children[index]) {
                    el.style.position = el.style.left = el.style.top = '';
                    el.show('opacity', null, 150);
                }

            }

            this.trigger('change');
        }

        return this;
    }

});




