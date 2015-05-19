/** * @author [作者] */

Dom.disableTab = function (elem, tab) {
    if (tab === undefined) {
        tab = '\t';
    }
    Dom.on(elem, 'keydown', function(e) {
        if (e.keyCode == 9) {
            e.preventDefault();
            var start = this.selectionStart,
                end = this.selectionEnd,
                text = this.value,
                length = tab.length;
            text = text.substr(0, start) + tab + text.substr(start);
            this.value = text;
            this.selectionStart = start + tab.length;
            this.selectionEnd = end + tab.length;
        }
    });
};
