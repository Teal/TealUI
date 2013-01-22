
using("System.Browser.Base");


/**
 * 允许动态载入一个模块。
 */
Browser.use = function (namespaces, callBack) {
  
};

 
// // 实现 载入  JS  或 CSS
// 
// 
// // BY 司徒正美
// 
// ;;(function(WIN,DOM,undefined){
    // var
    // reg_module_name = /(?:^|\/)([^(\/]+)(?=\(|$)/,
    // reg_module_url = /\(([^)]+)\)/,
    // reg_multi_module = /\s*,\s*/g,
    // _dom = WIN.node,
    // dom = {
        // mix : function(target, source ,override) {
            // var i, ride = (override === void 0) || override;
            // for (i in source) {
                // if (ride || !(i in target)) {
                    // target[i] = source[i];
                // }
            // }
            // return target;
        // },
        // noConflict: function(  ) {//防止命名冲突，请先行引用其他库再引用本框架
            // WIN.dom = _dom;//这是别人的
            // return dom;//请赋以其一个命名空间
        // },
        // //请求模块
        // require:function(dependList,callback){
            // var self = arguments.callee
            // var moduleNames = [], i =0, hash = self.loadedModules,
               // re = reg_multi_module, reg = reg_module_name ,moduleName, str;
            // if(typeof dependList === "string"){
                // dependList  = dependList.split(re)
            // }
            // while(str = dependList[i++]){
                // moduleName = str.match(reg)[1];
                // if(!hash[moduleName]){
                    // moduleNames.push(moduleName);
                    // self.appendScript(str);
                // }
            // }
            // this.provide(moduleNames,hash,callback)
        // },
        // //声明模块
        // declare:function(moduleName,dependList,callback){
            // var hash = this.require.loadedModules;
            // this.require(dependList,function(){
                // callback();
                // hash[moduleName] = 1
            // })
        // },
        // //提供模块
        // provide:function(array,hash,callback){
            // var flag = true, i = 0, args = arguments, fn = args.callee, el;
            // while(el = array[i++]){
                // if(!hash[el]){
                    // flag = false;
                    // break;
                // }
            // }
            // if(flag){
                // callback();
            // }else{
                // setTimeout(function(){
                    // fn.apply(null,args)
                // },32);
            // }
        // }
    // }
    // dom.mix(dom.require, {
        // loadedModules:{},
        // //http://www.cnblogs.com/rubylouvre/archive/2011/02/10/1950940.html
        // getBasePath:function(){
            // var url;
            // try{
                // a.b.c()
            // }catch(e){
                // url = e.fileName || e.sourceURL;//针对firefox与safari
            // }
            // if(!url){
                // var script = (function (e) {
                    // if(e.nodeName.toLowerCase() == 'script') return e;
                    // return arguments.callee(e.lastChild)
                // })(DOM);//取得核心模块所在的script标签
                // url = script.hasAttribute ?  script.src : script.getAttribute('src', 4);
            // }
            // url = url.substr( 0, url.lastIndexOf('/'));
            // dom.require.getBasePath = function(){
                // return url;//缓存结果，第一次之后直接返回，再不用计算
            // }
            // return url;
        // },
        // appendScript:function(str){
            // var module = str, reg = reg_module_url, url;
            // //处理dom.node(http://www.cnblogs.com/rubylouvre/dom/node.js)的情形
            // var _u = module.match(reg);
            // url = _u && _u[1] ? _u[1] : this.getBasePath()+"/"+ str + ".js?timestamp="+1*new Date;
            // var script = DOM.createElement("script");
            // script.charset = "utf-8";
            // script.defer = true;
            // script.async = true;
            // script.src = url;
            // //避开IE6的base标签bug
            // //http://www.cnblogs.com/rubylouvre/archive/2010/05/18/1738034.html
            // DOM.documentElement.firstChild.insertBefore(script,null);//
            // this.removeScript(script);
        // },
        // removeScript:function(script){//移除临时生成的节点
            // var parent = script.parentNode;
            // if(parent&&parent.nodeType === 1){
                // script.onload = script.onreadystatechange = function(){
                    // if ((!this.readyState) || this.readyState === "loaded" || this.readyState === "complete" ){
                        // if (this.clearAttributes) {
                            // this.clearAttributes();
                        // } else {
                            // this.onload = this.onreadystatechange = null;
                        // }
                        // parent.removeChild(this)
                    // }
                // }
            // }
        // }
    // });
    // //先行取得核心模块的URL
    // dom.require.getBasePath();
    // window.node = node;
