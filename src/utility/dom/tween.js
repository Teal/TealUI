/**
 * @fileOverview 基于 JavaScript 实现 DOM 特效。
 * @author xuld@vip.qq.com
 */

typeof include === "function" && include("../misc/fx.js");
typeof include === "function" && include("dom/dom.js");

/**
 * 表示一个补间动画。
 * @param {Dom} dom 执行动画的目标节点。 
 * @param {Object} options 动画的相关参数。
 * @class
 */
function Tween(dom) {
    this.dom = Dom(dom);
}

Dom.roles.tween = Tween;

Tween.prototype = new Fx();

Tween.prototype.constructor = Tween;

/**
 * 生成当前变化所进行的初始状态。
 * @param {Object} options 开始。
 * @protected override
 */
Tween.prototype.init = function (options) {
    var me = this;
    Fx.prototype.init.call(this, options);
    
    // 存储解析后的渐变信息。
    me.current = {};

    // 处理每个 CSS 属性。
    var enginesCache = Tween._enginesCache || (Tween._enginesCache || {});
    for (var cssPropertyName in me.params) {
        
        var to = me.params[cssPropertyName];

        // 获取针对当前 CSS 属性的补间动画。
        var engine = enginesCache[cssPropertyName];

        // 如果未缓存过此属性的补间动画则重新生成。
        if (!engine) {
            for (engine in Tween.engines) {
                if (engine.support(cssPropertyName, to)) {
                    enginesCache[cssPropertyName] = engine;
                    break;
                }
            }
        }

        var from;
        var part;
        
        // 支持 +=x -=y 或 a-b 格式。
        if (typeof value === 'string') {
            part = /^([+-]=|(.+?)-)(.*)$/.exec(value);
            if (part) {
                from = part[2] ? engine.parse(part[2]) : engine.get(me.dom, key);
                to = engine.parse(part[3]);
            }
        }

        if (!part) {
            from = engine.get(me.dom, key);
            to = engine.parse(value);
        }

        me.current[cssPropertyName] = {
            engine: engine,
            from: from,
            to: to
        }
    }

};

/**
 * 根据指定变化量设置值。
 * @param {Number} delta 变化量。 0 - 1 。
 * @protected override
 */
Tween.prototype.set = function (delta) {
    var me = this;
    // 对当前每个需要执行的特效进行重新计算并赋值。
    for (var key in me.current) {
        var current = me.current[key];
        current.engine.set(me.dom, key, current.engine.compute(current.from, current.to, delta));
    }
};

/**
 * 默认的补间动画的引擎。 
 */
Tween.engines = {

    scroll: {
        support: function (key) {
            return /^scroll(Top|Left)/i.test(key);
        },
        get: function(dom, key) {
            return dom.scroll()[/p$/.test(key) ? "top" : "left"];
        },
        set: function(dom, key, value) {
            var obj = {};
            obj[/p$/.test(key) ? "top" : "left"] = value;
            dom.scroll(obj);
        }
    },

    color: {
	
        set: Fx.numberTweener.set,
	
        compute: function(from, to, delta){
            var compute = Fx.numberTweener.compute,
                r = [
                    Math.round(compute(from[0], to[0], delta)),
                    Math.round(compute(from[1], to[1], delta)),
                    Math.round(compute(from[2], to[2], delta))
                ],
                i = 0;
		
            while(i < 3) {
                delta = r[i].toString(16);
                r[i++] = delta.length === 1 ? '0' + delta : delta;
            }
            return '#' + r.join('');
        },
	
        parse: function(value){
            if(value === 'transparent')
                return [255, 255, 255];
            var i, r, part;
		
            if(part = /^#([\da-f]{1,2})([\da-f]{1,2})([\da-f]{1,2})$/i.exec(value)){
                i = 0;
                r = [];
                while (++i <= 3) {
                    value = part[i];
                    r.push(parseInt(value.length == 1 ? value + value : value, 16));
                }
            } else if(part = /(\d+),\s*(\d+),\s*(\d+)/.exec(value)){
                i = 0;
                r = [];
                while (++i <= 3) {
                    r.push(parseInt(part[i]));
                }
            }
		
            return r;
        },
	
        get: function(elem, name){
            return this.parse(Dom.styleString(elem, name));
        }

    },

    number: {
        get: Dom.clac,

        /**
         * 常用计算。
         * @param {Object} from 开始。
         * @param {Object} to 结束。
         * @param {Object} delta 变化。
         */
        compute: function (from, to, delta) {
            return (to - from) * delta + from;
        },

        parse: function (value) {
            return typeof value == "number" ? value : parseFloat(value);
        },

        set: function (elem, name, value) {
            Dom.css(elem, name, value);
        }
    }

};


