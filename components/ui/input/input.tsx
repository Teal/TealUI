import * as dom from "ux/dom";
import Control, { VNode, bind } from "ui/control";
import { Status, getStatus, setStatus } from "ux/status";
import ToolTip from "ui/toolTip";

/**
 * 表示一个输入控件。
 */
export default class Input extends Control {

    protected render() {
        return <input type="hidden" />;
    }

    /**
     * 获取真正存储输入值的 HTML 元素。
     */
    get input() {
        return (dom.find(this.elem, "input,select,textarea") || this.elem) as HTMLInputElement;
    }

    protected init() {
        if (this.validateEvent) {
            dom.on(this.input, this.validateEvent, this.reportValidity, this);
        }
    }

    /**
     * 字段名。
     */
    @bind("@input", "name") name: string;

    /**
     * 字段值。
     */
    get value() { return this.input.value as any; }
    set value(value) {
        this.input.value = value;
        if (!this.hasOwnProperty("defaultValue")) {
            this.defaultValue = value;
        }
    }

    /**
     * 默认值。
     */
    defaultValue: this["value"];

    /**
     * 输入框的类型。
     */
    @bind("@input", "type") type: string;

    /**
     * 未输入内容时的占位符。
     */
    @bind("@input", "placeholder") placeholder: string;

    /**
     * 是否禁用。
     */
    @bind("@input", "disabled") disabled: boolean;

    /**
     * 是否只读。
     */
    @bind("@input", "readOnly") readOnly: boolean;

    /**
     * 复制事件。
     * @see https://developer.mozilla.org/zh-CN/docs/Web/API/GlobalEventHandlers/oncopy
     */
    @bind("@input", "onCopy") onCopy: (e: ClipboardEvent, sender: this) => void;

    /**
     * 剪切事件。
     * @see https://developer.mozilla.org/zh-CN/docs/Web/API/GlobalEventHandlers/oncut
     */
    @bind("@input", "onCut") onCut: (e: ClipboardEvent, sender: this) => void;

    /**
     * 粘贴事件。
     * @see https://developer.mozilla.org/zh-CN/docs/Web/API/GlobalEventHandlers/onpaste
     */
    @bind("@input", "onPaste") onPaste: (e: ClipboardEvent, sender: this) => void;

    /**
     * 即将复制事件。
     * @see https://msdn.microsoft.com/zh-cn/library/aa769320.ASPX
     */
    @bind("@input", "onBeforeCopy") onBeforeCopy: (e: ClipboardEvent, sender: this) => void;

    /**
     * 即将剪切事件。
     * @see https://msdn.microsoft.com/zh-cn/library/aa769321.aspx
     */
    @bind("@input", "onBeforeCut") onBeforeCut: (e: ClipboardEvent, sender: this) => void;

    /**
     * 即将粘贴事件。
     * @see https://msdn.microsoft.com/zh-cn/library/aa769324.aspx
     */
    @bind("@input", "onBeforePaste") onBeforePaste: (e: ClipboardEvent, sender: this) => void;

    /**
     * 获取焦点事件。
     * @see https://developer.mozilla.org/zh-CN/docs/Web/API/GlobalEventHandlers/nfocus
     */
    @bind("@input", "onFocus") onFocus: (e: FocusEvent, sender: this) => void;

    /**
     * 失去焦点事件。
     * @see https://developer.mozilla.org/zh-CN/docs/Web/API/GlobalEventHandlers/onblur
     */
    @bind("@input", "onBlur") onBlur: (e: FocusEvent, sender: this) => void;

    /**
     * 当前元素和子元素获取焦点事件。
     * @see https://msdn.microsoft.com/zh-CN/library/ms536935(VS.85).aspx
     */
    @bind("@input", "onFocusIn") onFocusIn: (e: FocusEvent, sender: this) => void;

    /**
     * 当前元素和子元素失去焦点事件。
     * @see https://msdn.microsoft.com/zh-CN/library/ms536936(VS.85).aspx
     */
    @bind("@input", "onFocusOut") onFocusOut: (e: FocusEvent, sender: this) => void;

    /**
     * 输入事件。
     * @see https://developer.mozilla.org/zh-CN/docs/Web/API/GlobalEventHandlers/oninput
     */
    @bind("@input", "onInput") onInput: (e: Event, sender: this) => void;

