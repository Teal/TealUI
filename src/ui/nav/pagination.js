/**
 * @author xuld
 */


include("ui/core/base.js");


var Pagination = Control.extend({

    pageCount: 1,

    xtype: 'pagination',

    tpl: '<ul class="x-control"></ul>',

    onClick: function (e) {
        var page = e.getTarget().getAttr('data-pagination');
        if (page) {
            this.update(page);
            this.trigger('change', page);
        }
        return false;
    },

    init: function () {
        this.update(1);
        this.on('click', this.onClick);
    },

    update: function (value) {
        if (value <= 0 || value > this.pageCount)
            return;

        var html = '';

        if (currentPage === 0) {
            html += '<li class="x-pagination-disabled x-pagination-first"><a href="#" title="上一页">«</a></li>';
        } else {
            html += '<li class="x-pagination-first"><a href="#" title="上一页" data-pagination="1">«</a></li>';
        }

        var left = 1, right = this.pageCount;

        for (var i = left; i < currentPage; i++) {
            html += '<li><a href="#" data-pagination="' + i + '">' + i + '</a></li>';
        }

        html += '<li class="x-pagination-selected"><span>' + currentPage + '</span></li>';

        for (var i = currentPage + 1; i < right; i++) {
            html += '<li><a href="#" data-pagination="' + i + '">' + i + '</a></li>';
        }

        this.node.innerHTML = html;

    }

});