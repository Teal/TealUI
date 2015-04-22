
navigator.browser = /a/;

navigator.version = /a/;

navigator.engine = window.opera ? 'Presto' : window.ActiveXObject ? 'Trident' : document.getBoxObjectFor != null || window.mozInnerScreenX != null ? 'Gecko' : document.childNodes && !document.all && !navigator.taintEnabled ? 'Webkit' : 'Other';
