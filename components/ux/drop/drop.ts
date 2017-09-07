import { getRect } from "ux/dom";
import { Draggable } from "ux/drag";

/**
 * 表示一个可拖放区域。
 */
export class Droppable {

    /**
     * 任意元素拖动开始事件。
     * @param draggable 当前的拖动元素。
     * @param e 事件对象。
     * @param sender 事件源。
     * @return 如果返回 false 则当前拖动区域不响应指定元素的拖放相关事件。
     */
    onDragStart?: (draggable: Draggable, e: MouseEvent, sender: this) => boolean | void;

    /**
     * 拖动进入事件。
     * @param draggable 当前的拖动元素。
     * @param e 事件对象。
     * @param sender 事件源。
     * @return 如果返回 false 则忽略本次拖动进入操作。
     */
    onDragEnter?: (draggable: Draggable, e: MouseEvent, sender: this) => boolean | void;

    /**
     * 在当前区域拖动移动事件。
     * @param draggable 当前的拖动元素。
     * @param e 事件对象。
     * @param sender 事件源。
     */
    onDragMove?: (draggable: Draggable, e: MouseEvent, sender: this) => void;

    /**
     * 拖动离开事件。
     * @param draggable 当前的拖动元素。
     * @param e 事件对象。
     * @param sender 事件源。
     * @return 如果返回 false 则忽略本次拖动离开操作。
     */
    onDragLeave?: (draggable: Draggable, e: MouseEvent, sender: this) => boolean | void;

    /**
     * 拖放事件。
     * @param draggable 当前的拖动元素。
     * @param e 事件对象。
     * @param sender 事件源。
     */
    onDrop?: (draggable: Draggable, e: MouseEvent, sender: this) => void;

    /**
     * 任意元素拖动结束事件。
     * @param draggable 当前的拖动元素。
     * @param e 事件对象。
     * @param sender 事件源。
     */
    onDragEnd?: (draggable: Draggable, e: MouseEvent, sender: this) => void;

    /**
     * 所有拖放区域。
     */
    static instances: Droppable[] = [];

    /**
     * 本次拖动操作可拖放的所有区域。
     */
    static current: Droppable[] | null;

    /**
     * 处理拖动开始事件。
     * @param e 事件对象。
     * @param sender 事件源。
     */
    static handleDragStart(e: MouseEvent, sender: Draggable) {
        Droppable.current = Droppable.instances.filter(droppable => !droppable.onDragStart || droppable.onDragStart(sender, e, droppable) !== false);
    }

    /**
     * 处理拖动移动事件。
     * @param e 事件对象。
     * @param sender 事件源。
     */
    static handleDragMove(e: MouseEvent, sender: Draggable) {
        for (const droppable of Droppable.current!) {
            if (droppable.contains(sender, e)) {
                if (droppable.active) {
                    droppable.onDragMove && droppable.onDragMove(sender, e, droppable);
                } else if (!droppable.onDragEnter || droppable.onDragEnter(sender, e, droppable) !== false) {
                    droppable.active = true;
                }
            } else if (droppable.active && (!droppable.onDragLeave || droppable.onDragLeave(sender, e, droppable) !== false)) {
                droppable.active = false;
            }
        }
    }

    /**
     * 处理拖动结束事件。
     * @param e 事件对象。
     * @param sender 事件源。
     */
    static handleDragEnd(e: MouseEvent, sender: Draggable) {
        for (const droppable of Droppable.current!) {
            droppable.onDragEnd && droppable.onDragEnd(sender, e, droppable);
            if (droppable.active) {
                droppable.active = false;
                droppable.onDrop && droppable.onDrop(sender, e, droppable);
            }
        }
        Droppable.current = null;
    }

    /**
     * 拖放的元素。
     */
    elem: HTMLElement;

    /**
     * 启用拖放。
     */
    enable() {
        const index = Droppable.instances.indexOf(this);
        if (index < 0) {
            Droppable.instances.push(this);
        }
    }

    /**
     * 禁用拖放。
     */
    disable() {
        const index = Droppable.instances.indexOf(this);
        if (index >= 0) {
            Droppable.instances.splice(index, 1);
        }
    }

    /**
     * 判断当前区域是否包含拖动对象。
     */
    protected active: boolean;

    /**
     * 判断指定的拖动元素是否已进入当前拖放区域。
     * @param draggable 当前的拖动元素。
     * @param e 事件对象。
     * @return 如果在区域内则返回 true，否则返回 false。
     */
    contains(draggable: Draggable, e: MouseEvent) {
        const rect = getRect(this.elem);
        return rect.x <= draggable.endX && draggable.endX <= rect.x + rect.width && rect.y <= draggable.endY && draggable.endY <= rect.y + rect.height;
    }

}

function connect(dragEvent: string, dropEvent: string) {
    const old = (Draggable.prototype as any)[dragEvent];
    (Draggable.prototype as any)[dragEvent] = function (e: MouseEvent) {
        const result = old.call(this, e);
        (Droppable as any)[dropEvent](e, this);
        return result;
    };
}
connect("dragStart", "handleDragStart");
connect("dragMove", "handleDragMove");
connect("dragEnd", "handleDragEnd");

/**
 * 创建一个新的可拖放区域。
 * @param elem 要拖放的元素。
 * @param options 拖放的选项。
 * @return 返回一个可拖放区域。
 */
export default function droppable(elem: HTMLElement, options?: Partial<Droppable>) {
    const result = new Droppable();
    result.elem = elem;
    Object.assign(result, options);
    result.enable();
    return result;
}
