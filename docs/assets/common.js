
var UI = {

    resetIFrame: function (iframe, reset) {
        iframe.contentDocument.body.style.overflowY = 'hidden';
        iframe.style.height = iframe.contentDocument.documentElement.scrollHeight + 3 + 'px';
        if (reset !== false) {
            setTimeout(function () {
                UI.resetIFrame(iframe, false);
            }, 400);
        }
    },

    initMenu: function (docData) {

        var links = docData.links = {};
        var menu = Dom.get("menu");
        UI.docData = docData;

        // 树实现。

        function toggleMenu() {
            var first = Dom.first(this);

            if (first.innerHTML) {

                // 切换加减号。
                first.innerHTML = first.innerHTML === "✚" ? "━" : "✚";

                // 切换子菜单显示。
                Dom.toggle(Dom.next(this));

                return false;

            }

        }

        Dom.on(menu, "dblclick", "a", toggleMenu);

        Dom.on(menu, "click", ".tree-span", function () {
            return toggleMenu.call(this.parentNode);
        });

        // 导航。

        function selectMenu() {
            var old = Dom.find('#menu .tree-selected');
            if (old) {
                old.className = '';
            }

            this.className = 'tree-selected';

        }

        function openMenu(path) {

            path = path.replace("!", "");

            var data = links[path];

            if (data) {

                // 获取对应的菜单项。
                var menuItem = Dom.find('#menu a[href="#!' + path + '"]');

                var p = menuItem;

                // 确保项是可见的。
                while (p.offsetHeight === 0) {
                    toggleMenu.call(p = Dom.first(p.parentNode.parentNode.parentNode));
                }

                // 选中项。
                selectMenu.call(menuItem);

                // 如果存在实际的页面。
                if (data.url) {

                    var r = ['<span>' + data.value + '</span>'];

                    p = data;
                    while (p = p.parent) {
                        r.push('<a href="#!' + p.path + '">' + p.value + '</a> » ');
                    }
                    r.push(docData.nav);
                    r = r.reverse();
                    Dom.get('breadcrumb').innerHTML = r.join('');
                    Dom.get('contentiframe').src = Dom.get('opennew').href = data.url;
                }

            }
        }

        // 初始化树。

        function initMenus(data, parent, r, indent) {
            for (var key in data.sub) {

                var obj = data.sub[key];

                obj.path = obj.path || obj.url || key;
                obj.value = key;
                obj.parent = parent;
                links[obj.path] = obj;

                r.push('<li>');

                r.push('<a href="#!' + obj.path + '" style="padding-left:' + indent + 'px"><span class="tree-span">' + (obj.sub ? "✚" : "") + '</span><span title="' + (obj.title || key) + '"><i class="x-icon icon-' + (obj.icon || (obj.sub ? "folder" : "page")) + '"></i>' + key + ' <small class="x-hint">' + (obj.name || "") + '</small></span></a>');

                if (obj.sub) {
                    r.push('<ul style="display:none">');
                    initMenus(obj, obj, r, indent + 16);
                    r.push('</ul>');
                }

                r.push('</li>');
            }
        }

        var r = [];

        initMenus(docData, null, r, 0);
        
        menu.innerHTML = r.join("");

        Dom.hashchange(openMenu);

        // 如果当前不存在任何选中的项，使用第一个项。
        if (!Dom.find('#menu .tree-selected')) {
            for (var index in links) {
                if (links[index].url) {
                    openMenu("!" + index);
                    break;
                }
            }
        }

    },

    initSearchBox: function () {

        var d1 = new SearchTextBox('#d1');

        d1.on('search', function (text) {
            alert("准备搜索 " + text + " ...");
        });
    }

};

Dom.ready(function () {
    var scrollToTop = new ScrollToTop().renderTo();
});
