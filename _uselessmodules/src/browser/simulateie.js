//===========================================
//  兼容IE   simuldateie.js     
//===========================================

// 
// if(!document.all){
// //zzcv的ff ie兼容脚本
// /*脚本没有解决的问题及处理:
// 
// 2.IE下,可以使用()或[]获取集合类对象;Firefox下,只能使用[]获取集合类对象. 
// 解决方法:统一使用[]获取集合类对象. 
// 3.IE下,可以使用获取常规属性的方法来获取自定义属性,也可以使用getAttribute()获取自定义属性;Firefox下,只能使用getAttribute()获取自定义属性. 
// 解决方法:统一通过getAttribute()获取自定义属性. 
// 4.IE下,HTML对象的ID可以作为document的下属对象变量名直接使用;Firefox下则不能.
// 5.Firefox下,可以使用与HTML对象ID相同的变量名;IE下则不能。
// 解决方法:使用document.getElementById("idName")代替document.idName.最好不要取HTML对象ID相同的变量名,以减少错误;在声明变量时,一律加上var,以避免歧义. 
// 6.IE下input.type属性为只读;但是Firefox下input.type属性为读写. 
// 8.IE下,可以通过showModalDialog和showModelessDialog打开模态和非模态窗口;Firefox下则不能
// 9.Firefox的body在body标签没有被浏览器完全读入之前就存在；而IE的body则必须在body标签被浏览器完全读入之后才存在
// 10.
// */
// 
// 
// //文档兼容
// HTMLDocument.prototype.__defineGetter__("all",function(){
    // return this.getElementsByName("*");});
// 
// HTMLFormElement.constructor.prototype.item=function(s){
    // return this.elements[s];};
// 
// HTMLCollection.prototype.item=function(s){
    // return this[s];};
//     
// //事件兼容
// window.constructor.prototype.__defineGetter__("event",function(){
    // for(var o=arguments.callee.caller,e=null;o!=null;o=o.caller){
        // e=o.arguments[0];
        // if(e&&(e instanceof Event))
            // return e;}
    // return null;});
// 
// window.constructor.prototype.attachEvent=HTMLDocument.prototype.attachEvent=HTMLElement.prototype.attachEvent=function(e,f){
    // this.addEventListener(e.replace(/^on/i,""),f,false);};
// 
// window.constructor.prototype.detachEvent=HTMLDocument.prototype.detachEvent=HTMLElement.prototype.detachEvent=function(e,f){
    // this.removeEventListener(e.replace(/^on/i,""),f,false);};
// 
// 
// with(window.Event.constructor.prototype){
    // __defineGetter__("srcElement",function(){
        // return this.target;});
// 
    // __defineSetter__("returnValue",function(b){
        // if(!b)this.preventDefault();});
// 
    // __defineSetter__("cancelBubble",function(b){
        // if(b)this.stopPropagation();});
// 
    // __defineGetter__("fromElement",function(){
        // var o=(this.type=="mouseover"&&this.relatedTarget)||(this.type=="mouseout"&&this.target)||null;
        // if(o)
            // while(o.nodeType!=1)
                // o=o.parentNode;
        // return o;});
// 
    // __defineGetter__("toElement",function(){
        // var o=(this.type=="mouseover"&&this.target)||(this.type=="mouseout"&&this.relatedTarget)||null;
        // if(o)
            // while(o.nodeType!=1)
                // o=o.parentNode;
        // return o;});
// 
    // __defineGetter__("x",function(){
        // return this.pageX;});
// 
    // __defineGetter__("y",function(){
        // return this.pageY;});
// 
    // __defineGetter__("offsetX",function(){
        // return this.layerX;});
// 
    // __defineGetter__("offsetY",function(){
        // return this.layerY;});
// }
// //节点操作兼容
// with(window.Node.prototype){
    // replaceNode=function(o){
        // this.parentNode.replaceChild(o,this);}
