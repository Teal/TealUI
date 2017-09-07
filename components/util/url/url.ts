import { parseQuery, formatQuery } from "util/query";

// Reference: RFC 3986, RFC 1808, RFC 2396

// protocols that never have a hostname.
const hostlessProtocol: any = {
    "javascript": true,
    "javascript:": true
};
// protocols that always contain a // bit.
const slashedProtocol: any = {
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
export default class Url {

    /**
     * 协议部分。如 "http:"。
     */
    protocol: string;

    /**
     * 判断当前地址是否包含分隔符(//)。
     */
    slashes: boolean;

    /**
     * 验证部分。如 "name:password"。
     */
    auth: string;

    /**
     * 主机部分。如 "localhost:80"。
     */
    host: string;

    /**
     * 端口部分。如 "80"。
     */
    port: string;

    /**
     * 主机名部分。如 "localhost"。
     */
    hostname: string;

    /**
     * 哈希值部分。如 "#hash"。
     */
    hash: string;

    /**
     * 查询参数部分。如 "?q=1"。
     */
    search: string;

    /**
     * 查询参数部分。如 {q: 1}。
     */
    query: string | { [key: string]: string };

    /**
     * 路径名部分。如 "/foo/a.html?q=1"。
     */
    pathname: string;

    /**
     * 路径部分。如 "/foo/a.html"。
     */
    path: string;

    /**
     * 完整地址。如 "http://localhost:80/foo/a.html?q=1"。
     */
    href: string;

    /**
     * 解析指定的地址并填充信息到当前地址。
     * @param url 要解析的地址。
     * @param parseQueryString 是否解析查询字符串。
     * @param slashesDenoteHost 允许 "/" 作为主机名解析。
     */
    parse(url: string, parseQueryString?: boolean, slashesDenoteHost?: boolean) {

        // Copy chrome, IE, opera backslash-handling behavior.
        // Back slashes before the query string get converted to forward slashes
        // See: https://code.google.com/p/chromium/issues/detail?id=25916
        let hasHash = false;
        let start = -1;
        let end = -1;
        let rest = "";
        let lastPos = 0;
        let i = 0;
        for (let inWs = false, split = false; i < url.length; ++i) {
            const code = url.charCodeAt(i);

            // Find first and last non-whitespace characters for trimming
            const isWs = code === 32 /* */ ||
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
            } else {
                if (inWs) {
                    if (!isWs) {
                        end = -1;
                        inWs = false;
                    }
                } else if (isWs) {
                    end = i;
                    inWs = true;
                }
            }

            // Only convert backslashes while we haven't seen a split character
            if (!split) {
                switch (code) {
                    case 35: // '#'
                        hasHash = true;
                    // Fall through
                    case 63: // '?'
                        split = true;
                        break;
                    case 92: // '\\'
                        if (i - lastPos > 0)
                            rest += url.slice(lastPos, i);
                        rest += "/";
                        lastPos = i + 1;
                        break;
                }
            } else if (!hasHash && code === 35/*#*/) {
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
                } else {
                    rest = url.slice(start, end);
                }
            } else if (end === -1 && lastPos < url.length) {
                // We converted some backslashes and have only part of the entire string
                rest += url.slice(lastPos);
            } else if (end !== -1 && lastPos < end) {
                // We converted some backslashes and have only part of the entire string
                rest += url.slice(lastPos, end);
            }
        }

        if (!slashesDenoteHost && !hasHash) {
            // Try fast path regexp
            const simplePath = /^(\/\/?(?!\/)[^\?\s]*)(\?[^\s]*)?$/.exec(rest);
            if (simplePath) {
                this.path = rest;
                this.href = rest;
                this.pathname = simplePath[1];
                if (simplePath[2]) {
                    this.search = simplePath[2];
                    this.query = parseQueryString ? parseQuery(this.search.slice(1)) : this.search.slice(1);
                } else if (parseQueryString) {
                    this.search = "";
                    this.query = {};
                }
                return this;
            }
        }

        const match = /^([a-z0-9.+-]+:)/i.exec(rest);
        let proto;
        let lowerProto;
        if (match) {
            proto = match[0];
            this.protocol = lowerProto = proto.toLowerCase();
            rest = rest.slice(proto.length);
        }

        // figure out if it's got a host
        // user@server is *always* interpreted as a hostname, and url
        // resolution will treat //foo/bar as host=foo,path=bar because that's
        // how the browser resolves relative URLs.
        let slashes;
        if (slashesDenoteHost || proto || /^\/\/[^@\/]+@[^@\/]+/.test(rest)) {
            slashes = rest.charCodeAt(0) === 47 /*/*/ &&
                rest.charCodeAt(1) === 47 /*/*/;
            if (slashes && !(proto && hostlessProtocol[proto])) {
                rest = rest.slice(2);
                this.slashes = true;
            }
        }

        if (!hostlessProtocol[proto as any] && (slashes || (proto && !slashedProtocol[proto]))) {

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

            let hostEnd = -1;
            let atSign = -1;
            let nonHost = -1;
            for (i = 0; i < rest.length; ++i) {
                switch (rest.charCodeAt(i)) {
                    case 9:   // '\t'
                    case 10:  // '\n'
                    case 13:  // '\r'
                    case 32:  // ' '
                    case 34:  // '"'
                    case 37:  // '%'
                    case 39:  // '\''
                    case 59:  // ';'
                    case 60:  // '<'
                    case 62:  // '>'
                    case 92:  // '\\'
                    case 94:  // '^'
                    case 96:  // '`'
                    case 123: // '{'
                    case 124: // '|'
                    case 125: // '}'
                        // Characters that are never ever allowed in a hostname from RFC 2396
                        if (nonHost === -1)
                            nonHost = i;
                        break;
                    case 35: // '#'
                    case 47: // '/'
                    case 63: // '?'
                        // Find the first instance of any host-ending characters
                        if (nonHost === -1)
                            nonHost = i;
                        hostEnd = i;
                        break;
                    case 64: // '@'
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
            } else {
                this.host = rest.slice(start, nonHost);
                rest = rest.slice(nonHost);
            }

            // pull out port.
            this.parseHost();

            // we've indicated that there is a hostname,
            // so even if it's empty, it has to be present.
            if (typeof this.hostname !== "string")
                this.hostname = "";

            const hostname = this.hostname;

            // if hostname begins with [ and ends with ]
            // assume that it's an IPv6 address.
            const ipv6Hostname = hostname.charCodeAt(0) === 91 /*[*/ &&
                hostname.charCodeAt(hostname.length - 1) === 93 /*]*/;

            // validate a little.
            if (!ipv6Hostname) {
                const result = validateHostname(this, rest, hostname);
                if (result !== undefined)
                    rest = result;
            }

            // 主机名最长 255
            if (this.hostname.length > 255) {
                this.hostname = "";
            } else {
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

            const p = this.port ? ":" + this.port : "";
            const h = this.hostname || "";
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
        const unsafeProtocol: any = {
            "javascript": true,
            "javascript:": true
        };

        // now rest is set to the post-host stuff.
        // chop off any delim chars.
        if (!unsafeProtocol[lowerProto as any]) {
            // First, make 100% sure that any "autoEscape" chars get
            // escaped, even if encodeURIComponent doesn't think they
            // need to be.
            const result = autoEscapeStr(rest);
            if (result !== undefined)
                rest = result;
        }

        let questionIdx = -1;
        let hashIdx = -1;
        for (i = 0; i < rest.length; ++i) {
            const code = rest.charCodeAt(i);
            if (code === 35 /*#*/) {
                this.hash = rest.slice(i);
                hashIdx = i;
                break;
            } else if (code === 63 /*?*/ && questionIdx === -1) {
                questionIdx = i;
            }
        }

        if (questionIdx !== -1) {
            if (hashIdx === -1) {
                this.search = rest.slice(questionIdx);
                this.query = rest.slice(questionIdx + 1);
            } else {
                this.search = rest.slice(questionIdx, hashIdx);
                this.query = rest.slice(questionIdx + 1, hashIdx);
            }
            if (parseQueryString) {
                this.query = parseQuery(this.query as string);
            }
        } else if (parseQueryString) {
            // no query string, but parseQueryString still requested
            this.search = "";
            this.query = {};
        }

        const firstIdx = (questionIdx !== -1 &&
            (hashIdx === -1 || questionIdx < hashIdx)
            ? questionIdx
            : hashIdx);
        if (firstIdx === -1) {
            if (rest.length > 0)
                this.pathname = rest;
        } else if (firstIdx > 0) {
            this.pathname = rest.slice(0, firstIdx);
        }
        if (slashedProtocol[lowerProto as any] &&
            this.hostname && !this.pathname) {
            this.pathname = "/";
        }

        // to support http.request
        if (this.pathname || this.search) {
            const p = this.pathname || "";
            const s = this.search || "";
            this.path = p + s;
        }

        // finally, reconstruct the href based on what has been validated.
        this.href = this.toString();
        return this;


        function autoEscapeStr(rest: any) {
            let newRest = "";
            let lastPos = 0;
            for (let i = 0; i < rest.length; ++i) {
                // Automatically escape all delimiters and unwise characters from RFC 2396
                // Also escape single quotes in case of an XSS attack
                switch (rest.charCodeAt(i)) {
                    case 9:   // '\t'
                        if (i - lastPos > 0)
                            newRest += rest.slice(lastPos, i);
                        newRest += "%09";
                        lastPos = i + 1;
                        break;
                    case 10:  // '\n'
                        if (i - lastPos > 0)
                            newRest += rest.slice(lastPos, i);
                        newRest += "%0A";
                        lastPos = i + 1;
                        break;
                    case 13:  // '\r'
                        if (i - lastPos > 0)
                            newRest += rest.slice(lastPos, i);
                        newRest += "%0D";
                        lastPos = i + 1;
                        break;
                    case 32:  // ' '
                        if (i - lastPos > 0)
                            newRest += rest.slice(lastPos, i);
                        newRest += "%20";
                        lastPos = i + 1;
                        break;
                    case 34:  // '"'
                        if (i - lastPos > 0)
                            newRest += rest.slice(lastPos, i);
                        newRest += "%22";
                        lastPos = i + 1;
                        break;
                    case 39:  // '\''
                        if (i - lastPos > 0)
                            newRest += rest.slice(lastPos, i);
                        newRest += "%27";
                        lastPos = i + 1;
                        break;
                    case 60:  // '<'
                        if (i - lastPos > 0)
                            newRest += rest.slice(lastPos, i);
                        newRest += "%3C";
                        lastPos = i + 1;
                        break;
                    case 62:  // '>'
                        if (i - lastPos > 0)
                            newRest += rest.slice(lastPos, i);
                        newRest += "%3E";
                        lastPos = i + 1;
                        break;
                    case 92:  // '\\'
                        if (i - lastPos > 0)
                            newRest += rest.slice(lastPos, i);
                        newRest += "%5C";
                        lastPos = i + 1;
                        break;
                    case 94:  // '^'
                        if (i - lastPos > 0)
                            newRest += rest.slice(lastPos, i);
                        newRest += "%5E";
                        lastPos = i + 1;
                        break;
                    case 96:  // '`'
                        if (i - lastPos > 0)
                            newRest += rest.slice(lastPos, i);
                        newRest += "%60";
                        lastPos = i + 1;
                        break;
                    case 123: // '{'
                        if (i - lastPos > 0)
                            newRest += rest.slice(lastPos, i);
                        newRest += "%7B";
                        lastPos = i + 1;
                        break;
                    case 124: // '|'
                        if (i - lastPos > 0)
                            newRest += rest.slice(lastPos, i);
                        newRest += "%7C";
                        lastPos = i + 1;
                        break;
                    case 125: // '}'
                        if (i - lastPos > 0)
                            newRest += rest.slice(lastPos, i);
                        newRest += "%7D";
                        lastPos = i + 1;
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

        function validateHostname(self: Url, rest: string, hostname: string) {
            for (let i = 0, lastPos: any; i <= hostname.length; ++i) {
                let code: any;
                if (i < hostname.length)
                    code = hostname.charCodeAt(i);
                if (code === 46 /*.*/ || i === hostname.length) {
                    if (i - lastPos > 0) {
                        if (i - lastPos > 63) {
                            self.hostname = hostname.slice(0, lastPos + 63);
                            return "/" + hostname.slice(lastPos + 63) + rest;
                        }
                    }
                    lastPos = i + 1;
                    continue;
                } else if ((code >= 48 /*0*/ && code <= 57 /*9*/) ||
                    (code >= 97 /*a*/ && code <= 122 /*z*/) ||
                    code === 45 /*-*/ ||
                    (code >= 65 /*A*/ && code <= 90 /*Z*/) ||
                    code === 43 /*+*/ ||
                    code === 95 /*_*/ ||
                    code > 127) {
                    continue;
                }
                // Invalid host character
                self.hostname = hostname.slice(0, i);
                if (i < hostname.length)
                    return "/" + hostname.slice(i) + rest;
                break;
            }
        }

    }

    /**
     * 解析主机名部分。
     */
    private parseHost() {
        let host = this.host;
        const match = /:[0-9]*$/.exec(host);
        if (match) {
            const port = match[0];
            if (port !== ":") {
                this.port = port.slice(1);
            }
            host = host.slice(0, host.length - port.length);
        }
        if (host) this.hostname = host;
    }

    /**
     * 解析指定的地址并填充信息到当前地址。
     * @param url 要解析的地址。
     * @param parseQueryString 是否解析查询字符串。
     * @param slashesDenoteHost 允许 "/" 作为主机名解析。
     */
    static parse(url: string | Url, parseQueryString?: boolean, slashesDenoteHost?: boolean) {
        if (url instanceof Url) return url;

        const u = new Url();
        u.parse(url as string, parseQueryString, slashesDenoteHost);
        return u;
    }

    /**
     * 转换当前地址为字符串。
     */
    toString() {
        let auth = this.auth || "";
        if (auth) {
            auth = encodeURIComponent(auth).replace(/%3A/g, ":");
            auth += "@";
        }

        let protocol = this.protocol || "";
        let pathname = this.pathname || "";
        let hash = this.hash || "";
        let host: string | undefined;
        let query = "";

        if (this.host) {
            host = auth + this.host;
        } else if (this.hostname) {
            host = auth + (this.hostname.indexOf(":") === -1 ?
                this.hostname :
                "[" + this.hostname + "]");
            if (this.port) {
                host += ":" + this.port;
            }
        }

        if (this.query !== null && typeof this.query === "object")
            query = formatQuery(this.query);

        let search = this.search || (query && ("?" + query)) || "";

        if (protocol && protocol.charCodeAt(protocol.length - 1) !== 58/*:*/)
            protocol += ":";

        let newPathname = "";
        let lastPos = 0;
        for (let i = 0; i < pathname.length; ++i) {
            switch (pathname.charCodeAt(i)) {
                case 35: // '#'
                    if (i - lastPos > 0)
                        newPathname += pathname.slice(lastPos, i);
                    newPathname += "%23";
                    lastPos = i + 1;
                    break;
                case 63: // '?'
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
            if (pathname && pathname.charCodeAt(0) !== 47/*/*/)
                pathname = "/" + pathname;
        } else if (!host) {
            host = "";
        }

        search = search.replace("#", "%23");

        if (hash && hash.charCodeAt(0) !== 35/*#*/) hash = "#" + hash;
        if (search && search.charCodeAt(0) !== 63/*?*/) search = "?" + search;

        return protocol + host + pathname + search + hash;
    }

    /**
     * 格式化指定的对象为标准地址。
     * @param obj 要格式化的对象。
     */
    static format(obj: any) {
        // ensure it's an object, and not a string url.
        // If it's an obj, this is a no-op.
        // this way, you can call url_format() on strings
        // to clean up potentially wonky urls.
        if (typeof obj === "string") obj = Url.parse(obj);

        else if (typeof obj !== "object" || obj === null)
            throw new TypeError('Parameter "urlObj" must be an object, not ' + obj === null ? "null" : typeof obj);

        else if (!(obj instanceof Url)) return Url.prototype.toString.call(obj) as string;

        return obj.toString() as string;
    }

    /**
     * 基于当前地址解析指定的相对地址，返回绝对地址。
     * @param relative 要解析的相对地址。
     */
    resolve(relative: string) {
        return this.resolveObject(relative).toString();
    }

    /**
     * 基于指定地址解析指定的相对地址，返回绝对地址。
     * @param source 要解析的基地址。
     * @param relative 要解析的相对地址。
     * @return 返回解析后的地址。
     */
    static resolve(source: string | Url, relative: string) {
        return Url.parse(source, false, true).resolve(relative);
    }

    /**
     * 基于当前地址解析指定的相对地址，返回绝对地址。
     * @param relative 要解析的相对地址。
     */
    resolveObject(relative: string | Url) {

        if (typeof relative === "string") {
            const rel = new Url();
            rel.parse(relative as string, false, true);
            relative = rel;
        }

        const result = new Url();
        for (const tkey in this as any) {
            (result as any)[tkey] = (this as any)[tkey];
        }

        result.hash = (relative as Url).hash;

        // if the relative url is empty, then there's nothing left to do here.
        if ((relative as Url).href === "") {
            result.href = (relative as Url).toString();
            return result;
        }

        // hrefs like //foo/bar always cut to the protocol.
        if ((relative as Url).slashes && !(relative as Url).protocol) {
            // take everything except the protocol from relative
            for (const k in result) {
                if (k !== "protocol")
                    (result as any)[k] = (relative as any)[k];
            }

            // urlParse appends trailing / to urls like http://www.example.com
            if (slashedProtocol[result.protocol] && result.hostname && !result.pathname) {
                result.path = result.pathname = "/";
            }

            result.href = (result as Url).toString();
            return result;
        }

        if ((relative as Url).protocol && (relative as Url).protocol !== result.protocol) {
            // if it's a known url protocol, then changing
            // the protocol does weird things
            // first, if it's not file:, then we MUST have a host,
            // and if there was a path
            // to begin with, then we MUST have a path.
            // if it is file:, then the host is dropped,
            // because that's known to be hostless.
            // anything else is assumed to be absolute.
            if (!slashedProtocol[(relative as Url).protocol]) {
                for (const k in result) {
                    (result as any)[k] = (relative as any)[k];
                }
                return result;
            }

            result.protocol = (relative as Url).protocol;
            if (!(relative as Url).host &&
                !/^file:?$/.test((relative as Url).protocol) &&
                !hostlessProtocol[(relative as Url).protocol]) {
                const relPath = ((relative as Url).pathname || "").split("/");
                while (relPath.length && !((relative as Url).host = relPath.shift()!));
                if (!(relative as Url).host) (relative as Url).host = "";
                if (!(relative as Url).hostname) (relative as Url).hostname = "";
                if (relPath[0] !== "") relPath.unshift("");
                if (relPath.length < 2) relPath.unshift("");
                result.pathname = relPath.join("/");
            } else {
                result.pathname = (relative as Url).pathname;
            }
            result.search = (relative as Url).search;
            result.query = (relative as Url).query;
            result.host = (relative as Url).host || "";
            result.auth = (relative as Url).auth;
            result.hostname = (relative as Url).hostname || (relative as Url).host;
            result.port = (relative as Url).port;
            // to support http.request
            if (result.pathname || result.search) {
                const p = result.pathname || "";
                const s = result.search || "";
                result.path = p + s;
            }
            result.slashes = result.slashes || (relative as Url).slashes;
            result.href = result.toString();
            return result;
        }

        const isSourceAbs = (result.pathname && result.pathname.charAt(0) === "/");
        const isRelAbs = (
            (relative as Url).host ||
            (relative as Url).pathname && (relative as Url).pathname.charAt(0) === "/"
        );
        let mustEndAbs: any = (isRelAbs || isSourceAbs ||
            (result.host && (relative as Url).pathname));
        const removeAllDots = mustEndAbs;
        let srcPath = result.pathname && result.pathname.split("/") || [];
        const relPath = (relative as Url).pathname && (relative as Url).pathname.split("/") || [];
        const psychotic = result.protocol && !slashedProtocol[result.protocol];

        // if the url is a non-slashed url, then relative
        // links like ../.. should be able
        // to crawl up to the hostname, as well.  This is strange.
        // result.protocol has already been set by now.
        // Later on, put the first path part into the host field.
        if (psychotic) {
            result.hostname = "";
            result.port = null!;
            if (result.host) {
                if (srcPath[0] === "") srcPath[0] = result.host;
                else srcPath.unshift(result.host);
            }
            result.host = "";
            if ((relative as Url).protocol) {
                (relative as Url).hostname = null!;
                (relative as Url).port = null!;
                (relative as Url).auth = null!;
                if ((relative as Url).host) {
                    if (relPath[0] === "") relPath[0] = (relative as Url).host;
                    else relPath.unshift((relative as Url).host);
                }
                (relative as Url).host = null!;
            }
            mustEndAbs = mustEndAbs && (relPath[0] === "" || srcPath[0] === "");
        }

        if (isRelAbs) {
            // it's absolute.
            if ((relative as Url).host || (relative as Url).host === "") {
                result.host = (relative as Url).host;
                result.auth = null!;
            }
            if ((relative as Url).hostname || (relative as Url).hostname === "") {
                result.hostname = (relative as Url).hostname;
                result.auth = null!;
            }
            result.search = (relative as Url).search;
            result.query = (relative as Url).query;
            srcPath = relPath;
            // fall through to the dot-handling below.
        } else if (relPath.length) {
            // it's relative
            // throw away the existing file, and take the new path instead.
            if (!srcPath) srcPath = [];
            srcPath.pop();
            srcPath = srcPath.concat(relPath);
            result.search = (relative as Url).search;
            result.query = (relative as Url).query;
        } else if (relative.search !== null && relative.search !== undefined) {
            // just pull out the search.
            // like href='?foo'.
            // Put this after the other two cases because it simplifies the booleans
            if (psychotic) {
                result.hostname = result.host = srcPath.shift()!;
                // occasionally the auth can get stuck only in host
                // this especially happens in cases like
                // url.resolveObject('mailto:local1@domain1', 'local2@domain2')
                const authInHost = result.host && result.host.indexOf("@") > 0 &&
                    result.host.split("@");
                if (authInHost) {
                    result.auth = authInHost.shift()!;
                    result.host = result.hostname = authInHost.shift()!;
                }
            }
            result.search = (relative as Url).search;
            result.query = (relative as Url).query;
            // to support http.request
            if (result.pathname !== null || result.search !== null) {
                result.path = (result.pathname ? result.pathname : "") +
                    (result.search ? result.search : "");
            }
            result.href = result.toString();
            return result;
        }

        if (!srcPath.length) {
            // no path at all.  easy.
            // we've already handled the other stuff above.
            result.pathname = null!;
            // to support http.request
            if (result.search) {
                result.path = "/" + result.search;
            } else {
                result.path = null!;
            }
            result.href = result.toString();
            return result;
        }

        // if a url ENDs in . or .., then it must get a trailing slash.
        // however, if it ends in anything else non-slashy,
        // then it must NOT get a trailing slash.
        let last = srcPath.slice(-1)[0];
        const hasTrailingSlash = (
            (result.host || (relative as Url).host || srcPath.length > 1) &&
            (last === "." || last === "..") || last === "");

        // strip single dots, resolve double dots to parent dir
        // if the path tries to go above the root, `up` ends up > 0
        let up = 0;
        for (let i = srcPath.length; i >= 0; i--) {
            last = srcPath[i];
            if (last === ".") {
                spliceOne(srcPath, i);
            } else if (last === "..") {
                spliceOne(srcPath, i);
                up++;
            } else if (up) {
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

        const isAbsolute = srcPath[0] === "" ||
            (srcPath[0] && srcPath[0].charAt(0) === "/");

        // put the host back
        if (psychotic) {
            result.hostname = result.host = isAbsolute ? "" :
                srcPath.length ? srcPath.shift()! : "";
            // occasionally the auth can get stuck only in host
            // this especially happens in cases like
            // url.resolveObject('mailto:local1@domain1', 'local2@domain2')
            const authInHost = result.host && result.host.indexOf("@") > 0 &&
                result.host.split("@");
            if (authInHost) {
                result.auth = authInHost.shift()!;
                result.host = result.hostname = authInHost.shift()!;
            }
        }

        mustEndAbs = mustEndAbs || (result.host && srcPath.length);

        if (mustEndAbs && !isAbsolute) {
            srcPath.unshift("");
        }

        if (!srcPath.length) {
            result.pathname = null!;
            result.path = null!;
        } else {
            result.pathname = srcPath.join("/");
        }

        // to support request.http
        if (result.pathname !== null || result.search !== null) {
            result.path = (result.pathname ? result.pathname : "") +
                (result.search ? result.search : "");
        }
        result.auth = (relative as Url).auth || result.auth;
        result.slashes = result.slashes || (relative as Url).slashes;
        result.href = result.toString();
        return result;

        // About 1.5x faster than the two-arg version of Array#splice().
        function spliceOne(list: any[], index: number) {
            for (let i = index, k = i + 1; k < list.length; i += 1, k += 1)
                list[i] = list[k];
            list.pop();
        }

    }

    /**
     * 基于指定地址解析指定的相对地址，返回绝对地址。
     * @param source 要解析的基地址。
     * @param relative 要解析的相对地址。
     * @return 返回解析后的地址。
     */
    static resolveObject(source: string | Url, relative: string | Url) {
        if (!source) return relative;
        return Url.parse(source, false, true).resolveObject(relative);
    }

}
