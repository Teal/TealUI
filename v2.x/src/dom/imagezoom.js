/**
 * @author xuld
 */

//#include dom/imagezoom.css
//#include dom/base.js

Dom.imageZoom = function (elem, getUrlCallback) {

    Dom.addClass(elem, 'x-imagezoom-small');
    Dom.on(elem, 'click', function (e) {
        var oldState, data = Dom.data(this);

        if (Dom.hasClass(this, 'x-imagezoom-small')) {
            Dom.removeClass(this, 'x-imagezoom-small');
            Dom.addClass(this, 'x-imagezoom-large');
            if (getUrlCallback) {
                data.imageZoomSrc = this.src;
                this.src = getUrlCallback(this.src);
            } else {
                data.imageZoomWidth = Dom.getWidth(this);
                data.imageZoomHeight = Dom.getHeight(this);
                this.style.width = this.style.height = 'auto';
            }
        } else {
            Dom.addClass(this, 'x-imagezoom-small');
            Dom.removeClass(this, 'x-imagezoom-large');
            if (getUrlCallback) {
                this.src = data.imageZoomSrc;
            } else {
                Dom.setWidth(this, data.imageZoomWidth);
                Dom.setHeight(this, data.imageZoomHeight);
            }
        }
    });

};

Dom.prototype.imageZoom = function () {
    return;
};