// 
    // removeNode=function(b){
        // if(b)
            // return this.parentNode.removeChild(this);
        // var range=document.createRange();
        // range.selectNodeContents(this);
        // return this.parentNode.replaceChild(range.extractContents(),this);}
// 
    // swapNode=function(o){
        // return this.parentNode.replaceChild(o.parentNode.replaceChild(this,o),this);}
// 
    // contains=function(o){
        // return o?((o==this)?true:arguments.callee(o.parentNode)):false;}
// }
// // //HTML元素兼容
// // with(window.HTMLElement.prototype){
    // // __defineGetter__("parentElement",function(){
        // // return (this.parentNode==this.ownerDocument)?null:this.parentNode;});
// // 
    // // __defineGetter__("children",function(){
        // // var c=[];
        // // for(var i=0,cs=this.childNodes;i<cs.length;i++){
            // // if(cs[i].nodeType==1)
                // // c.push(cs[i]);}
        // // return c;});
// // 
    // // __defineGetter__("canHaveChildren",function(){
        // // return !/^(area|base|basefont|col|frame|hr|img|br|input|isindex|link|meta|param)$/i.test(this.tagName);});
// // 
    // // __defineSetter__("outerHTML",function(s){
        // // var r=this.ownerDocument.createRange();
        // // r.setStartBefore(this);
        // // void this.parentNode.replaceChild(r.createContextualFragment(s),this);
        // // return s;});
    // // __defineGetter__("outerHTML",function(){
        // // var as=this.attributes;
        // // var str="<"+this.tagName;
        // // for(var i=0,al=as.length;i<al;i++){
            // // if(as[i].specified)
                // // str+=" "+as[i].name+"=""+as[i].value+""";}
        // // return this.canHaveChildren?str+">":str+">"+this.innerHTML+"</"+this.tagName+">";});
// // 
    // // __defineSetter__("innerText",function(s){
        // // return this.innerHTML=document.createTextNode(s);});
    // // __defineGetter__("innerText",function(){
        // // var r=this.ownerDocument.createRange();
        // // r.selectNodeContents(this);
        // // return r.toString();});
// // 
    // // __defineSetter__("outerText",function(s){
        // // void this.parentNode.replaceChild(document.createTextNode(s),this);
        // // return s});
    // // __defineGetter__("outerText",function(){
        // // var r=this.ownerDocument.createRange();
        // // r.selectNodeContents(this);
        // // return r.toString();});
// // 
    // // insertAdjacentElement=function(s,o){
        // // return (s=="beforeBegin"&&this.parentNode.insertBefore(o,this))||(s=="afterBegin"&&this.insertBefore(o,this.firstChild))||(s=="beforeEnd"&&this.appendChild(o))||(s=="afterEnd"&&((this.nextSibling)&&this.parentNode.insertBefore(o,this.nextSibling)||this.parentNode.appendChild(o)))||null;}
// // 
    // // insertAdjacentHTML=function(s,h){
        // // var r=this.ownerDocument.createRange();
        // // r.setStartBefore(this);
        // // this.insertAdjacentElement(s,r.createContextualFragment(h));}
// // 
    // // insertAdjacentText=function(s,t){
        // // this.insertAdjacentElement(s,document.createTextNode(t));}
// // }
// //XMLDOM兼容
// window.ActiveXObject=function(s){
    // switch(s){
        // case "XMLDom":
        // document.implementation.createDocument.call(this,"text/xml","", null);
        // //domDoc = document.implementation.createDocument("text/xml","", null);
        // break;
        // }
    // }
// 
// XMLDocument.prototype.LoadXML=function(s){
    // for(var i=0,cs=this.childNodes,cl=childNodes.length;i<cl;i++)
        // this.removeChild(cs[i]);
    // this.appendChild(this.importNode((new DOMParser()).parseFromString(s,"text/xml").documentElement,true));}
