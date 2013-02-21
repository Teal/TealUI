//===========================================
//  表格数据结构   DataTable.js  MIT LICENCE
//  Copyright(c) 2009-2010 xuld
//===========================================
//功能说明: 类主要用于存储类似数据库结构的表格
//              全局变量  playjs.DataSet :  全部数据的集合
//              一个playjs.DataSet含有多个playjs.DataTable  每个playjs.DataTable 含有一个playjs.DataTitle和多个playjs.DataRow
//              不提供UI界面。只能作为一个数据(XML,数据库,JSON)接口。
//最简单示例:
//     /*  js code 
//		* * playObject 最简单示例
//		* * 创建一个表格并创建一个列
//      */
//          var Table = playjs.DataSet.add("表格名字",["标题1","标题2","标题3"]);    //创建一个表格,并定义表格有哪些标题
//			Table.add(["第一行第1列","第一行第2列","第一行第3列"],"名字1");           //创建一行
//          Table.add(["第二行第1列","第二行第2列","第二行第3列"],"名字2");           //创建一行
//			Table["名字1"]["标题1"] = 3;             // 这样调用名字为名字1的行的第一列。
//			Table[0][3] = 6                          // 也可以使用数字
//			Table.play()                           // 创建一个 <TABLE> 标签,这个方法一般用于调试,观察所有的表格数据
//
//基本示例:
//       常用方法说明: 
//          add   增加一项
//          del   删除一项
//          indexOf   返回指定索引的内容
//          find   返回指定内容索引,如果找不到有关内容,返回 -1
//          insert   在当前位置末尾插入一个内容
//          insertAt   在一个位置插入一个内容
//          remove   按照内容删除,可以传入一个数组
//          removeAt   按照索引删除
//          search   返回当前有无指定内容
//          getAt   返回指定索引位置,如果索引越界,返回一个 NULL
//          length  个数
//          key     主键
//
//       playjs.DataSet::add()    增加一个表,参数:如果是1个。表示表格标题,如果2个,前个参数为表格名,后个是标题。
//       playjs.DataSet::del()    删除一个表,参数:表格名字。
//       playjs.DataSet::table    全部表格的集合
//                              当您添加一个表格后,要使用table集合获得该表格     playjs.DataSet.table[索引]  或 playjs.DataSet.table[名]
//       playjs.DataSet::count    表格数
//       playjs.DataSet::xtype    JPlus对象对自身的说明
//       playjs.DataTable::addTitle    增加表格的标题,参数可以是数组,或逗号隔开的字符串。
//       playjs.DataTable::addTitleAt    增加表格的标题到一个位置,第一个参数为位置(数字),第二个为标题
//       playjs.DataTable::render    渲染到一个DIV元素
//       playjs.DataTable::container    读取一个<TABLE>
//       playjs.DataTable::sort(列,比较函数,顺序/逆序,开始位置,结束位置)    排序
//                                 排序是使用较多的功能,使用的参数全可选,
//                                 当没有列时,列使用主列。
//                                 比较函数,默认是返回由小到大。
//                                       比叫函数  2   个参数,  表示 2个列。 返回一个布尔 如 function(x,y){return x<y};  这样按  x<y  排序
//                                 顺序,逆序:布尔,始排序结果相反(默认true)。   
//                                 开始位置,开始排序的位置。  
//       
//==========================================


namespace("System.Data");

