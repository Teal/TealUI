


var Palette = Control.extend({

    /**
     * 当用户点击某一项时执行。
     * @param {Dom} item 正在被点击的项。
     * @protected virtual
     */
    onItemClick: function (item) {

        // 如果此项是允许点击的。则生成新的日期对象，并设置为当前值。
        if (!item.hasClass('x-monthcalender-disabled')) {
            this.selectItem(item);
        }

        return false;
    },

    /**
     * 模拟用户选中某一项。
     * @param {Dom} item 需要选中的项。
     */
    selectItem: function (item) {

        // 根据 item 取得 value 。
        var value = new Date(this.displayedValue.getFullYear(), this.displayedValue.getMonth(), parseInt(item.getText()));

        // 如果允许选中。
        if (this.trigger('selecting', value)) {

            // 获取原值。
            var oldValue = this.getValue();

            // 设置值。
            this.setValue(value);

            // 检测值是否改变。
            if (value - oldValue > 0) {
                this.trigger('change');
            }

        }

        return this;

    },

    /**
     * 设置当前日历的值。
     * @param {Date} value 要设置的值。
     */
    setValue: function (value) {

        // 设置值。
        this.value = value;


        if (this._isPopup) {
            this.element.val(c)
                .next().attr('style', 'background-color:' + c);
        } else {
            this._setColorInd(c, 1);
        }
        if (this.options.history && this._paletteIdx > 0) {
            this._add2History(c);
        }
        this.element.trigger('change.color', c);

        return this;
    },

    /**
     * 获取当前日历的值。
     */
    getValue: function (fn) {
        return this.value;
    },

    /**
     * 切换当前显示的界面。
     */
    setView: function (view) {
        
    },

    _create: function () {
        this._paletteIdx = 1;
        this._id = 'evo-cp' + _idx++;
        this._enabled = true;
        var that = this;
        switch (this.element.get(0).tagName) {
            case 'INPUT':
                var color = this.options.color,
                    e = this.element;
                this._isPopup = true;
                this._palette = null;
                if (color != null) {
                    e.val(color);
                } else {
                    var v = e.val();
                    if (v != '') {
                        color = this.options.color = v;
                    }
                }
                e.addClass('colorPicker ' + this._id)
                    .wrap('<div style="width:' + (this.element.width() + 32) + 'px;'
                        + (isIE ? 'margin-bottom:-21px;' : '')
                        + ($.browser.mozilla ? 'padding:1px 0;' : '')
                        + '"></div>')
                    .after('<div class="evo-colorind' + ($.browser.mozilla ? '-ff' : _ie) + '" ' +
                        (color != null ? 'style="background-color:' + color + '"' : '') + '></div>')
                    .on('keyup onpaste', function (evt) {
                        var c = $(this).val();
                        if (c != that.options.color) {
                            that._setValue(c, true);
                        }
                    });
                var showOn = this.options.showOn;
                if (showOn == 'both' || showOn == 'focus') {
                    e.on('focus', function () {
                        that.showPalette();
                    })
                }
                if (showOn == 'both' || showOn == 'button') {
                    e.next().on('click', function (evt) {
                        evt.stopPropagation();
                        that.showPalette();
                    });
                }
                break;
            default:
                this._isPopup = false;
                this._palette = this.element.html(this._paletteHTML())
                    .attr('aria-haspopup', 'true');
                this._bindColors();
        }
        if (color != null && this.options.history) {
            this._add2History(color);
        }
    },

    _paletteHTML: function () {
        var h = [], pIdx = this._paletteIdx = Math.abs(this._paletteIdx),
            opts = this.options,
            labels = opts.strings.split(',');
        h.push('<div class="evo-pop', _ie, ' x-widget x-widget-content x-corner-all"',
            this._isPopup ? ' style="position:absolute"' : '', '>');
        h.push('<span>', this['_paletteHTML' + pIdx](), '</span>');
        h.push('<div class="evo-more"><a href="javascript:void(0)">', labels[1 + pIdx], '</a>');
        if (opts.history) {
            h.push('<a href="javascript:void(0)" class="evo-hist">', labels[5], '</a>');
        }
        h.push('</div>');
        h.push(this._colorIndHTML(this.options.color, 'left'), this._colorIndHTML('', 'right'));
        h.push('</div>');
        return h.join('');
    },

    _colorIndHTML: function (c, fl) {
        var h = [];
        h.push('<div class="evo-color" style="float:left"><div style="');
        h.push(c ? 'background-color:' + c : 'display:none');
        if (isIE) {
            h.push('" class="evo-colorboui-ie"></div><span class=".evo-colortxt-ie" ');
        } else {
            h.push('"></div><span ');
        }
        h.push(c ? '>' + c + '</span>' : '/>');
        h.push('</div>');
        return h.join('');
    },

    _paletteHTML1: function () {
        var h = [], labels = this.options.strings.split(','),
            oTD = '<td style="background-color:#',
            cTD = isIE ? '"><div style="width:2px;"></div></td>' : '"><span/></td>',
            oTRTH = '<tr><th colspan="10" class="x-widget-content">';
        // base theme colors
        h.push('<table class="evo-palette', _ie, '">', oTRTH, labels[0], '</th></tr><tr>');
        for (var i = 0; i < 10; i++) {
            h.push(oTD, baseThemeColors[i], cTD);
        }
        h.push('</tr>');
        if (!isIE) {
            h.push('<tr><th colspan="10"></th></tr>');
        }
        h.push('<tr class="top">');
        // theme colors
        for (var i = 0; i < 10; i++) {
            h.push(oTD, subThemeColors[i], cTD);
        }
        for (var r = 1; r < 4; r++) {
            h.push('</tr><tr class="in">');
            for (var i = 0; i < 10; i++) {
                h.push(oTD, subThemeColors[r * 10 + i], cTD);
            }
        }
        h.push('</tr><tr class="bottom">');
        for (var i = 40; i < 50; i++) {
            h.push(oTD, subThemeColors[i], cTD);
        }
        h.push('</tr>', oTRTH, labels[1], '</th></tr><tr>');
        // standard colors
        for (var i = 0; i < 10; i++) {
            h.push(oTD, standardColors[i], cTD);
        }
        h.push('</tr></table>');
        return h.join('');
    },

    _paletteHTML2: function () {
        function toHex(i) {
            var h = i.toString(16);
            if (h.length == 1) {
                h = '0' + h;
            }
            return h + h + h;
        };
        var h = [],
            oTD = '<td style="background-color:#',
            cTD = isIE ? '"><div style="width:5px;"></div></td>' : '"><span/></td>',
            oTableTR = '<table class="evo-palette2' + _ie + '"><tr>',
            cTableTR = '</tr></table>';
        h.push('<div class="evo-palcenter">');
        // hexagon colors
        for (var r = 0, rMax = moreColors.length; r < rMax; r++) {
            h.push(oTableTR);
            var cs = moreColors[r];
            for (var i = 0, iMax = cs.length; i < iMax; i++) {
                h.push(oTD, cs[i], cTD);
            }
            h.push(cTableTR);
        }
        h.push('<div class="evo-sep"/>');
        // gray scale colors
        var h2 = [];
        h.push(oTableTR);
        for (var i = 255; i > 10; i -= 10) {
            h.push(oTD, toHex(i), cTD);
            i -= 10;
            h2.push(oTD, toHex(i), cTD);
        }
        h.push(cTableTR, oTableTR, h2.join(''), cTableTR);
        h.push('</div>');
        return h.join('');
    },

    _switchPalette: function (link) {
        if (this._enabled) {
            var labels = this.options.strings.split(',');
            if ($(link).hasClass('evo-hist')) {
                // history
                var h = ['<table class="evo-palette"><tr><th class="x-widget-content">',
                    labels[5], '</th></tr></tr></table>',
                    '<div class="evo-cHist">'];
                if (history.length == 0) {
                    h.push('<p>&nbsp;', labels[6], '</p>');
                } else {
                    for (var i = history.length - 1; i > -1; i--) {
                        h.push('<div style="background-color:', history[i], '"></div>');
                    }
                }
                h.push('</div>');
                var idx = -this._paletteIdx,
                    content = h.join(''),
                    label = labels[4];
            } else {
                // palette
                if (this._paletteIdx < 0) {
                    var idx = -this._paletteIdx;
                    this._palette.find('.evo-hist').show();
                } else {
                    var idx = (this._paletteIdx == 2) ? 1 : 2;
                }
                var content = this['_paletteHTML' + idx](),
                    label = labels[idx + 1];
                this._paletteIdx = idx;

            }
            this._paletteIdx = idx;
            var e = this._palette.find('.evo-more')
                .prev().html(content).end()
                .children().eq(0).html(label);
            if (idx < 0) {
                e.next().hide();
            }
        }
    },

    _bindColors: function () {
        var es = this._palette.find('div.evo-color'),
            sel = this.options.history ? 'td,.evo-cHist div' : 'td';
        this._cTxt1 = es.eq(0).children().eq(0);
        this._cTxt2 = es.eq(1).children().eq(0);
        var that = this;
        this._palette
            .on('click', sel, function (evt) {
                if (that._enabled) {
                    that._setValue($(this).attr('style').substring(17));
                }
            })
            .on('mouseover', sel, function (evt) {
                if (that._enabled) {
                    var c = $(this).attr('style').substring(17);
                    that._setColorInd(c, 2);
                    that.element.trigger('mouseover.color', c);
                }
            })
            .find('.evo-more a').on('click', function () {
                that._switchPalette(this);
            });
    },

    _setColorInd: function (c, idx) {
        this['_cTxt' + idx].attr('style', 'background-color:' + c)
            .next().html(c);
    },

    _setOption: function (key, value) {
        if (key == 'color') {
            this._setValue(value, true);
        } else {
            this.options[key] = value;
        }
    },

    _add2History: function (c) {
        var iMax = history.length;
        // skip color if already in history
        for (var i = 0; i < iMax; i++) {
            if (c == history[i]) {
                return;
            }
        }
        // limit of 28 colors in history
        if (iMax > 27) {
            history.shift();
        }
        // add to history
        history.push(c);

    }

});

