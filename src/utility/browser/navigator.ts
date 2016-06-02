// #todo


(function (ua) {

    var match = ua.match(/(IE|Firefox|Chrome|Safari|Opera)[\/\s](\d*)/i) || ua.match(/(WebKit|Gecko)[\/\s]([\w\.]*)/i) || [0, "Other", 0];

    /**
     * ��ȡ��ǰ����������
     */
    navigator.browser = match[1];

    /**
     * ��ȡ��ǰ�������汾��
     */
    navigator.version = match[2];

})(navigator.userAgent);

/**
 * ��ȡ��ǰ���������档
 */
navigator.engine = window.opera ? 'Presto' : window.ActiveXObject ? 'Trident' : document.getBoxObjectFor != null || window.mozInnerScreenX != null ? 'Gecko' : document.childNodes && !document.all && !navigator.taintEnabled ? 'Webkit' : 'Other';