// 
// XMLDocument.prototype.selectSingleNode=Element.prototype.selectSingleNode=function(s){
    // return this.selectNodes(s)[0];}
// XMLDocument.prototype.selectNodes=Element.prototype.selectNodes=function(s){
    // var rt=[];
    // for(var i=0,rs=this.evaluate(s,this,this.createNSResolver(this.ownerDocument==null?this.documentElement:this.ownerDocument.documentElement),XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,null),sl=rs.snapshotLength;i<sl;i++)
        // rt.push(rs.snapshotItem(i));
    // return rt;}
// 
// XMLDocument.prototype.__proto__.__defineGetter__("xml",function(){
    // try{
        // return new XMLSerializer().serializeToString(this);}
    // catch(e){
        // return document.createElement("div").appendChild(this.cloneNode(true)).innerHTML;}});
// Element.prototype.__proto__.__defineGetter__("xml",function(){
    // try{
        // return new XMLSerializer().serializeToString(this);}
    // catch(e){
        // return document.createElement("div").appendChild(this.cloneNode(true)).innerHTML;}});
// 
// XMLDocument.prototype.__proto__.__defineGetter__("text",function(){
    // return this.firstChild.textContent;});
// 
// Element.prototype.__proto__.__defineGetter__("text",function(){
    // return this.textContent;});
// Element.prototype.__proto__.__defineSetter__("text",function(s){
    // return this.textContent=s;});
// 
// }
// 




// BROWSER.firefox = document.getBoxObjectFor && USERAGENT.indexOf('firefox') != -1 && USERAGENT.substr(USERAGENT.indexOf('firefox') + 8, 3);
// 
// if(BROWSER.firefox && window.Event){// 修正Event的DOM
// 
    // Event.prototype.__defineSetter__("returnValue",function(b){//
// 
        // if(!b)this.preventDefault();
// 
        // return b;
// 
        // });
// 
    // Event.prototype.__defineSetter__("cancelBubble",function(b){// 设置或者检索当前事件句柄的层次冒泡
// 
        // if(b)this.stopPropagation();
// 
        // return b;
// 
        // });
// 
    // Event.prototype.__defineGetter__("srcElement",function(){
// 
        // var node=this.target;
// 
        // while(node.nodeType!=1)node=node.parentNode;
// 
        // return node;
// 
        // });
// 
    // Event.prototype.__defineGetter__("fromElement",function(){// 返回鼠标移出的源节点
// 
        // var node;
// 
        // if(this.type=="mouseover")
// 
            // node=this.relatedTarget;
// 
        // else if(this.type=="mouseout")
// 
            // node=this.target;
// 
        // if(!node)return;
// 
        // while(node.nodeType!=1)node=node.parentNode;
// 
        // return node;
// 
        // });
// 
    // Event.prototype.__defineGetter__("toElement",function(){// 返回鼠标移入的源节点
// 
        // var node;
// 
        // if(this.type=="mouseout")
// 
            // node=this.relatedTarget;
// 
        // else if(this.type=="mouseover")
// 
            // node=this.target;
// 
        // if(!node)return;
// 
        // while(node.nodeType!=1)node=node.parentNode;
// 
        // return node;
// 
        // });
// 
    // Event.prototype.__defineGetter__("offsetX",function(){
// 
        // return this.layerX;
// 
        // });
// 
    // Event.prototype.__defineGetter__("offsetY",function(){
// 
        // return this.layerY;
// 
        // });
// 
    // }
// 
// if(BROWSER.firefox && window.Document){// 修正Document的DOM
// 
    // }
// if(BROWSER.firefox && window.Node){// 修正Node的DOM
// 
    // Node.prototype.replaceNode=function(Node){// 替换指定节点
// 
        // this.parentNode.replaceChild(Node,this);
// 
        // }
// 
    // Node.prototype.removeNode=function(removeChildren){// 删除指定节点
// 
        // if(removeChildren)
// 
            // return this.parentNode.removeChild(this);
