


背景:

	一般网站项目的开发，前端页面和后台程序是由不同的人员负责的。而页面制作本身是不需要服务器的，大部分前端页面开发人员也不熟悉后台程序语言。这就使前端开发时会遇到很多麻烦的事情:

	1. 调试 AJAX 十分困难、很难测试跨域问题。
	2. 代码不可重用。比如每个页面内的 <head> 标签中的元素大同小异，却不得不每个页面都创建一个副本。
	3. 产品经理的困难。当产品经理在审核页面时发现一些小错误(如文字错误)时，不得不通知前端修改(因为他对 HTML 不熟悉或者没有权限修改代码)。
	
UedToolkit  自述:

	UedToolkit 是一个用户体验开发(UED)的工具套件。UedToolkit 可以作为一个轻量但高速的 Web 服务器，并默认使用 Javascript 作为后台编程语言，其主要功能有:

	- 视觉、交互和前端交互物的在线展示。
		UedToolkit 允许开发人员通过 Web 形式向验收人员展示最终作品，而不是通过传统的文件或 FTP 方式展示。

	- 支持前端页面服务器端模板和母版。
		大部分页面的顶部和底部的 HTML 代码是一致的。母版技术可以帮助基于统一的网页模板创建页面。在前端页面内，使用后台模板技术可以减少代码的重复，更减少了维护的成本。

	- 强大的插件模式
		UedToolkit 提供了完整的插件支持。您可以很方便地制作和安装插件以实现自己的开发需求。

UedToolkit 内置的插件提供下列功能:

	- AJAX 调试支持。
		无需等AJAX 接口完成，前端即可自定义服务器收到 AJAX 请求后的行为。
	
	- 伪跨域跳转。
		UedToolkit 可以作为一个反向代理服务器，避免前端开发时因为跨域而无法调试的尴尬情景。

	- 在线修改静态文件。
		您可以以所见即所得方式在浏览器修改页面源码，并直接将修改结果保存到服务器文件，而不需修改源文件。

	- 自动刷新。
		UedToolkit 可以监视项目内文件，当文件被修改(比如使用 CTRL+S 保存)时，将自动刷新打开这个页面的浏览器。

	- 在线高亮、格式化、压缩代码。

	- 在线浏览 GIT 状态。

	- 在线浏览视觉稿(.psd) 。

	- 在线的 HTML、CSS 和 Javascript 规范验证。
		此功能可以帮助检测项目内的编码质量，并可以找到一些低级错误。

	- 前端构架支持。

UedToolkit 用法:
	
	- 作为一个 GUI 应用程序: 双击启动 UedToolkit.exe 即可直接使用。如果是第一次使用，会显示一个设置对话框。在这个对话框内设置项目所在文件夹位置和其它可选的设置，如果对某个设置项不了解可以将鼠标移到该设置项所在位置。UedToolkit.exe 在工作时会缩小化到系统托盘。
	- 作为一个 控制台程序: 启动 UedToolkit.Console.exe 。输入 UedToolkit.Console.exe /? 可获取更多信息。
	- 作为 IIS 下的 ASP.NET 应用: 将 UedToolkit.exe 及相关的 DLL 文件拷贝到 ASP.NET 站点的 Bin 文件夹，并拷贝 UedToolkit.exe.config 内的配置到 ASP.NET 的 web.config 到网站跟目录。在 IIS 中设置将相关请求提交给 ASP.NET 模块处理。

UedToolkit 模板用法说明:

	UedToolkit 的模板语法是和 ASP 相同的，如果您有 ASP 开发经验，那么不需要额外的学习成本。

	1. 默认配置下，只有 .html、.asp 文件才会被解析。
	2. 页面内，以 <% 开始，以 %> 结尾的部分是服务器端代码块。默认配置下，内部为 JavaScript 代码。比如:

	<% for(var i = 0; i < 3; i++) { %>
	<div>hello</div>
	<% } %>

	可以生成如下代码:

	<div>hello</div>
	<div>hello</div>
	<div>hello</div>

	比如:

	<% function show(name){ %>
	<%		if(name == 'a') { %>
				AAA
	<%		} else { %>
				BBB
	<%		} %>
	<% } %>
	<% show('a'); show('b') %>

	可以生成如下代码:

	AAABBB


	3. 为了支持页面交互和参数，可以使用内置的 5 个对象编程:
		Response
		Request
		Session
		Application
		Server

		比如:

		<% Response.Write("<div>Hello</div>") %>

		可以生成下面的代码:

		<div>Hello</div>

		上面的代码也可以简写为

		<%= "<div>Hello</div>" %>


		更多信息可以参考 ASP 教程。

	4. <%--  --%> 内是服务器端注释。(当然您可以使用 Javascript 注释)
	5. <!-- #include virtual="" --> 可以产生一个文件包含效果。具体语法:
			<!-- #include virtual="相对于网站跟目录(虚拟地址)的地址" -->
			<!-- #include file="相对于当前文件的地址" -->
		

	6. 使用 <%@Page MasterPageFile="母版文件" %> 可以使用一个母版功能。
	7. 在 UedToolkit 中打开 HTML 文件即可解析模板并发送给浏览器。如果 HTML 文件被修改，只需刷新浏览器，软件会自动重新解析模板。


UedToolkit 模板解析结果获取:

	既然在前端使用了后台模板，这意味着后台必须也使用这套模板，然后页面才能解析。但这是不现实的，因为后台语言不是随便可以改的。所以，最后的解决方案是:
	前端先将模板解析好，然后交付解析后的代码，这样既可保证开发流程和不使用模板的流程一样。

	UedToolkit 提供了一个 Publish 插件，这个插件可以将一个文件夹内的所有 HTML 文件进行解析并将结果保存到另外一个文件夹。

	您也可以使用 C# 自定义 Publish 功能。

	如下代码(C#)演示了如何获取 HTML 解析后的内容。

	1. 创建.net 3.5 项目，引用 UedToolkit.exe 。
	2. 核心代码如下:
		
		// 创建一个虚拟的服务器。
		Server server = new Server(1234, "项目所在文件夹", "/");
		// 1234 是端口，可以随便选择一个未被占用的端口。  / 是虚拟地址。

		// 创建一个虚拟的请求，请求的 URL 是 mypage/index.html ,并将此次请求的结果保存到 output/save.html 文件。
		WebRequest wr = WebRequest.Create("mypage/index.html?t=4", "output/save.html");

		// 可以设置请求时使用的方式。
		wr.HttpVerb = "POST";

		// 让服务器解析请求。
		server.Process(wr);

		// 如果页面解析后返回 200 或 304， 说明正常。
		// 如果模板解析出错，会返回 500 。
		// 如果找不到源文件，会返回 404
		if(wr.StatusCode == 200 || wr.StatusCode == 304){
			
			Console.Write("保存成功");

		} else {
			
			Console.Write("保存失败");

		}




UedToolkit 用到的第三方类库:

CassiniDev - http://cassinidev.codeplex.com
SimplePsd
CommandLineParser
Goggle Code Prettify - http://google-code-prettify.googlecode.com
GitSharp
RestClient
HtmlAgilityPack
Jint
GitPrise
HostsEditor
YUI Compressor.NET - http://yuicompressor.codeplex.com/
CSSParser
EcmaScript.NET
postcardviewer - http://www.simpleviewer.net/


UedToolkit 基于 GPL 开源 
有关此协议的具体内容，请阅读 License.txt


UedToolkit 1.0 by xuld
