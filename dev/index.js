
var DevIndex = {
	'开发手册': '-',
	'jPlusUI 设计理念': '~/dev/cookbooks/features.html',
	'开发系统文档': '~/dev/cookbooks/apps.html',
	'如何添加自己的模块': '~/dev/cookbooks/addmodule.html',
	'类机制': '~/dev/cookbooks/class.html',
	'如何开发 UI 组件': '~/dev/cookbooks/control.html',

	'规范': '-',
	'HTML 规范': '~/dev/specification/html.html',
	'CSS 规范': '~/dev/specification/css.html',
	'JavaScript 规范': '~/dev/specification/javascript.html',
	'文件夹规范': '~/dev/specification/folder.html',
	'Google 编码规范': 'http://google-styleguide.googlecode.com/svn/trunk/',

	'测试': '-',
	'类图': '~/dev/classdiagram/index.html',
	'速度比较': '~/dev/speedmatch/index.html',
	'单元测试': '~/dev/unittest/index.html'

};

if (Demo.writeNavbar) {
	Demo.writeNavbar(DevIndex);
} else if (Demo.writeList)  {
	Demo.writeList(DevIndex, 4);
}
