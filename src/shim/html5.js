/**
 * @author xuld
 * @fileOverview 为低版本浏览器提供 HTML5 的部分功能。
 * @remark 
 * 可以使用 HTML IE 判断是否加载本文件。
 */

// #region IE6-8

// IE6-8: 不支持 Array.prototype.indexOf
if (!Array.prototype.indexOf) {

    /**
     * 返回当前数组中某个值的第一个位置。
     * @param {Object} item 成员。
     * @param {Number} startIndex=0 开始查找的位置。
     * @return {Number} 返回 *vaue* 的索引，如果不存在指定的值， 则返回-1 。
     */
    Array.prototype.indexOf = function (value, startIndex) {
        startIndex = startIndex || 0;
        for (var len = this.length; startIndex < len; startIndex++)
            if (this[startIndex] === value)
                return startIndex;
        return -1;
    };

}

// #endregion

// #region IE8

if (!+"\v1" && Object.defineProperty && this.Element) {

    Document.prototype.createEvent = function(eventName) {
        return {
            eventType: eventName,
            initEvent: function (eventName, bubbles, type) {
                this.type = eventName;
            }
        };
    };

    Element.prototype.dispatchEvent = function(event) {
        this.fireEvent('on' + event.type, event);
    };

    Element.prototype.addEventListener = function(eventName, eventHandler) {
        this.attachEvent('on' + eventName, eventHandler);
    };

    Element.prototype.removeEventListener = function (eventName, eventHandler) {
        this.detachEvent('on' + eventName, eventHandler);
    };

}

// #endregion
