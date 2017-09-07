/**
 * 表示一个事件分发器。
 */
export default class EventEmitter {

    /**
     * 存储所有事件。
     */
    private _events: { [eventName: string]: Function | Function[] };

    /**
     * 添加一个事件监听器。
     * @param eventName 要添加的事件名。
     * @param eventListener 要添加的事件监听器。
     * @example new EventEmitter().on("click", function (e) {  });
     */
    on(eventName: string, eventListener: Function) {
        const events = this._events || (this._events = { __proto__: null! });
        const eventListeners = events[eventName];
        if (Array.isArray(eventListeners)) {
            eventListeners.push(eventListener);
        } else {
            events[eventName] = eventListener;
        }
        return this;
    }

    /**
     * 删除指定或所有的事件监听器。
     * @param eventName 要删除的事件名。如果不传递此参数，则删除所有事件监听器。
     * @param eventListener 要删除的事件监听器。如果不传递此参数，则删除指定事件的所有监听器。如果同一个事件被多次添加，则只删除第一个。
     * @example
     * var fn =  function () {}; // 必须保存函数的引用才能删除。
     * var ee = new EventEmitter();
     * ee.on("click", fn); // 绑定一个 click 事件。
     * ee.off("click", fn); // 删除一个 click 事件。
     */
    off(eventName?: string, eventListener?: Function) {
        const events = this._events;
        if (events) {
            if (eventName) {
                const eventListeners = events[eventName];
                if (eventListeners) {
                    if (eventListener) {
                        if (Array.isArray(eventListeners)) {
                            const index = eventListeners.indexOf(eventListener);
                            if (index >= 0) {
                                eventListeners.splice(index, 1);
                                eventListener = eventListeners.length as any;
                            }
                        } else if (eventListeners === eventListener) {
                            eventListener = undefined;
                        }
                    }
                    if (!eventListener) {
                        delete events[eventName];
                    }
                }
            } else {
                delete this._events;
            }
        }
        return this;
    }

    /**
     * 触发一个事件。
     * @param eventName 要触发的事件名。
     * @param eventArgs 传递给监听器的所有参数。
     * @return 如果事件被阻止则返回 false，否则返回 true。
     * @example
     * var ee = new EventEmitter(); // 创建一个实例。
     * ee.on("click", function (e) { console.log("haha"); }); // 绑定一个 click 事件。
     * ee.emit("click"); // 手动触发 click。
     */
    emit(eventName: string, ...eventArgs: any[]) {
        let t: any = this._events;
        if (t && (t = t[eventName])) {
            if (typeof t === "function") {
                t.apply(this, eventArgs);
            } else {
                for (const eventListener of t.slice(0)) {
                    eventListener.apply(this, eventArgs);
                }
            }
            return true;
        }
        return false;
    }

}
