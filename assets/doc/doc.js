/**
 * 提供文档演示相关功能接口。
 */
const Doc = {

    /**
     * 初始化文档页面。
     * @param meta 当前页面的元数据。
     */
    init(meta) {
        Doc._meta = meta;
        if (Doc._hasQuery("doc-fullscreen")) {
            Doc._toggleClass(document.body, "doc-fullscreen");
            Doc._each("#doc_header,#doc_sidebar,#doc_pager,#doc_footer,.doc-permalink", Doc._remove);
            Doc._get("doc_mainmenu").innerHTML = `<a href="javascript:Doc.toggleFullScreen()" title="退出全屏"><i class="doc-icon">✠</i>退出全屏</a>`;
        } else {
            if (meta.test && Doc._hasQuery("doc-unittest")) {
                document.title = "单元测试：" + document.title.replace(/\s*-[^\-]*$/, "");
                const main = Doc._get("doc_main");
                main.innerHTML = `<aside id="doc_mainmenu" class="doc-menubutton" style="margin: -.25rem 1rem 0">
                            <a href="javascript:Doc.toggleUnitTest()"><i class="doc-icon">✖</i>退出单元测试</a>
                        </aside>
                        <link rel="stylesheet" href="${meta.root}/assets/doc/qunit.css">
                        <div id="qunit"><span class="doc-tip"><i class="doc-icon doc-spin">҉</i> 正在载入测试用例...</span></div>
                        <div id="qunit-fixture"></div>
                        <div style="display: none" class="doc">${main.innerHTML}</div>`;
                const pager = Doc._get("doc_pager");
                if (pager) {
                    main.appendChild(pager);
                }
                Doc.runUnitTest(meta.test);
            }

            Doc._insert(`<div id="doc_progress"></div>`);
            Doc._insert(`<a href="javascript:Doc.gotoTop()" id="doc_gototop" class="doc-icon doc-gototop-hide">↑</a>`);
            window.addEventListener("resize", Doc.relayout, false);
            window.addEventListener("scroll", Doc.relayout, false);
            window.addEventListener("load", Doc.relayout, false);
        }

        Doc._each(".doc-menubutton>menu", elem => {
            elem.onclick = () => {
                if (!Doc._hasClass(elem, "doc-menubutton-disable")) {
                    Doc._toggleClass(elem, "doc-menubutton-disable");
                }
            };
            elem.parentNode.onmouseover = elem.parentNode.ontouchstart = () => {
                if (Doc._hasClass(elem, "doc-menubutton-disable")) {
                    Doc._toggleClass(elem, "doc-menubutton-disable");
                }
            };
        });
        Doc._each("a[href^='#']", anchor => {
            anchor.onclick = e => {
                const target = Doc._get(anchor.getAttribute("href").slice(1));
                if (target) {
                    Doc._scrollTo(document, target.getBoundingClientRect().top - 5, true);
                    if (target.parentNode && target.parentNode.parentNode && target.parentNode.parentNode.className === "doc-api") {
                        Doc.toggleApi(target.querySelector("td > .doc-api-toggle"), true);
                    }
                    history.pushState(null, document.title, anchor.href);
                    e.preventDefault();
                }
            };
        });
        Doc._each("#doc_pager a", anchor => {
            anchor.href += location.search;
        });
        const target = location.hash.length > 1 && Doc._get(location.hash.slice(1));
        if (target && target.parentNode && target.parentNode.parentNode && target.parentNode.parentNode.className === "doc-api") {
            Doc.toggleApi(target.querySelector("td > .doc-api-toggle"), true);
        }
        Doc.injectRequire();
    },

    /**
     * 更新页面布局。
     */
    relayout() {
        const bodyHeight = window.innerHeight;
        const mainTop = Doc._get("doc_main").getBoundingClientRect().top;
        const mainBottom = Doc._get("doc_footer").getBoundingClientRect().top;
        const smallScreen = Doc._get("doc_togglesidebar").offsetHeight;
        let position;
        let top;
        let innerHeight;
        if (smallScreen || mainTop <= 0) {
            position = "fixed";
            top = 0;
            innerHeight = smallScreen ? bodyHeight : Math.min(bodyHeight, mainBottom);
        } else {
            position = "absolute";
            top = "";
            innerHeight = bodyHeight - mainTop - Math.max(0, bodyHeight - mainBottom);
        }
        const sidebarStyle = Doc._get("doc_sidebar").style;
        sidebarStyle.position = position;
        sidebarStyle.top = top;
        Doc._get("doc_sidebar_menu").style.height = innerHeight - Doc._get("doc_sidebar_header").offsetHeight - 1 + "px";
        Doc._get("doc_progress").style.width = mainTop < 0 ? Math.max(0, Math.min(-mainTop * 100 / (mainBottom - 40 - mainTop - bodyHeight), 100)) + "%" : 0;
        Doc._get("doc_gototop").className = "doc-icon" + (mainTop <= 0 ? "" : " doc-gototop-hide");
    },

    /**
     * 初始化列表。
     * @param list 列表数据。
     */
    initList(list) {
        Doc._list = list;
        Doc.renderList();
        Doc.relayout();

        const menu = Doc._get("doc_sidebar_menu");
        const active = menu.querySelector(".doc-sidebar-active");
        if (active) {
            Doc._scrollIntoView(menu, active, true);
        }

        const filter = Doc._get("doc_sidebar_filter");
        filter.oninput = Doc.renderList;
        filter.onkeydown = e => {
            switch (e.keyCode) {
                case 10 /* enter */:
                case 13 /* enter */:
                    Doc.gotoActiveItem();
                    break;
                case 38 /* up */:
                case 40 /* down */:
                    e.preventDefault();
                    Doc.moveActiveItem(e.keyCode === 38 ? -1 : 1);
                    break;
            }
        };

        if (navigator.appVersion.indexOf("Win") >= 0) {
            menu.className = "doc-hidescrollbar";
        }
    },

    /**
     * 重新渲染列表。
     */
    renderList() {
        let list = Doc._list;
        let active = Doc._meta.active;

        const filter = Doc._get("doc_sidebar_filter").value.trim().toLowerCase();
        if (filter) {
            list = [];
            const add = item => {
                if (Array.isArray(item)) {
                    for (const data of item) {
                        const matchResult = Doc._matchFilter(data, filter);
                        if (matchResult) {
                            matchResult.href = data.href;
                            matchResult.title = data.title;
                            list.push(matchResult);
                        }
                    }
                } else {
                    for (const key in item) {
                        add(item[key]);
                    }
                }
            };
            add(Doc._list);
            list.sort((x, y) => y.level - x.level);
            active = list[0] && list[0].href;
        }

        let html = "";
        const append = items => {
            if (Array.isArray(items)) {
                for (const item of items) {
                    const title = Doc._encodeHTML(item.title);
                    html += `<li${item.href === active ? ` class="doc-sidebar-active" aria-selected="true"` : ""}><a href="${Doc._meta.root}/${Doc._meta.dir}/${item.href}${location.search}" title="${title}">${item.titleHtml || title}<small>${item.nameHtml || Doc._encodeHTML(Doc.nameOfItem(item.href))}</small></a></li>`;
                }
            } else {
                for (const key in items) {
                    html += `<li><span onclick="Doc.toggleMenu(this)">${Doc._encodeHTML(key)}</span><ul>`;
                    append(items[key]);
                    html += `</ul></li>`;
                }
            }
        };
        append(list);
        Doc._get("doc_sidebar_menu").innerHTML = filter ? html || `<li class="doc-tip"><i class=\"doc-icon\">❗</i> 无匹配的结果</li>` : html;
    },

    /**
     * 切换菜单的折叠。
     * @param elem 菜单标题元素。
     */
    toggleMenu(elem) {
        const ul = elem.nextSibling;
        Doc._toggle(ul, ul.style.display);
    },

    /**
     * 获取指定项的名称。
     * @param href 完整链接地址。
     * @return 返回名称。
     */
    nameOfItem(href) {
        href = href.replace(/(\/|\.html)$/, "").replace(/^.*\//, "");
        return href.charAt(0).toUpperCase() + href.slice(1);
    },

    /**
     * 进入列表选中项。
     */
    gotoActiveItem() {
        const active = document.querySelector(".doc-sidebar-active a");
        if (active) {
            location.href = active.href;
        }
    },

    /**
     * 移动列表选中项。
     * @param delta 移动的项数。
     */
    moveActiveItem(delta) {
        const menu = Doc._get("doc_sidebar_menu");
        const list = menu.getElementsByTagName("a");
        if (list[0]) {
            let pos = delta < 0 ? -1 : 0;
            for (let i = 0; list[i]; i++) {
                if (list[i].parentNode.className === "doc-sidebar-active") {
                    list[i].parentNode.className = "";
                    list[i].parentNode.removeAttribute("aria-selected");
                    pos = i + delta;
                    break;
                }
            }
            if (pos < 0) {
                pos += list.length;
            }
            const next = (list[pos] || list[0]).parentNode;
            next.className = "doc-sidebar-active";
            next.setAttribute("aria-selected", "true");
            Doc._scrollIntoView(menu, next);
        }
    },

    /**
     * 切换侧边栏。
     */
    toggleSidebar() {
        Doc._toggleClass(document.body, "doc-sidebar-open");
        if (Doc._hasClass(document.body, "doc-sidebar-open")) {
            Doc.relayout();
            const closeSidebar = e => {
                if (!Doc._contains(Doc._get("doc_sidebar"), e.target)) {
                    e.preventDefault();
                    document.removeEventListener("touchend", closeSidebar, false);
                    document.removeEventListener("mouseup", closeSidebar, false);
                    Doc.toggleSidebar();
                }
            };
            document.addEventListener("touchend", closeSidebar, false);
            document.addEventListener("mouseup", closeSidebar, false);
        }
    },

    /**
     * 切换单元测试模式。
     */
    toggleUnitTest() {
        Doc._toggleQuery("doc-unittest");
    },

    /**
     * 切换全屏模式。
     */
    toggleFullScreen() {
        Doc._toggleQuery("doc-fullscreen");
    },

    /**
     * 切换所有代码折叠。
     */
    toggleDemoCodes() {
        let hasCollapsed = !!document.querySelector(".doc-demo-collapsed");
        Doc._each(".doc-demo", elem => {
            if (Doc._hasClass(elem, "doc-demo-collapsed") === hasCollapsed) {
                Doc.toggleDemoCode(elem);
            }
        });
    },

    /**
     * 折叠或展开源码。
     */
    toggleDemoCode(elem) {
        const value = Doc._hasClass(elem, "doc-demo-collapsed");
        Doc._toggleClass(elem, "doc-demo-collapsing");
        Doc._toggle(elem.querySelector(".doc-code"), value, () => {
            Doc._toggleClass(elem, "doc-demo-collapsing");
            Doc._toggleClass(elem, "doc-demo-collapsed");
        });
        const toggle = elem.querySelector(".doc-demo-toggle");
        if (toggle) {
            toggle.setAttribute("aria-label", value ? "折叠源码" : "查看源码");
            toggle.setAttribute("aria-checked", value);
        }
    },

    /**
     * 折叠或展开所有 API 详情。
     */
    toggleApis() {
        const open = !document.querySelector(".doc-api-open");
        Doc._each(".doc-api-toggle", elem => {
            Doc.toggleApi(elem, open);
        });
    },

    /**
     * 折叠或展开 API 详情。
     * @param elem 箭头元素。
     * @param value 如果为 true 则强制打开，如果为 false 为强制关闭。
     */
    toggleApi(elem, value) {
        const td = elem.parentNode;
        const tr = td.parentNode;
        const table = tr.parentNode.parentNode;
        if (!table.style.tableLayout) {
            for (const th of table.querySelectorAll(".doc-api>tbody>tr>th")) {
                th.style.width = th.offsetWidth * 100 / table.offsetWidth + "%";
            }
            table.style.tableLayout = "fixed";
        }
        const hide = Doc._hasClass(tr, "doc-api-open");
        if (value === undefined || value !== hide) {
            if (hide) {
                Doc._toggleClass(tr, "doc-api-hiding");
            }
            Doc._toggle(td.querySelector(".doc-api-detail"), !hide, () => {
                if (hide) {
                    Doc._toggleClass(tr, "doc-api-hiding");
                }
                td.colSpan = hide ? 0 : 5;
                Doc._toggleClass(tr, "doc-api-open");
            });
        }
    },

    /**
     * 复制指定的内容。
     * @param content 要复制的文本内容。
     */
    copy(content) {
        if (/ipad|ipod|iphone|android|silk/i.test(navigator.userAgent)) {
            prompt("请长按复制", content);
            return false;
        }
        const textarea = Doc._insert(`<textarea style="position:fixed;top:0;left:0;"></textarea>`);
        textarea.value = content;
        textarea.select();
        try {
            return document.execCommand("copy");
        } catch (e) {
        } finally {
            Doc._remove(textarea);
        }
        prompt("请按 Ctrl/Command+C 复制", content);
        return false;
    },

    /**
     * 复制代码。
     * @param elem 要复制的代码元素。
     */
    copyCode(elem) {
        elem.innerHTML = Doc.copy(elem.nextSibling.textContent) ? "✓" : "✖";
        elem.onmouseout = elem.onmouseout || (() => {
            elem.innerHTML = "❐";
        });
    },

    /**
     * 返回顶部。
     */
    gotoTop() {
        Doc._scrollTo(document, 0);
    },

    /**
     * 执行单元测试。
     * @param test 测试文件路径。
     */
    runUnitTest(test) {
        require.alias["assert"] = "assert";
        require(`${Doc._meta.root}/assets/doc/qunit.js`, QUnit => {
            QUnit.config.autostart = true;
            window.QUnit = QUnit;
            define("assert", [], () => QUnit.assert);
            const registerQUnitTests = exports => {
                for (const name in exports) {
                    const value = exports[name];
                    if (typeof value === "function") {
                        switch (name) {
                            case "before":
                                QUnit.moduleStart(value);
                                continue;
                            case "after":
                                QUnit.moduleDone(value);
                                continue;
                            case "beforeEach":
                                QUnit.testStart(value);
                                continue;
                            case "afterEach":
                                QUnit.testDone(value);
                                continue;
                        }
                        if (value.length) {
                            QUnit.test(name, function (assert) {
                                return this(assert.async());
                            }.bind(value));
                        } else {
                            QUnit.test(name, value);
                        }
                    } else {
                        QUnit.module(name);
                        registerQUnitTests(value);
                    }
                }
            };
            require(test, registerQUnitTests);
        });
    },

    /**
     * 注入 `require()`，将模块导出到全局。
     */
    injectRequire() {
        const exportModule = module => {
            for (const name in module.exports) {
                const exportName = name === "default" && module.exports[name] && module.exports[name].name || name;
                if (!(exportName in window)) {
                    window[exportName] = module.exports[name];
                }
            }
        };
        for (const name in require.modules) {
            const module = require.modules[name];
            if (module.callbacks) {
                module.callbacks.unshift(() => {
                    exportModule(module);
                });
            } else {
                exportModule(module);
            }
        }
        const oldLoad = require._load;
        require._load = function (module, url) {
            module.callbacks.unshift(() => {
                exportModule(module);
            });
            oldLoad(module, url);
        };
    },

    /**
     * 生成列表。
     */
    writeList() {
        const main = Doc._get("doc_main");
        const columnCount = Math.floor(main.offsetWidth / 200) || 1;
        let globalTotal = 0;
        const addGroup = (data, title) => {
            const sections = [];
            for (let i = 0; i < columnCount; i++) {
                sections.push({
                    total: 0,
                    html: ""
                });
            }

            for (const key in data) {
                const items = data[key];

                let minSection = sections[0];
                for (let i = 1; i < columnCount; i++) {
                    if (sections[i].total < minSection.total) {
                        minSection = sections[i];
                    }
                }

                minSection.total += items.length || 0;
                minSection.html += `<h4 id="${Doc._encodeHTML(key)}">${Doc._encodeHTML(key)}<small>(${items.length || "0"})</small></h4><ul>`;
                if (Array.isArray(items)) {
                    for (const item of items) {
                        const title = Doc._encodeHTML(item.title);
                        minSection.html += `<li><a href="${Doc._meta.root}/${Doc._meta.dir}/${item.href}" title="${title}">${title}</a><small>${Doc._encodeHTML(Doc.nameOfItem(item.href))}</small></li>`;
                    }
                }
                minSection.html += `</ul>`;
            }

            let total = 0;
            let html = "";
            for (const section of sections) {
                total += section.total;
                html += `<section class="doc-col doc">${section.html}</section>`;
            }

            if (title) {
                Doc._insert(`<h2 id="${Doc._encodeHTML(title)}"><a href="#${Doc._encodeHTML(title)}" title="链接" aria-hidden="true" class="doc-icon doc-permalink">☍</a>${Doc._encodeHTML(title)}<small>(${total})</small></h2>`, main);
            }
            Doc._insert(`<div class="doc-waterfall doc-row">${html}</div>`, main);
            globalTotal += total;
        };

        const data = Doc._list;
        let hasLevel3 = false;
        for (const key in data) {
            hasLevel3 = !Array.isArray(data[key]);
            break;
        }
        if (hasLevel3) {
            for (const key in data) {
                addGroup(data[key], key);
            }
        } else {
            addGroup(data);
        }

        const h1 = document.querySelector("#doc_main>h1");
        if (h1) {
            Doc._insert(`<small>(${globalTotal})</small>`, h1);
        }

        const loading = Doc._get("doc_loading");
        if (loading) {
            Doc._remove(loading);
        }

        document.onkeydown = e => {
            if (e.keyCode === 70 /* f */ && (e.ctrlKey || e.metaKey) && document.activeElement !== Doc._get("doc_sidebar_filter")) {
                Doc._get("doc_sidebar_filter").focus();
                Doc._get("doc_sidebar_filter").select();
                e.preventDefault();
            }
        };
    },

    _get(id) {
        return document.getElementById(id);
    },

    _insert(html, parent = document.body, prepend) {
        const div = Doc._div || (Doc._div = document.createElement("div"));
        div.innerHTML = html;
        html = div.firstChild;
        return prepend ? parent.insertBefore(html, parent.firstChild) : parent.appendChild(html);
    },

    _remove(elem) {
        elem.parentNode.removeChild(elem);
    },

    _each(selector, callback) {
        for (const elem of document.querySelectorAll(selector)) {
            callback(elem);
        }
    },

    _hasClass(elem, className) {
        return (" " + elem.className).indexOf(" " + className) >= 0;
    },

    _toggleClass(elem, className) {
        className = " " + className;
        const current = " " + elem.className;
        elem.className = (current.indexOf(className) < 0 ? current + className : current.replace(className, "")).trim();
    },

    _contains(parent, child) {
        if (parent.contains) {
            return parent.contains(child);
        }
        while (child) {
            if (child === parent) {
                return true;
            }
            child = child.parentNode;
        }
        return false;
    },

    _scrollTo(elem, value, delta) {
        if (elem === document) {
            const html = elem.documentElement;
            const body = elem.body;
            if (html.scrollTop) {
                elem = html;
            } else if (body.scrollTop) {
                elem = body;
            } else {
                html.scrollTop = 1;
                elem = html.scrollTop ? html : body;
                html.scrollTop = 0;
            }
        }
        if (delta) {
            value += elem.scrollTop;
        }

        const start = elem.scrollTop;
        const length = value - start;
        let count = 0;
        let last = start;
        const step = () => {
            if (elem.scrollTop === last) {
                elem.scrollTop = start + (1 - (1 - count / 25) ** 3) * length;
                if (count++ < 25) {
                    last = elem.scrollTop;
                    setTimeout(step, 20);
                }
            }
        };
        step();
    },

    _scrollIntoView(scrollParent, elem, alignCenter) {
        const deltaY = elem.getBoundingClientRect().top - scrollParent.getBoundingClientRect().top;
        const deltaHeight = scrollParent.offsetHeight - elem.offsetHeight;
        if (deltaY < 0 || deltaY > deltaHeight) {
            const offsetY = alignCenter ? deltaHeight / 2 : 0;
            scrollParent.scrollTop += deltaY - (deltaY < 0 ? offsetY : deltaHeight - offsetY);
        }
    },

    _toggle(elem, value, callback) {
        if (value) {
            elem.style.display = "";
            callback && callback();
        }
        let oldHeight = elem.offsetHeight;
        let newHeight = 0;
        if (value) {
            newHeight = oldHeight;
            oldHeight = 0;
        }
        elem.style.overflow = "hidden";
        elem.style.height = oldHeight + "px";
        elem.clientLeft;
        elem.style.webkitTransition = elem.style.transition = "height .3s";
        elem.style.height = newHeight + "px";
        setTimeout(() => {
            elem.style.webkitTransition = elem.style.transition = elem.style.height = elem.style.overflow = "";
            if (!value) {
                elem.style.display = "none";
                callback && callback();
            }
        }, 300);
    },

    _hasQuery(name) {
        return new RegExp("([?&])" + name + "\\b").test(location.search);
    },

    _toggleQuery(name) {
        const regexp = new RegExp("([?&])" + name + "\\b");
        if (regexp.test(location.search)) {
            location.search = location.search.replace(regexp, "$1");
        } else {
            location.search += (location.search.indexOf("?") >= 0 ? "&" : "?") + name;
        }
    },

    _matchFilter(data, filter) {
        if (!data._title) {
            data._title = Doc._splitCharCodes(data.title);
            data._pinyin = data.pinyin.split(" ");
            data._name = data.href.replace(/\/$/, "");
            data._words = Doc._splitWord(data._name);
            if (data.keywords) {
                data._keywords = Doc._splitCharCodes(data.keywords);
                data._keywordsPinYin = data.keywordsPinYin.split(" ");
            }
        }
        const titleResult = Doc._matchPinYin(data._title, data._pinyin, filter);
        const wordResult = Doc._matchWord(data._words, filter);
        const keywordsResult = data._keywords ? Doc._matchPinYin(data._keywords, data._keywordsPinYin, filter) : [];
        if (titleResult.length || wordResult.length || keywordsResult.length) {
            let level = 0;
            if (titleResult.length) {
                if (titleResult[0].start === 0) {
                    level += 100000;
                }
                level += (titleResult[0].end - titleResult[0].start) * titleResult.length;
            }
            if (wordResult.length) {
                if (wordResult[0].start === 0) {
                    level += 10000;
                }
                level += (wordResult[0].end - wordResult[0].start) * wordResult.length;
            }
            if (keywordsResult.length && keywordsResult[0].start === 0) {
                level++;
            }
            level -= data._title.length;
            return {
                level: level,
                titleHtml: Doc._insertMark(data.title, titleResult),
                nameHtml: Doc._insertMark(data._name, wordResult)
            }
        }
    },

    _splitCharCodes(chars) {
        const result = [];
        for (let i = 0; i < chars.length; i++) {
            result.push(chars.charCodeAt(i));
        }
        return result;
    },

    _splitWord(word) {
        const result = [];
        word.replace(/[A-Z][a-z]*|[a-z]+|./g, all => {
            result.push(all.toLowerCase());
        });
        return result;
    },

    _matchPinYin(charCodes, pinyins, filter) {
        const result = [];
        next: for (let i = 0; i < charCodes.length; i++) {
            let charIndex = i;
            let filterIndex = 0;
            while (filterIndex < filter.length) {
                if (charIndex >= charCodes.length) {
                    continue next;
                }
                if (charCodes[charIndex] === filter.charCodeAt(filterIndex)) {
                    filterIndex++;
                } else {
                    let pinyin = pinyins[charIndex];
                    while (pinyin) {
                        const matchCount = Doc._searchStart(pinyin, filter, filterIndex);
                        if (matchCount) {
                            filterIndex += matchCount;
                            break;
                        }

                        if (pinyin.indexOf("|") >= 0) {
                            pinyin = pinyin.slice(pinyin.indexOf("|") + 1);
                        } else {
                            continue next;
                        }
                    }
                }
                charIndex++;
            }
            result.push({ start: i, end: charIndex });
            i = charIndex;
        }
        return result;
    },

    _matchWord(words, filter) {
        const result = [];
        let wordIndex = 0;
        let filterIndex = 0;
        for (const word of words) {
            wordIndex += word.length;
            const matchCount = this._searchStart(word, filter, filterIndex);
            if (matchCount) {
                filterIndex += matchCount;
                const start = wordIndex - word.length;
                result.push({ start: start, end: start + matchCount });
            }
        }
        if (filterIndex < filter.length) {
            result.length = 0;
        }
        return result;
    },

    _searchStart(value, child, childIndex) {
        let result = 0;
        while (result < value.length && childIndex + result < child.length && value.charCodeAt(result) === child.charCodeAt(childIndex + result)) {
            result++;
        }
        return result;
    },

    _insertMark(value, points) {
        for (let i = points.length; i-- > 0;) {
            const point = points[i];
            value = Doc._encodeHTML(value.slice(0, point.start)) + "<mark>" + Doc._encodeHTML(value.slice(point.start, point.end)) + "</mark>" + (i === points.length - 1 ? Doc._encodeHTML(value.slice(point.end)) : value.slice(point.end));
        }
        return value;
    },

    _encodeHTML(value) {
        return value.replace(/[&><"]/g, m => ({
            "&": "&amp;",
            ">": "&gt;",
            "<": "&lt;",
            "\"": "&quot;"
        }[m]));
    }

};
