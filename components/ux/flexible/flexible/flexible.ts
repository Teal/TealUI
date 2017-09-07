/**
 * 自动缩放。
 */
export function flexible() {
    (function (doc, win) {
    var docEl = doc.documentElement,
        isIPhone = window.navigator.appVersion.match(/iphone/gi),
        fontSize,scale,
        platform = navigator.platform;

    function recalc() {
        var clientWidth = docEl.clientWidth; //window.document.documentElement.getBoundingClientRect().width
        var dpr = window.devicePixelRatio;
        var justMobile = !/win32/i.test(platform);  //只限移动端，pc不缩放
        var ua = navigator.userAgent.toLowerCase();
        var wechat = ua.match(/MicroMessenger/i) == "micromessenger" ? true : false;

        // iOS下，对于2和3的屏，用2倍的方案，其余的用1倍方案 ,  其他设备下，仍旧使用1倍的方案
        if (!(isIPhone && justMobile)) {
            dpr = 1;
        }
        scale = 1 / (dpr > 1 ? 2 : dpr);
        if(wechat) {
            scale = 1;
        }
        fontSize = 20 * (clientWidth / 320) / scale;
        fontSize = (fontSize > 54) ? 54: fontSize;

        docEl.style.fontSize = fontSize + 'px';
        docEl.setAttribute('data-dpr', dpr);

        //设置viewport
        var viewport = document.querySelector('meta[name="viewport"]');
        var viewport_content = 'initial-scale=' + scale + ', maximum-scale=' + scale + ', minimum-scale=' + scale + ', user-scalable=no';
        viewport && viewport.setAttribute('content', viewport_content);


    };
    recalc();
})(document, window);


}

export default flexible;
