
//#include browser/base.js


/**
 * 允许动态载入一个模块。
 * @return {Node} 返回动态创建的相关节点。
 */
Browser.loadScript = function(url, onLoad, doc){
	
	var doc = doc|| document,
	onLoad = onLoad||'',
	script = doc.createElement("script");
	script.type = "text/javascript";	
	script.src = url;
	
	Browser.onLoad(script,url,onLoad);
	return doc.getElementsByTagName("head")[0].appendChild(script);
};

Browser.loadStyle = function(url, onLoad, doc){
	var doc = doc|| document,
		onLoad = onLoad||'',
		link = doc.createElement("link");
		link.rel =  'stylesheet';
		link.media =  'screen';
		link.type =  'text/css';
		link.href = url;
		
		Browser.onLoad(link,url,onLoad);
	return doc.getElementsByTagName("head")[0].appendChild(link);
};

Browser.loadImage = function(url, onLoad, onError, onAbort){

	var image = new Image(),
	onLoad = onLoad||'',
	onError = onError||'',
	onAbort = onAbort||'';
	image.src = url;
	Browser.onLoad(image,url,onLoad);
	if(onError){
		image.onerror = function(){
			onError();
		}
	}
	if(onAbort){
		image.onabort = function(){
			onAbort();
		}		
	}
	return image;
};

Browser.loadImages = function (urls, onComplete, onSuccess, onError) {
	var images = [],
		onSuccess = onSuccess||Function.empty,
		onComplete = onComplete||Function.empty,	
		completeNum = 0;
	var complete = function(){
			onSuccess();
			onComplete();
		}
	for(var i=0;i<urls.length;i++){
		if(completeNum==urls.length-1) onSuccess = complete;
		images[i] = Browser.loadImage(urls[i],onSuccess,onError);
		completeNum = completeNum+1; 
	}
	return images;
};
Browser.onLoad = function(obj,url,callback){
	var callback = callback||'';
	if(callback){
		obj.onload = obj.onreadystatechange = function() {
			if (!obj.readyState || obj.readyState == "loaded" || obj.readyState == "complete")
					callback();
		};		
	}
}




// 
		// loadResource : function(attr, callback, autoremove, doc) {
					// // javascript , img..
					// var src = CC.delAttr(attr, 'src');
					// // css style sheet
					// var href = CC.delAttr(attr, 'href');
					// // tag
					// var res = this.$C(attr, doc);
					// if(callback || autoremove){
  					// if(res.readyState) {
  						// //IE
  						// res.onreadystatechange = function() {
  							// if (res.readyState == "loaded" ||
  							// res.readyState == "complete") {
  								// res.onreadystatechange = null;
  								// if(autoremove)
  								  // setTimeout(function(){res.parentNode.removeChild(res)},1)
  								// if(callback)
  								// callback.call(res);
  							// }
  						// };
  					// }else{
  						// //Others
  						// res.onload = function() {
  							// if(autoremove)
  							  // setTimeout(function(){res.parentNode.removeChild(res)},1)
  							// if(callback)
  							  // callback.call(res);
  						// };
  					// }
				  // }
// 					
					// if(src)
					 // res.src = src;
// 					
					// if(href)
					 // res.href = href;
// 					
					// this.$T('head')[0].appendChild(res);
// 					
					// return res;
				// },
/**
 * 加载JavaScript脚本文件
 * @param {String} url
 * @param {Function} callback
 * @param {String} [id]
 */
        // loadScript: function(url, callback, id) {
          // var nd = this.loadResource({
                // tagName: 'script',
                // src: url,
                // type: 'text/javascript'
          // }, callback, true);
//           
          // if(id) 
          	// nd.id = id;
          // return nd;
        // }
        // ,
/**
 * 加载一个CSS样式文件
 * @param {String} url 加载css的路径
 * @param {Function} callback 
 * @param {String} [id] style node id
 * @return {DOMElement} link node
 */
        // loadCSS: function(url, callback, id) {
          // var nd = this.loadResource({
                // tagName: 'link',
                // rel: 'stylesheet',
                // href: url,
                // type: 'text/css'
          // }, callback);
          // if(id) 
          	// nd.id = id;
          // return nd;
        // }
        // ,
/**
 * 应用一段CSS样式文本.
 * <pre><code>
   CC.loadStyle('.g-custom {background-color:#DDD;}');
   //在元素中应用新增样式类
   &lt;div class=&quot;g-custom&quot;&gt;动态加载样式&lt;/div&gt;
   </code></pre>
 * @param {String} id 生成的样式style结点ID\
 * @param {String} 样式文本内容
 */
        // loadStyle: function(ss, doc) {
          // var styleEl = this._styleEl;
          // if(!styleEl){
            // styleEl = this._styleEl = this.$C( {
              // tagName: 'style',
              // type: 'text/css'
            // });
            // this.$T('head')[0].appendChild(styleEl);
          // }
          // styleEl.styleSheet && (styleEl.styleSheet.cssText += ss) || styleEl.appendChild((doc||document).createTextNode(ss));
          // return styleEl;    }
   





       
   
        