    /**
     * 更改事件。
     * @see https://developer.mozilla.org/zh-CN/docs/Web/API/GlobalEventHandlersonchange
     */
    @bind("@input", "onChange") onChange: (e: Event, sender: this) => void;

    /**
     * 键盘按下事件。
     * @see https://developer.mozilla.org/zh-CN/docs/Web/API/GlobalEventHandlers/onkeydown
     */
    @bind("@input", "onKeyDown") onKeyDown: (e: KeyboardEvent, sender: this) => void;

    /**
     * 键盘点击事件。
     * @see https://developer.mozilla.org/zh-CN/docs/Web/API/GlobalEventHandlers/onkeypress
     */
    @bind("@input", "onKeyPress") onKeyPress: (e: KeyboardEvent, sender: this) => void;

    /**
     * 键盘按上事件。
     * @see https://developer.mozilla.org/zh-CN/docs/Web/API/GlobalEventHandlers/onkeyup
     */
    @bind("@input", "onKeyUp") onKeyUp: (e: KeyboardEvent, sender: this) => void;

    /**
     * 触发验证的事件。
     */
    validateEvent: string | null;

    /**
     * 是否禁用验证。
     */
    noValidate: boolean;

    /**
     * 字段是否必填。
     */
    required: boolean;

    /**
     * 字段不满足必填时的提示文案。
     */
    requiredMessage: string;

    /**
     * 最大长度。-1 表示不限制。
     */
    maxLength: number;

    /**
     * 字段不满足最大长度时的提示文案。
     */
    maxLengthMessage: string;

    /**
     * 最小长度。-1 表示不限制。
     */
    minLength: number;

    /**
     * 字段不满足最小长度时的提示文案。
     */
    minLengthMessage: string;

    /**
     * 最大值。
     */
    max: any;

    /**
     * 字段不满足最大值时的提示文案。
     */
    maxMessage: string;

    /**
     * 最小值。
     */
    min: any;

    /**
     * 字段不满足最小值时的提示文案。
     */
    minMessage: string;

    /**
     * 匹配格式的正则表达式。
     */
    pattern: RegExp;

    /**
     * 字段不满足格式时的提示文案。
     */
    patternMessage: string;

    /**
     * 验证失败的提示文案。
     */
    validateErrorMessage: string;

    /**
     * 开始异步验证的提示文案。
     */
    validateStartMessage: string;

    /**
     * 异步验证失败的提示文案。
     */
    validateFailMessage: string;

    /**
     * 验证信息状态的提示文案前缀。
     */
    validateInfoMessagePrefix: string;

    /**
     * 验证失败状态的提示文案前缀。
     */
    validateErrorMessagePrefix: string;

    /**
     * 验证警告状态的提示文案前缀。
     */
    validateWarningMessagePrefix: string;

    /**
     * 验证成功状态的提示文案前缀。
     */
    validateSuccessMessagePrefix: string;

    /**
     * 本地化提示文案。
     */
    static locale = {
        requiredMessage: `该字段为必填的`,
        maxLengthMessage: `该字段最大长度为 {bound}，超出 {delta}`,
        minLengthMessage: `该字段最少长度为 {bound}，缺少 {delta}`,
        maxMessage: `该字段最大为 {bound}`,
        minMessage: `该字段最小为 {bound}`,
        patternMessage: `该字段格式不正确`,
        validateErrorMessage: `该字段存在错误`,
        validateStartMessage: `<i class="x-icon x-spin">҉</i> 正在验证中...`,
        validateFailMessage: `无法验证：{reason}`,
        validateInfoMessagePrefix: `<i class="x-icon">🛈</i> `,
        validateSuccessMessagePrefix: `<i class="x-icon">✓</i> `,
        validateWarningMessagePrefix: `<i class="x-icon">⚠</i> `,
        validateErrorMessagePrefix: `<i class="x-icon">&#10071;</i> `
    };

