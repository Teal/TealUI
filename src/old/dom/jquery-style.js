/**
 * @fileOverview 实现链式操作 DOM 的辅助方法。
 */

/**
 * 快速执行一个选择器、节点生成或 DOM ready 事件。
 */
function $(selector, context) {
    
    if (selector) {

        switch (selector.constructor) {

            // 选择器或创建节点。
            case String:
                selector = selector[0] === '<' ? [Dom.parse(selector, context)] : Array.prototype.slice.call(Dom.query(selector, context));
                break;
            
            // 原生数组。
            case Array:
                if (context) {
                    break;
                }
                return $.prototype.concat.apply($(), selector);

            // DOMReady 函数。
            case Function:
                return Dom.ready(selector);

            // 已经是 $ 对象。
            case $:
                return selector;

            // 原生节点。
            default:
                selector = selector.length != null && selector.length.constructor === Number ? Array.prototype.slice.call(selector, 0) : [selector];

        }

    } else {
        selector = [];
    }

    // #if CompactMode

    if (!selector.__proto__) {
        if (this.constructor !== $) {
            return new $(selector, true);
        }

        this.push.apply(this, selector);
        selector = this;
    }

    // #endif

    selector.__proto__ = $.prototype;

    return selector;

}

$.prototype = [];

$.prototype.constructor = $;

$.prototype.concat = function () {
    for (var i = 0; i < arguments.length; i++) {

        arguments[i] = $(arguments[i]);

        // #if CompactMode

        // IE6-8 不支持直接转换。
        if (!+"\v") {
            arguments[i] = Array.prototype.slice.call(arguments[i]);
        }

        // #endif

        this.push.apply(this, arguments[i]);
    }
    return this;
};

$.prototype.get = function(index) {
    return $(this[index < 0 ? this.length + index : index]);
};

$.prototype.query = function (selector) {
    return $(this[0] && Dom.query(selector, this[0]));
};

$.prototype.find = function (selector) {
    return $(this[0] && Dom.find(selector, this[0]));
};

"filter reverse sort slice unique".replace(/\w+/g, function (funcName) {
    $.prototype[funcName] = function () {
        return $(Array.prototype[funcName].apply(this, arguments));
    };
});

"on off trigger addClass removeClass toggleClass remove setText setHtml setAttr show hide toggle setSize offsetParent setOffset setPosition setScroll".replace(/\w+/g, function (funcName) {
    $.prototype[funcName] = function (arg0, arg1) {
        for (var i = 0, length = this.length; i < length; i++) {
            Dom[funcName](this[i], arg0, arg1);
        }
        return this;
    };
});

"matches getStyle isHidden getAttr getText getHtml contains getSize getScrollSize getOffset getPosition getScroll append prepend after before".replace(/\w+/g, function (funcName) {
    $.prototype[funcName] = function (arg0) {
        return this[0] && Dom[funcName](this[0], arg0);
    };
});

"closest parent prev next first last children clone".replace(/\w+/g, function (funcName) {
    $.prototype[funcName] = function (arg0) {
        return $(this[0] && Dom[funcName](this[0], arg0));
    };
});

$.prototype.appendTo = function(parent) {
    $(parent).append(this[0]);
    return this;
};
