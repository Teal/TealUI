import Control, { VNode } from "./control";

declare global {
    namespace JSX {

        type Element = VNode;

        type ElementClass = Control;

        interface ElementAttributesProperty { __props__: Partial<this>; }

        interface IntrinsicElements extends ElementMap {

            /**
             * 未知标签。
             */
            [tagName: string]: any;

        }

        type ElementMap = {[tagName in keyof ElementTagNameMap]: Partial<ElementTagNameMap[tagName] & ElementExtension>; };

        /**
         * HTML 元素属性扩展。
         */
        interface ElementExtension {

            /**
             * 未知属性。
             */
            [prop: string]: any;

            /**
             * 当前元素关联的控件实例。
             */
            __control__: Control;

            /**
             * CSS 类名。
             * @see https://developer.mozilla.org/zh-CN/docs/Web/API/Element/className
             */
            class: string;

            /**
             * 元素样式。
             * @see https://developer.mozilla.org/zh-CN/docs/Web/API/HTMLElement/style
             */
            style: Partial<CSSStyleDeclaration> | string | any;

            /**
             * 绑定一个复制事件。
             * @param e 相关的事件参数。
             * @param sender 触发事件的节点。
             * @see https://developer.mozilla.org/zh-CN/docs/Web/API/GlobalEventHandlers/oncopy
             */
            onCopy: (e: ClipboardEvent, sender?: this) => any;

            /**
             * 绑定一个剪切事件。
             * @param e 相关的事件参数。
             * @param sender 触发事件的节点。
             * @see https://developer.mozilla.org/zh-CN/docs/Web/API/GlobalEventHandlers/oncut
             */
            onCut: (e: ClipboardEvent, sender?: this) => any;

            /**
             * 绑定一个粘贴事件。
             * @param e 相关的事件参数。
             * @param sender 触发事件的节点。
             * @see https://developer.mozilla.org/zh-CN/docs/Web/API/GlobalEventHandlers/onpaste
             */
            onPaste: (e: ClipboardEvent, sender?: this) => any;

            /**
             * 绑定一个即将复制事件。
             * @param e 相关的事件参数。
             * @param sender 触发事件的节点。
             * @see https://msdn.microsoft.com/zh-cn/library/aa769320.ASPX
             */
            onBeforeCopy: (e: ClipboardEvent, sender?: this) => any;

            /**
             * 绑定一个即将剪切事件。
             * @param e 相关的事件参数。
             * @param sender 触发事件的节点。
             * @see https://msdn.microsoft.com/zh-cn/library/aa769321.aspx
             */
            onBeforeCut: (e: ClipboardEvent, sender?: this) => any;

            /**
             * 绑定一个即将粘贴事件。
             * @param e 相关的事件参数。
             * @param sender 触发事件的节点。
             * @see https://msdn.microsoft.com/zh-cn/library/aa769324.aspx
             */
            onBeforePaste: (e: ClipboardEvent, sender?: this) => any;

            /**
             * 绑定一个获取焦点事件。
             * @param e 相关的事件参数。
             * @param sender 触发事件的节点。
             * @see https://developer.mozilla.org/zh-CN/docs/Web/API/GlobalEventHandlers/onfocus
             */
            onFocus: (e: FocusEvent, sender?: this) => any;

            /**
             * 绑定一个失去焦点事件。
             * @param e 相关的事件参数。
             * @param sender 触发事件的节点。
             * @see https://developer.mozilla.org/zh-CN/docs/Web/API/GlobalEventHandlers/onblur
             */
            onBlur: (e: FocusEvent, sender?: this) => any;

            /**
             * 绑定一个当前元素和子元素获取焦点事件。
             * @param e 相关的事件参数。
             * @param sender 触发事件的节点。
             * @see https://msdn.microsoft.com/zh-CN/library/ms536935(VS.85).aspx
             */
            onFocusIn: (e: FocusEvent, sender?: this) => any;

            /**
             * 绑定一个当前元素和子元素失去焦点事件。
             * @param e 相关的事件参数。
             * @param sender 触发事件的节点。
             * @see https://msdn.microsoft.com/zh-CN/library/ms536936(VS.85).aspx
             */
            onFocusOut: (e: FocusEvent, sender?: this) => any;

            /**
             * 绑定一个选择开始事件。
             * @param e 相关的事件参数。
             * @param sender 触发事件的节点。
             * @see https://developer.mozilla.org/en-US/docs/Web/API/GlobalEventHandlers/onselectstart
             */
            onSelectStart: (e: Event, sender?: this) => any;

            /**
             * 绑定一个激活事件。
             * @param e 相关的事件参数。
             * @param sender 触发事件的节点。
             */
            onActivate: (e: UIEvent, sender?: this) => any;

            /**
             * 绑定一个激活前事件。
             * @param e 相关的事件参数。
             * @param sender 触发事件的节点。
             */
            onBeforeActivate: (e: UIEvent, sender?: this) => any;

            /**
             * 绑定一个取消激活前事件。
             * @param e 相关的事件参数。
             * @param sender 触发事件的节点。
             */
            onBeforeDeactivate: (e: UIEvent, sender?: this) => any;

            /**
             * 绑定一个取消激活事件。
             * @param e 相关的事件参数。
             * @param sender 触发事件的节点。
             */
            onDeactivate: (e: UIEvent, sender?: this) => any;

            /**
             * 绑定一个点击事件。
             * @param e 相关的事件参数。
             * @param sender 触发事件的节点。
             * @see https://developer.mozilla.org/zh-CN/docs/Web/API/GlobalEventHandlers/onclick
             */
            onClick: (e: MouseEvent, sender?: this) => any;

            /**
             * 绑定一个中键点击事件。
             * @param e 相关的事件参数。
             * @param sender 触发事件的节点。
             * @see https://developer.mozilla.org/zh-CN/docs/Web/API/GlobalEventHandlers/onauxclick
             */
            onAuxClick: (e: MouseEvent, sender?: this) => any;

            /**
             * 绑定一个双击事件。
             * @param e 相关的事件参数。
             * @param sender 触发事件的节点。
             * @see https://developer.mozilla.org/zh-CN/docs/Web/API/GlobalEventHandlers/ondblclick
             */
            onDblClick: (e: MouseEvent, sender?: this) => any;

            /**
             * 绑定一个右键菜单事件。
             * @param e 相关的事件参数。
             * @param sender 触发事件的节点。
             * @see https://developer.mozilla.org/zh-CN/docs/Web/API/GlobalEventHandlers/oncontextmenu
             */
            onContextMenu: (e: PointerEvent, sender?: this) => any;

            /**
             * 绑定一个鼠标按下事件。
             * @param e 相关的事件参数。
             * @param sender 触发事件的节点。
             * @see https://developer.mozilla.org/zh-CN/docs/Web/API/GlobalEventHandlers/onmousedown
             */
            onMouseDown: (e: MouseEvent, sender?: this) => any;

            /**
             * 绑定一个鼠标按上事件。
             * @param e 相关的事件参数。
             * @param sender 触发事件的节点。
             * @see https://developer.mozilla.org/zh-CN/docs/Web/API/GlobalEventHandlers/onmouseup
             */
            onMouseUp: (e: MouseEvent, sender?: this) => any;

            /**
             * 绑定一个鼠标移入事件。
             * @see https://developer.mozilla.org/zh-CN/docs/Web/API/GlobalEventHandlers/onmouseover
             */
            onMouseOver: (e: MouseEvent, sender?: this) => any;

            /**
             * 绑定一个鼠标移开事件。
             * @param e 相关的事件参数。
             * @param sender 触发事件的节点。
             * @see https://developer.mozilla.org/zh-CN/docs/Web/API/GlobalEventHandlers/onmouseout
             */
            onMouseOut: (e: MouseEvent, sender?: this) => any;

            /**
             * 绑定一个鼠标进入事件。
             * @param e 相关的事件参数。
             * @param sender 触发事件的节点。
             * @see https://developer.mozilla.org/zh-CN/docs/Web/API/GlobalEventHandlers/onmouseenter
             */
            onMouseEnter: (e: MouseEvent, sender?: this) => any;

            /**
             * 绑定一个鼠标离开事件。
             * @param e 相关的事件参数。
             * @param sender 触发事件的节点。
             * @see https://developer.mozilla.org/zh-CN/docs/Web/API/GlobalEventHandlers/onmouseleave
             */
            onMouseLeave: (e: MouseEvent, sender?: this) => any;

            /**
             * 绑定一个鼠标移动事件。
             * @param e 相关的事件参数。
             * @param sender 触发事件的节点。
             * @see https://developer.mozilla.org/zh-CN/docs/Web/API/GlobalEventHandlers/onmousemove
             */
            onMouseMove: (e: MouseEvent, sender?: this) => any;

            /**
             * 绑定一个鼠标滚轮事件。
             * @param e 相关的事件参数。
             * @param sender 触发事件的节点。
             * @see https://developer.mozilla.org/zh-CN/docs/Web/Events/wheel
             */
            onWheel: (e: WheelEvent, sender?: this) => any;

            /**
             * 绑定一个滚动事件。
             * @param e 相关的事件参数。
             * @param sender 触发事件的节点。
             * @see https://developer.mozilla.org/zh-CN/docs/Web/API/GlobalEventHandlers/onscroll
             */
            onScroll: (e: UIEvent, sender?: this) => any;

            /**
             * 绑定一个拖动事件。
             * @param e 相关的事件参数。
             * @param sender 触发事件的节点。
             * @see https://developer.mozilla.org/zh-CN/docs/Web/API/GlobalEventHandlers/ondrag
             */
            onDrag: (e: DragEvent, sender?: this) => any;

            /**
             * 绑定一个拖动结束事件。
             * @param e 相关的事件参数。
             * @param sender 触发事件的节点。
             * @see https://developer.mozilla.org/zh-CN/docs/Web/API/GlobalEventHandlers/ondragend
             */
            onDragEnd: (e: DragEvent, sender?: this) => any;

            /**
             * 绑定一个拖动进入事件。
             * @param e 相关的事件参数。
             * @param sender 触发事件的节点。
             * @see https://developer.mozilla.org/zh-CN/docs/Web/API/GlobalEventHandlers/ondragenter
             */
            onDragEnter: (e: DragEvent, sender?: this) => any;

            /**
             * 绑定一个拖动离开事件。
             * @param e 相关的事件参数。
             * @param sender 触发事件的节点。
             * @see https://developer.mozilla.org/zh-CN/docs/Web/API/GlobalEventHandlers/ondragleave
             */
            onDragLeave: (e: DragEvent, sender?: this) => any;

            /**
             * 绑定一个拖动进入事件。
             * @param e 相关的事件参数。
             * @param sender 触发事件的节点。
             * @see https://developer.mozilla.org/zh-CN/docs/Web/API/GlobalEventHandlers/ondragover
             */
            onDragOver: (e: DragEvent, sender?: this) => any;

            /**
             * 绑定一个拖动开始事件。
             * @param e 相关的事件参数。
             * @param sender 触发事件的节点。
             * @see https://developer.mozilla.org/zh-CN/docs/Web/API/GlobalEventHandlers/ondragstart
             */
            onDragStart: (e: DragEvent, sender?: this) => any;

            /**
             * 绑定一个拖放事件。
             * @param e 相关的事件参数。
             * @param sender 触发事件的节点。
             * @see https://developer.mozilla.org/zh-CN/docs/Web/API/GlobalEventHandlers/ondrop
             */
            onDrop: (e: DragEvent, sender?: this) => any;

            /**
             * 绑定一个触摸开始事件。
             * @param e 相关的事件参数。
             * @param sender 触发事件的节点。
             * @see https://developer.mozilla.org/zh-CN/docs/Web/API/GlobalEventHandlers/ontouchstart
             */
            onTouchStart: (e: TouchEvent, sender?: this) => any;

            /**
             * 绑定一个触摸移动事件。
             * @param e 相关的事件参数。
             * @param sender 触发事件的节点。
             * @see https://developer.mozilla.org/zh-CN/docs/Web/API/GlobalEventHandlers/ontouchmove
             */
            onTouchMove: (e: TouchEvent, sender?: this) => any;

            /**
             * 绑定一个触摸结束事件。
             * @param e 相关的事件参数。
             * @param sender 触发事件的节点。
             * @see https://developer.mozilla.org/zh-CN/docs/Web/API/GlobalEventHandlers/ontouchend
             */
            onTouchEnd: (e: TouchEvent, sender?: this) => any;

            /**
             * 绑定一个触摸撤销事件。
             * @param e 相关的事件参数。
             * @param sender 触发事件的节点。
             * @see https://developer.mozilla.org/zh-CN/docs/Web/API/GlobalEventHandlers/ontouchcancel
             */
            onTouchCancel: (e: TouchEvent, sender?: this) => any;

            /**
             * 绑定一个指针进入事件。
             * @param e 相关的事件参数。
             * @param sender 触发事件的节点。
             * @see https://developer.mozilla.org/zh-CN/docs/Web/API/GlobalEventHandlers/onpointerenter
             */
            onPointerEnter: (e: PointerEvent, sender?: this) => any;

            /**
             * 绑定一个指针离开事件。
             * @param e 相关的事件参数。
             * @param sender 触发事件的节点。
             * @see https://developer.mozilla.org/zh-CN/docs/Web/API/GlobalEventHandlers/onpointerleave
             */
            onPointerLeave: (e: PointerEvent, sender?: this) => any;

            /**
             * 绑定一个指针移入事件。
             * @param e 相关的事件参数。
             * @param sender 触发事件的节点。
             * @see https://developer.mozilla.org/zh-CN/docs/Web/API/GlobalEventHandlers/onpointerover
             */
            onPointerOver: (e: PointerEvent, sender?: this) => any;

            /**
             * 绑定一个指针移开事件。
             * @param e 相关的事件参数。
             * @param sender 触发事件的节点。
             * @see https://developer.mozilla.org/zh-CN/docs/Web/API/GlobalEventHandlers/onpointerout
             */
            onPointerOut: (e: PointerEvent, sender?: this) => any;

            /**
             * 绑定一个指针按下事件。
             * @param e 相关的事件参数。
             * @param sender 触发事件的节点。
             * @see https://developer.mozilla.org/zh-CN/docs/Web/API/GlobalEventHandlers/onpointerdown
             */
            onPointerDown: (e: PointerEvent, sender?: this) => any;

            /**
             * 绑定一个指针移动事件。
             * @param e 相关的事件参数。
             * @param sender 触发事件的节点。
             * @see https://developer.mozilla.org/zh-CN/docs/Web/API/GlobalEventHandlers/onpointermove
             */
            onPointerMove: (e: PointerEvent, sender?: this) => any;

            /**
             * 绑定一个指针松开事件。
             * @param e 相关的事件参数。
             * @param sender 触发事件的节点。
             * @see https://developer.mozilla.org/zh-CN/docs/Web/API/GlobalEventHandlers/onpointerup
             */
            onPointerUp: (e: PointerEvent, sender?: this) => any;

            /**
             * 绑定一个指针取消事件。
             * @param e 相关的事件参数。
             * @param sender 触发事件的节点。
             * @see https://developer.mozilla.org/zh-CN/docs/Web/API/GlobalEventHandlers/onpointercancel
             */
            onPointerCancel: (e: PointerEvent, sender?: this) => any;

            /**
             * 绑定一个指针开始捕获事件。
             * @param e 相关的事件参数。
             * @param sender 触发事件的节点。
             * @see https://developer.mozilla.org/zh-CN/docs/Web/API/GlobalEventHandlers/ongotpointercapture
             */
            onGotPointerCapture: (e: PointerEvent, sender?: this) => any;

            /**
             * 绑定一个指针停止捕获事件。
             * @param e 相关的事件参数。
             * @param sender 触发事件的节点。
             * @see https://developer.mozilla.org/zh-CN/docs/Web/API/GlobalEventHandlers/onlostpointercapture
             */
            onLostPointerCapture: (e: PointerEvent, sender?: this) => any;

            /**
             * 绑定一个渐变结束事件。
             * @param e 相关的事件参数。
             * @param sender 触发事件的节点。
             * @see https://developer.mozilla.org/zh-CN/docs/Web/API/GlobalEventHandlers/ontransitionend
             */
            onTransitionEnd: (e: TransitionEvent, sender?: this) => any;

            /**
             * 绑定一个动画取消事件。
             * @param e 相关的事件参数。
             * @param sender 触发事件的节点。
             * @see https://developer.mozilla.org/zh-CN/docs/Web/API/GlobalEventHandlers/onanimationcancel
             */
            onAnimationCancel: (e: AnimationEvent, sender?: this) => any;

            /**
             * 绑定一个动画结束事件。
             * @param e 相关的事件参数。
             * @param sender 触发事件的节点。
             * @see https://developer.mozilla.org/zh-CN/docs/Web/API/GlobalEventHandlers/onanimationend
             */
            onAnimationEnd: (e: AnimationEvent, sender?: this) => any;

            /**
             * 绑定一个动画迭代事件。
             * @param e 相关的事件参数。
             * @param sender 触发事件的节点。
             * @see https://developer.mozilla.org/zh-CN/docs/Web/API/GlobalEventHandlers/onanimationiteration
             */
            onAnimationIteration: (e: AnimationEvent, sender?: this) => any;

            /**
             * 绑定一个输入事件。
             * @param e 相关的事件参数。
             * @param sender 触发事件的节点。
             * @see https://developer.mozilla.org/zh-CN/docs/Web/API/GlobalEventHandlers/oninput
             */
            onInput: (e: Event, sender?: this) => any;

            /**
             * 绑定一个选择事件。
             * @param e 相关的事件参数。
             * @param sender 触发事件的节点。
             * @see https://developer.mozilla.org/zh-CN/docs/Web/API/GlobalEventHandlers/onselect
             */
            onSelect: (e: UIEvent, sender?: this) => any;

            /**
             * 绑定一个更改事件。
             * @param e 相关的事件参数。
             * @param sender 触发事件的节点。
             * @see https://developer.mozilla.org/zh-CN/docs/Web/API/GlobalEventHandlers/onchange
             */
            onChange: (e: Event, sender?: this) => any;

            /**
             * 绑定一个键盘按下事件。
             * @param e 相关的事件参数。
             * @param sender 触发事件的节点。
             * @see https://developer.mozilla.org/zh-CN/docs/Web/API/GlobalEventHandlers/onkeydown
             */
            onKeyDown: (e: KeyboardEvent, sender?: this) => any;

            /**
             * 绑定一个键盘点击事件。
             * @param e 相关的事件参数。
             * @param sender 触发事件的节点。
             * @see https://developer.mozilla.org/zh-CN/docs/Web/API/GlobalEventHandlers/onkeypress
             */
            onKeyPress: (e: KeyboardEvent, sender?: this) => any;

            /**
             * 绑定一个键盘按上事件。
             * @param e 相关的事件参数。
             * @param sender 触发事件的节点。
             * @see https://developer.mozilla.org/zh-CN/docs/Web/API/GlobalEventHandlers/onkeyup
             */
            onKeyUp: (e: KeyboardEvent, sender?: this) => any;

            /**
             * 绑定一个重置事件。
             * @param e 相关的事件参数。
             * @param sender 触发事件的节点。
             * @see https://developer.mozilla.org/zh-CN/docs/Web/API/GlobalEventHandlers/onreset
             */
            onReset: (e: Event, sender?: this) => any;

            /**
             * 绑定一个提交事件。
             * @param e 相关的事件参数。
             * @param sender 触发事件的节点。
             * @see https://developer.mozilla.org/zh-CN/docs/Web/API/GlobalEventHandlers/onsubmit
             */
            onSubmit: (e: Event, sender?: this) => any;

            /**
             * 绑定一个校验非法事件。
             * @param e 相关的事件参数。
             * @param sender 触发事件的节点。
             * @see https://developer.mozilla.org/zh-CN/docs/Web/API/GlobalEventHandlers/oninvalid
             */
            onInvalid: (e: Event, sender?: this) => any;

            /**
             * 绑定一个可播放事件。
             * @param e 相关的事件参数。
             * @param sender 触发事件的节点。
             */
            onCanPlay: (e: Event, sender?: this) => any;

            /**
             * 绑定一个可立即播放事件。
             * @param e 相关的事件参数。
             * @param sender 触发事件的节点。
             */
            onCanPlayThrough: (e: Event, sender?: this) => any;

            /**
             * 绑定一个视频时长发生变化事件。
             * @param e 相关的事件参数。
             * @param sender 触发事件的节点。
             */
            onDurationChange: (e: Event, sender?: this) => any;

            /**
             * 绑定一个视频播放列表为空事件。
             * @param e 相关的事件参数。
             * @param sender 触发事件的节点。
             */
            onEmptied: (e: Event, sender?: this) => any;

            /**
             * 绑定一个视频播放结束事件。
             * @param e 相关的事件参数。
             * @param sender 触发事件的节点。
             */
            onEnded: (e: MediaStreamErrorEvent, sender?: this) => any;

            /**
             * 绑定一个视频载入桢事件。
             * @param e 相关的事件参数。
             * @param sender 触发事件的节点。
             */
            onLoadedData: (e: Event, sender?: this) => any;

            /**
             * 绑定一个视频载入元数据事件。
             * @param e 相关的事件参数。
             * @param sender 触发事件的节点。
             */
            onLoadedMetaData: (e: Event, sender?: this) => any;

            /**
             * 绑定一个视频开始载入事件。
             * @param e 相关的事件参数。
             * @param sender 触发事件的节点。
             */
            onLoadStart: (e: Event, sender?: this) => any;

            /**
             * 绑定一个视频暂停事件。
             * @param e 相关的事件参数。
             * @param sender 触发事件的节点。
             */
            onPause: (e: Event, sender?: this) => any;

            /**
             * 绑定一个视频播放事件。
             * @param e 相关的事件参数。
             * @param sender 触发事件的节点。
             */
            onPlay: (e: Event, sender?: this) => any;

            /**
             * 绑定一个视频正在播放事件。
             * @param e 相关的事件参数。
             * @param sender 触发事件的节点。
             */
            onPlaying: (e: Event, sender?: this) => any;

            /**
             * 绑定一个视频正在下载事件。
             * @param e 相关的事件参数。
             * @param sender 触发事件的节点。
             */
            onProgress: (e: ProgressEvent, sender?: this) => any;

            /**
             * 绑定一个视频播放速度发生改变事件。
             * @param e 相关的事件参数。
             * @param sender 触发事件的节点。
             */
            onRateChange: (e: Event, sender?: this) => any;

            /**
             * 绑定一个视频重新定位事件。
             * @param e 相关的事件参数。
             * @param sender 触发事件的节点。
             */
            onSeeked: (e: Event, sender?: this) => any;

            /**
             * 绑定一个视频正在重新定位事件。
             * @param e 相关的事件参数。
             * @param sender 触发事件的节点。
             */
            onSeeking: (e: Event, sender?: this) => any;

            /**
             * 绑定一个视频不可用事件。
             * @param e 相关的事件参数。
             * @param sender 触发事件的节点。
             */
            onStalled: (e: Event, sender?: this) => any;

            /**
             * 绑定一个视频中断下载事件。
             * @param e 相关的事件参数。
             * @param sender 触发事件的节点。
             */
            onSuspend: (e: Event, sender?: this) => any;

            /**
             * 绑定一个视频播放位置改变事件。
             * @param e 相关的事件参数。
             * @param sender 触发事件的节点。
             */
            onTimeUpdate: (e: Event, sender?: this) => any;

            /**
             * 绑定一个视频播放音量改变事件。
             * @param e 相关的事件参数。
             * @param sender 触发事件的节点。
             */
            onVolumeChange: (e: Event, sender?: this) => any;

            /**
             * 绑定一个视频等待事件。
             * @param e 相关的事件参数。
             * @param sender 触发事件的节点。
             */
            onWaiting: (e: Event, sender?: this) => any;

            /**
             * 绑定一个终止事件。
             * @param e 相关的事件参数。
             * @param sender 触发事件的节点。
             */
            onAbort: (e: UIEvent, sender?: this) => any;

            /**
             * 绑定一个载入事件。
             * @param e 相关的事件参数。
             * @param sender 触发事件的节点。
             */
            onLoad: (e: Event, sender?: this) => any;

            /**
             * 绑定一个载入错误事件。
             * @param e 相关的事件参数。
             * @param sender 触发事件的节点。
             */
            onError: (e: ErrorEvent, sender?: this) => any;

            /**
             * 绑定一个域内容改变事件。
             * @param e 相关的事件参数。
             * @param sender 触发事件的节点。
             */
            onCueChange: (e: Event, sender?: this) => any;

        }

    }

}