Dom.prototype.tween = function (params, duration, callback, link) {
    return this.role('tween', {
        params: params,
        duration: duration,
        callback: callback,
        link: link
    });
};


/**
 * 系统的颜色
 * @author xuld@vip.qq.com
 */

typeof include === "function" && include("fx/color.js");

Object.extend(Fx.defaultTweeners[0], {
	
    // Some named colors to work with
    // From Interface by Stefan Petre
    // http://interface.eyecon.ro/

    color: {
        aqua:[0,255,255],
        azure:[240,255,255],
        beige:[245,245,220],
        black:[0,0,0],
        blue:[0,0,255],
        brown:[165,42,42],
        cyan:[0,255,255],
        darkblue:[0,0,139],
        darkcyan:[0,139,139],
        darkgrey:[169,169,169],
        darkgreen:[0,100,0],
        darkkhaki:[189,183,107],
        darkmagenta:[139,0,139],
        darkolivegreen:[85,107,47],
        darkorange:[255,140,0],
        darkorchid:[153,50,204],
        darkred:[139,0,0],
        darksalmon:[233,150,122],
        darkviolet:[148,0,211],
        fuchsia:[255,0,255],
        gold:[255,215,0],
        green:[0,128,0],
        indigo:[75,0,130],
        khaki:[240,230,140],
        lightblue:[173,216,230],
        lightcyan:[224,255,255],
        lightgreen:[144,238,144],
        lightgrey:[211,211,211],
        lightpink:[255,182,193],
        lightyellow:[255,255,224],
        lime:[0,255,0],
        magenta:[255,0,255],
        maroon:[128,0,0],
        navy:[0,0,128],
        olive:[128,128,0],
        orange:[255,165,0],
        pink:[255,192,203],
        purple:[128,0,128],
        violet:[128,0,128],
        red:[255,0,0],
        silver:[192,192,192],
        white:[255,255,255],
        yellow:[255,255,0],
        transparent: [255,255,255]
    },
	
    _parse: Fx.defaultTweeners[0].parse,
	
    parse: function(value){
        return this.color[value] || this._parse(value);
    }

});

/**
 * @author xuld@vip.qq.com
 */

typeof include === "function" && include("fx/tween.js");

