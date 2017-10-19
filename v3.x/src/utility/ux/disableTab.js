/**
 * @fileOverview 在文本框按 TAB 不切换焦点，改为输入 TAB。
 * @author xuld
 */

/**
 * 在文本框按 TAB 不切换焦点，改为输入 TAB。
 * @param {String} [tab="\t"] 自定义 TAB 的输入内容。
 */
Dom.prototype.disableTab = function (tab) {
    if (tab == undefined) tab = '\t';
    return this.on('keydown', function (e) {
        if (e.keyCode == 9) {
            e.preventDefault();
            var start = this.selectionStart,
                end = this.selectionEnd,
                text = this.value,
                length = tab.length;

            // IE 使用 document.selection.createRange(); 插入选区。
            if (start == null) {
                var sel = document.selection.createRange();
                sel.text = tab;
                return;
            }
            text = text.substr(0, start) + tab + text.substr(start);
            this.value = text;
            this.selectionStart = start + tab.length;
            this.selectionEnd = end + tab.length;
        }
    });
};