// })(this,this.document)
// 
// 
// 
	// /**
			 // * 同步载入css文件。
			 // * @param {String} uri 地址。
			 // * @param {Function} callback (默认空函数)对返回值的处理函数。
			 // */
			// loadCss: function(v, callback) {
				// var head = document.getElementsByTagName('head')[0], css = document.createElement('link');
				// if(!head) return false;
				// css.href = v;
				// css.rel = 'stylesheet';
				// css.type = 'text/css';
				// head.appendChild(css);
				// if (callback)
					// css.onload = css.onreadystatechange = function() {
						// if (!this.readyState || this.readyState == 'loaded' || this.readyState == 'complete') {
							// css.onload = css.onreadystatechange = null;
							// callback();
						// }
					// };
// 
			// },
// 
// 			
// 			
// 			
// //================================================================================
// 
// 
// EZJ.JavaScript = function() {
// ///<summary>处理 JavaScript 加载的对象。</summary>
// }
// 
// 
// EZJ.JavaScript.load = function(jsUrls, onComplete) {
// ///<summary>按顺序加载一个或多个 JavaScript 文件。语法：EZJ.JavaScript.load(jsUrls[, onComplete])</summary>
// ///<param name="jsUrls" type="string/array">要加载的一个或多个 JavaScript 文件的 URL，多个时请使用数组类型。</param>
// ///<param name="onComplete" type="function">可选。所有 js 文件加载完成（不判断成功与否）后要执行的函数。</param>
    // var urls = (typeof (jsUrls) == "string") ? [jsUrls] : jsUrls;
// 
    // //由于多个 JavaScript 文件之间可能存在引用，为了保障引用的可用性，采用依次读取的方式。
    // //每轮只读取一个 JavaScript 文件，当该文件读取完成后，利用类似递归的方式继续读取下一个文件。
// 
    // var script = EZJ.$C("script", { type: "text/javascript" });
// 
    // //Firefox 一类响应 onload，无 readyState。
    // script.onload = function() {
        // if (urls.length == 1) {
            // //无可继续读取的文件
            // if (typeof (onComplete) == "function") {
                // onComplete();
            // }
        // }
        // else {
            // EZJ.JavaScript.load(urls.slice(1), onComplete);
        // }
    // }
// 
    // //IE 一类浏览器。
    // script.onreadystatechange = function() {
        // if (script.readyState == 4 || script.readyState == "loaded" || script.readyState == "complete") {
            // if (urls.length == 1) {
                // //无可继续读取的文件
                // if (typeof (onComplete) == "function") {
                    // onComplete();
                // }
            // }
            // else {
                // EZJ.JavaScript.load(urls.slice(1), onComplete);
            // }
        // }
    // }
// 
    // script.setAttribute("src", urls[0]); //一轮只读取一个
    // EZJ.$C(script, null, document.body);
// }
// 
// 
// //================================================================================
// 
// 
// 
// 
// 
// 
// 
// EZJ.Css = function() {
// ///<summary>处理 CSS 的对象。</summary>
// }
// 
// 
// EZJ.Css.addText = function(cssText) {
// ///<summary>添加 CSS 文字。语法：EZJ.Css.addText(cssText)</summary>
// ///<param name="cssText" type="string">CSS 文字，比如：body { font-size:13px; }。</param>
    // try {
        // //IE
        // var style = document.createStyleSheet();
        // style.cssText = cssText;
    // }
    // catch (e) {
        // var style = EZJ.$C("style", { type: "text/css" }, document.getElementsByTagName("head").item(0));
        // style.textContent = cssText;
    // }
// }
// 
// 
// EZJ.Css.addLink = function(cssUrl) {
// ///<summary>添加 CSS 链接。语法：EZJ.Css.addLink(cssUrl)</summary>
// ///<param name="cssUrl" type="string">要添加的 CSS 文件的 URL。</param>
    // EZJ.$C("link", { rel: "stylesheet", type: "text/css", href: cssUrl }, document.getElementsByTagName("head").item(0));
// }






