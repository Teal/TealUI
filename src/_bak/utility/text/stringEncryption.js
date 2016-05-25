
/**
 * 加密指定的字符串。
 * @param {String} str 要加密的字符串。
 * @param {Number} key 加密的密钥。
 * @returns {String} 返回加密后的字符串。
 * @example encryptString("abc", 123) // "``e"
 */
function encryptString(str, key) {
    typeof console === "object" && console.assert(typeof str === "string", "encryptString(str: 必须是字符串, [key])");
    if (key == undefined) {
        key = 19901206;
    }
    var length = str.length,
        chartemp = new Array(length--),
        key1 = ~key;
    for (var i = 0; i <= length; i++) {
        chartemp[i] = String.fromCharCode(~(((str.charCodeAt(i) & key1) | ((i === length ? str.charCodeAt(0) : str.charCodeAt(i + 1)) & key)) ^ (~(i + length))));
    }
        
    return chartemp.join('');
}

/**
 * 解密指定的字符串。
 * @param {String} str 要解密的字符串。
 * @param {key} str 解密的密钥。
 * @returns {String} 返回解密后的字符串。
 * @example dencryptString("abc", 123) // "cce"
 */
function dencryptString(str, key) {
    typeof console === "object" && console.assert(typeof str === "string", "dencryptString(str: 必须是字符串, [key])");
    if (key == undefined) {
        key = 19901206;
    }
    var length = str.length,
        chartemp = new Array(length--),
        key1 = ~key;

    for (var i = length; i >= 0; i--) {
        chartemp[i] = ~(str.charCodeAt(i) ^ (~(i + length)));
    }
       
    var f = chartemp[length];

    for (var i = length; i >= 0; i--) {
        chartemp[i] = ((chartemp[i] & key1) | ((i === 0 ? f : (chartemp[i - 1])) & key));
    }

    for (var i = length; i >= 0; i--) {
        chartemp[i] = String.fromCharCode(chartemp[i]);
    }

    return chartemp.join('');
}