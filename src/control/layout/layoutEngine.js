
typeof include === "function" && include("../utility/class");

var LayoutEngine = Base.extend({

    /**
     * 初始化指定容器的布局。
     */
    initLayout: function(container) {

    },

    /**
     * 取消初始化指定容器的布局。
     */
    uninitLayout: function(container) {

    },

    _layoutLockCount: 0,

    /**
     * 临时挂起当前布局引擎的逻辑。
     */
    suspendLayout: function() {
        this._layoutLockCount++;
    },

    /**
     * 恢复挂起当前布局引擎的逻辑。
     */
    resumeLayout: function(performLayout) {
        if (--this._layoutLockCount === 0 && performLayout !== false) {
            this.performLayout();
        }
    },

    /**
     * 当被子类重写时，负责执行当前布局引擎的逻辑。
     */
    performLayout: function() {
        
    }

});