(function () {

    var opacity0 = {
        opacity: 0
    },

        displayEffects = Fx.displayEffects = {
            opacity: function (options, elem) {
                return opacity0;
            }
        },

		toggle = Dom.prototype.toggle,

		shift = Array.prototype.shift,

		height = 'height marginTop paddingTop marginBottom paddingBottom';

    function fixProp(options, elem, prop) {
        options.orignal[prop] = elem.style[prop];
        elem.style[prop] = Dom.styleNumber(elem, prop) + 'px';
    }

    Object.each({
        all: height + ' opacity width',
        height: height,
        width: 'width marginLeft paddingLeft marginRight paddingRight'
    }, function (value, key) {
        value = Object.map(value, this, {});

        displayEffects[key] = function (options, elem, isShow) {

            // 修复 overflow 。
            options.orignal.overflow = elem.style.overflow;
            elem.style.overflow = 'hidden';

            // inline 元素不支持 修改 width 。
            if (Dom.styleString(elem, 'display') === 'inline') {
                options.orignal.display = elem.style.display;
                elem.style.display = 'inline-block';
            }

            // 如果是 width, 固定 height 。
            if (key === 'height') {
                fixProp(options, elem, 'width');
            } else if (key === 'width') {
                fixProp(options, elem, 'height');
            }

            return value;
        };
    }, function () {
        return 0;
    });

    Object.map('Left Right Top Bottom', function (key, index) {
        displayEffects[key.toLowerCase()] = function (options, elem, isShow) {

            // 将父元素的 overflow 设为 hidden 。
            elem.parentNode.style.overflow = 'hidden';

            var params = {},
				fromValue,
				toValue,
				key2,
				delta;

            if (index <= 1) {
                key2 = index === 0 ? 'marginRight' : 'marginLeft';
                fromValue = -elem.offsetWidth - Dom.styleNumber(elem, key2);
                toValue = Dom.styleNumber(elem, key);
                params[key] = isShow ? (fromValue + '-' + toValue) : (toValue + '-' + fromValue);

                fixProp(options, elem, 'width');
                delta = toValue - fromValue;
                toValue = Dom.styleNumber(elem, key2);
                fromValue = toValue + delta;
                params[key2] = isShow ? (fromValue + '-' + toValue) : (toValue + '-' + fromValue);

            } else {
                key2 = index === 2 ? 'marginBottom' : 'marginTop';
                fromValue = -elem.offsetHeight - Dom.styleNumber(elem, key2);
                toValue = Dom.styleNumber(elem, key);
                params[key] = isShow ? (fromValue + '-' + toValue) : (toValue + '-' + fromValue);
            }

            return params;

        };
        key = 'margin' + key;

    });

    /**
	 * 初始化 show/hide 的参数。
	 */
    function initArgs(args) {

        // [elem, 300]
        // [elem, 300, function(){}]
        // [elem, 300, function(){}, 'wait']
        // [elem, {}]
        // [elem, [opacity, 300], {}]

        var options = args[1] && typeof args[1] === 'object' ? args[1] : {
            duration: args[1],
            callback: args[2],
            link: args[3]
        }, userArgs = args.args;

        // 允许通过 args 字段来定义默认参数。
        if (userArgs != undefined) {
            if (typeof userArgs === 'object') {
                Object.extend(options, userArgs);
            } else {
                options.duration = userArgs;
            }
        }

        // 默认为 opacity 渐变。
        if (!options.effect) {
            options.effect = 'opacity';
        } else if (options.duration === undefined) {

            // 如果指定了渐变方式又没指定时间，覆盖为默认大小。
            options.duration = -1;
        }

        options.callback = options.callback || Function.empty;

        //assert(Fx.displayEffects[options.effect], "Dom#toggle(effect, duration, callback, link): 不支持 {effect} 。", args.effect);


        return options;

    }

    Dom.tween = function (elem) {
        var data = Dom.data(elem);
        return data.$tween || (data.$tween = new Fx.Tween());
    };

    /**
     * 变化到某值。
     * @param {Object} [params] 变化的名字或变化的末值或变化的初值。
     * @param {Number} duration=-1 变化的时间。
     * @param {Function} [oncomplete] 停止回调。
     * @param {String} link='wait' 变化串联的方法。 可以为 wait, 等待当前队列完成。 rerun 柔和转换为目前渐变。 cancel 强制关掉已有渐变。 ignore 忽视当前的效果。
     * @returns this
     */
    Dom.animate = function (elem, params, duration, callback, link) {

        //assert.notNull(params, "Dom#animate(params, duration, oncomplete, link): {params} ~", params);

        if (params.params) {
            link = params.link;
        } else {
            params = {
                params: params,
                duration: duration,
                complete: callback
            };
        }

        params.elem = elem;

        //assert(!params.duration || typeof params.duration === 'number', "Dom#animate(params, duration, callback, link): {duration} 必须是数字。如果需要制定为默认时间，使用 -1 。", params.duration);
        //assert(!params.complete || typeof params.complete === 'function', "Dom#animate(params, duration, callback, link): {callback} 必须是函数", params.complete);

        Dom.tween(elem).run(params, link);
    };

    /**
     * 获取一个标签的默认 display 属性。
     * @param {Element} elem 元素。
     */
    Dom.defaultDisplay = function (elem) {
        var displays = Dom.displays || (Dom.displays = {}),
            tagName = elem.tagName,
            display = displays[tagName],
            iframe,
            iframeDoc;

        if (!display) {

            elem = document.createElement(tagName);
            document.body.appendChild(elem);
            display = Dom.currentStyle(elem, 'display');
            document.body.removeChild(elem);

            // 如果简单的测试方式失败。使用 IFrame 测试。
            if (display === "none" || display === "") {
                iframe = document.body.appendChild(Dom.emptyIframe || (Dom.emptyIframe = Object.extend(document.createElement("iframe"), {
                    frameBorder: 0,
                    width: 0,
                    height: 0
                })));

                // Create a cacheable copy of the iframe document on first call.
                // IE and Opera will allow us to reuse the iframeDoc without re-writing the fake HTML
                // document to it; WebKit & Firefox won't allow reusing the iframe document.
                iframeDoc = (iframe.contentWindow || iframe.contentDocument).document;
                iframeDoc.write("<!doctype html><html><body>");
                iframeDoc.close();

                elem = iframeDoc.body.appendChild(iframeDoc.createElement(tagName));
                display = Dom.currentStyle(elem, 'display');
                document.body.removeChild(iframe);
            }

            displays[tagName] = display;
        }

        return display;
    };

    /**
     * 显示当前元素。
     * @param {String} [params] 显示时使用的特效。如果为 null，则表示无特效。
     * @param {Number} duration=300 特效持续的毫秒数。如果为 null，则表示无特效。
     * @param {Function} [callback] 特效执行完之后的回调。
     * @param {String} link='wait' 如果正在执行其它特效时的处理方式。
     *
     * - "**wait**"(默认): 等待上个效果执行完成。
     * - "**ignore**": 忽略新的效果。
     * - "**stop**": 正常中止上一个效果，然后执行新的效果。
     * - "**abort**": 强制中止上一个效果，然后执行新的效果。
     * - "**replace**": 将老的特效直接过渡为新的特效。
     * @returns this
     */
    Dom.show = function (elem) {
        var args = arguments;
        
        // 加速空参数的 show 调用。
        if (args.length === 1) {

            // 普通元素 设置为 空， 因为我们不知道这个元素本来的 display 是 inline 还是 block
            elem.style.display = '';

            // 如果元素的 display 仍然为 none , 说明通过 CSS 实现的隐藏。这里默认将元素恢复为 block。
            if (Dom.currentStyle(elem, 'display') === 'none')
                elem.style.display = elem.style.defaultDisplay || Dom.defaultDisplay(elem);

        } else {

            args = initArgs(args);

            // 如果 duration === null，则使用同步方式显示。
            if (args.duration == null) {
                Dom.show(elem);
                args.callback.call(elem, false, false);
            } else {
                Dom.tween(elem).run({
                    elem: elem,
                    duration: args.duration,
                    start: function (options, fx) {
                    	
                        var elem = this,
                            t,
                            params,
                            param;

                        // 如果元素本来就是显示状态，则不执行后续操作。
                        if (!Dom.isHidden(elem)) {
                            args.callback.call(elem, true, true);
                            return false;
                        }

                        // 首先显示元素。
                        Dom.show(elem);

                        // 保存原有的值。
                        options.orignal = {};

                        // 新建一个新的 params 。
                        options.params = params = {};

                        // 获取指定特效实际用于展示的css字段。
                        t = Fx.displayEffects[args.effect](options, elem, true);

                        // 保存原有的css值。
                        // 用于在hide的时候可以正常恢复。
                        for (param in t) {
                            options.orignal[param] = elem.style[param];
                        }
		                       
                        // IE6-8 仅支持 filter 设置。 
                        if(navigator.isIE678 && ('opacity' in t)) {
                            options.orignal.filter = elem.style.filter;
                        }

                        // 因为当前是显示元素，因此将值为 0 的项修复为当前值。
                        for (param in t) {
                            if (t[param] === 0) {

                                // 设置变化的目标值。
                                params[param] = Dom.styleNumber(elem, param);

                                // 设置变化的初始值。
                                elem.style[param] = 0;
                            } else {
                                params[param] = t[param];
                            }
                        }
                    },
                    complete: function (isAbort, fx) {
                    	
                        // 拷贝回默认值。
                        Object.extend(this.style, fx.options.orignal);

                        args.callback.call(this, false, isAbort);
                    }
                }, args.link);
            }

        }

    };

    /**
     * 隐藏当前元素。
     * @param {String} effect='opacity' 隐藏时使用的特效。如果为 null，则表示无特效。
     * @param {Number} duration=300 特效持续的毫秒数。如果为 null，则表示无特效。
     * @param {Function} [callback] 特效执行完之后的回调。
     * @param {String} link='wait' 如果正在执行其它特效时的处理方式。
     *
     * - "**wait**"(默认): 等待上个效果执行完成。
     * - "**ignore**": 忽略新的效果。
     * - "**stop**": 正常中止上一个效果，然后执行新的效果。
     * - "**abort**": 强制中止上一个效果，然后执行新的效果。
     * - "**replace**": 将老的特效直接过渡为新的特效。
     * @returns this
     */
    Dom.hide = function (elem) {

        var args = arguments;

        // 加速空参数的 show 调用。
        if (args.length === 1) {

            // 如果已经定义了 defaultDisplay， 直接设置为 none 即可。
            if (elem.style.defaultDisplay) {
                elem.style.display = 'none';
            } else {
                var currentDisplay = Dom.styleString(elem, 'display');
                if (currentDisplay !== 'none') {
                    elem.style.defaultDisplay = currentDisplay;
                    elem.style.display = 'none';
                }
            }
        } else {

            args = initArgs(args);

            // 如果 duration === null，则使用同步方式显示。
            if (args.duration === null) {
                Dom.hide(elem);
                args.callback.call(elem, false, false);
            } else {
                Dom.tween(elem).run({
                    elem: elem,
                    duration: args.duration,
                    start: function (options, fx) {

                        var elem = this,
                            params,
                            param;

                        // 如果元素本来就是隐藏状态，则不执行后续操作。
                        if (Dom.isHidden(elem)) {
                            args.callback.call(elem, false, true);
                            return false;
                        }

                        // 保存原有的值。
                        options.orignal = {};

                        // 获取指定特效实际用于展示的css字段。
                        options.params = params = Fx.displayEffects[args.effect](options, elem, false);
						
                        // 保存原有的css值。
                        // 用于在show的时候可以正常恢复。
                        for (param in params) {
                            options.orignal[param] = elem.style[param];
                        }
		                       
                        // IE6-8 仅支持 filter 设置。 
                        if(navigator.isIE678 && ('opacity' in params)) {
                            delete options.orignal.opacity;
                            options.orignal.filter = elem.style.filter;
                        }

                    },
                    complete: function (isAbort, fx) {

                        var elem = this;

                        // 最后显示元素。
                        Dom.hide(elem);

                        // 恢复所有属性的默认值。
                        Object.extend(elem.style, fx.options.orignal);

                        // callback
                        args.callback.call(elem, false, isAbort);
                    }
                }, args.link);
            }
        }

    };

    Dom.toggle = function (elem) {

        Dom.tween(elem).then(function (args) {
            Dom[Dom.isHidden(elem) ? 'show' : 'hide'].apply(Dom, args);
            return false;
        }, arguments);

    };

    /**
	 * @class Dom
	 */
    Dom.implement({

        animate: function () {
            return this.iterate(Dom.animate, arguments);
        },

        show: function () {
            return this.iterate(Dom.show, arguments);
        },

        hide: function () {
            return this.iterate(Dom.hide, arguments);
        },

        toggle: function () {
            return this.iterate(Dom.toggle, arguments);
        }

    });

})();


// 如果是纯数字属性，使用 numberParser 。
if (/^(columnCount|fillOpacity|flexGrow|flexShrink|fontWeight|lineHeight|opacity|order|orphans|widows|zIndex|zoom)$/.test(cssPropertyName)) {
    tweener = Fx.numberTweener;
} else {

    i = Fx.defaultTweeners.length;

    // 尝试使用每个转换器
    while (i-- > 0) {

        // 获取转换器
        parsed = Fx.defaultTweeners[i].parse(value, key);

        // 如果转换后结果合格，证明这个转换器符合此属性。
        if (parsed || parsed === 0) {
            tweener = Fx.defaultTweeners[i];
            break;
        }
    }

    // 找不到合适的解析器。
    if (!tweener) {
        continue;
    }

}

// 缓存 tweeners，下次直接使用。
Fx.tweeners[key] = tweener;