    /**
     * 验证当前输入域。
     * @return 返回验证结果。如果正在执行异步验证则返回一个确认对象。
     */
    checkValidity(): NormalizedValidityResult | Promise<NormalizedValidityResult> {

        // 测试是否已填数据。
        const value = this.value;
        if (value == null || (typeof value === "string" || Array.isArray(value)) && value.length === 0) {
            if (this.required) {
                return { valid: false, status: "error", message: this.requiredMessage };
            }
            return { valid: true, status: "success", message: null };
        }

        // 执行内置验证。
        const result = this.normlizeValidityResult(this.validate(value));
        if (result instanceof Promise) {
            return result.then(result => {
                if (!result.valid) {
                    return result;
                }
                // 执行自定义验证。
                if (this.onValidate) {
                    return this.normlizeValidityResult(this.onValidate(value, this));
                }
                // 验证成功。
                return result;
            });
        }
        if (!result.valid) {
            return result;
        }
        // 执行自定义验证。
        if (this.onValidate) {
            return this.normlizeValidityResult(this.onValidate(value, this));
        }
        // 验证成功。
        return result;
    }

    /**
     * 判断当前输入域是否需要验证。
     */
    get willValidate() {
        if (this.noValidate || this.readOnly || this.disabled || this.hidden) {
            return false;
        }
        if (this.onValidate || this.required || this.maxLength >= 0 || this.minLength >= 0 || this.max != null || this.min != null || this.pattern) {
            return true;
        }
        return false;
    }

    /**
     * 当被子类重写时负责验证指定的值。
     * @param value 要验证的值。
     * @return 返回验证结果。如果正在执行异步验证则返回一个确认对象。
     */
    protected validate(value: this["value"]): ValidityResult {
        if (this.maxLength >= 0 && (value as any).length > this.maxLength) {
            return this.maxLengthMessage.replace("{bound}", this.maxLength as any).replace("{delta}", ((value as any).length - this.maxLength) as any);
        }
        if (this.minLength >= 0 && (value as any).length < this.minLength) {
            return this.minLengthMessage.replace("{bound}", this.minLength as any).replace("{delta}", (this.minLength - (value as any).length) as any);
        }
        if (this.max != null && value > this.max) {
            return this.maxMessage.replace("{bound}", this.max as any);
        }
        if (this.min != null && value < this.min) {
            return this.minMessage.replace("{bound}", this.min as any);
        }
        if (this.pattern && !this.pattern.test(value)) {
            return this.patternMessage.replace("{bound}", this.pattern as any);
        }
        return "";
    }

    /**
     * 验证事件。
     * @param value 要验证的值。
     * @param sender 触发事件的源。
     * @return 返回验证结果。如果正在执行异步验证则返回一个确认对象。
     */
    onValidate: (value: this["value"], sender: this) => ValidityResult;

    /**
     * 规范化验证结果对象。
     * @param result 用户返回的验证结果。
     * @param 返回已格式化的严重结果。
     */
    protected normlizeValidityResult(result: ValidityResult): NormalizedValidityResult | Promise<NormalizedValidityResult> {
        if (result instanceof Promise) {
            return result.then(r => this.normlizeValidityResult(r));
        }
        if (typeof result === "boolean") {
            result = result ? "" : this.validateErrorMessage;
        }
        if (typeof result === "string") {
            return {
                valid: !result,
                status: result ? "error" : "success",
                message: result ? this.validateErrorMessagePrefix + result : this.validateSuccessMessagePrefix + "",
            };
        }
        result.message = result.message || "";
        if (result.valid == undefined) {
            result.valid = !result.status || result.status === "success";
        }
        return result as NormalizedValidityResult;
    }

    /**
     * 向用户报告验证结果。
     * @return 返回验证结果。如果正在执行异步验证则返回一个确认对象。
     */
    reportValidity() {
        const result = this.willValidate ? this.checkValidity() : { valid: true, status: null, message: null };
        if (result instanceof Promise) {
            if (!this._validatePromise) {
                this.setCustomValidity({ valid: false, status: "warning", message: this.validateStartMessage });
            }
            const promise = this._validatePromise = result.then(result => {
                if (this._validatePromise === promise) {
                    delete this._validatePromise;
                    this.setCustomValidity(result);
                }
                return result;
            }, (reason: string) => {
                const result = this.normlizeValidityResult(this.validateFailMessage.replace("{reason}", reason)) as NormalizedValidityResult;
                if (this._validatePromise === promise) {
                    delete this._validatePromise;
                    this.setCustomValidity(result);
                }
                return result;
            });
            return promise;
        }
        this.setCustomValidity(result);
        return result;
    }

