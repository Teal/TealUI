let nextTickImpl: typeof nextTick;

// Edge: 原生支持 setImmediate。
if (typeof setImmediate !== "undefined") {
    nextTickImpl = setImmediate;
} else if (window.postMessage && !(window as any).importScripts && window.addEventListener) {
    // 除 IE 8-: 使用 postMessage。
    // 存在 importScripts 表示在 web worker 中运行，此时无法使用 postMessage。
    const queue: Function[] = [];
    window.addEventListener("message", e => {
        if ((e.source === window || e.source === null) && e.data === "_nextTick") {
            e.stopPropagation();
            const func = queue.shift();
            if (func) {
                func();
            }
        }
    }, true);
    nextTickImpl = (func: Function) => {
        queue.push(func);
        window.postMessage("_nextTick", "*");
    };
} else {
    // 其它浏览器。
    nextTickImpl = setTimeout;
}

/**
 * 等待下一帧执行。
 * @param func 要执行的函数。
 * @example nextTick(() => alert(1))
 */
export default function nextTick(func: Function) {
    nextTickImpl(func);
}
