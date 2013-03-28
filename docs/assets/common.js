
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

    initMenu: function (menuObject, baseTitle, index) {

        var menu = Dom.get("menu");

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

        //function getMenu(path) {
        //    var p = menuObject;
        //    path.split("/").forEach(function (value) {
        //        p = p[value] || {};
        //    });

        //    return p;
        //}

        function selectMenu() {
            var old = Dom.find('#menu .tree-selected');
            if (old) {
                old.className = '';
            }

            this.className = 'tree-selected';

        }

        function openMenu(path) {
            // 获取对应的菜单项。
            var menuItem = Dom.find('#menu a[href="#' + path + '"]');

            if (menuItem) {

                var p = menuItem;

                // 确保项是可见的。
                while (p.offsetHeight === 0) {
                    toggleMenu.call(p = Dom.first(p.parentNode.parentNode.parentNode));
                }

                // 选中项。
                selectMenu.call(menuItem);

                var obj = { sub: menuObject };
                var r = [baseTitle];
                var lastPath = '';

                path = path.replace("!", "").split("/");
                path.forEach(function (value, index) {
                    obj = (obj.sub || {})[value] || {};

                    if (path.length == index + 1) {
                        r.push('<span>' + (obj.name || value) + '</span>');
                    } else {
                        r.push('<a href="#!' + lastPath + value + '">' + (obj.name || value) + '</a> » ');
                    }

                    lastPath += value + '/';
                });

                if (obj.url) {
                    Dom.get('breadcrumb').innerHTML = r.join('');
                    Dom.get('contentiframe').src = Dom.get('opennew').href = obj.url;
                }

            }
        }

        function addMenus(menuObject, r, basePath, indent) {
            // collspae
            for (var menuItem in menuObject) {

                var p = menuObject[menuItem];

                r.push('<li>');

                r.push('<a href="#!' + (basePath + menuItem) + '" data-url="' + (p.url || "") + '" style="padding-left:' + indent + 'px"><span class="tree-span">' + (p.sub ? "✚" : "") + '</span><span title="' + (p.title || p.name || menuItem) + '"><i class="x-icon icon-' + (p.icon || (p.sub ? "folder" : "page")) + '"></i>' + (p.name || menuItem) + ' <small class="x-hint">' + (p.subname || "") + '</small></span></a>');

                if (p.sub) {
                    r.push('<ul style="display:none">');
                    addMenus(p.sub, r, basePath + menuItem + '/', indent + 16);
                    r.push('</ul>');
                }

                r.push('</li>');



            }

        }

        var r = [];

        addMenus(menuObject, r, "", 0);
        
        menu.innerHTML = r.join("");

        Dom.hashchange(openMenu);

        openMenu("!" + index);

        //Dom.first(menu).className = 'tree-selected';

    },

    //toggleMenu: function (path) {

    //    // 获取实际的菜单项。
    //    var menuItem = Dom.find('#menu a[data-path="' + path + '"]');

    //    // 切换加减号。
    //    Dom.first(menuItem).innerHTML = Dom.isHidden(Dom.next(menuItem)) ? "━" : "✚";

    //    // 切换子菜单显示。
    //    Dom.toggle(Dom.next(menuItem));
    //}

};
