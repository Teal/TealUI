const keys = {
    __proto__: null!,
    esc: 27,
    up: 38,
    down: 40,
    left: 37,
    right: 39,
    pageUp: 33,
    pageDown: 34,
    home: 36,
    end: 35,
    space: 32,
    tab: 9,
    backspace: 8,
    delete: 46
};

/**
 * 表示常用键盘按键。
 */
export interface KeyPressOptions {

    [key: string]: undefined | ((e: KeyboardEvent) => boolean | void);

    /**
     * 按下 ESC 执行。
     */
    esc?: (e: KeyboardEvent) => boolean | void;

    /**
     * 按下方向上后执行。
     */
    up?: (e: KeyboardEvent) => boolean | void;

    /**
     * 按下方向下后执行。
     */
    down?: (e: KeyboardEvent) => boolean | void;

    /**
     * 按下方向左后执行。
     */
    left?: (e: KeyboardEvent) => boolean | void;

    /**
     * 按下方向右后执行。
     */
    right?: (e: KeyboardEvent) => boolean | void;

    /**
     * 按下向上翻页执行。
     */
    pageUp?: (e: KeyboardEvent) => boolean | void;

    /**
     * 按下向下翻页执行。
     */
    pageDown?: (e: KeyboardEvent) => boolean | void;

    /**
     * 按下主页执行。
     */
    home?: (e: KeyboardEvent) => boolean | void;

    /**
     * 按下尾页执行。
     */
    end?: (e: KeyboardEvent) => boolean | void;

    /**
     * 按下回车后执行。
     */
    enter?: (e: KeyboardEvent) => boolean | void;

    /**
     * 按下Ctrl+回车后执行。
     */
    ctrlEnter?: (e: KeyboardEvent) => boolean | void;

    /**
     * 按下空格后执行。
     */
    space?: (e: KeyboardEvent) => boolean | void;

    /**
     * 按下制表符执行。
     */
    tab?: (e: KeyboardEvent) => boolean | void;

    /**
     * 按下退格后执行。
     */
    backspace?: (e: KeyboardEvent) => boolean | void;

    /**
     * 按下删除后执行。
     */
    delete?: (e: KeyboardEvent) => boolean | void;

    /**
     * 按下其它键执行。
     */
    other?: (e: KeyboardEvent) => void;

}

/**
 * 绑定常用键盘按键。
 * @param elem 要绑定的元素。
 * @param options 绑定各个事件的处理器。
 */
export default function keyPress(elem: HTMLElement, options: KeyPressOptions) {
    const map: any = {};
    for (const key in options) {
        map[(keys as any)[key] || key] = (options as any)[key];
    }
    if (options.enter || options.ctrlEnter) {
        map["10"] = map["13"] = (e: KeyboardEvent) => {
            if (options.ctrlEnter && (e.ctrlKey || e.metaKey)) {
                return options.ctrlEnter(e);
            }
            if (options.enter) {
                return options.enter(e);
            }
        };
    }
    elem.addEventListener("keydown", function (e) {
        const func = map[e.keyCode];
        if (func && func.call(this, e) !== true) {
            e.preventDefault();
        }
    }, false);
    if (map.other) {
        elem.addEventListener("keyup", function (e) {
            // 忽略 Shift 等组合键。
            const keyCode = e.keyCode;
            if ((keyCode < 16 || keyCode > 18) && !map[keyCode]) {
                map.other.call(this, e);
            }
        }, false);
    }
}
