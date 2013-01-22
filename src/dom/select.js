
using("System.Dom.Base");


var HtmlSelect = Dom.extend({

	constructor: function(id){
		this.node = Dom.getNode(id);
	},

	add: function(option){

	},

	addItem: function (text, value, selected) {

	},

	removeItem: function () {

	},

	clearItems: function () {

	},

	getSelectedItem: function () {

	},

	setSelectedItem: function () {

	},

	getValue: function () {

	},

	setValue: function () {

	},

	getSelectedIndex: function () {

	},

	getSelected: function (item) {

	},

	setSelected: function (item, value) {

	},

	setSelectedIndex: function () {

	}


});


// //===============================================
// // class - select
// // 使锟矫凤拷锟斤拷:
// // var Select=new cls_select(
// //					id,     // id
// //					arr,    // 锟叫憋拷 [array]  arr[0][0] 值 arr[0][1]  value
// //					size,   // 锟叫憋拷 锟斤拷小
// //					multi,  // 锟斤拷选
// //					cf      //  锟侥憋拷锟叫憋拷锟斤拷执锟叫的猴拷锟斤拷锟斤拷  锟斤拷锟斤拷锟斤拷锟斤拷锟斤拷  默锟斤拷为选锟斤拷锟斤拷锟斤拷锟?  cf=alert    锟斤拷锟斤拷锟斤拷锟窖★拷锟斤拷锟斤拷锟斤拷
// //                          //  锟斤拷锟斤拷锟揭拷锟斤拷掳锟脚? cf=state('锟斤拷删','锟斤拷锟斤拷','锟斤拷锟斤拷');
// //			  );
// // Select.creat()           //  锟斤拷锟斤拷
// // Select.add(o,t,i)        //  锟斤拷锟? o  为 锟侥憋拷   t 为值    i为顺锟斤拷  默锟斤拷锟斤拷锟?// // Select.del(i)            //   删锟斤拷  i  锟斤拷锟斤拷为  锟斤拷锟斤拷   值
// // Select.dels()            //   删锟斤拷选锟斤拷
// // Select.gets()            //  锟斤拷取 锟斤拷锟斤拷:选锟叫碉拷锟斤拷 锟叫憋拷 [array]   锟斤拷锟斤拷  选锟叫碉拷锟叫憋拷
// // Select.state()           //  锟斤拷锟斤拷状态( Select.hc ; 选锟斤拷?  Select.canup  :  锟斤拷锟斤拷锟斤拷    Select.candown  :  锟斤拷锟斤拷锟斤拷   锟斤拷 
// //							    锟斤拷锟斤拷锟?锟斤拷锟斤拷锟斤拷使锟斤拷3锟斤拷锟斤拷锟斤拷锟斤拷锟斤拷id锟侥讹拷锟襟不匡拷锟斤拷
// // Select.moveon(k,i)       // 锟狡讹拷 锟斤拷i锟斤拷 默锟斤拷选锟斤拷 k位  锟斤拷k==0 锟斤拷锟狡讹拷 k==1 锟斤拷锟斤拷一锟斤拷  k==-1 锟斤拷锟斤拷 锟斤拷
// // Select.movetop(i)        // 锟狡讹拷 锟斤拷i锟斤拷 默锟斤拷选锟斤拷  锟斤拷锟斤拷
// // Select.movedown(i)       // 锟狡讹拷 锟斤拷i锟斤拷 默锟斤拷选锟斤拷  锟斤拷锟?// // Select.getall()          //  全锟斤拷锟斤拷锟斤拷
// // Select.getsall ()        //    锟斤拷锟斤拷:选锟叫碉拷锟斤拷 锟叫憋拷 [array] 值  锟斤拷锟斤拷  选锟叫碉拷值
// //===============================================
// try{
	// var Select=new cls_select("objselect");
