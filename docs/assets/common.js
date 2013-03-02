
var UI = {

    resetIFrame: function (iframe, reset) {
        iframe.contentDocument.body.style.overflowY = 'hidden';
        iframe.style.height = iframe.contentDocument.documentElement.scrollHeight + 3 + 'px';
        if (reset !== false) {
            setTimeout(function () {
                UI.resetIFrame(iframe, false);
            }, 400);
        }
    }

};
