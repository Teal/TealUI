/**
 * AJAX 传输 JSON
 * @author xuld
 */

using("System.Ajax.Base");
using("System.Data.JSON");

Ajax.accepts.json = "application/json, text/javascript";
Ajax.dataParsers.json = function (xhrObject) {
    return JSON.parse(this.text(xhrObject));
};

