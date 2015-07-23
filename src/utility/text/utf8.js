/**
 * @author xuld
 */

/**
 * 将 utf8 转 gb2312。
 * @param {String} str 要转换的字符串。
 * @returns {String} 转换后的字符串。
 * @example utf8ToGb2312("a")
 */
function utf8ToGb2312(str) {
    var result = "", index, i, c, code;
    for (i = 0; i < str.length; i++) {
        c = str.charAt(i);
        code = str.charCodeAt(i);
        if (c == " ") result += "+";
        else if (code >= 19968 && code <= 40869) {
            index = code - 19968;
            result += "%" + str.substr(index * 4, 2) + "%" + str.substr(index * 4 + 2, 2);
        } else {
            result += "%" + str.charCodeAt(i).toString(16);
        }
    }
    return result;
};

/**
 * 将 gb2312 转 utf8。
 * @param {String} str 要转换的字符串。
 * @returns {String} 转换后的字符串。
 * @example gb2312ToUtf8("a")
 */
function gb2312ToUtf8(str) {
    var result = '', i, c;
    for (i = 0; i < str.length; i++) {
        c = str.charAt(i);
        // +是空格
        if (c == '+') {
            result += ' ';
        }
            // a,b,c,1,2等，非%开头的，直接返回本身
        else if (c != '%') {
            result += c;
        }
            // %开头
        else {
            i++;
            var nextC = str.charAt(i);
            // 数字，则不是汉字
            if (!isNaN(parseInt(nextC))) {
                i++;
                result += decodeURIComponent(c + nextC + str.charAt(i));
            }
            else {
                var x = new String();
                try {
                    var code = str.substr(i, 2) + str.substr(i + 3, 2);
                    i = i + 4;

                    var index = -1;
                    while ((index = z.indexOf(code, index + 1)) != -1) {
                        if (index % 4 == 0) {
                            result += String.fromCharCode(index / 4 + 19968);
                            break;
                        }
                    }
                } catch (e) { }
            }
        }
    }
    return result;
};

/**
 * 将 utf16 转 utf8。
 * @param {String} str 要转换的字符串。
 * @returns {String} 转换后的字符串。
 * @example utf16ToUtf8("a")
 */
function utf16ToUtf8(str) {

    //http://wiki.orz.asia/owen/index.php?title=Js%E6%B1%89%E5%AD%97%E8%BD%AC%E6%8B%BC%E9%9F%B3&oldid=452&printable=yes
    //http://tech.byreach.com/node/222

    var out = "", i, len = str.length, c;
    for (i = 0; i < len; i++) {
        c = str.charCodeAt(i);
        if ((c >= 0x0001) && (c <= 0x007F)) {
            out += str.charAt(i);
        } else if (c > 0x07FF) {
            out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F));
            out += String.fromCharCode(0x80 | ((c >> 6) & 0x3F));
            out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
        } else {
            out += String.fromCharCode(0xC0 | ((c >> 6) & 0x1F));
            out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
        }
    }
    return out;
};

/**
 * 将 utf8 转 utf16。
 * @param {String} str 要转换的字符串。
 * @returns {String} 转换后的字符串。
 * @example utf8ToUtf16("a")
 */
function utf8ToUtf16(str) {
    var out, i, len, c, char2, char3;

    out = "";
    len = str.length;
    i = 0;
    while (i < len) {
        c = str.charCodeAt(i++);
        switch (c >> 4) {
            case 0: case 1: case 2: case 3: case 4: case 5: case 6: case 7:
                // 0xxxxxxx
                out += str.charAt(i - 1);
                break;
            case 12: case 13:
                // 110x xxxx   10xx xxxx
                char2 = str.charCodeAt(i++);
                out += String.fromCharCode(((c & 0x1F) << 6) | (char2 & 0x3F));
                break;
            case 14:
                // 1110 xxxx  10xx xxxx  10xx xxxx
                char2 = str.charCodeAt(i++);
                char3 = str.charCodeAt(i++);
                out += String.fromCharCode(((c & 0x0F) << 12) |
                    ((char2 & 0x3F) << 6) |
                    ((char3 & 0x3F) << 0));
                break;
        }
    }

    return out;
}