    /**
     * 存储最后一次确认对象。
     */
    private _validatePromise: Promise<NormalizedValidityResult>;

    /**
     * 设置自定义的验证消息。
     * @param validityResult 要报告的验证结果。
     */
    setCustomValidity(validityResult: string | boolean | Partial<NormalizedValidityResult>) {
        validityResult = this.normlizeValidityResult(validityResult) as NormalizedValidityResult;

        // 更新状态。
        this.status = validityResult.status!;

        // 自定义错误报告。
        if (this.onReportValidity && this.onReportValidity(validityResult as NormalizedValidityResult, this) === false) {
            return;
        }

        // 成功状态且没有设置消息则关闭提示。
        const successWithNoMessage = this.status === "success" && (!validityResult.message || validityResult.message === this.validateSuccessMessagePrefix);
        const tip = dom.next(this.elem, ".x-tip,.x-tipbox");
        if (tip) {
            const isTipBox = dom.hasClass(tip, "x-tipbox");
            setStatus(tip, isTipBox ? "x-tipbox-" : "x-tip-", this.status);
            tip.innerHTML = validityResult.message!;
            if (isTipBox) {
                dom.toggle(tip, !!this.status);
                dom.toggleClass(tip, "x-transparent", successWithNoMessage);
            } else {
                dom.toggle(tip, !!this.status && !successWithNoMessage);
            }
        } else {
            let validityToolTip = this._validityToolTip;
            if (this.status && !successWithNoMessage) {
                if (!validityToolTip) {
                    this._validityToolTip = validityToolTip = new ToolTip();
                    validityToolTip.event = "focusin";
                    validityToolTip.target = this.elem;
                    validityToolTip.onShow = () => {
                        if (!this.status || this.status === "success") {
                            this._validityToolTip.hide();
                        }
                    };
                    Object.assign(validityToolTip, this.validityToolTipOptions);
                    dom.after(this.elem, validityToolTip.elem);
                }
                const arrow = dom.first(validityToolTip.elem, ".x-arrow");
                validityToolTip.elem.innerHTML = validityResult.message!;
                if (arrow) dom.prepend(validityToolTip.elem, arrow);
                validityToolTip.show();
            } else if (validityToolTip) {
                validityToolTip.hide();
            }
        }
    }

    /**
     * 验证工具提示的选项。
     */
    validityToolTipOptions: Partial<ToolTip>;

    /**
     * 用于报告验证失败的工具提示。
     */
    private _validityToolTip: ToolTip;

    /**
     * 报告验证结果事件。
     * @param validityResult 要报告的验证结果。
     * @param sender 触发事件的源。
     * @return 返回 false 禁用默认报告器。
     */
    onReportValidity: (validityResult: NormalizedValidityResult, sender: this) => boolean | void;

    /**
     * 控件状态。
     */
    get status() {
        return getStatus(this.elem, this.statusClassPrefix);
    }
    set status(value) {
        setStatus(this.elem, this.statusClassPrefix, value);
    }

    /**
     * 控件状态前缀。
     */
    statusClassPrefix: string;

    /**
     * 重置当前输入域。
     */
    reset() {
        this.setCustomValidity({ valid: true, status: null, message: null });
        this.value = this.defaultValue;
    }

    /**
     * 令当前控件获得焦点。
     */
    focus() {
        this.input.focus();
    }

    /**
     * 令当前控件失去焦点。
     */
    blur() {
        this.input.blur();
    }
}

for (const key in Input.locale) {
    Input.prototype[key as keyof typeof Input["locale"]] = Input.locale[key as keyof typeof Input["locale"]];
}
Input.prototype.statusClassPrefix = "x-";
Input.prototype.validateEvent = "change";

/**
 * 表示验证的结果。
 */
export type ValidityResult = boolean | string | Partial<NormalizedValidityResult> | Promise<boolean | string | Partial<NormalizedValidityResult>>;

/**
 * 表示已格式化的验证结果。
 */
export interface NormalizedValidityResult {

    /**
     * 验证是否通过。
     */
    valid: boolean;

    /**
     * 验证的结果状态。
     */
    status: Status;

    /**
     * 提示的信息。
     */
    message: string | null;

}
