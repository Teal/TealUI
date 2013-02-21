/**
 * AJAX 传输 JSON
 * @author xuld
 */

//#include ajax/base.js
//#include data/json.js

Ajax.accepts.json = "application/json, text/javascript";
Ajax.dataParsers.json = function (xhrObject) {
    return JSON.parse(this.text(xhrObject));
};