Object.extend(Palette, {

    SimpleView: {

        render: function (palette) {

        }

    },

    FullView: {

        render: function (palette) {

        }

    }


});


(function ($, undefined) {

    var _idx = 0,
        isIE = $.browser.msie,
        _ie = isIE ? '-ie' : '',
        history = [],
        baseThemeColors = ['ffffff', '000000', 'eeece1', '1f497d', '4f81bd', 'c0504d', '9bbb59', '8064a2', '4bacc6', 'f79646'],
        subThemeColors = ['f2f2f2', '7f7f7f', 'ddd9c3', 'c6d9f0', 'dbe5f1', 'f2dcdb', 'ebf1dd', 'e5e0ec', 'dbeef3', 'fdeada',
            'd8d8d8', '595959', 'c4bd97', '8db3e2', 'b8cce4', 'e5b9b7', 'd7e3bc', 'ccc1d9', 'b7dde8', 'fbd5b5',
            'bfbfbf', '3f3f3f', '938953', '548dd4', '95b3d7', 'd99694', 'c3d69b', 'b2a2c7', '92cddc', 'fac08f',
            'a5a5a5', '262626', '494429', '17365d', '366092', '953734', '76923c', '5f497a', '31859b', 'e36c09',
            '7f7f7f', '0c0c0c', '1d1b10', '0f243e', '244061', '632423', '4f6128', '3f3151', '205867', '974806'],
        standardColors = ['c00000', 'ff0000', 'ffc000', 'ffff00', '92d050', '00b050', '00b0f0', '0070c0', '002060', '7030a0'],
        moreColors = [
            ['003366', '336699', '3366cc', '003399', '000099', '0000cc', '000066'],
            ['006666', '006699', '0099cc', '0066cc', '0033cc', '0000ff', '3333ff', '333399'],
            ['669999', '009999', '33cccc', '00ccff', '0099ff', '0066ff', '3366ff', '3333cc', '666699'],
            ['339966', '00cc99', '00ffcc', '00ffff', '33ccff', '3399ff', '6699ff', '6666ff', '6600ff', '6600cc'],
            ['339933', '00cc66', '00ff99', '66ffcc', '66ffff', '66ccff', '99ccff', '9999ff', '9966ff', '9933ff', '9900ff'],
            ['006600', '00cc00', '00ff00', '66ff99', '99ffcc', 'ccffff', 'ccccff', 'cc99ff', 'cc66ff', 'cc33ff', 'cc00ff', '9900cc'],
            ['003300', '009933', '33cc33', '66ff66', '99ff99', 'ccffcc', 'ffffff', 'ffccff', 'ff99ff', 'ff66ff', 'ff00ff', 'cc00cc', '660066'],
            ['333300', '009900', '66ff33', '99ff66', 'ccff99', 'ffffcc', 'ffcccc', 'ff99cc', 'ff66cc', 'ff33cc', 'cc0099', '993399'],
            ['336600', '669900', '99ff33', 'ccff66', 'ffff99', 'ffcc99', 'ff9999', 'ff6699', 'ff3399', 'cc3399', '990099'],
            ['666633', '99cc00', 'ccff33', 'ffff66', 'ffcc66', 'ff9966', 'ff6666', 'ff0066', 'd60094', '993366'],
            ['a58800', 'cccc00', 'ffff00', 'ffcc00', 'ff9933', 'ff6600', 'ff0033', 'cc0066', '660033'],
            ['996633', 'cc9900', 'ff9900', 'cc6600', 'ff3300', 'ff0000', 'cc0000', '990033'],
            ['663300', '996600', 'cc3300', '993300', '990000', '800000', '993333']
        ];

    $.widget("evol.colorpicker", {

        version: '1.1',

        options: {
            color: null, // example default:'#31859B'
            showOn: 'both', // possible values 'focus','button','both'
            history: true,
            strings: 'Theme Colors,Standard Colors,More Colors,Less Colors,Back to Palette,History,No history yet.'
        },

    });

})(jQuery);