// 
        // else{
// 
            // var range=document.createRange();
// 
            // range.selectNodeContents(this);
// 
            // return this.parentNode.replaceChild(range.extractContents(),this);
// 
            // }
// 
        // }
// 
    // Node.prototype.swapNode=function(Node){// 交换节点
// 
        // var nextSibling=this.nextSibling;
// 
        // var parentNode=this.parentNode;
// 
        // node.parentNode.replaceChild(this,Node);
// 
        // parentNode.insertBefore(node,nextSibling);
// 
        // }
// 
    // }
// 
// if(BROWSER.firefox && window.HTMLElement){
// 
    // HTMLElement.prototype.__defineGetter__("all",function(){
// 
        // var a=this.getElementsByTagName("*");
// 
        // var node=this;
// 
        // a.tags=function(sTagName){
// 
            // return node.getElementsByTagName(sTagName);
// 
            // }
// 
        // return a;
// 
        // });
// 
    // HTMLElement.prototype.__defineGetter__("parentElement",function(){
// 
        // if(this.parentNode==this.ownerDocument)return null;
// 
        // return this.parentNode;
// 
        // });
// 
    // HTMLElement.prototype.__defineGetter__("children",function(){
// 
        // var tmp=[];
// 
        // var j=0;
// 
        // var n;
// 
        // for(var i=0;i<this.childNodes.length;i++){
// 
            // n=this.childNodes;
// 
            // if(n.nodeType==1){
// 
                // tmp[j++]=n;
// 
                // if(n.name){
// 
                    // if(!tmp[n.name])
// 
                        // tmp[n.name]=[];
// 
                    // tmp[n.name][tmp[n.name].length]=n;
// 
                    // }
// 
                // if(n.id)
// 
                    // tmp[n.id]=n;
// 
                // }
// 
            // }
// 
        // return tmp;
// 
        // });
// 
    // HTMLElement.prototype.__defineGetter__("currentStyle", function(){
// 
        // return this.ownerDocument.defaultView.getComputedStyle(this,null);
// 
        // });
// 
    // HTMLElement.prototype.__defineSetter__("outerHTML",function(sHTML){
// 
        // var r=this.ownerDocument.createRange();
// 
        // r.setStartBefore(this);
// 
        // var df=r.createContextualFragment(sHTML);
// 
        // this.parentNode.replaceChild(df,this);
// 
        // return sHTML;
// 
        // });
// 
    // HTMLElement.prototype.__defineGetter__("outerHTML",function(){
// 
        // var attr;
// 
        // var attrs=this.attributes;
// 
        // var str="<"+this.tagName;
// 
        // for(var i=0;i<attrs.length;i++){
// 
            // attr=attrs;
// 
            // if(attr.specified)
// 
                // str+=" "+attr.name+'="'+attr.value+'"';
// 
            // }
// 
        // if(!this.canHaveChildren)
// 
            // return str+">";
// 
        // return str+">"+this.innerHTML+"</"+this.tagName+">";
// 
        // });
// 
    // HTMLElement.prototype.__defineGetter__("canHaveChildren",function(){
// 
        // switch(this.tagName.toLowerCase()){
// 
            // case "area":
// 
            // case "base":
// 
            // case "basefont":
// 
            // case "col":
// 
            // case "frame":
// 
            // case "hr":
// 
            // case "img":
// 
            // case "br":
// 
            // case "input":
// 
            // case "isindex":
// 
            // case "link":
// 
            // case "meta":
// 
            // case "param":
// 
                // return false;
// 
            // }
// 
        // return true;
// 
        // });
// 
    // HTMLElement.prototype.__defineSetter__("innerText",function(sText){
// 
        // var parsedText=document.createTextNode(sText);
// 
        // this.innerHTML=parsedText;
// 
        // return parsedText;
// 
        // });
// 
    // HTMLElement.prototype.__defineGetter__("innerText",function(){
