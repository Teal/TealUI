/**
 * @fileOverview 在文本框按 TAB 不切换焦点，改为输入 TAB。
 * @author xuld
 */

/**
 * 在文本框按 TAB 不切换焦点，改为输入 TAB。
 * @param {String} [tab="\t"] 自定义 TAB 的输入内容。
 */
Element.prototype.disableTab = function (tab) {
    var elem = this;
    if (tab == undefined) tab = '\t';
    elem.addEventListener('keydown', function (e) {
        if (e.keyCode == 9) {
            e.preventDefault();
            var start = elem.selectionStart,
                end = elem.selectionEnd,
                text = elem.value,
                length = tab.length;
            text = text.substr(0, start) + tab + text.substr(start);
            elem.value = text;
            elem.selectionStart = start + tab.length;
            elem.selectionEnd = end + tab.length;
        }
    }, false);
};
