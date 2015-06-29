/**
 * @author xuld
 */

// #require ../control/base

/**
 * 表示一个面板。
 */
var Panel = Control.extend({

    role: 'panel',

    init: function () {
        if (this.elem.classList.contains('x-panel-collapsed') || this.elem.classList.contains('x-panel-expanded')) {
            this.elem.on('click', '.x-panel-header', function () {
                this.toggleCollapse();
            }, this);
        }
    },

    /**
     * 判断当前面板是否是折叠状态。
     * @returns {Boolean}
     */
    getCollapsed: function() {
        return this.elem.classList.contains('x-panel-collapsed');
    },

    /**
     * 设置当前面板是否是折叠状态。
     * @param {Boolean} value 如果指定为 true，则强制折叠，如果指定为 false，则强制展开。
     */
    setCollapsed: function(value) {
        this.elem.classList[value !== false ? 'add' : 'remove']('x-panel-collapsed');
        return this;
    },

    /**
     * 切换当前面板的折叠状态。
     * @param {Boolean?} value 如果指定为 true，则强制折叠，如果指定为 false，则强制展开。否则切换当前折叠状态。
     * @returns this
     */
    toggleCollapse: function (value) {

        var isCollapsed = this.getCollapsed();

        // 如果折叠结果无变化则忽略。
        if (value == undefined) {
            value = !isCollapsed;
        } else if (value == isCollapsed) {
            return this;
        }

        // value 最终是 true: 表示即将折叠。
        // value 最终是 false: 表示即将展开。

        var classList = this.elem.classList;
        if (!classList.contains('x-panel-collapsing') && this.trigger('collapsing', value)) {

            var body = this.elem.querySelector('.x-panel-body');

            if (value) {
                classList.add('x-panel-collapsing');
                body.hide('height', function () {
                    classList.add('x-panel-collapsed');
                    classList.remove('x-panel-collapsing');
                    classList.remove('x-panel-expanded');
                });
            } else {
                classList.add('x-panel-expanded');
                classList.remove('x-panel-collapsed');
                body.show('height');
            }

            this.trigger('collapse', value);

        }
        return this;
    }

});


