

typeof include === "function" && include("../lang/class");


/**
 * 表示一个表格数据集。
 * @class
 * @extends Base
 */
var DataTable = Base.extend.call(Array, {

    trigger: Base.prototype.trigger,
    on: Base.prototype.on,
    off: Base.prototype.off,
    toString: function () {
        return JSON.stringify(this.slice(0));
    },

    /**
     * 当添加行时回调。
     * @param {Number} index 要添加的行号位置。
     * @param {Object} row 要添加的行。
     * @return {Boolean} 如果返回 @true，则允许添加指定的行，否则不允许。
     * @protected
     * @inner
     */
    onAddRow: function(index, row){
        return this.trigger('add', {index: index, row: row}) && this.onChange();
    },

    /**
     * 当删除行时回调。
     * @param {Number} index 要删除的行号。
     * @param {Number} length 要删除的行数。
     * @return {Boolean} 如果返回 @true，则允许删除指定的行，否则不允许。
     * @protected
     * @inner
     */
    onRemoveRow: function(index, length){
        return this.trigger('remove', {index: index, length: length}) && this.onChange();
    },

    /**
     * 当数据发生改变时回调。
     * @protected
     * @inner
     */
    onChange: function(){
        return this.trigger('change');
    },

    /**
     * 初始化 DataSet 类。
     * @param {Object} [columns] 当前表格的列信息。具体格式如：
     * 
     *      {
     *          a: { // 列名。表格内列应该唯一。
     *              type: 'number', // 列类型，可填写 JavaScript typeof 返回的所有内置类型。
     *              sorter: function(){} // 当前列的排序方案
     *          } // , ...
     *      }
     * 
     * @param {Array} [data] 要处理的原始数据。具体数值应该是和列一一对应的 JSON 对象数组。
     * @constructor
     * @example 
     * new DataTable({
     *     a: { // 列名。表格内列应该唯一。
     *         type: 'number', // 列类型，可填写 JavaScript typeof 返回的所有内置类型。
     *         sorter: function(){} // 当前列的排序方案
     *     } // , ...
     * }, [{
     *      a: 1
     * }, {
     *      a: 2
     * }]);
     */
    constructor: function (columns, data) {
        this.columns = columns || {};
        data && this.set(data);
        /*@cc_on if(!-"\v1"){
         var result = [];
         for(var p in this){
            result[p] = this[p];
         }
         return result; 
        } @*/
    },

    /**
     * 设置当前数据集的所有数据或指定行数据。
     * @param {Number} [index=0] 要更新的行号。
     * @param {Object} row 要更新的新行。
     * @returns this
     * @example 
     * new DataTable().set(2, {});
     * 
     * new DataTable().set([{}]);
     */
    set: function (index, row) {
        if(index != null && index.constructor === Number && this.onRemoveRow(index, 1) && this.onAddRow(index, row)) {
            this[index] = row;
            if(index + 1 > this.length) {
                this.length = index + 1;
            }
        } else {
            this.clear().add.apply(this, index);
        }
        return this;
    },

    /**
     * 在当前数据表添加一行。
     * @param {Number} [index=0] 要添加的行号。
     * @param {Object} row 要添加的行。
     * @param {Object} ... 要添加的行。
     * @returns {Number} 返回最新的长度。
     * @example new DataTable().add([1, 2, 3])
     */
    add: function (index, row) {

        // 判断是否包含位置标记。
        var firstRowArgIndex = 0;
        if (typeof index === "number") {
            firstRowArgIndex = 1;
        }
        for(; firstRowArgIndex < arguments.length; firstRowArgIndex++)
            if(this.onAddRow(firstRowArgIndex ? index : this.length, arguments[firstRowArgIndex]))
                firstRowArgIndex ? this.splice(index++, 0, arguments[firstRowArgIndex]) : this.push(arguments[firstRowArgIndex]);

        return this.length;
    },

    /**
     * 删除一行数据。
     * @param {mixed} row 要删除的行号或行本身。
     * @param {Number} [length=1] 要删除的行数。
     * @returns {Array} 返回本次被删除的行组成的数组。如果未删除则返回空数组。
     * @example new DataTable().remove(1)
     */
    remove: function (row, length) {
        length = length == undefined ? 1 : length;
        // 将行内容转为行号。
        if (typeof row !== "number") {
            row = this.indexOf(row);
        }
        return this.onRemoveRow(row, length) ? this.splice(row, length) : [];
    },

    /**
     * 清空当前表格的所有行。
     * @returns this
     * @example new DataTable().clear()
     */
    clear: function(){
        if(this.onRemoveRow(0, this.length)) {
            this.length = 0;
        }
        return this;
    },

    /**
     * 获取指定列或全部列的所有值。
     * @param {mixed} [column] 要获取的列名或列号。如果不设置列，则获取全部列的值。
     * @return {Array} 返回指定列或全部列的值。
     * @example new DataTable().values("columnName")
     */
    values: function (column) {

        // 未指定列名获取所有数据。
        if(column == undefined) {
            return this.slice(0);
        }

        // 选出指定列的值。
        column = this.columns[column];
        var result = [];
        for(var i = 0; i < this.length; i++) {
            result.push(this[i][column.name]);
        }
        return result;
    },

    /**
     * 对当前表进行排序。
     * @param  {mixed} column 排序的列或排序方法。
     * @return this
     * @example
     * ##### 按列名排序
     * new DataTable().sort('columnName')
     * ##### 按自定义排序
     * new DataTable().sort(function(x, y){ return x.id > y.id })
     */
    sort: function(column){

        // 根据列排序。
        if(column != null && column.constructor !== Function) {
            var col = this.columns[column];
            column = col && (col.sorter ? function(x, y){
                return col.sorter(x[col.name], y[col.name]);
            } : function(x, y){
                return x[col.name] - y[col.name];
            });
        }
        
        Array.prototype.sort.call(this, column);
        this.set(this.slice(0));
        return this;
    }

});
