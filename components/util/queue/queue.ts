/**
 * 表示一个队列。
 */
export default class Queue<T> implements Iterable<T> {

    /**
     * 存储当前队列的最后一项。
     */
    private _last?: QueueEntry<T>;

    /**
     * 判断当前队列是否为空。
     */
    get empty() { return this._last == undefined; }

    /**
     * 获取队列顶部的值。
     */
    get top() { return this._last ? this._last.next.value : undefined; }

    /**
     * 获取当前队列的长度。
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
     * 获取当前队列的迭代器。
     */
    [Symbol.iterator]() {
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
     * 将指定的项添加到队列末尾。
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
     * 获取当前队列的等价数组。
     */
    toArray() {
        const result: T[] = [];
        if (this._last) {
            for (let item = this._last.next; item !== this._last; item = item.next) {
                result.push(item.value);
            }
            result.push(this._last.value);
        }
        return result;
    }

    /**
     * 获取当前队列的等价字符串。
     */
    toString() { return this.toArray().toString(); }

    /**
     * 自定义当前对象在调试时的显示文案。
     */
    private inspect() { return `[${this.toString()}]`; }

}

/**
 * 表示一个队列项。
 */
interface QueueEntry<T> {

    /**
     * 存储当前项的值。
     */
    value: T;

    /**
     * 存储下一个队列项。
     */
    next: QueueEntry<T>;

}
