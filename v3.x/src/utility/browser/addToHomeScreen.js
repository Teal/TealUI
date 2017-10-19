/**
 * @author xuld
 */

/**
 * 对于 IOS/Android 用户，弹出添加到主屏幕的浮层。
 * @param {Object} [options] 可选的配置信息。
 * @remark
 * 请确保必须在 DomReady 中调用本函数。
 */
function addToHomeScreen(options) {

    // IE6-8: 不支持。
    /*@cc_on if(!-"\v1")return; @*/

    typeof console === "object" && console.assert(document.body, "addToHomeScreen(options): 必须在 DOM Ready 后才能调用此函数");

    // 排除一些浏览器。
    var opt = {

        // 是否强制显示浮层。
        forceShow: true,

        // 存储显示信息的本地存储键。
        storageKey: 'TealUI_addToHomeScreen',

        // 最小访问次数。如果用户实际访问次数小于指定值，则不显示提示。
        minVisitCount: 0,

        // 最多显示次数。
        maxShowCount: 1,
        
        // 显示的天数有效期。在指定天数内不再重复显示。
        period: 30,

        // 指示当前提示框是否可关闭。
        closable: true,

        // 指示当前时间。
        now: new Date,

        // 显示的图标地址。如果为 true 则根据页面 meta 标签获取。
        icon: true,

        tpls: {
            //ios: "<div class="flight-shortcut flight-shortcut-iphone-safari" onclick="$(this).hide()" style="z-index:9999999">                            <i class="flight-shortcut-close">close</i>                            <i class="flight-shortcut-logo">ctrip-logo</i>                            <p class="flight-shortcut-txt">先点击<i class="flight-shortcut-iconios"><em></em></i><br>再“添加到主屏幕”                            </p>                        </div>"
        }

    }, key;

    // 读取用户相关的配置项。
    try {
        // 在私有模式使用 localStorage 会引发异常。
        // 读取错误数据引发异常。
        opt.session = JSON.parse(localStorage.getItem(opt.storageKey));
    } catch (e) {
        opt.session = {

            // 是否已添加到桌面图标。
            added: false,

            // 用户访问时间。
            visitCount: 0,

            // 浮层显示次数。
            showCount: 0,

            // 最后显示时间。
            lastShowTime: 0
        };

    }

    // 应用用户配置。
    for (key in options) opt[key] = options[key];

    function check(opt) {

        var ua = navigator.userAgent,
            hasToken = /[?&]standalone=true(&|$)/.test(document.location.search),
            isIDevice = (/iphone|ipod|ipad/i).test(ua),
            isMobileChrome = ua.indexOf('Android') > -1 && (/Chrome\/[.0-9]*/).test(_ua) && _ua.indexOf("Version") == -1,
            isMobileIE = ua.indexOf('Windows Phone') > -1,
           
            _nav = window.navigator,
            isMobileSafari = ath.isIDevice && _ua.indexOf('Safari') > -1 && _ua.indexOf('CriOS') < 0,
            OS = ath.isIDevice ? 'ios' : ath.isMobileChrome ? 'android' : ath.isMobileIE ? 'windows' : 'unsupported',
            OSVersion = _ua.match(/(OS|Android) (\d+[_\.]\d+)/),
            OSVersion = ath.OSVersion && ath.OSVersion[2] ? +ath.OSVersion[2].replace('_', '.') : 0,

            isTablet = (isMobileSafari && ~ua.indexOf('iPad')) || (isMobileChrome && ua.indexOf('Mobile') < 0),

            isAndriodUC = /UCBrowser/.test(ua) && /And(roid|\b)/.test(ua),

            isSupported = (isMobileSafari && OSVersion >= 6) || isMobileChrome || isAndriodUC;

        // 1. 当前设备不支持添加到主屏幕。
        if (!isSupported) return 10000;

        // 2. 已添加过主屏幕。
        if (opt.session.added) return 10000;

        // 3. 当前从主屏幕打开。
        if (navigator.standalone === true) {
            opt.session.added = true;
            return 1;
        }

        // 4. 当前网址包含来自主屏幕的标记。
        // 如果第一次访问就包含标记，则认为是外链地址已包含标记，此时认为标记无效。
        if (hasToken && opt.session.visitCount) {
            opt.session.added = true;
            return 1;
        }

        // 5. 用户访问次数不够。
        if (++opt.session.visitorCount < opt.minVisitCount) return 1;

        // 6. 显示次数太多。
        if (++opt.session.showCount >= opt.maxShowCount) return 1;

        // 7. 上次显示仍在有效期。
        if (opt.now - opt.session.lastShowTime / 86400000 < opt.period) return 1;
        opt.session.lastShowTime = +opt.now;

        // 为网址添加来自主屏幕的标记。
        if (!hasToken) history.replaceState('', document.title, document.location.href + (document.location.search ? '&' : '?') + 'standalone=true');

        // 可以显示菜单。
        return 0;
    }

    function show(opt) {

        // message already on screen
        if (opt.shown) {
            opt.doLog("Add to homescreen: not displaying callout because already shown on screen");
            return;
        }

        var now = Date.now();
        var lastDisplayTime = opt.session.lastDisplayTime;

        opt.shown = true;

        // try to get the highest resolution application icon
        if (!opt.applicationIcon) {
            if (ath.OS == 'ios') {
                opt.applicationIcon = document.querySelector('head link[rel^=apple-touch-icon][sizes="152x152"],head link[rel^=apple-touch-icon][sizes="144x144"],head link[rel^=apple-touch-icon][sizes="120x120"],head link[rel^=apple-touch-icon][sizes="114x114"],head link[rel^=apple-touch-icon]');
            } else {
                opt.applicationIcon = document.querySelector('head link[rel^="shortcut icon"][sizes="196x196"],head link[rel^=apple-touch-icon]');
            }
        }

        var message = '';

        if (typeof opt.options.message == 'object' && ath.language in opt.options.message) {		// use custom language message
            message = opt.options.message[ath.language][ath.OS];
        } else if (typeof opt.options.message == 'object' && ath.OS in opt.options.message) {		// use custom os message
            message = opt.options.message[ath.OS];
        } else if (opt.options.message in ath.intl) {				// you can force the locale
            message = ath.intl[opt.options.message][ath.OS];
        } else if (opt.options.message !== '') {						// use a custom message
            message = opt.options.message;
        } else if (ath.OS in ath.intl[ath.language]) {				// otherwise we use our message
            message = ath.intl[ath.language][ath.OS];
        }

        // add the action icon
        message = '<p>' + message.replace('%icon', '<span class="ath-action-icon">icon</span>') + '</p>';

        // create the message container
        opt.viewport = document.createElement('div');
        opt.viewport.className = 'ath-viewport';
        if (opt.options.modal) {
            opt.viewport.className += ' ath-modal';
        }
        if (opt.options.mandatory) {
            opt.viewport.className += ' ath-mandatory';
        }
        opt.viewport.style.position = 'absolute';

        // create the actual message element
        opt.element = document.createElement('div');
        opt.element.className = 'ath-container ath-' + ath.OS + ' ath-' + ath.OS + (ath.OSVersion + '').substr(0, 1) + ' ath-' + (ath.isTablet ? 'tablet' : 'phone');
        opt.element.style.cssText = '-webkit-transition-property:-webkit-transform,opacity;-webkit-transition-duration:0s;-webkit-transition-timing-function:ease-out;transition-property:transform,opacity;transition-duration:0s;transition-timing-function:ease-out;';
        opt.element.style.webkitTransform = 'translate3d(0,-' + window.innerHeight + 'px,0)';
        opt.element.style.transform = 'translate3d(0,-' + window.innerHeight + 'px,0)';

        // add the application icon
        if (opt.options.icon && opt.applicationIcon) {
            opt.element.className += ' ath-icon';
            opt.img = document.createElement('img');
            opt.img.className = 'ath-application-icon';
            opt.img.addEventListener('load', this, false);
            opt.img.addEventListener('error', this, false);

            opt.img.src = opt.applicationIcon.href;
            opt.element.appendChild(opt.img);
        }

        opt.element.innerHTML += message;

        // we are not ready to show, place the message out of sight
        opt.viewport.style.left = '-99999em';

        // attach all elements to the DOM
        opt.viewport.appendChild(opt.element);
        opt.container.appendChild(opt.viewport);

        // if we don't have to wait for an image to load, show the message right away
        if (opt.img) {
            opt.doLog("Add to homescreen: not displaying callout because waiting for img to load");
        } else {
            opt._delayedShow();
        }
    }

    opt.errorCode = check(opt);

    // 保存用户状态。
    if (opt.errorCode < 10) {
        try {
            localStorage.setItem(opt.storageKey, JSON.stringify(opt.session));
        } catch (e) { }
    }

    // 检查当前网址是否包含来自网址复制。

    if (!opt.errorCode || opt.forceShow) {

    }
    // message in all supported languages
    ath.intl = {
        zh_cn: {
            ios: '如要把应用程序加至主屏幕,请点击%icon, 然后<strong>添加到主屏幕</strong>',
            android: 'To add this web app to the home screen open the browser option menu and tap on <strong>Add to homescreen</strong>. <small>The menu can be accessed by pressing the menu hardware button if your device has one, or by tapping the top right menu icon <span class="ath-action-icon">icon</span>.</small>',
        }
    };

    // default options
    ath.defaults = {
        
        fontSize: 15,				// base font size, used to properly resize the popup based on viewport scale factor
        
        modal: false,				// prevent further actions until the message is closed
      
        autostart: true,			// show the message automatically
        skipFirstVisit: false,		// show only to returning visitors (ie: skip the first time you visit)
        startDelay: 1,				// display the message after that many seconds from page load
        lifespan: 15,				// life of the message in seconds
        displayPace: 1440,			// minutes before the message is shown again (0: display every time, default 24 hours)
        maxDisplayCount: 0,			// absolute maximum number of times the message will be shown to the user (0: no limit)
        icon: true,					// add touch icon to the message
        message: '',				// the message can be customized
      
    };

    ath.Class.prototype = {

        _delayedShow: function (e) {
            setTimeout(opt._show.bind(this), opt.options.startDelay * 1000 + 500);
        },

        _show: function () {
            var that = this;

            // update the viewport size and orientation
            opt.updateViewport();

            // reposition/resize the message on orientation change
            window.addEventListener('resize', this, false);
            window.addEventListener('scroll', this, false);
            window.addEventListener('orientationchange', this, false);

            if (opt.options.modal) {
                // lock any other interaction
                document.addEventListener('touchmove', this, true);
            }

            // Enable closing after 1 second
            if (!opt.options.mandatory) {
                setTimeout(function () {
                    that.element.addEventListener('click', that, true);
                }, 1000);
            }

            // kick the animation
            setTimeout(function () {
                that.element.style.webkitTransitionDuration = '1.2s';
                that.element.style.transitionDuration = '1.2s';
                that.element.style.webkitTransform = 'translate3d(0,0,0)';
                that.element.style.transform = 'translate3d(0,0,0)';
            }, 0);

            // set the destroy timer
            if (opt.options.lifespan) {
                opt.removeTimer = setTimeout(opt.remove.bind(this), opt.options.lifespan * 1000);
            }

            // fire the custom onShow event
            if (opt.options.onShow) {
                opt.options.onShow.call(this);
            }
        },

        remove: function () {
            clearTimeout(opt.removeTimer);

            // clear up the event listeners
            if (opt.img) {
                opt.img.removeEventListener('load', this, false);
                opt.img.removeEventListener('error', this, false);
            }

            window.removeEventListener('resize', this, false);
            window.removeEventListener('scroll', this, false);
            window.removeEventListener('orientationchange', this, false);
            document.removeEventListener('touchmove', this, true);
            opt.element.removeEventListener('click', this, true);

            // remove the message element on transition end
            opt.element.addEventListener('transitionend', this, false);
            opt.element.addEventListener('webkitTransitionEnd', this, false);
            opt.element.addEventListener('MSTransitionEnd', this, false);

            // start the fade out animation
            opt.element.style.webkitTransitionDuration = '0.3s';
            opt.element.style.opacity = '0';
        },

        _removeElements: function () {
            opt.element.removeEventListener('transitionend', this, false);
            opt.element.removeEventListener('webkitTransitionEnd', this, false);
            opt.element.removeEventListener('MSTransitionEnd', this, false);

            // remove the message from the DOM
            opt.container.removeChild(opt.viewport);

            opt.shown = false;

            // fire the custom onRemove event
            if (opt.options.onRemove) {
                opt.options.onRemove.call(this);
            }
        },

        updateViewport: function () {
            if (!opt.shown) {
                return;
            }

            opt.viewport.style.width = window.innerWidth + 'px';
            opt.viewport.style.height = window.innerHeight + 'px';
            opt.viewport.style.left = window.scrollX + 'px';
            opt.viewport.style.top = window.scrollY + 'px';

            var clientWidth = document.documentElement.clientWidth;

            opt.orientation = clientWidth > document.documentElement.clientHeight ? 'landscape' : 'portrait';

            var screenWidth = ath.OS == 'ios' ? opt.orientation == 'portrait' ? screen.width : screen.height : screen.width;
            opt.scale = screen.width > clientWidth ? 1 : screenWidth / window.innerWidth;

            opt.element.style.fontSize = opt.options.fontSize / opt.scale + 'px';
        },

        resize: function () {
            clearTimeout(opt.resizeTimer);
            opt.resizeTimer = setTimeout(opt.updateViewport.bind(this), 100);
        },

        clearSession: function () {
            opt.session = _defaultSession;
            opt.updateSession();
        },

        getItem: function (item) {
            try {
                if (!localStorage) {
                    throw new Error('localStorage is not defined');
                }

                return localStorage.getItem(item);
            } catch (e) {
                // Preventing exception for some browsers when fetching localStorage key
                ath.hasLocalStorage = false;
            }
        },

        clearDisplayCount: function () {
            opt.session.displayCount = 0;
            opt.updateSession();
        },

        _preventDefault: function (e) {
            e.preventDefault();
            e.stopPropagation();
        }
    };

    // utility
    function _extend(target, obj) {
        for (var i in obj) {
            target[i] = obj[i];
        }

        return target;
    }

}


