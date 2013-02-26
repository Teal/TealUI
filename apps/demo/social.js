if(typeof Demo === 'object' && location.protocol !== "file:") {
	var duoshuoQuery = {short_name:"jplusui"};
		Demo.Dom.ready(function(){
		var footer = document.createElement('footer');
		footer.className = 'demo';
		footer.innerHTML = Demo.Configs.footer.replace('<footer class="demo">', '<div class="ds-thread"></div>').replace('</footer>', '');
		document.body.appendChild(footer);
		var ds = document.createElement('script');
		ds.type = 'text/javascript';ds.async = true;
		ds.src = 'http://static.duoshuo.com/embed.js';
		ds.charset = 'UTF-8';
		(document.getElementsByTagName('head')[0] 
		|| document.getElementsByTagName('body')[0]).appendChild(ds);
		});

		Demo.writeFooter = function () { };
}
document.write(unescape("%3Cscript src='" + (("https:" == document.location.protocol) ? " https://" : " http://") + "hm.baidu.com/h.js%3Fa37192ce04370b8eb0c50aa13e48a15b' type='text/javascript'%3E%3C/script%3E"));