// }catch(e){
// }
// function cls_select(id,arr,size,multi,cf){
	// var objselect=document.getElementById(id);
	// size=size||9;
	// if(typeof cf=="undefined")cf=""
	// else if(cf.indexOf("state")<0)cf+="(this.value)";
	// if(typeof multi=="undefined") multi=true;
	// var al=!arr?0:arr.length;
	// this.creat=function(){
		// document.write("<select name='"+id+"' size='"+size+"'")
		// if(multi) document.write(" multiple='multiple'");
		// document.write(" id='"+id+"' onchange='"+cf+"'>");
		// for(i=0;i<al;i++){
			// document.write("<option value='"+al[i][1]+"'>"+al[i][0]+"</option>");
		// }
		// document.write("</select>");
		// objselect=document.getElementById(id);
	// }
	// this.add=function(o,t,i){
		// if(typeof i=="undefined") i=objselect.length;
		// if (window.navigator.userAgent.indexOf("MSIE") > 0) {
				// var option = document.createElement("option");
				// option.innerText = o;
				// option.value =t;
				// objselect.insertBefore(option, objselect.options[i]);
		// }else{              // for Firefox
				// objselect.insertBefore(new Option(o, t), selectCtl.options[0]);
		// }
	// }
// 	
	// this.del=function(i){
		// if(isNaN(i)){
			// for(var k=0;k<objselect.length;k++)
				// if(objselect.item(i).value==i) return this.del(k);
		// }else{
			// objselect.remove(i);
			// try{
				// objselect.selectedIndex=i;
			// }catch(e){
				// };
		// }
		// return true;
	// }
	// this.gets=function(){
		// if(multi){
			// al=objselect.length;
			// var arr=new Array(al);
			// for(i=0;i<al;i++)
				// if(objselect.item(i).selected) arr[k++]=i;
			// return arr;
		// }else{
			// return objselect.selectedIndex;
		// }
// 	
	// }
	// this.state=function(){
		// this.hc=objselect.selectedIndex>=0;
		// this.canup=objselect.selectedIndex>0;
		// this.candown=objselect.selectedIndex>0 && objselect.selectedIndex<objselect.length;
		// if(arguments.length){
			// try{
				// document.getElementById(arguments[0]).disabled=!this.hc;
				// document.getElementById(arguments[1]).disabled=!this.canup;
				// document.getElementById(arguments[2]).disabled=!this.candown;
			// }catch(e){}
		// }
// 	
	// }
// 	
	// this.dels=function(){
		// if(multi){
			// pc=-1;
			// for(i=0;i<objselect.length;i++)
				// if(objselect.item(i).selected) objselect.remove(pc=i--);
			// if(pc>=0)objselect.selectedIndex=pc>=objselect.length?pc-1:pc;
		// }else{
			// this.del(objselect.selectedIndex);
		// }
	// }
	// this.moveon=function(k,i){
	  // if(typeof i=="undefined") i=objselect.selectedIndex;
	  // if(i<0 || i+k>=objselect.length || i+k<0) return false;
	  // option_value=objselect.item(i).value;
	  // option_text=objselect.item(i).text;
	  // objselect.item(i).value=objselect.item(i+k).value;
	  // objselect.item(i).text=objselect.item(i+k).text;
	  // objselect.item(i+k).value=option_value;
	  // objselect.item(i+k).text=option_text;
	  // objselect.selectedIndex=i+k;
    // }
	// this.movetop=function(i){this.moveon(-objselect.selectedIndex,i);}
	// this.movetbottom=function(i){this.moveon(objselect.length-objselect.selectedIndex-1,i);}
	// this.getall=function(){
		// var arr=new Array(objselect.length);
		// for(i=0;i<objselect.length;i++)
			 // arr[i]=objselect.item(i).value;
		// return arr;
// 	
	// }
	// this.getsall=function(){
		// if(multi){
			// var k=0;
			// var arr=new Array();
			// for(i=0;i<objselect.length;i++)
				// if(objselect.item(i).selected) arr[k++]=objselect.item(i).value;
			// return arr;
		// }else{
			// return objselect.item(objselect.selectedIndex) .value;
		// }
	// }
// }