///	<summary>
///	表格行
///	</summary>
/// <class extend="Array" name="DataRow" />
JPlus.Data.DataRow = Array.extend({
    
    ///	<summary>
	///	当前行所在的表格。
	///	</summary>
	/// <type name="ownerTable" />
    ownerTable : null,
    
    ///	<summary>
	///	构造函数。
	///	</summary>
	/// <params name="array" type="Array">内容。如果不需要可等于 null。</params>
	/// <params name="ownerTable" type="DataTable">所在的表格。</params>
    constructor : function(array,ownerTable){
    
        //assert(array == null || Array.isArray(array),"用于生成 dataRow 的参数 array必须是null或数组");
    
        if(array != null)
            array.cloneTo(this);
        this.ownerTable = ownerTable;
    },

    ///	<summary>
	///	xtype。
	///	</summary>
	/// <type name="String" />
	/// <const />
	xtype : "DataRow",
	
	///	<summary>
	///	结合标题。
	///	</summary>
	titleBind : function(){
	
	    //assert(this.ownerTable,"结合标题时必须指定行的所在表");
	    
		var title = this.ownerTable.title;
		for(var i = title.length; i > 0; i--)
			this[title[i]] = this[i];
		
	},
	
	///	<summary>
	///	在一个位置插入列。
	///	</summary>
	/// <params name="value" type="Object">内容。</params>
	insert : Array.prototype.push,

	///	<summary>
	///	获取或设置行的某一列的值。
	///	</summary>
	/// <params name="title" type="Number">列位置。</params>
	/// <params name="title" type="String">列名。</params>
	/// <params name="value" type="Object">内容。</params>
	/// <returns type="Object">内容</returns>
	valueAt : function(title,value){

	    //assert(typeof title == "number" || this.ownerTable,"通过标题时必须指定行的所在表");
	
	    var index = typeof title == "number" ? title : this.ownerTable.title.indexOf(value);
	    
	    if(typeof value != "undefined")
	        this[index] = value;
	        
	    return this[index];
	}

});


///	<summary>
///	表格结构
///	</summary>
/// <class extend="Array" name="DataTable" />
JPlus.Data.DataTable = Array.extend({
    
    ///	<summary>
	///	名字。
	///	</summary>
	/// <type name="String" />
    name : null,
    
    ///	<summary>
	///	标题。
	///	</summary>
	/// <type name="DataRow" />
    title : null,
    
    ///	<summary>
	///	主键。
	///	</summary>
	/// <type name="String" />
    key : null,
    
    ///	<summary>
	///	当前排序列。默认null。
	///	</summary>
	/// <type name="String" />
    sortBy : null,
    
    ///	<summary>
	///	构造函数。
	///	</summary>
    constructor : function(value,name,key){
        // [null,""]  ->标题
        
        //assert(value == null || Array.isArray(value),"初始化表格的value必须是数组或null值");
        
        if(value == null) return;
        if(value.length || !Array.isArray(value[0]))  //二维数组
            value = [value];
        var me = this;
        value.each(function(v,index){me[index] = new DataRow(v,this);});
        
        me.title = me[0] || new DataRow(null,me);
        
        me.name = name;
        
        me.key = key || (me.title.length ? null : me.title[0] );
    
    },
    
    ///	<summary>
	///	生成一个新行。
	///	</summary>
	/// <params name="value" type="Array">内容。</params>
	/// <params name="index" type="Number">位置。默认末尾。</params>
	/// <returns type="DataRow">新行</returns>
    newRow : function(value,index){
        var a = new DataRow(value,this);
        this.insertAt(a,index);
        return a;
    },
    
    ///	<summary>
	///	xtype。
	///	</summary>
	/// <type name="String" />
	/// <const />
    xtype : "DataTable",
    
    ///	<summary>
	///	设置所有内容。
	///	</summary>
	/// <params name="value" type="Object">内容。</params>
    setValue : function(value){
        for(var i = 0, l = this.length; i < l; i++)
            this[i] = value[i];
    },
    
    ///	<summary>
	///	简单排序。
	///	</summary>
	/// <params name="row" type="Object">列。</params>
	/// <params name="f" type="Function">比较。</params>
	/// <params name="bool" type="Boolean">是否倒序。</params>
	/// <params name="start" type="Number">开始。</params>
	/// <params name="end" type="Number">结束。</params>
    sort : function(row,f,bool,start,end){
    
        //设置建
		this.sortBy = row = row || this.key;
		
		//设置排序委托
		f = typeof f == "function" ? f : function(x,y){return x<y};
		
		//是否倒序
		var fn = bool===false ? function(x,y){return !f(x,y)} : f;
		
		//位置
		start = start || 0;
		end = end || this.length;
		var tmp;
		for(var i=start;i< end;i++){
			for(var j=i+1;j<end;j++)
				if(!fn(this[i][row],this[j][row])){
					tmp = 	this[j][row];
					this[j][row] = this[i][row];
					this[i][row] = tmp;
				}
		}
		
	}


});


var DataRow = JPlus.Data.DataRow;
var DataTable = JPlus.Data.DataTable;