// 
        // var r=this.ownerDocument.createRange();
// 
        // r.selectNodeContents(this);
// 
        // return r.toString();
// 
        // });
// 
    // HTMLElement.prototype.__defineSetter__("outerText",function(sText){
// 
        // var parsedText=document.createTextNode(sText);
// 
        // this.outerHTML=parsedText;
// 
        // return parsedText;
// 
        // });
// 
    // HTMLElement.prototype.__defineGetter__("outerText",function(){
// 
        // var r=this.ownerDocument.createRange();
// 
        // r.selectNodeContents(this);
// 
        // return r.toString();
// 
        // });
// 
    // HTMLElement.prototype.attachEvent=function(sType,fHandler){
// 
        // var shortTypeName=sType.replace(/on/,"");
// 
        // fHandler._ieEmuEventHandler=function(e){
// 
            // window.event=e;
// 
            // return fHandler();
// 
            // }
// 
        // this.addEventListener(shortTypeName,fHandler._ieEmuEventHandler,false);
// 
        // }
// 
    // HTMLElement.prototype.detachEvent=function(sType,fHandler){
// 
        // var shortTypeName=sType.replace(/on/,"");
// 
        // if(typeof(fHandler._ieEmuEventHandler)=="function")
// 
            // this.removeEventListener(shortTypeName,fHandler._ieEmuEventHandler,false);
// 
        // else
// 
            // this.removeEventListener(shortTypeName,fHandler,true);
// 
        // }
// 
    // HTMLElement.prototype.contains=function(Node){// 是否包含某节点
// 
        // do if(Node==this)return true;
// 
        // while(Node=Node.parentNode);
// 
        // return false;
// 
        // }
// 
    // HTMLElement.prototype.insertAdjacentElement=function(where,parsedNode){
// 
        // switch(where){
// 
            // case "beforeBegin":
// 
                // this.parentNode.insertBefore(parsedNode,this);
// 
                // break;
// 
            // case "afterBegin":
// 
                // this.insertBefore(parsedNode,this.firstChild);
// 
                // break;
// 
            // case "beforeEnd":
// 
                // this.appendChild(parsedNode);
// 
                // break;
// 
            // case "afterEnd":
// 
                // if(this.nextSibling)
// 
                    // this.parentNode.insertBefore(parsedNode,this.nextSibling);
// 
                // else
// 
                    // this.parentNode.appendChild(parsedNode);
// 
                // break;
// 
            // }
// 
        // }
// 
    // HTMLElement.prototype.insertAdjacentHTML=function(where,htmlStr){
// 
        // var r=this.ownerDocument.createRange();
// 
        // r.setStartBefore(this);
// 
        // var parsedHTML=r.createContextualFragment(htmlStr);
// 
        // this.insertAdjacentElement(where,parsedHTML);
// 
        // }
// 
    // HTMLElement.prototype.insertAdjacentText=function(where,txtStr){
// 
        // var parsedText=document.createTextNode(txtStr);
// 
        // this.insertAdjacentElement(where,parsedText);
// 
        // }
// 
    // HTMLElement.prototype.attachEvent=function(sType,fHandler){
// 
        // var shortTypeName=sType.replace(/on/,"");
// 
        // fHandler._ieEmuEventHandler=function(e){
// 
            // window.event=e;
// 
            // return fHandler();
// 
            // }
// 
        // this.addEventListener(shortTypeName,fHandler._ieEmuEventHandler,false);
// 
        // }
// 
    // HTMLElement.prototype.detachEvent=function(sType,fHandler){
// 
        // var shortTypeName=sType.replace(/on/,"");
// 
        // if(typeof(fHandler._ieEmuEventHandler)=="function")
// 
            // this.removeEventListener(shortTypeName,fHandler._ieEmuEventHandler,false);
// 
        // else
// 
            // this.removeEventListener(shortTypeName,fHandler,true);
// 
        // }
// 
    // }