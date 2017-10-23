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
 * 绑定指定元素的键盘按键事件。
 * @param elem 元素。
 * @param options 由键值和要绑定的事件函数组成的键值对。
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
        if (func && func.call(this, e) !== false) {
            e.preventDefault();
            e.stopPropagation();
        }
    });
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

/**
 * 表示键盘按键选项。
 */
export interface KeyPressOptions {

    /**
     * 按下指定的按键执行。
     * @param e 相关的键盘事件。
     * @return 如果函数返回 false 则表示执行默认的操作。
     */
    [key: string]: undefined | ((e: KeyboardEvent) => boolean | void);

    /**
     * 按下 ESC 执行。
     * @param e 相关的键盘事件。
     * @return 如果函数返回 false 则表示执行默认的操作。
     */
    esc?: (e: KeyboardEvent) => boolean | void;

    /**
     * 按下方向上后执行。
     * @param e 相关的键盘事件。
     * @return 如果函数返回 false 则表示执行默认的操作。
     */
    up?: (e: KeyboardEvent) => boolean | void;

    /**
     * 按下方向下后执行。
     * @param e 相关的键盘事件。
     * @return 如果函数返回 false 则表示执行默认的操作。
     */
    down?: (e: KeyboardEvent) => boolean | void;

    /**
     * 按下方向左后执行。
     * @param e 相关的键盘事件。
     * @return 如果函数返回 false 则表示执行默认的操作。
     */
    left?: (e: KeyboardEvent) => boolean | void;

    /**
     * 按下方向右后执行。
     * @param e 相关的键盘事件。
     * @return 如果函数返回 false 则表示执行默认的操作。
     */
    right?: (e: KeyboardEvent) => boolean | void;

    /**
     * 按下向上翻页执行。
     * @param e 相关的键盘事件。
     * @return 如果函数返回 false 则表示执行默认的操作。
     */
    pageUp?: (e: KeyboardEvent) => boolean | void;

    /**
     * 按下向下翻页执行。
     * @param e 相关的键盘事件。
     * @return 如果函数返回 false 则表示执行默认的操作。
     */
    pageDown?: (e: KeyboardEvent) => boolean | void;

    /**
     * 按下主页执行。
     * @param e 相关的键盘事件。
     * @return 如果函数返回 false 则表示执行默认的操作。
     */
    home?: (e: KeyboardEvent) => boolean | void;

    /**
     * 按下尾页执行。
     * @param e 相关的键盘事件。
     * @return 如果函数返回 false 则表示执行默认的操作。
     */
    end?: (e: KeyboardEvent) => boolean | void;

    /**
     * 按下回车后执行。
     * @param e 相关的键盘事件。
     * @return 如果函数返回 false 则表示执行默认的操作。
     */
    enter?: (e: KeyboardEvent) => boolean | void;

    /**
     * 按下Ctrl/Command+回车后执行。
     * @param e 相关的键盘事件。
     * @return 如果函数返回 false 则表示执行默认的操作。
     */
    ctrlEnter?: (e: KeyboardEvent) => boolean | void;

    /**
     * 按下空格后执行。
     * @param e 相关的键盘事件。
     * @return 如果函数返回 false 则表示执行默认的操作。
     */
    space?: (e: KeyboardEvent) => boolean | void;

    /**
     * 按下制表符执行。
     * @param e 相关的键盘事件。
     * @return 如果函数返回 false 则表示执行默认的操作。
     */
    tab?: (e: KeyboardEvent) => boolean | void;

    /**
     * 按下退格后执行。
     * @param e 相关的键盘事件。
     * @return 如果函数返回 false 则表示执行默认的操作。
     */
    backspace?: (e: KeyboardEvent) => boolean | void;

    /**
     * 按下删除后执行。
     * @param e 相关的键盘事件。
     * @return 如果函数返回 false 则表示执行默认的操作。
     */
    delete?: (e: KeyboardEvent) => boolean | void;

    /**
     * 按下其它键执行。
     * @param e 相关的键盘事件。
     * @return 如果函数返回 false 则表示执行默认的操作。
     */
    other?: (e: KeyboardEvent) => void;

}
