/**
 * AJAX 传输 JSON
 * @author xuld
 */

//#require ajax/base.js
//#require data/json.js

Ajax.accepts.json = "application/json, text/javascript";
Ajax.dataParsers.json = function (xhrObject) {
    return JSON.parse(this.text(xhrObject));
};

