/**
 * @author xuld
 */

//#include dom/dom.js

/**
 * 设置当文本框空的时候，显示的文本。
 */
Dom.prototype.placeholder = function (value) {

    function hidePlaceHolder() {
        Dom(this).text() === value && Dom(this).removeClass('placeholder').text('');
    }

    function showPlaceHolder() {
        Dom(this).text() || Dom(this).text(value).addClass('placeholder');
    }

    return this.on('focus', hidePlaceHolder).on('blur', showPlaceHolder).each(function (elem) {
        elem.form && Dom(elem.form).on('submit', hidePlaceHolder, elem);
        hidePlaceHolder.call(elem);
        showPlaceHolder.call(elem);
    });

};
