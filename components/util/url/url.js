define(["require", "exports", "util/query"], function (require, exports, query_1) {
    Object.defineProperty(exports, "__esModule", { value: true });
    // Reference: RFC 3986, RFC 1808, RFC 2396
    // protocols that never have a hostname.
    var hostlessProtocol = {
        "javascript": true,
        "javascript:": true
    };
    // protocols that always contain a // bit.
    var slashedProtocol = {
        "http": true,
        "http:": true,
        "https": true,
        "https:": true,
        "ftp": true,
        "ftp:": true,
        "gopher": true,
        "gopher:": true,
        "file": true,
        "file:": true
    };
    /**
     * 表示一个地址。
     * @see https://github.com/nodejs/node/blob/master/lib/url.js
     */
    var Url = /** @class */ (function () {
        function Url() {
        }
        /**
         * 解析地址并填充信息到当前地址。
         * @param url 要解析的地址。
         * @param parseQueryString 是否解析查询字符串。
         * @param slashesDenoteHost 允许 "/" 作为主机名解析。
         */
        Url.prototype.parse = function (url, parseQueryString, slashesDenoteHost) {
            // Copy chrome, IE, opera backslash-handling behavior.
            // Back slashes before the query string get converted to forward slashes
            // See: https://code.google.com/p/chromium/issues/detail?id=25916
            var hasHash = false;
            var start = -1;
            var end = -1;
            var rest = "";
            var lastPos = 0;
            var i = 0;
            for (var inWs = false, split = false; i < url.length; ++i) {
                var code = url.charCodeAt(i);
                // Find first and last non-whitespace characters for trimming
                var isWs = code === 32 /* */ ||
                    code === 9 /*\t*/ ||
                    code === 13 /*\r*/ ||
                    code === 10 /*\n*/ ||
                    code === 12 /*\f*/ ||
                    code === 160 /*\u00A0*/ ||
                    code === 65279 /*\uFEFF*/;
                if (start === -1) {
                    if (isWs)
                        continue;
                    lastPos = start = i;
                }
                else {
                    if (inWs) {
                        if (!isWs) {
                            end = -1;
                            inWs = false;
                        }
                    }
                    else if (isWs) {
                        end = i;
                        inWs = true;
                    }
                }
                // Only convert backslashes while we haven't seen a split character
                if (!split) {
                    switch (code) {
                        case 35:// '#'
                            hasHash = true;
                        // Fall through
                        case 63:// '?'
                            split = true;
                            break;
                        case 92:// '\\'
                            if (i - lastPos > 0)
                                rest += url.slice(lastPos, i);
                            rest += "/";
                            lastPos = i + 1;
                            break;
                    }
                }
                else if (!hasHash && code === 35 /*#*/) {
                    hasHash = true;
                }
            }
            // Check if string was non-empty (including strings with only whitespace)
            if (start !== -1) {
                if (lastPos === start) {
                    // We didn't convert any backslashes
                    if (end === -1) {
                        if (start === 0)
                            rest = url;
                        else
                            rest = url.slice(start);
                    }
                    else {
                        rest = url.slice(start, end);
                    }
                }
                else if (end === -1 && lastPos < url.length) {
                    // We converted some backslashes and have only part of the entire string
                    rest += url.slice(lastPos);
                }
                else if (end !== -1 && lastPos < end) {
                    // We converted some backslashes and have only part of the entire string
                    rest += url.slice(lastPos, end);
                }
            }
            if (!slashesDenoteHost && !hasHash) {
                // Try fast path regexp
                var simplePath = /^(\/\/?(?!\/)[^\?\s]*)(\?[^\s]*)?$/.exec(rest);
                if (simplePath) {
                    this.path = rest;
                    this.href = rest;
                    this.pathname = simplePath[1];
                    if (simplePath[2]) {
                        this.search = simplePath[2];
                        this.query = parseQueryString ? query_1.parseQuery(this.search.slice(1)) : this.search.slice(1);
                    }
                    else if (parseQueryString) {
                        this.search = "";
                        this.query = {};
                    }
                    return this;
                }
            }
            var match = /^([a-z0-9.+-]+:)/i.exec(rest);
            var proto;
            var lowerProto;
            if (match) {
                proto = match[0];
                this.protocol = lowerProto = proto.toLowerCase();
                rest = rest.slice(proto.length);
            }
            // figure out if it's got a host
            // user@server is *always* interpreted as a hostname, and url
            // resolution will treat //foo/bar as host=foo,path=bar because that's
            // how the browser resolves relative URLs.
            var slashes;
            if (slashesDenoteHost || proto || /^\/\/[^@\/]+@[^@\/]+/.test(rest)) {
                slashes = rest.charCodeAt(0) === 47 /*/*/ &&
                    rest.charCodeAt(1) === 47 /*/*/;
                if (slashes && !(proto && hostlessProtocol[proto])) {
                    rest = rest.slice(2);
                    this.slashes = true;
                }
            }
            if (!hostlessProtocol[proto] && (slashes || (proto && !slashedProtocol[proto]))) {
                // there's a hostname.
                // the first instance of /, ?, ;, or # ends the host.
                //
                // If there is an @ in the hostname, then non-host chars *are* allowed
                // to the left of the last @ sign, unless some host-ending character
                // comes *before* the @-sign.
                // URLs are obnoxious.
                //
                // ex:
                // http://a@b@c/ => user:a@b host:c
                // http://a@b?@c => user:a host:b path:/?@c
                // v0.12 TODO(isaacs): This is not quite how Chrome does things.
                // Review our test case against browsers more comprehensively.
                var hostEnd = -1;
                var atSign = -1;
                var nonHost = -1;
                for (i = 0; i < rest.length; ++i) {
                    switch (rest.charCodeAt(i)) {
                        case 9: // '\t'
                        case 10: // '\n'
                        case 13: // '\r'
                        case 32: // ' '
                        case 34: // '"'
                        case 37: // '%'
                        case 39: // '\''
                        case 59: // ';'
                        case 60: // '<'
                        case 62: // '>'
                        case 92: // '\\'
                        case 94: // '^'
                        case 96: // '`'
                        case 123: // '{'
                        case 124: // '|'
                        case 125:// '}'
                            // Characters that are never ever allowed in a hostname from RFC 2396
                            if (nonHost === -1)
                                nonHost = i;
                            break;
                        case 35: // '#'
                        case 47: // '/'
                        case 63:// '?'
                            // Find the first instance of any host-ending characters
                            if (nonHost === -1)
                                nonHost = i;
                            hostEnd = i;
                            break;
                        case 64:// '@'
                            // At this point, either we have an explicit point where the
                            // auth portion cannot go past, or the last @ char is the decider.
                            atSign = i;
                            nonHost = -1;
                            break;
                    }
                    if (hostEnd !== -1)
                        break;
                }
                start = 0;
                if (atSign !== -1) {
                    this.auth = decodeURIComponent(rest.slice(0, atSign));
                    start = atSign + 1;
                }
                if (nonHost === -1) {
                    this.host = rest.slice(start);
                    rest = "";
                }
                else {
                    this.host = rest.slice(start, nonHost);
                    rest = rest.slice(nonHost);
                }
                // pull out port.
                this.parseHost();
                // we've indicated that there is a hostname,
                // so even if it's empty, it has to be present.
                if (typeof this.hostname !== "string")
                    this.hostname = "";
                var hostname = this.hostname;
                // if hostname begins with [ and ends with ]
                // assume that it's an IPv6 address.
                var ipv6Hostname = hostname.charCodeAt(0) === 91 /*[*/ &&
                    hostname.charCodeAt(hostname.length - 1) === 93 /*]*/;
                // validate a little.
                if (!ipv6Hostname) {
                    var r = validateHostname(this, rest, hostname);
                    if (r !== undefined)
                        rest = r;
                }
                // 主机名最长 255
                if (this.hostname.length > 255) {
                    this.hostname = "";
                }
                else {
                    // hostnames are always lower case.
                    this.hostname = this.hostname.toLowerCase();
                }
                // Do Not Support.
                // if (!ipv6Hostname) {
                //    // IDNA Support: Returns a punycoded representation of "domain".
                //    // It only converts parts of the domain name that
                //    // have non-ASCII characters, i.e. it doesn't matter if
                //    // you call it with a domain that already is ASCII-only.
                //    this.hostname = punycode.toASCII(this.hostname);
                // }
                var p = this.port ? ":" + this.port : "";
                var h = this.hostname || "";
                this.host = h + p;
                // strip [ and ] from the hostname
                // the host field still retains them, though
                if (ipv6Hostname) {
                    this.hostname = this.hostname.slice(1, -1);
                    if (rest[0] !== "/") {
                        rest = "/" + rest;
                    }
                }
            }
            // protocols that can allow "unsafe" and "unwise" chars.
            var unsafeProtocol = {
                "javascript": true,
                "javascript:": true
            };
            // now rest is set to the post-host stuff.
            // chop off any delim chars.
            if (!unsafeProtocol[lowerProto]) {
                // First, make 100% sure that any "autoEscape" chars get
                // escaped, even if encodeURIComponent doesn't think they
                // need to be.
                var r = autoEscapeStr(rest);
                if (r !== undefined)
                    rest = r;
            }
            var questionIdx = -1;
            var hashIdx = -1;
            for (i = 0; i < rest.length; ++i) {
                var code = rest.charCodeAt(i);
                if (code === 35 /*#*/) {
                    this.hash = rest.slice(i);
                    hashIdx = i;
                    break;
                }
                else if (code === 63 /*?*/ && questionIdx === -1) {
                    questionIdx = i;
                }
            }
            if (questionIdx !== -1) {
                if (hashIdx === -1) {
                    this.search = rest.slice(questionIdx);
                    this.query = rest.slice(questionIdx + 1);
                }
                else {
                    this.search = rest.slice(questionIdx, hashIdx);
                    this.query = rest.slice(questionIdx + 1, hashIdx);
                }
                if (parseQueryString) {
                    this.query = query_1.parseQuery(this.query);
                }
            }
            else if (parseQueryString) {
                // no query string, but parseQueryString still requested
                this.search = "";
                this.query = {};
            }
            var firstIdx = (questionIdx !== -1 &&
                (hashIdx === -1 || questionIdx < hashIdx)
                ? questionIdx
                : hashIdx);
            if (firstIdx === -1) {
                if (rest.length > 0)
                    this.pathname = rest;
            }
            else if (firstIdx > 0) {
                this.pathname = rest.slice(0, firstIdx);
            }
            if (slashedProtocol[lowerProto] &&
                this.hostname && !this.pathname) {
                this.pathname = "/";
            }
            // to support http.request
            if (this.pathname || this.search) {
                var p = this.pathname || "";
                var s = this.search || "";
                this.path = p + s;
            }
            // finally, reconstruct the href based on what has been validated.
            this.href = this.toString();
            return this;
            function autoEscapeStr(rest) {
                var newRest = "";
                var lastPos = 0;
                for (var i_1 = 0; i_1 < rest.length; ++i_1) {
                    // Automatically escape all delimiters and unwise characters from RFC 2396
                    // Also escape single quotes in case of an XSS attack
                    switch (rest.charCodeAt(i_1)) {
                        case 9:// '\t'
                            if (i_1 - lastPos > 0)
                                newRest += rest.slice(lastPos, i_1);
                            newRest += "%09";
                            lastPos = i_1 + 1;
                            break;
                        case 10:// '\n'
                            if (i_1 - lastPos > 0)
                                newRest += rest.slice(lastPos, i_1);
                            newRest += "%0A";
                            lastPos = i_1 + 1;
                            break;
                        case 13:// '\r'
                            if (i_1 - lastPos > 0)
                                newRest += rest.slice(lastPos, i_1);
                            newRest += "%0D";
                            lastPos = i_1 + 1;
                            break;
                        case 32:// ' '
                            if (i_1 - lastPos > 0)
                                newRest += rest.slice(lastPos, i_1);
                            newRest += "%20";
                            lastPos = i_1 + 1;
                            break;
                        case 34:// '"'
                            if (i_1 - lastPos > 0)
                                newRest += rest.slice(lastPos, i_1);
                            newRest += "%22";
                            lastPos = i_1 + 1;
                            break;
                        case 39:// '\''
                            if (i_1 - lastPos > 0)
                                newRest += rest.slice(lastPos, i_1);
                            newRest += "%27";
                            lastPos = i_1 + 1;
                            break;
                        case 60:// '<'
                            if (i_1 - lastPos > 0)
                                newRest += rest.slice(lastPos, i_1);
                            newRest += "%3C";
                            lastPos = i_1 + 1;
                            break;
                        case 62:// '>'
                            if (i_1 - lastPos > 0)
                                newRest += rest.slice(lastPos, i_1);
                            newRest += "%3E";
                            lastPos = i_1 + 1;
                            break;
                        case 92:// '\\'
                            if (i_1 - lastPos > 0)
                                newRest += rest.slice(lastPos, i_1);
                            newRest += "%5C";
                            lastPos = i_1 + 1;
                            break;
                        case 94:// '^'
                            if (i_1 - lastPos > 0)
                                newRest += rest.slice(lastPos, i_1);
                            newRest += "%5E";
                            lastPos = i_1 + 1;
                            break;
                        case 96:// '`'
                            if (i_1 - lastPos > 0)
                                newRest += rest.slice(lastPos, i_1);
                            newRest += "%60";
                            lastPos = i_1 + 1;
                            break;
                        case 123:// '{'
                            if (i_1 - lastPos > 0)
                                newRest += rest.slice(lastPos, i_1);
                            newRest += "%7B";
                            lastPos = i_1 + 1;
                            break;
                        case 124:// '|'
                            if (i_1 - lastPos > 0)
                                newRest += rest.slice(lastPos, i_1);
                            newRest += "%7C";
                            lastPos = i_1 + 1;
                            break;
                        case 125:// '}'
                            if (i_1 - lastPos > 0)
                                newRest += rest.slice(lastPos, i_1);
                            newRest += "%7D";
                            lastPos = i_1 + 1;
                            break;
                    }
                }
                if (lastPos === 0)
                    return;
                if (lastPos < rest.length)
                    return newRest + rest.slice(lastPos);
                else
                    return newRest;
            }
            function validateHostname(self, rest, hostname) {
                for (var i_2 = 0, lastPos_1; i_2 <= hostname.length; ++i_2) {
                    var code = void 0;
                    if (i_2 < hostname.length)
                        code = hostname.charCodeAt(i_2);
                    if (code === 46 /*.*/ || i_2 === hostname.length) {
                        if (i_2 - lastPos_1 > 0) {
                            if (i_2 - lastPos_1 > 63) {
                                self.hostname = hostname.slice(0, lastPos_1 + 63);
                                return "/" + hostname.slice(lastPos_1 + 63) + rest;
                            }
                        }
                        lastPos_1 = i_2 + 1;
                        continue;
                    }
                    else if ((code >= 48 /*0*/ && code <= 57 /*9*/) ||
                        (code >= 97 /*a*/ && code <= 122 /*z*/) ||
                        code === 45 /*-*/ ||
                        (code >= 65 /*A*/ && code <= 90 /*Z*/) ||
                        code === 43 /*+*/ ||
                        code === 95 /*_*/ ||
                        code > 127) {
                        continue;
                    }
                    // Invalid host character
                    self.hostname = hostname.slice(0, i_2);
                    if (i_2 < hostname.length)
                        return "/" + hostname.slice(i_2) + rest;
                    break;
                }
            }
        };
        /**
         * 解析主机名部分。
         */
        Url.prototype.parseHost = function () {
            var host = this.host;
            var match = /:[0-9]*$/.exec(host);
            if (match) {
                var port = match[0];
                if (port !== ":") {
                    this.port = port.slice(1);
                }
                host = host.slice(0, host.length - port.length);
            }
            if (host)
                this.hostname = host;
        };
        /**
         * 解析地址。
         * @param url 要解析的地址。
         * @param parseQueryString 是否解析查询字符串。
         * @param slashesDenoteHost 允许 "/" 作为主机名解析。
         * @return 返回新地址对象。
         */
        Url.parse = function (url, parseQueryString, slashesDenoteHost) {
            if (url instanceof Url)
                return url;
            var u = new Url();
            u.parse(url, parseQueryString, slashesDenoteHost);
            return u;
        };
        /**
         * 转换地址为字符串。
         * @return 返回格式化后的字符串。
         */
        Url.prototype.toString = function () {
            var auth = this.auth || "";
            if (auth) {
                auth = encodeURIComponent(auth).replace(/%3A/g, ":");
                auth += "@";
            }
            var protocol = this.protocol || "";
            var pathname = this.pathname || "";
            var hash = this.hash || "";
            var host;
            var query = "";
            if (this.host) {
                host = auth + this.host;
            }
            else if (this.hostname) {
                host = auth + (this.hostname.indexOf(":") === -1 ?
                    this.hostname :
                    "[" + this.hostname + "]");
                if (this.port) {
                    host += ":" + this.port;
                }
            }
            if (this.query !== null && typeof this.query === "object")
                query = query_1.formatQuery(this.query);
            var search = this.search || (query && ("?" + query)) || "";
            if (protocol && protocol.charCodeAt(protocol.length - 1) !== 58 /*:*/)
                protocol += ":";
            var newPathname = "";
            var lastPos = 0;
            for (var i = 0; i < pathname.length; ++i) {
                switch (pathname.charCodeAt(i)) {
                    case 35:// '#'
                        if (i - lastPos > 0)
                            newPathname += pathname.slice(lastPos, i);
                        newPathname += "%23";
                        lastPos = i + 1;
                        break;
                    case 63:// '?'
                        if (i - lastPos > 0)
                            newPathname += pathname.slice(lastPos, i);
                        newPathname += "%3F";
                        lastPos = i + 1;
                        break;
                }
            }
            if (lastPos > 0) {
                if (lastPos !== pathname.length)
                    pathname = newPathname + pathname.slice(lastPos);
                else
                    pathname = newPathname;
            }
            // only the slashedProtocols get the //.  Not mailto:, xmpp:, etc.
            // unless they had them to begin with.
            if (this.slashes || (!protocol || slashedProtocol[protocol]) && host !== undefined) {
                host = "//" + (host || "");
                if (pathname && pathname.charCodeAt(0) !== 47 /*/*/)
                    pathname = "/" + pathname;
            }
            else if (!host) {
                host = "";
            }
            search = search.replace("#", "%23");
            if (hash && hash.charCodeAt(0) !== 35 /*#*/)
                hash = "#" + hash;
            if (search && search.charCodeAt(0) !== 63 /*?*/)
                search = "?" + search;
            return protocol + host + pathname + search + hash;
        };
        /**
         * 格式化地址对象为字符串。
         * @param obj 要格式化的对象。
         * @return 返回格式化后的字符串。
         */
        Url.format = function (obj) {
            // ensure it's an object, and not a string url.
            // If it's an obj, this is a no-op.
            // this way, you can call url_format() on strings
            // to clean up potentially wonky urls.
            if (typeof obj === "string")
                obj = Url.parse(obj);
            else if (typeof obj !== "object" || obj === null)
                throw new TypeError('Parameter "urlObj" must be an object, not ' + obj === null ? "null" : typeof obj);
            else if (!(obj instanceof Url))
                return Url.prototype.toString.call(obj);
            return obj.toString();
        };
        /**
         * 基于当前地址解析指定的相对地址。
         * @param relative 要解析的相对地址。
         * @return 返回新地址对象。
         */
        Url.prototype.resolve = function (relative) {
            if (typeof relative === "string") {
                var rel = new Url();
                rel.parse(relative, false, true);
                relative = rel;
            }
            var r = new Url();
            for (var tkey in this) {
                r[tkey] = this[tkey];
            }
            r.hash = relative.hash;
            // if the relative url is empty, then there's nothing left to do here.
            if (relative.href === "") {
                r.href = relative.toString();
                return r;
            }
            // hrefs like //foo/bar always cut to the protocol.
            if (relative.slashes && !relative.protocol) {
                // take everything except the protocol from relative
                for (var k in r) {
                    if (k !== "protocol")
                        r[k] = relative[k];
                }
                // urlParse appends trailing / to urls like http://www.example.com
                if (slashedProtocol[r.protocol] && r.hostname && !r.pathname) {
                    r.path = r.pathname = "/";
                }
                r.href = r.toString();
                return r;
            }
            if (relative.protocol && relative.protocol !== r.protocol) {
                // if it's a known url protocol, then changing
                // the protocol does weird things
                // first, if it's not file:, then we MUST have a host,
                // and if there was a path
                // to begin with, then we MUST have a path.
                // if it is file:, then the host is dropped,
                // because that's known to be hostless.
                // anything else is assumed to be absolute.
                if (!slashedProtocol[relative.protocol]) {
                    for (var k in r) {
                        r[k] = relative[k];
                    }
                    return r;
                }
                r.protocol = relative.protocol;
                if (!relative.host &&
                    !/^file:?$/.test(relative.protocol) &&
                    !hostlessProtocol[relative.protocol]) {
                    var relPath_1 = (relative.pathname || "").split("/");
                    while (relPath_1.length && !(relative.host = relPath_1.shift()))
                        ;
                    if (!relative.host)
                        relative.host = "";
                    if (!relative.hostname)
                        relative.hostname = "";
                    if (relPath_1[0] !== "")
                        relPath_1.unshift("");
                    if (relPath_1.length < 2)
                        relPath_1.unshift("");
                    r.pathname = relPath_1.join("/");
                }
                else {
                    r.pathname = relative.pathname;
                }
                r.search = relative.search;
                r.query = relative.query;
                r.host = relative.host || "";
                r.auth = relative.auth;
                r.hostname = relative.hostname || relative.host;
                r.port = relative.port;
                // to support http.request
                if (r.pathname || r.search) {
                    var p = r.pathname || "";
                    var s = r.search || "";
                    r.path = p + s;
                }
                r.slashes = r.slashes || relative.slashes;
                r.href = r.toString();
                return r;
            }
            var isSourceAbs = (r.pathname && r.pathname.charAt(0) === "/");
            var isRelAbs = (relative.host ||
                relative.pathname && relative.pathname.charAt(0) === "/");
            var mustEndAbs = (isRelAbs || isSourceAbs ||
                (r.host && relative.pathname));
            var removeAllDots = mustEndAbs;
            var srcPath = r.pathname && r.pathname.split("/") || [];
            var relPath = relative.pathname && relative.pathname.split("/") || [];
            var psychotic = r.protocol && !slashedProtocol[r.protocol];
            // if the url is a non-slashed url, then relative
            // links like ../.. should be able
            // to crawl up to the hostname, as well.  This is strange.
            // r.protocol has already been set by now.
            // Later on, put the first path part into the host field.
            if (psychotic) {
                r.hostname = "";
                r.port = null;
                if (r.host) {
                    if (srcPath[0] === "")
                        srcPath[0] = r.host;
                    else
                        srcPath.unshift(r.host);
                }
                r.host = "";
                if (relative.protocol) {
                    relative.hostname = null;
                    relative.port = null;
                    relative.auth = null;
                    if (relative.host) {
                        if (relPath[0] === "")
                            relPath[0] = relative.host;
                        else
                            relPath.unshift(relative.host);
                    }
                    relative.host = null;
                }
                mustEndAbs = mustEndAbs && (relPath[0] === "" || srcPath[0] === "");
            }
            if (isRelAbs) {
                // it's absolute.
                if (relative.host || relative.host === "") {
                    r.host = relative.host;
                    r.auth = null;
                }
                if (relative.hostname || relative.hostname === "") {
                    r.hostname = relative.hostname;
                    r.auth = null;
                }
                r.search = relative.search;
                r.query = relative.query;
                srcPath = relPath;
                // fall through to the dot-handling below.
            }
            else if (relPath.length) {
                // it's relative
                // throw away the existing file, and take the new path instead.
                if (!srcPath)
                    srcPath = [];
                srcPath.pop();
                srcPath = srcPath.concat(relPath);
                r.search = relative.search;
                r.query = relative.query;
            }
            else if (relative.search !== null && relative.search !== undefined) {
                // just pull out the search.
                // like href='?foo'.
                // Put this after the other two cases because it simplifies the booleans
                if (psychotic) {
                    r.hostname = r.host = srcPath.shift();
                    // occasionally the auth can get stuck only in host
                    // this especially happens in cases like
                    // url.resolveObject('mailto:local1@domain1', 'local2@domain2')
                    var authInHost = r.host && r.host.indexOf("@") > 0 &&
                        r.host.split("@");
                    if (authInHost) {
                        r.auth = authInHost.shift();
                        r.host = r.hostname = authInHost.shift();
                    }
                }
                r.search = relative.search;
                r.query = relative.query;
                // to support http.request
                if (r.pathname !== null || r.search !== null) {
                    r.path = (r.pathname ? r.pathname : "") +
                        (r.search ? r.search : "");
                }
                r.href = r.toString();
                return r;
            }
            if (!srcPath.length) {
                // no path at all.  easy.
                // we've already handled the other stuff above.
                r.pathname = null;
                // to support http.request
                if (r.search) {
                    r.path = "/" + r.search;
                }
                else {
                    r.path = null;
                }
                r.href = r.toString();
                return r;
            }
            // if a url ENDs in . or .., then it must get a trailing slash.
            // however, if it ends in anything else non-slashy,
            // then it must NOT get a trailing slash.
            var last = srcPath.slice(-1)[0];
            var hasTrailingSlash = ((r.host || relative.host || srcPath.length > 1) &&
                (last === "." || last === "..") || last === "");
            // strip single dots, resolve double dots to parent dir
            // if the path tries to go above the root, `up` ends up > 0
            var up = 0;
            for (var i = srcPath.length; i >= 0; i--) {
                last = srcPath[i];
                if (last === ".") {
                    spliceOne(srcPath, i);
                }
                else if (last === "..") {
                    spliceOne(srcPath, i);
                    up++;
                }
                else if (up) {
                    spliceOne(srcPath, i);
                    up--;
                }
            }
            // if the path is allowed to go above the root, restore leading ..s
            if (!mustEndAbs && !removeAllDots) {
                for (; up--; up) {
                    srcPath.unshift("..");
                }
            }
            if (mustEndAbs && srcPath[0] !== "" &&
                (!srcPath[0] || srcPath[0].charAt(0) !== "/")) {
                srcPath.unshift("");
            }
            if (hasTrailingSlash && (srcPath.join("/").substr(-1) !== "/")) {
                srcPath.push("");
            }
            var isAbsolute = srcPath[0] === "" ||
                (srcPath[0] && srcPath[0].charAt(0) === "/");
            // put the host back
            if (psychotic) {
                r.hostname = r.host = isAbsolute ? "" :
                    srcPath.length ? srcPath.shift() : "";
                // occasionally the auth can get stuck only in host
                // this especially happens in cases like
                // url.resolveObject('mailto:local1@domain1', 'local2@domain2')
                var authInHost = r.host && r.host.indexOf("@") > 0 &&
                    r.host.split("@");
                if (authInHost) {
                    r.auth = authInHost.shift();
                    r.host = r.hostname = authInHost.shift();
                }
            }
            mustEndAbs = mustEndAbs || (r.host && srcPath.length);
            if (mustEndAbs && !isAbsolute) {
                srcPath.unshift("");
            }
            if (!srcPath.length) {
                r.pathname = null;
                r.path = null;
            }
            else {
                r.pathname = srcPath.join("/");
            }
            // to support request.http
            if (r.pathname !== null || r.search !== null) {
                r.path = (r.pathname ? r.pathname : "") +
                    (r.search ? r.search : "");
            }
            r.auth = relative.auth || r.auth;
            r.slashes = r.slashes || relative.slashes;
            r.href = r.toString();
            return r;
            // About 1.5x faster than the two-arg version of Array#splice().
            function spliceOne(list, index) {
                for (var i = index, k = i + 1; k < list.length; i += 1, k += 1)
                    list[i] = list[k];
                list.pop();
            }
        };
        /**
         * 基于指定地址解析指定的相对地址返回绝对地址。
         * @param source 要解析的基地址。
         * @param relative 要解析的相对地址。
         * @return 返回解析后的地址。
         */
        Url.resolve = function (source, relative) {
            return Url.parse(source, false, true).resolve(relative).toString();
        };
        return Url;
    }());
    exports.default = Url;
});
//# sourceMappingURL=url.js.map