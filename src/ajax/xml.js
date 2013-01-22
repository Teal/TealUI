/**
 * AJAX 传输 XML
 * @author xuld
 */

using("System.Ajax.Base");


Ajax.accepts.xml = "application/xml, text/xml";
Ajax.dataParsers.xml = function (xhrObject) {
    var xml = xhrObject.xhr.responseXML;
    return xml && xml.documentElement ? xml : null;
};



