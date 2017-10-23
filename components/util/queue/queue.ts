/**
 * 表示一个队列。
 */
export default class Queue<T> {

    /**
     * 将项添加到队列末尾。
     * @param item 要添加的项。
     */
    enqueue(item: T) {
        const last = this._last;
        if (last) {
            this._last = last.next = {
                value: item,
                next: last.next
            };
        } else {
            const entry = { value: item } as QueueEntry<T>;
            this._last = entry.next = entry;
        }
    }

    /**
     * 取出队首的项。
     * @return 返回队首的项。如果队列为空则返回 undefined。
     */
    dequeue() {
        if (!this._last) {
            return;
        }
        const head = this._last.next;
        if (head === this._last) {
            this._last = undefined;
        } else {
            this._last.next = head.next;
        }
        return head.value;
    }

    /**
     * 获取队列顶部的值。
     */
    get top() { return this._last ? this._last.next.value : undefined; }

    /**
     * 判断队列是否为空。
     */
    get empty() { return this._last == undefined; }

    /**
     * 获取队列的长度。
     */
    get length() {
        if (this._last == undefined) {
            return 0;
        }
        let count = 1;
        for (let item = this._last.next; item !== this._last; item = item.next) {
            count++;
        }
        return count;
    }

    /**
     * 存储队列的最后一项。
     */
    private _last?: QueueEntry<T>;

    /**
     * 获取队列的迭代器。
     */
    [typeof Symbol === "undefined" ? "iterator" : Symbol.iterator]() {
        const last = this._last;
        let current = last;
        let end = last == undefined;
        return {
            next() {
                if (end) {
                    return { value: undefined, done: true };
                }
                current = current!.next;
                if (current === last) {
                    end = true;
                }
                return { value: current.value, done: false };
            }
        } as Iterator<T>;
    }

    /**
     * 将队列转为数组。
     */
    toArray() {
        const r: T[] = [];
        if (this._last) {
            for (let item = this._last.next; item !== this._last; item = item.next) {
                r.push(item.value);
            }
            r.push(this._last.value);
        }
        return r;
    }

    /**
     * 将队列转为字符串。
     */
    toString() { return this.toArray().toString(); }

    /**
     * 自定义调试时的显示文案。
     */
    protected inspect() { return `[${this.toString()}]`; }

}

/**
 * 表示一个队列项。
 */
interface QueueEntry<T> {

    /**
     * 存储项的值。
     */
    value: T;

    /**
     * 存储下一个队列项。
     */
    next: QueueEntry<T>;

}
