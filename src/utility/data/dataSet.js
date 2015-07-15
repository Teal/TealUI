//===========================================
//  鏁版嵁闆嗗璞?  dataset.js     
//===========================================


Ext.data.Store = function (config) {
    this.data = new Ext.util.MixedCollection(false);
    this.data.getKey = function (o) {
        return o.id;
    };
    this.baseParams = {};
    this.paramNames = {
        "start": "start",
        "limit": "limit",
        "sort": "sort",
        "dir": "dir"
    };
    Ext.apply(this, config);

    if (this.reader && !this.recordType) {
        this.recordType = this.reader.recordType;
    }

    this.fields = this.recordType.prototype.fields;

    this.modified = [];

    this.addEvents({

        datachanged: true,

        add: true,

        remove: true,

        update: true,

        clear: true,

        beforeload: true,

        load: true,

        loadexception: true
    });

    if (this.proxy) {
        this.relayEvents(this.proxy, ["loadexception"]);
    }
    this.sortToggle = {};

    Ext.data.Store.superclass.constructor.call(this);
};
Ext.extend(Ext.data.Store, Ext.util.Observable, {





    remoteSort: false,


    lastOptions: null,


    add: function (records) {
        records = [].concat(records);
        for (var i = 0, len = records.length; i < len; i++) {
            records[i].join(this);
        }
        var index = this.data.length;
        this.data.addAll(records);
        this.fireEvent("add", this, records, index);
    },


    remove: function (record) {
        var index = this.data.indexOf(record);
        this.data.removeAt(index);
        this.fireEvent("remove", this, record, index);
    },


    removeAll: function () {
        this.data.clear();
        this.fireEvent("clear", this);
    },


    insert: function (index, records) {
        records = [].concat(records);
        for (var i = 0, len = records.length; i < len; i++) {
            this.data.insert(index, records[i]);
            records[i].join(this);
        }
        this.fireEvent("add", this, records, index);
    },


    indexOf: function (record) {
        return this.data.indexOf(record);
    },


    indexOfId: function (id) {
        return this.data.indexOfKey(id);
    },


    getById: function (id) {
        return this.data.key(id);
    },


    getAt: function (index) {
        return this.data.itemAt(index);
    },


    getRange: function (start, end) {
        return this.data.getRange(start, end);
    },


    storeOptions: function (o) {
        o = Ext.apply({}, o);
        delete o.callback;
        delete o.scope;
        this.lastOptions = o;
    },


    load: function (options) {
        options = options || {};
        if (this.fireEvent("beforeload", this, options) !== false) {
            this.storeOptions(options);
            var p = Ext.apply(options.params || {}, this.baseParams);
            if (this.sortInfo && this.remoteSort) {
                var pn = this.paramNames;
                p[pn["sort"]] = this.sortInfo.field;
                p[pn["dir"]] = this.sortInfo.direction;
            }
            this.proxy.load(p, this.reader, this.loadRecords, this, options);
        }
    },


    reload: function (options) {
        this.load(Ext.applyIf(options || {}, this.lastOptions));
    },



    loadRecords: function (o, options, success) {
        if (!o || success === false) {
            if (success !== false) {
                this.fireEvent("load", this, [], options);
            }
            if (options.callback) {
                options.callback.call(options.scope || this, [], options, false);
            }
            return;
        }
        var r = o.records, t = o.totalRecords || r.length;
        for (var i = 0, len = r.length; i < len; i++) {
            r[i].join(this);
        }
        if (!options || options.add !== true) {
            this.data.clear();
            this.data.addAll(r);
            this.totalLength = t;
            this.applySort();
            this.fireEvent("datachanged", this);
        } else {
            this.totalLength = Math.max(t, this.data.length + r.length);
            this.data.addAll(r);
        }
        this.fireEvent("load", this, r, options);
        if (options.callback) {
            options.callback.call(options.scope || this, r, options, true);
        }
    },


    loadData: function (o, append) {
        var r = this.reader.readRecords(o);
        this.loadRecords(r, { add: append }, true);
    },


    getCount: function () {
        return this.data.length || 0;
    },


    getTotalCount: function () {
        return this.totalLength || 0;
    },


    getSortState: function () {
        return this.sortInfo;
    },


    applySort: function () {
        if (this.sortInfo && !this.remoteSort) {
            var s = this.sortInfo, f = s.field;
            var st = this.fields.get(f).sortType;
            var fn = function (r1, r2) {
                var v1 = st(r1.data[f]), v2 = st(r2.data[f]);
                return v1 > v2 ? 1 : (v1 < v2 ? -1 : 0);
            };
            this.data.sort(s.direction, fn);
            if (this.snapshot && this.snapshot != this.data) {
                this.snapshot.sort(s.direction, fn);
            }
        }
    },


    setDefaultSort: function (field, dir) {
        this.sortInfo = { field: field, direction: dir ? dir.toUpperCase() : "ASC" };
    },


    sort: function (fieldName, dir) {
        var f = this.fields.get(fieldName);
        if (!dir) {
            if (this.sortInfo && this.sortInfo.field == f.name) {
                dir = (this.sortToggle[f.name] || "ASC").toggle("ASC", "DESC");
            } else {
                dir = f.sortDir;
            }
        }
        this.sortToggle[f.name] = dir;
        this.sortInfo = { field: f.name, direction: dir };
        if (!this.remoteSort) {
            this.applySort();
            this.fireEvent("datachanged", this);
        } else {
            this.load(this.lastOptions);
        }
    },


    each: function (fn, scope) {
        this.data.each(fn, scope);
    },


    getModifiedRecords: function () {
        return this.modified;
    },


    filter: function (property, value) {
        if (!value.exec) {
            value = String(value);
            if (value.length == 0) {
                return this.clearFilter();
            }
            value = new RegExp("^" + Ext.escapeRe(value), "i");
        }
        this.filterBy(function (r) {
            return value.test(r.data[property]);
        });
    },


    filterBy: function (fn, scope) {
        var data = this.snapshot || this.data;
        this.snapshot = data;
        this.data = data.filterBy(fn, scope);
        this.fireEvent("datachanged", this);
    },


    clearFilter: function (suppressEvent) {
        if (this.snapshot && this.snapshot != this.data) {
            this.data = this.snapshot;
            delete this.snapshot;
            if (suppressEvent !== true) {
                this.fireEvent("datachanged", this);
            }
        }
    },


    afterEdit: function (record) {
        if (this.modified.indexOf(record) == -1) {
            this.modified.push(record);
        }
        this.fireEvent("update", this, record, Ext.data.Record.EDIT);
    },


    afterReject: function (record) {
        this.modified.remove(record);
        this.fireEvent("update", this, record, Ext.data.Record.REJECT);
    },


    afterCommit: function (record) {
        this.modified.remove(record);
        this.fireEvent("update", this, record, Ext.data.Record.COMMIT);
    },


    commitChanges: function () {
        var m = this.modified.slice(0);
        this.modified = [];
        for (var i = 0, len = m.length; i < len; i++) {
            m[i].commit();
        }
    },


    rejectChanges: function () {
        var m = this.modified.slice(0);
        this.modified = [];
        for (var i = 0, len = m.length; i < len; i++) {
            m[i].reject();
        }
    }
});

