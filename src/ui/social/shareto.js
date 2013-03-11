/**
 * @author xuld
 */

var ShareTo = Control.extend({

    tpl: '<div class="x-shareto">\
			<a href="http://v.t.sina.com.cn/share/share.php?title={title}&url={url}" onclick="ShareTo.open(this);return false;" class="x-shareto-content x-shareto-sina" title="分享到新浪微博" target="_blank">新浪微博</a>&nbsp;\
			<a href="http://v.t.qq.com/share/share.php?title={title}&url={url}" onclick="ShareTo.open(this);return false;" class="x-shareto-content x-shareto-qqt" title="分享到腾讯微博" target="_blank">腾讯微博</a>&nbsp;\
			<a href="http://t.163.com/article/user/checkLogin.do?info={title}{url}&link={url}" onclick="ShareTo.open(this);return false;" class="x-shareto-content x-shareto-163" title="分享到网易微博" target="_blank">网易微博</a>&nbsp;\
			<a href="http://share.renren.com/share/buttonshare?title={title}{url}&link={url}" onclick="ShareTo.open(this);return false;" class="x-shareto-content x-shareto-renren" title="分享到人人网" target="_blank">人人网</a>&nbsp;\
			<a href="http://www.douban.com/recommend/?title={title}&url={url}" onclick="ShareTo.open(this);return false;" class="x-shareto-content x-shareto-douban" title="分享到豆瓣" target="_blank">豆瓣</a>\
		</div>',

    parseTpl: function (title, url, text, plain) {
        var tpl = this.tpl.replace(/{url}/g, encodeURIComponent(url || location.href)).replace(/{title}/g, encodeURIComponent(title || document.title));

        if (text)
            tpl = tpl.replace('x-shareto">', 'x-shareto"><span>' + text + '</span>');
        return plain ? tpl.replace('x-shareto', 'x-shareto x-shareto-plain') : tpl;
    },

    create: function (options) {
        return Dom.parseNode(this.parseTpl(options.title, options.url, options.text, options.plain));
    }

});

ShareTo.write = function (title, url, text, plain) {
    document.write(ShareTo.prototype.parseTpl(title, url, text, plain));
};

ShareTo.open = function (dom) {
	window.open(dom.href, "newwindow", "height=600, width=700, top=0, left=0, toolbar=no, menubar=no, scrollbars=no, resizable=no,location=no, status=no");
};
