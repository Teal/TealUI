---
version: 0.0.1
author: xuld <xuld@vip.qq.com>
import:
    - typo/reset
---
# 菜单

## 基本用法

```htm
<Menu />
```
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>J+ Library</title>
    <link href="../../controls/core/assets/styles/base.css" rel="stylesheet" type="text/css">
    <link href="../../controls/display/assets/styles/icon.less" rel="stylesheet/less" type="text/css" />
    <link href="../../controls/button/assets/styles/menu.less" rel="stylesheet/less" type="text/css" />

    <script src="../../system/core/assets/scripts/base.js" type="text/javascript"></script>
    <script src="../../system/dom/assets/scripts/base.js" type="text/javascript"></script>
    <script src="../../controls/core/assets/scripts/base.js" type="text/javascript"></script>
    <script src="../../controls/core/assets/scripts/scrollablecontrol.js" type="text/javascript"></script>
    <script src="../../controls/core/assets/scripts/listcontrol.js" type="text/javascript"></script>
    <script src="../../controls/core/assets/scripts/treecontrol.js" type="text/javascript"></script>
    <script src="../../controls/button/assets/scripts/menu.js" type="text/javascript"></script>

    <script src="../../assets/demo/less.js" type="text/javascript"></script>
    <script src="../../assets/demo/demo.js" type="text/javascript"></script>
</head>
<body>
    <ul id="a" class="x-menu">
        <li>
            a-1-text
        </li>
        <li>
           -
        </li>
        <li>
            <a class="x-menuitem" href="javascript:alert(0)">
                a-2-menuitem
            </a>
        </li>
        <li>
            <div class="x-menuseperator"> </div>
        </li>
        <li>
            <div>
                a-3-custom
            </div>
        </li>
        <li>
            subMenu
            <ul id="b" class="x-menu">
                 <li>b-1</li>
                 <li>b-2</li>
             </ul>
        </li>
    </ul>

    <aside class="demo">
        <script>
            var a = new Menu("a"); 
            a.add('-');
            a.add('a-4-js').on('click', trace); 
            a.add(new MenuSeperator);
            a.add(new MenuItem().setText('a-5-menuitem'));
            
            var b = new Menu();
            b.add('b-1');
            b.add('-');
            b.add('b-2');
            a.item(-1).setSubMenu(b);
            
            a.add('a-6-submenu').getSubMenu().add('c-1-js', '-', new MenuItem().setText('c-2-menuitem'));

        </script>
    </aside>
    <section class="demo-test">
        <hr style="margin-top: 300px;">
        <ul class="x-menu">
            <li class="x-menu-item">内容 tmp</li>
            <li class="x-menu-item"><a class="x-menuitem x-menuitem-submenu x-menuitem-selected"
                href="#">内容 tmp</a></li>
            <li class="x-menu-item"><a class="x-menuitem x-menuitem-submenu" href="#">内容 tmp</a>
            </li>
            <li class="x-menu-item">
                <div class="x-menuseperator"></div>
            </li>
            <li class="x-menu-item"><a class="x-menuitem" href="#">内容 tmp</a></li>
        </ul>
    </section>
</body>
</html>


<!DOCTYPE html>
<html>
	<head>
		<meta charset="UTF-8">
		<title>J+ Library</title>
		
		<link href="../../controls/core/assets/styles/base.css" rel="stylesheet" type="text/css">
		<link href="../../controls/display/assets/styles/icon.less" rel="stylesheet/less" type="text/css" />
		<link href="../../controls/button/assets/styles/menu-alt.less" rel="stylesheet/less" type="text/css" />
		
		<script src="../../system/core/assets/scripts/base.js" type="text/javascript"></script>
		<script src="../../system/dom/assets/scripts/base.js" type="text/javascript"></script>
		<script src="../../controls/core/assets/scripts/base.js" type="text/javascript"></script>
		<script src="../../controls/button/assets/scripts/menu-alt.js" type="text/javascript"></script>
		
		<script src="../../assets/demo/less.js" type="text/javascript"></script>
		<script src="../../assets/demo/demo.js" type="text/javascript"></script>
	</head>
	<body>
		<ul id="a" class="x-menu">
        <li>
            a-1-text
        </li>
        <li>
           -
        </li>
        <li>
            <a class="x-menuitem" href="javascript:alert(0)">
                a-2-menuitem
            </a>
        </li>
        <li>
            <div class="x-menuseperator"></div>
        </li>
        <li>
            <div>
                a-3-custom
            </div>
        </li>
        <li>
            subMenu
            <ul id="b" class="x-menu">
                 <li>b-1</li>
                 <li>b-2</li>
             </ul>
        </li>
    </ul>

    <aside class="demo">
        <script>
            var a = new Menu("a"); 
            a.add('-');
            a.add('a-4-js').on('click', trace); 
            a.add(new MenuSeperator);
            a.add(new MenuItem().setText('a-5-menuitem'));
            
            var b = new Menu();
            b.add('b-1');
            b.add('-');
            b.add('b-2');
            a.item(-1).setSubMenu(b);
            
            a.add('a-6-submenu').getSubMenu().add('c-1-js', '-', new MenuItem().setText('c-2-menuitem'));

        </script>
    </aside>
    <section class="demo-test">
        <hr style="margin-top: 300px;">
        <ul class="x-menu">
            <li class="x-menu-item">
                    <span class="x-icon x-icon-checked"></span>
                  内容 tmp</li>
            <li class="x-menu-item"><a class="x-menuitem x-menuitem-submenu x-menu-hover"
                href="#">内容 tmp</a></li>
            <li class="x-menu-item"><a class="x-menuitem x-menuitem-submenu" href="#">内容 tmp</a>
            </li>
            <li class="x-menu-item">
                <div class="x-menuseperator"></div>
            </li>
            <li class="x-menu-item"><a class="x-menuitem" href="#">内容 tmp</a></li>
        </ul>
    </section>
   		
   		<section class="demo-test">
   			
   			<hr>
   			
   			
	 	  <ul class="x-menu">
            <li class="x-menu-item">内容 tmp</li>
            <li class="x-menu-item x-menu-hover">
            	<a class="x-menuitem x-menuitem-submenu" href="#">内容  tmp</a>
            </li>
            <li class="x-menu-item">
            	<a class="x-menuitem x-menuitem-submenu" href="#">
            		<span class="x-icon x-icon-checked"></span>
            		内容  tmp
            	</a>
            </li>
            <li class="x-menu-item">
            	<div class="x-menuseperator"></div>
            </li>
            <li class="x-menu-item">
            	<a class="x-menuitem" href="#">
            		<span class="x-icon x-icon-none"></span>
            		内容  tmp</a>
            </li>
          </ul>
   		</section>
	</body>
</html>