Ext.data.SimpleStore = function (config) {
    Ext.data.SimpleStore.superclass.constructor.call(this, {
        reader: new Ext.data.ArrayReader({
            id: config.id
        },
            Ext.data.Record.create(config.fields)
        ),
        proxy: new Ext.data.MemoryProxy(config.data)
    });
    this.load();
};
Ext.extend(Ext.data.SimpleStore, Ext.data.Store);



// //==========================================
// // PyObject  by xuld
// //
// //   锟斤拷锟斤拷莸锟斤拷锟?// //
// //
// //锟斤拷锟斤拷说锟斤拷: 锟斤拷锟斤拷要锟斤拷锟节存储锟斤拷锟斤拷锟斤拷菘锟结构锟侥憋拷锟?// //              全锟街憋拷锟斤拷  DataSet :  全锟斤拷锟斤拷莸募锟斤拷锟?// //              一锟斤拷DataSet锟斤拷锟叫讹拷锟紻ataTable  每锟斤拷DataTable 锟斤拷锟斤拷一锟斤拷DataTitle锟酵讹拷锟紻ataRow
// //              锟斤拷锟结供UI锟斤拷锟芥。只锟斤拷锟斤拷为一锟斤拷锟斤拷锟?XML,锟斤拷菘锟?JSON)锟接口★拷
// //锟斤拷锟绞撅拷锟?
// //     /*  js code 
// //		* * PyObject 锟斤拷锟绞撅拷锟?// //		* * 锟斤拷锟斤拷一锟斤拷锟斤拷癫⒋锟斤拷锟揭伙拷锟斤拷锟?// //      */
// //          var Table = DataSet.add("锟斤拷锟斤拷锟斤拷锟?,["锟斤拷锟斤拷1","锟斤拷锟斤拷2","锟斤拷锟斤拷3"]);    //锟斤拷锟斤拷一锟斤拷锟斤拷锟?锟斤拷锟斤拷锟斤拷锟斤拷锟斤拷锟斤拷些锟斤拷锟斤拷
// //			Table.add("锟斤拷锟斤拷1",["锟斤拷一锟叫碉拷1锟斤拷","锟斤拷一锟叫碉拷2锟斤拷","锟斤拷一锟叫碉拷3锟斤拷"]);           //锟斤拷锟斤拷一锟斤拷
// //          Table.add("锟斤拷锟斤拷2",["锟节讹拷锟叫碉拷1锟斤拷","锟节讹拷锟叫碉拷2锟斤拷","锟节讹拷锟叫碉拷3锟斤拷"]);           //锟斤拷锟斤拷一锟斤拷
// //			Table["锟斤拷锟斤拷1"]["锟斤拷锟斤拷1"] = 3;             // 锟斤拷锟斤拷锟斤拷锟斤拷锟斤拷锟轿拷锟斤拷锟?锟斤拷锟叫的碉拷一锟叫★拷
// //			Table[0][3] = 6                          // 也锟斤拷锟斤拷使锟斤拷锟斤拷锟斤拷
// //			Table.create()                           // 锟斤拷锟斤拷一锟斤拷 <TABLE> 锟斤拷签,锟斤拷锟斤拷锟斤拷锟揭伙拷锟斤拷锟斤拷诘锟斤拷锟?锟桔诧拷锟斤拷锟叫的憋拷锟斤拷锟斤拷
// //
// //锟斤拷示锟斤拷:
// //       锟斤拷锟矫凤拷锟斤拷说锟斤拷: 
// //          add   锟斤拷锟斤拷一锟斤拷
// //          del   删锟斤拷一锟斤拷
// //          indexOf   锟斤拷锟斤拷指锟斤拷锟斤拷锟斤拷锟斤拷锟斤拷锟?// //          find   锟斤拷锟斤拷指锟斤拷锟斤拷锟斤拷锟斤拷锟斤拷,锟斤拷锟斤拷也锟斤拷锟斤拷泄锟斤拷锟斤拷锟?锟斤拷锟斤拷 -1
// //          insert   锟节碉拷前位锟斤拷末尾锟斤拷锟斤拷一锟斤拷锟斤拷锟斤拷
// //          insertAt   锟斤拷一锟斤拷位锟矫诧拷锟斤拷一锟斤拷锟斤拷锟斤拷
// //          remove   锟斤拷锟斤拷锟斤拷锟斤拷删锟斤拷,锟斤拷锟皆达拷锟斤拷一锟斤拷锟斤拷锟斤拷
// //          removeAt   锟斤拷锟斤拷锟斤拷锟斤拷删锟斤拷
// //          search   锟斤拷锟截碉拷前锟斤拷锟斤拷指锟斤拷锟斤拷锟斤拷
// //          getAt   锟斤拷锟斤拷指锟斤拷锟斤拷锟斤拷位锟斤拷,锟斤拷锟斤拷锟斤拷锟皆斤拷锟?锟斤拷锟斤拷一锟斤拷 NULL
// //          length  锟斤拷锟斤拷
// //          key     锟斤拷锟斤拷
// //
// //       DataSet::add()    锟斤拷锟斤拷一锟斤拷锟斤拷,锟斤拷锟斤拷:锟斤拷锟斤拷锟?锟斤拷锟斤拷锟斤拷示锟斤拷锟斤拷锟斤拷,锟斤拷锟?锟斤拷,前锟斤拷锟斤拷锟斤拷为锟斤拷锟斤拷锟?锟斤拷锟斤拷潜锟斤拷狻?// //       DataSet::del()    删锟斤拷一锟斤拷锟斤拷,锟斤拷锟斤拷:锟斤拷锟斤拷锟斤拷帧锟?// //       DataSet::table    全锟斤拷锟斤拷锟侥硷拷锟斤拷
// //                              锟斤拷锟斤拷锟斤拷锟揭伙拷锟斤拷锟斤拷锟?要使锟斤拷table锟斤拷锟较伙拷酶帽锟斤拷     DataSet.table[锟斤拷锟斤拷]  锟斤拷 DataSet.table[锟斤拷]
// //       DataSet::count    锟斤拷锟斤拷锟?// //       DataSet::xtype    JPlus锟斤拷锟斤拷锟斤拷锟斤拷锟斤拷说锟斤拷
// //       DataTable::addTitle    锟斤拷锟接憋拷锟侥憋拷锟斤拷,锟斤拷锟斤拷锟斤拷锟斤拷锟斤拷锟斤拷锟?锟津逗号革拷锟斤拷锟斤拷锟街凤拷
// //       DataTable::addTitleAt    锟斤拷锟接憋拷锟侥憋拷锟解到一锟斤拷位锟斤拷,锟斤拷一锟斤拷锟斤拷锟斤拷为位锟斤拷(锟斤拷锟斤拷),锟节讹拷锟斤拷为锟斤拷锟斤拷
// //       DataTable::render    锟斤拷染锟斤拷一锟斤拷DIV元锟斤拷
// //       DataTable::container    锟斤拷取一锟斤拷<TABLE>
// //       DataTable::sort(锟斤拷,锟饺较猴拷锟斤拷,顺锟斤拷/锟斤拷锟斤拷,锟斤拷始位锟斤拷,锟斤拷锟斤拷位锟斤拷)    锟斤拷锟斤拷
// //                                 锟斤拷锟斤拷锟斤拷使锟矫较讹拷墓锟斤拷锟?使锟矫的诧拷锟斤拷全锟斤拷选,
// //                                 锟斤拷没锟斤拷锟斤拷时,锟斤拷使锟斤拷锟斤拷锟叫★拷
// //                                 锟饺较猴拷锟斤拷,默锟斤拷锟角凤拷锟斤拷锟斤拷小锟斤拷锟斤拷
// //                                       锟饺叫猴拷锟斤拷  2   锟斤拷锟斤拷锟斤拷,  锟斤拷示 2锟斤拷锟叫★拷 锟斤拷锟斤拷一锟斤拷锟斤拷锟斤拷 锟斤拷 function(x,y){return x<y};  锟斤拷锟斤拷  x<y  锟斤拷锟斤拷
// //                                 顺锟斤拷,锟斤拷锟斤拷:锟斤拷锟斤拷,始锟斤拷锟斤拷锟斤拷锟洁反(默锟斤拷true)锟斤拷   
// //                                 锟斤拷始位锟斤拷,锟斤拷始锟斤拷锟斤拷锟轿伙拷谩锟? 
// //       
// //==========================================
// 
// 
// /* dataSet
// *     by xuld
// *      http://www.xuld.net
// *   注锟酵帮拷
// *      锟斤拷锟节硷拷锟斤拷锟斤拷锟斤拷:锟斤拷锟斤拷锟絡s没锟叫很讹拷锟脚伙拷锟斤拷,锟斤拷锟斤拷锟斤拷锟斤拷锟斤拷锟解。锟斤拷锟斤拷锟斤拷懈锟矫碉拷锟睫改斤拷锟斤拷,希锟斤拷锟杰凤拷锟斤拷锟斤拷一锟斤拷锟睫改碉拷源锟诫。
// *   全锟斤拷说锟斤拷
// *      锟斤拷锟斤拷锟斤拷锟绞癸拷锟絡s锟斤拷锟斤拷
// *   锟斤拷锟斤拷锟叫撅拷锟斤拷学习锟斤拷
// */
// if(!window.dataSet && dataSet.xtype!="dataSet"){
// dataSet = function(name){
// var playDataSet = {
// 			
// //全锟斤拷锟斤拷锟?			// table:new Array(),
// 			
// //锟斤拷锟斤拷锟?			// count:0,
// 			
// //锟芥本
// version:0.1,
// 			
// //锟斤拷癯ざ锟?			// length:function(){
// return this.table.length;
// },
// 
// //锟斤拷荽锟斤拷锟斤拷锟斤拷锟捷凤拷锟斤拷一锟斤拷锟斤拷锟斤拷
// _getAt:function(t,x){
// if(isNaN(x)){
// return this._indexOf(x);
// }else{
// return x>t.length?null:t[x];
// }
// },
// 			
// xtype:"dataSet",
// 			
// //锟斤拷锟斤拷一锟斤拷值锟斤拷末尾
// //锟斤拷锟斤拷:
// //  value : 锟斤拷锟斤拷
// //  key : 值 
// _insert:function(t,value,key){
// t.key = t.length;
// 
// if(typeof value == "undefined" || value==""){
// t[t.length] = key;
// }else{
// return t[t.length] = t[value] = key;
// }
// 				
// return t[t.key];
// },
// 			
// //锟斤拷一锟斤拷位锟矫诧拷锟斤拷一锟斤拷值
// //锟斤拷锟斤拷:
// //  table : 锟斤拷锟斤拷
// //  value : 锟斤拷锟斤拷
// //  key : 值
// _insertAt:function(t,table,value,key){
// t.key = table;
// 				
// for(var i=t.length-1;i>=table;i--){
// t[i+1] = t[i];
// }			
// 				
// if(typeof value == "undefined" || value==""){
// t[table] = key;
// }else{
// t[value] = t[table] = key;
// }
// return t[t.key];
// },
// 			
// //锟斤拷锟斤拷,锟斤拷锟斤拷锟斤拷锟斤拷,锟揭诧拷锟斤拷 锟斤拷锟斤拷 -1
// //锟斤拷锟斤拷:
// //  name : 锟斤拷锟斤拷
// _indexOf:function(t,name){
// for(var i=0;i<t.length;i++)
// if(t[i] &&  t[i].name==name)
// return i;
// return -1;
// 				
// },
// 			
// //删锟斤拷一锟斤拷值
// //锟斤拷锟斤拷:
// //  name : 值
// _remove:function(t,name){
// if(isArray(name)){
// var aa=new Array();
// for(var i=0; i<t.length; i++)
// for(var n=0; n<name.length;  n++ )
// if(t[i] && t[i].name==name[n]){
// aa.push(i);
// break;
// }
// return this._removeAt(t,aa);
// }
// for(var i=0;i<t.length;i++)
// if(t[i] &&  t[i].name==name){
// this._removeAt(t,i);
// return 1;
// break;
// }
// return  0;
// },
// 			
// 			
// //删锟斤拷
// //锟斤拷锟斤拷:
// //  table : 锟斤拷锟斤拷
// //  锟斤拷锟截憋拷删锟斤拷母锟斤拷锟?			// _removeAt:function(t,table){
// if(isArray(table)){
// var count = 0;
// for(var v=0;v<table.length;v++)
// if(t[table[v]]){
// count++;
// if(t[table[v]].name)
// delete t[t[table[v]].name];
// delete t[table[v]];	
// }
// var start,v;
// start = parseInt(table[0]);
// v = start;
// while(v++<t.length)
// if(t[v])
// t[start++] = t[v];
// t.length -= count;
// return count;
// }
// table = parseInt(table);
// if(!t[table])
// return 0;
// if(t[table].name)
// delete t[t[table].name];
// delete t[table];
// while(table++<t.length)
// t[table-1]  = t[table];
// t.length--;
// return 1;
// },
// 			
// _load :  function(t,value){
// switch(typeof value){
// case "object" :
// if(value.xtype){
// t = value;
// }else{
// for(var i in value){
// if(!i) continue;
// this._insert(t,i,value[i]);
// }
// }
// break;
// case "string" :
// value = value.split(",");
// for(var i in value){
// if(!i) continue;
// this._insert(t,i,value[i]);
// }
// break;
// default:
// break;
// }
// 				
// },
// 			
// 			
// //锟斤拷锟斤拷一锟斤拷值锟斤拷锟斤拷锟角凤拷锟斤拷锟?			// //锟斤拷锟斤拷:
// //  table : 锟斤拷锟斤拷
// _search:function(t,table){
// if(isArray(table)){
// for(var v in table)
// if(t[table[v]])
// continue;
// else
// return false; 
// }
// return !!t[table];
// 				
// },  
// 			
// //锟斤拷荽锟斤拷锟斤拷锟斤拷锟捷凤拷锟斤拷一锟斤拷锟斤拷锟?			// getAt:function(x){
// return this._getAt(this.table,x);
// },
// 			
// //锟斤拷锟斤拷一锟斤拷锟斤拷锟侥┪?			// //锟斤拷锟斤拷:
// //  tableName : 锟斤拷锟斤拷
// insert:function(tableName,value){
// this.count++;
// return this._insert(this.table,tableName,playDataTable(tableName,value));
// },
// 			
// //锟斤拷一锟斤拷位锟矫诧拷锟斤拷一锟斤拷值
// //锟斤拷锟斤拷:
// //  n : 锟斤拷锟斤拷
// // tableName: 锟斤拷锟斤拷
// insertAt:function(x,tableName,value){
// this.count++;
// return this._insertAt(this.table,x,tableName,playDataTable(tableName,value));
// },
// 
// //锟斤拷锟揭憋拷锟斤拷,锟斤拷锟斤拷锟斤拷锟斤拷,锟揭诧拷锟斤拷 锟斤拷锟斤拷 -1
// //锟斤拷锟斤拷:
// //  name : 锟斤拷锟斤拷
// indexOf:function(name){
// return this._indexOf(this.table,name);
// 				
// },
// 
// //删锟斤拷一锟斤拷锟斤拷
// //锟斤拷锟斤拷:
// //  table : 锟斤拷锟斤拷
// remove:function(tableName){
// this.count -= this._remove(this.table,tableName);
// },
// 
// //删锟斤拷一锟斤拷锟斤拷
// //锟斤拷锟斤拷:
// //  table : 锟斤拷锟斤拷锟斤拷
// removeAt:function(x){
// this.count -= this._removeAt(this.table,x);
// },
// 			
// //锟斤拷锟斤拷一锟斤拷锟斤拷锟斤拷锟角凤拷锟斤拷锟?			// //锟斤拷锟斤拷:
// //  table : 锟斤拷锟斤拷
// search:function(tableName){
// return this._search(this.table,tableName);
// 				
// },
// 			
// //锟斤拷锟斤拷
// key:0
// };
// 		
// //锟斤拷锟揭伙拷锟斤拷锟? 锟斤拷锟斤拷:位锟矫憋拷锟斤拷
// // add 位锟斤拷 锟斤拷锟斤拷 锟斤拷锟斤拷
// playDataSet.table.add =playDataSet.add =  function(table,TableName,C){
// if(C && typeof table!="Object")
// return playDataSet.insertAt(table,TableName,C);		
// else if(!C && !TableName)
// return playDataSet.insert(playDataSet.count+"_play",table);
// else if(typeof table!="Object")
// return playDataSet.insertAt(table,TableName,C);
// else
// return playDataSet.insert(table,TableName);
// };
// 
// //删锟斤拷一锟斤拷  锟斤拷锟斤拷:位锟矫憋拷锟斤拷
// playDataSet.table.del = playDataSet.del = function(table){
// if(isNaN(table))
// playDataSet.remove(table);
// else
// playDataSet.removeAt(table);
// };
// 		
// playDataSet.table.search = playDataSet.search;
// 		
// playDataSet.table.indexOf = playDataSet.indexOf;	
// 		
// playDataSet.table.getAt = playDataSet.getAt;
// 		
// return playDataSet;
// }();
// 
// playDataTable = function(name,title,vals){
// 	   
// var DataTable = new Array();
// 			
// //全锟斤拷锟斤拷
// DataTable.title = playDataColumn(name+"Title",title,this);
// 		
// //锟斤拷锟斤拷
// DataTable.name = name;
// 		
// //锟斤拷锟斤拷一锟斤拷锟叫碉拷末尾
// //锟斤拷锟斤拷:
// //  value : 锟斤拷锟斤拷
// DataTable.insert = function(value,vals){
// return dataSet._insert(this,value,playDataRow(value,vals,this));
// };
// 		
// //锟斤拷锟斤拷一锟斤拷
// //锟斤拷锟斤拷:
// //  name : 锟斤拷锟斤拷
// DataTable.addTitle = function(value){
// dataSet._load(this.title,value); 
// };  
// 		
// //锟斤拷锟斤拷一锟斤拷一锟斤拷位锟斤拷
// DataTable.addTitleAt = function(row,value){
// dataSet._insertAt(this.title,row,value,value); 
// };  
// //锟斤拷一锟斤拷位锟矫诧拷锟斤拷锟斤拷
// //锟斤拷锟斤拷:
// //  row : 锟斤拷锟斤拷
// //  value : 锟斤拷锟斤拷
// DataTable.insertAt = function(row,value,vals){
// var title = this.title;
// return dataSet._insertAt(this,row,value,playDataRow(value,vals,this));
// };
// 
// //锟斤拷锟斤拷锟斤拷锟斤拷,锟斤拷锟斤拷锟斤拷锟斤拷,锟揭诧拷锟斤拷 锟斤拷锟斤拷 -1
// //锟斤拷锟斤拷:
// //  name : 锟斤拷锟斤拷
// DataTable.indexOf = function(name){
// return dataSet._indexOf(this);
// 			
// };
// 
// //锟斤拷一锟斤拷锟叫诧拷锟斤拷一锟斤拷锟斤拷元锟斤拷,锟斤拷锟斤拷锟斤拷,锟揭诧拷锟斤拷 锟斤拷锟斤拷 -1
// //锟斤拷锟斤拷:
// //  name : 值
// DataTable.findAt = function(){
// if(arguments.length==2)
// for(var i=0;i<this.length;i++)
// if(this[i][arguments[0]]==arguments[1])
// return i;
// else
// for(var i=0;i<this.length;i++)
// if(this[i][this.key]==arguments[0])
// return i;	
// return -1;
// 			
// };	
// 		
// DataTable.xtype = "playDataTable";		
// //锟斤拷锟斤拷一锟斤拷锟斤拷元锟斤拷,锟斤拷锟斤拷锟斤拷锟斤拷锟斤拷锟斤拷(锟斤拷,锟斤拷),锟揭诧拷锟斤拷 锟斤拷锟斤拷 (-1,-1)
// //锟斤拷锟斤拷:
// //  value : 值
// DataTable.searchOf = function(value){
// for(var i=0;i<this.length;i++)
// for(var j=0;j<this[i].length;j++)
// if(this[i][j]==value)
// return [i,j];
// return [-1,-1];
// 			
// };		
// 		
// //删锟斤拷一锟斤拷
// //锟斤拷锟斤拷:
// //  row : 锟斤拷锟斤拷
// DataTable.remove = function(row){
// dataSet._remove(this,row);
// };
// 			
// //删锟斤拷一锟斤拷锟斤拷
// //锟斤拷锟斤拷:
// //  row : 锟斤拷锟斤拷
// DataTable.removeAt = function(row){
// dataSet._removeAt(this,row);
// };
// 			
// //锟斤拷锟斤拷一锟斤拷锟斤拷锟斤拷锟角凤拷锟斤拷锟?		// //锟斤拷锟斤拷:
// //  table : 锟斤拷锟斤拷
// DataTable.search = function(row){
// return !!this[row];
// }
// 		
// //锟斤拷锟斤拷锟斤拷,锟斤拷锟斤拷锟斤拷锟斤拷
// // 锟斤拷锟斤拷:
// //  锟叫碉拷锟斤拷锟斤拷
// //   值 锟斤拷锟斤拷锟角讹拷锟脚革拷锟斤拷锟斤拷值,锟斤拷json,锟斤拷锟斤拷锟斤拷,playDataRow
// DataTable.add = function(row,value){
// if(!value){
// return this.insert("",row);
// }else{
// return this.insert(row,value);
// }
// }
// 		
// DataTable.forEach = function(row,f){
// if(!f){
// f = row;
// row = this.key  ;
// }
// 			
// for(var i=0;i<this.length;i++)
// f(this[i][row],i,row);
// 			
// 		
// }
// 		
// //锟斤拷锟斤拷锟斤拷锟揭伙拷锟?没锟斤拷 null
// DataTable.getAt = function(x){
// return dataSet._getAt(x);
// }
// 
// 
// //锟斤拷锟斤拷  (冒锟斤拷)
// //锟斤拷锟斤拷: name id锟斤拷锟斤拷锟斤拷
// //  row  name bool f 
// DataTable.sort = function(row,f,bool,start,end){
// row = row || this.key;
// fn = typeof f=="function"?f:function(x,y){return x<y};
// if(bool===false) fn = function(x,y){return !fn(x,y)};
// start = start || 0;
// end = end || this.length;
// var tmp;
// for(var i=start;i< end;i++){
// for(var j=i+1;j<end;j++)
// if(!fn(this[i][row],this[j][row])){
// tmp = 	this[j][row];
// this[j][row] = this[i][row];
// this[i][row] = tmp;
// }
// }
// }
// 
// //锟斤拷一锟斤拷<table>锟斤拷签锟斤拷锟斤拷锟斤拷锟斤拷
// DataTable.container = function(id){
// id = typeof id=="string"?document.getElementById(id):id;
// if(id.tagName.toUpperCase()!="TABLE") return;
// for(var i=0;i<id.row.length();i++)
// for(var j=0;j<id.row[i].cell.length();j++)
// this[i][j] = id.row[i].cell[j].innerHTML;
// }
// 
// 
// 
// //写锟斤拷一锟斤拷<table>锟斤拷签
// DataTable.render = function(id){
// id = typeof id=="string"?document.getElementById(id):id;
// var sHTML="  <tr>\n";
// sHTML  += "    <th>";
// sHTML  += this.title.join("&nbsp;</th><th>");
// sHTML  += "    </th>\n";
// sHTML  += "  </tr>\n";
// sHTML  += "\n";			
// sHTML  += "  \n";			
// for(var i=0;i<this.length;i++){
// sHTML  += "  <tr>\n   <td>";
// sHTML  += this[i].join("&nbsp;</td><td>");
// sHTML  += "   </td>\n  </tr>\n";
// }	
// sHTML = "<table id=\"" + this.name + "\">" + sHTML + "</table>"
// id.innerHTML = sHTML;
// }
// 
// DataTable.create = function(){
// var n = this.name+"_v";
// document.write("<div id=\"" + n + "\"></div>")
// DataTable.render(n);
// }
// 
// 
// //锟斤拷锟斤拷锟斤拷锟斤拷锟斤拷id锟斤拷
// //锟斤拷锟斤拷: name id锟斤拷锟斤拷锟斤拷
// DataTable.autoID = function(name,start,row){
// name = name || "ID";
// this.addTitleAt(row || 0,name);
// start = start || 1;
// for(var i=0;i<this.length;i++)
// this[i].insertAt(0,name,start+i);
// }
// 		
// //锟斤拷锟斤拷锟斤拷
// DataTable.key = 0;
// 		
// 		
// return DataTable;
// };
// 	
// playDataColumn = function(name,vals,parent){
// var DataColumn = new Array();
// 		
// DataColumn.key = 0;
// 		
// DataColumn.name = name;
// 		
// DataColumn.xtype = "playDataColumn";
// 		
// DataColumn.sorted = false;
// 		
// DataColumn.parnet = parent;
// 		
// DataColumn.show = true,
// 		
// DataColumn.add = function(value){
// dataSet._load(this,value); 
// }
// 	
// DataColumn.insert = function(value,values){
// return dataSet._insert(this,value,values); 	
// }
// 		
// //锟斤拷一锟斤拷位锟矫诧拷锟斤拷锟斤拷
// //锟斤拷锟斤拷:
// //  row : 锟斤拷锟斤拷
// //  value : 锟斤拷锟斤拷
// DataColumn.insertAt = function(row,value,values){
// return dataSet._insertAt(this,row,value,values);
// };
// 
// //锟斤拷锟斤拷锟叫诧拷锟斤拷值,锟斤拷锟斤拷锟斤拷锟斤拷,锟揭诧拷锟斤拷 锟斤拷锟斤拷 -1
// //锟斤拷锟斤拷:
// //  name : 锟斤拷锟斤拷
// DataColumn.indexOf = function(name){
// return dataSet._indexOf(this,name);
// 			
// };
// 		
// //锟斤拷锟斤拷锟斤拷锟矫碉拷锟斤拷一锟斤拷锟斤拷锟斤拷锟斤拷锟斤拷位锟矫碉拷值
// //锟斤拷锟斤拷:
// //  value : 值
// DataColumn.getAt = function(value){
// return dataSet._getAt(this,value); 
// 			
// 			
// };		
// 		
// //删锟斤拷一锟斤拷
// //锟斤拷锟斤拷:
// //  row : 锟斤拷锟斤拷
// DataColumn.remove = function(row){
// dataSet._remove(this,row);
// };
// 			
// //删锟斤拷一锟斤拷
// //锟斤拷锟斤拷:
// //  table : 锟斤拷锟斤拷
// DataColumn.removeAt = function(row){
// dataSet._removeAt(this,row);
// };
// 		
// DataColumn.loadData = function(vals){
// dataSet._load(this,vals);
// }
// //锟斤拷锟斤拷锟斤拷锟角凤拷锟斤拷锟?		// //锟斤拷锟斤拷:
// //  table : 锟斤拷锟斤拷
// DataColumn.search = function(row){
// return !!this[row];
// 			
// }	
// 		
// DataColumn.loadData(vals);
// return DataColumn;
// 		
// }
// 	
// function isArray(a){
// return typeof a == "object" && (a.constructor ==Array || typeof a.sort=="function" && !isNaN(a.length)) && !a.xtype;
// 		
// }
// //锟斤拷锟揭伙拷锟?   // playDataRow = function(name,vals,parent){
// 	  
// var DataRow = new Array();
// 		
// DataRow.xtype = "playDataRow";
// 		
// DataRow.title = parent.title;
// //锟斤拷锟斤拷
// DataRow.name = name;
// 		
// DataRow.parent = parent;
// 		
// DataRow.sorted = false;
// 		
// DataRow.show = true,
// 		
// //锟斤拷锟斤拷锟叫碉拷末尾
// //锟斤拷锟斤拷:
// //  value : 锟斤拷锟斤拷
// DataRow.insert = function(value,values){
// return dataSet._insert(this,value,values);
// };
// 		
// //锟斤拷一锟斤拷位锟矫诧拷锟斤拷锟斤拷
// //锟斤拷锟斤拷:
// //  row : 锟斤拷锟斤拷
// //  value : 锟斤拷锟斤拷
// DataRow.insertAt = function(row,value,values){
// return dataSet._insertAt(this,row,value,values);
// };
// 
// //锟斤拷锟诫到一锟斤拷锟斤拷锟斤拷
// DataRow.loadData =function(value){
// dataSet._load(this,value);
// };
// 		
// //锟斤拷媳锟斤拷锟?		// DataRow.bind = function(v){
// for(var i=0;i<v.length;i++)
// this[v[i]] = this[i];
// 			
// }
// 		
// //锟斤拷锟斤拷锟叫诧拷锟斤拷值,锟斤拷锟斤拷锟斤拷锟斤拷,锟揭诧拷锟斤拷 锟斤拷锟斤拷 -1
// //锟斤拷锟斤拷:
// //  name : 锟斤拷锟斤拷
// DataRow.indexOf = function(name){
// return dataSet._indexOf(this,name);
// 			
// };
// 	
// //锟斤拷锟斤拷锟斤拷锟矫碉拷锟斤拷一锟斤拷锟斤拷锟斤拷锟斤拷锟斤拷位锟矫碉拷值
// //锟斤拷锟斤拷:
// //  value : 值
// DataRow.getAt = function(value){
// return dataSet._getAt(this,value); 
// 			
// 			
// };		
// 		
// //删锟斤拷一锟斤拷
// //锟斤拷锟斤拷:
// //  row : 锟斤拷锟斤拷
// DataRow.remove = function(row){
// dataSet.remove(this,row);
// };
// 			
// //删锟斤拷一锟斤拷
// //锟斤拷锟斤拷:
// //  table : 锟斤拷锟斤拷
// DataRow.removeAt = function(row){
// dataSet.removeAt(this,row);
// };
// 			
// //锟斤拷锟斤拷锟斤拷锟角凤拷锟斤拷锟?		// //锟斤拷锟斤拷:
// //  table : 锟斤拷锟斤拷
// DataRow.search = function(row){
// return !!this[row];
// 			
// }
// 		
// //锟斤拷锟斤拷锟斤拷
// DataRow.key = 0;
// 		
// DataRow.loadData(vals);
// 		
// DataRow.bind(DataRow.title);
// 		
// return DataRow;
// };
// }


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
    ownerTable: null,

    ///	<summary>
    ///	构造函数。
    ///	</summary>
    /// <params name="array" type="Array">内容。如果不需要可等于 null。</params>
    /// <params name="ownerTable" type="DataTable">所在的表格。</params>
    constructor: function (array, ownerTable) {

        //assert(array == null || Array.isArray(array),"用于生成 dataRow 的参数 array必须是null或数组");

        if (array != null)
            array.cloneTo(this);
        this.ownerTable = ownerTable;
    },

    ///	<summary>
    ///	xtype。
    ///	</summary>
    /// <type name="String" />
    /// <const />
    xtype: "DataRow",

    ///	<summary>
    ///	结合标题。
    ///	</summary>
    titleBind: function () {

        //assert(this.ownerTable,"结合标题时必须指定行的所在表");

        var title = this.ownerTable.title;
        for (var i = title.length; i > 0; i--)
            this[title[i]] = this[i];

    },

    ///	<summary>
    ///	在一个位置插入列。
    ///	</summary>
    /// <params name="value" type="Object">内容。</params>
    insert: Array.prototype.push,

    ///	<summary>
    ///	获取或设置行的某一列的值。
    ///	</summary>
    /// <params name="title" type="Number">列位置。</params>
    /// <params name="title" type="String">列名。</params>
    /// <params name="value" type="Object">内容。</params>
    /// <returns type="Object">内容</returns>
    valueAt: function (title, value) {

        //assert(typeof title == "number" || this.ownerTable,"通过标题时必须指定行的所在表");

        var index = typeof title == "number" ? title : this.ownerTable.title.indexOf(value);

        if (typeof value != "undefined")
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
    name: null,

    ///	<summary>
    ///	标题。
    ///	</summary>
    /// <type name="DataRow" />
    title: null,

    ///	<summary>
    ///	主键。
    ///	</summary>
    /// <type name="String" />
    key: null,

    ///	<summary>
    ///	当前排序列。默认null。
    ///	</summary>
    /// <type name="String" />
    sortBy: null,

    ///	<summary>
    ///	构造函数。
    ///	</summary>
    constructor: function (value, name, key) {
        // [null,""]  ->标题

        //assert(value == null || Array.isArray(value),"初始化表格的value必须是数组或null值");

        if (value == null) return;
        if (value.length || !Array.isArray(value[0]))  //二维数组
            value = [value];
        var me = this;
        value.each(function (v, index) { me[index] = new DataRow(v, this); });

        me.title = me[0] || new DataRow(null, me);

        me.name = name;

        me.key = key || (me.title.length ? null : me.title[0]);

    },

    ///	<summary>
    ///	生成一个新行。
    ///	</summary>
    /// <params name="value" type="Array">内容。</params>
    /// <params name="index" type="Number">位置。默认末尾。</params>
    /// <returns type="DataRow">新行</returns>
    newRow: function (value, index) {
        var a = new DataRow(value, this);
        this.insertAt(a, index);
        return a;
    },

    ///	<summary>
    ///	xtype。
    ///	</summary>
    /// <type name="String" />
    /// <const />
    xtype: "DataTable",

    ///	<summary>
    ///	设置所有内容。
    ///	</summary>
    /// <params name="value" type="Object">内容。</params>
    setValue: function (value) {
        for (var i = 0, l = this.length; i < l; i++)
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
    sort: function (row, f, bool, start, end) {

        //设置建
        this.sortBy = row = row || this.key;

        //设置排序委托
        f = typeof f == "function" ? f : function (x, y) { return x < y };

        //是否倒序
        var fn = bool === false ? function (x, y) { return !f(x, y) } : f;

        //位置
        start = start || 0;
        end = end || this.length;
        var tmp;
        for (var i = start; i < end; i++) {
            for (var j = i + 1; j < end; j++)
                if (!fn(this[i][row], this[j][row])) {
                    tmp = this[j][row];
                    this[j][row] = this[i][row];
                    this[i][row] = tmp;
                }
        }

    }


});


var DataRow = JPlus.Data.DataRow;
var DataTable = JPlus.Data.DataTable;
