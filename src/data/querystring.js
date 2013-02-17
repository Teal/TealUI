/**
 * @author xuld
 */

include("core/base.js");

var QueryString = {

    parse: function (value) {
        var r = {};
        if (value) {
            if (value.charAt(0) == '?') value = value.substr(1);
            value.split('&').each(function(value, key) {
                value = value.split('=');
                key = decodeURIComponent(value[0]);
                try {
                    r[key] = decodeURIComponent(value[1]);
                } catch (e) {
                    r[key] = value[1];
                }
            });
        }


        return r;
    },

    /**
     * <p>Converts an arbitrary value to a Query String representation.</p>
     *
     * <p>Objects with cyclical references will trigger an exception.</p>
     *
     * @method stringify
     * @param obj {Variant} any arbitrary value to convert to query string
     * @static
     */
    stringify: function (obj, name) {

        var s;
        if (obj && typeof obj === 'object') {
            s = [];
            Object.each(obj, function (value, key) {
                s.push(QueryString.stringify(value, name ? name + "[" + key + "]" : key));
            });
            s = s.join('&');
        } else {
            s = encodeURIComponent(name) + "=" + encodeURIComponent(obj);
        }

        return s.replace(/%20/g, '+');
    }

};
