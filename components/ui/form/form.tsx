import * as dom from "web/dom";
import Control, { VNode, bind } from "ui/control";
import CheckBox from "ui/checkBox";
import Input, { ValidityResult } from "ui/input";
import { scrollIntoViewIfNeeded } from "web/scroll";
import "./form.scss";

/**
 * 表示一个表单。
 */
export default class Form extends Control {

    elem: HTMLFormElement;

    protected render() {
        return <form class="x-form"></form>;
    }

    /**
     * 表单的提交地址。
     */
    @bind("", "action") action: string;

    /**
     * 表单的提交谓词。
     */
    @bind("", "method") method: string;

    /**
     * 改变事件。
     */
    @bind("", "change") onChange: (e: Event, sender: this) => void;

    /**
     * 是否异步提交表单。
     */
    async: boolean;

    /**
     * 是否禁用验证。
     */
    noValidate: boolean;

    /**
     * 判断当前表单是否需要验证。
     */
    get willValidate() {
        return !this.noValidate;
    }

    /**
     * 提交的附加数据。
     */
    data: { [key: string]: any };

    protected init() {
        dom.on(this.elem, "submit", this.handleSubmit, this);
        dom.on(this.elem, "reset", this.handleReset, this);
    }

    /**
     * 处理表单提交事件。
     */
    protected handleSubmit(e: Event) {
        if (!this.action) {
            e.preventDefault();
        }
        if (this.willValidate) {
            const r = this.reportValidity();
            if (r instanceof Promise) {
                // 立即终止当前表单提交。
                // 等待验证成功后重新提交。
                e.preventDefault();
                r.then(r => {
                    if (!r.valid) {
                        return;
                    }
                    const noValidate = this.noValidate;
                    this.noValidate = true;
                    try {
                        this.submit();
                    } finally {
                        this.noValidate = noValidate;
                    }
                });
                return;
            }
            if (!r.valid) {
                e.preventDefault();
                return;
            }
        }

        // 异步提交。
        if (this.async) {
            e.preventDefault();
            // TODO: 异步提交。
            throw ("异步提交功能正在开发,请不要使用");
        } else {
            this.onSubmit && this.onSubmit(e);
        }
    }

    /**
     * 处理表单重置事件。
     */
    protected handleReset(e: Event) {
        e.preventDefault();
        this.getInputs(false, true).forEach(input => input.reset());
    }

    /**
     * 最终提交的数据。
     */
    get value() {
        return this.getValue({ hidden: true });
    }
    set value(value) {
        this.data = { ...value };
        for (const input of this.inputs) {
            if (input.name in value) {
                delete this.data[input.name];
                if (input instanceof CheckBox) {
                    input.value = value[input.name] === input.value || Array.isArray(value[input.name]) && value[input.name].indexOf(input.value) >= 0;
                } else {
                    input.value = value[input.name];
                }
            }
        }
    }

    getValue({ hidden = false, disabled = false }) {
        const r = { ...this.data };
        for (const input of this.inputs) {
            if (input.name) {
                if (disabled == false && input.disabled) {
                    continue;
                }
                if (hidden == false && input.hidden) {
                    continue;
                }
                if (input instanceof CheckBox) {
                    if (input.value) {
                        if (Array.isArray(r[input.name])) {
                            r[input.name].push(input.key);
                        } else if (input.name in r) {
                            r[input.name] = [r[input.name], input.key];
                        } else {
                            r[input.name] = input.key;
                        }
                    }
                } else {
                    r[input.name] = input.value;
                }
            }
        }
        return r;
    }

    /**
     * 获取表单内所有输入域。
     * @param disabled 是否包含禁用的项。
     * @param hidden 是否包含隐藏的项。
     * @return 返回输入域列表。
     */
    getInputs(disabled = false, hidden = false) {
        const r: Input[] = [];
        next: for (const ctrl of this.query("*")) {
            if (!(ctrl instanceof Input) || !disabled && ctrl.disabled || r.indexOf(ctrl) >= 0) {
                continue;
            }
            if (!hidden && !ctrl.elem.offsetHeight) {
                for (let p = ctrl.elem; p; p = p.parentNode as HTMLElement) {
                    if (dom.isHidden(p)) {
                        continue next;
                    }
                }
            }
            r.push(ctrl);
        }
        return r;
    }

    /**
     * 当前表单内的所有输入域。
     */
    get inputs() {
        return this.getInputs(true, true);
    }

    /**
     * 是否禁用。禁用后数据不会被提交到服务端。
     */
    get disabled() {
        return this.getInputs(true, true).every(input => input.disabled);
    }
    set disabled(value: boolean) {
        this.getInputs(true, true).forEach(input => {
            input.disabled = value;
        });
    }

    /**
     * 是否只读。
     */
    get readOnly() {
        return this.getInputs(true, true).every(input => input.readOnly);
    }
    set readOnly(value: boolean) {
        this.getInputs(true, true).forEach(input => {
            input.readOnly = value;
        });
    }

    /**
     * 提交当前表单。
     */
    submit() {
        this.elem.submit();
    }

    /**
     * 重置当前表单。
     */
    reset() {
        this.elem.reset();
    }

    /**
     * 验证表单事件。
     * @param r 当前验证的结果。
     * @return 如果验证失败则返回 true，如果正在执行异步验证则返回一个确认对象。
     */
    onValidate: (r: FormValidityResult) => void | boolean | Promise<boolean>;

    /**
     * 提交表单事件。
     */
    onSubmit: (e: Event) => void;

    /**
     * 验证当前表单内的所有输入域。
     * @return 返回验证后的出错的字段列表。如果返回空数组说明验证成功。如果正在执行异步验证则返回一个确认对象。
     */
    checkValidity() {
        return this._checkValidity();
    }

    /**
     * 向用户报告验证结果。
     */
    reportValidity() {
        return this._checkValidity(true);
    }

    private _checkValidity(report?: boolean) {
        const r: FormValidityResult = {
            valid: true,
            inputs: [],
            results: []
        };
        const promises: Promise<void>[] = [];
        let firstError;
        for (const input of this.inputs) {
            if (input.hidden) {
                continue;
            }
            if (!input.willValidate) {
                continue;
            }
            const inputResult = report ? input.reportValidity() : input.checkValidity();
            if (inputResult instanceof Promise) {
                promises.push(inputResult.then(inputResult => {
                    if (!inputResult.valid) {
                        r.valid = false;
                    }
                    r.inputs.push(input);
                    r.results.push(inputResult);
                }));
            } else {
                if (!inputResult.valid) {
                    r.valid = false;
                    firstError = firstError || input;
                }
                r.inputs.push(input);
                r.results.push(inputResult);
            }
        }
        if (this.onValidate) {
            const newResult = this.onValidate(r);
            if (newResult instanceof Promise) {
                promises.push(newResult.then(newResult => {
                    if (newResult === false) {
                        r.valid = newResult;
                    }
                }));
            } else if (newResult === false) {
                r.valid = newResult;
            }
        }
        if (promises.length) {
            return Promise.all(promises).then(() => r);
        }
        if (report && firstError) {
            scrollIntoViewIfNeeded(firstError.elem);
        }
        return r;
    }

}

/**
 * 表示一个表单验证结果。
 */
export interface FormValidityResult {

    /**
     * 是否验证通过。
     */
    valid: boolean;

    /**
     * 所有验证的字段。
     */
    inputs: Input[];

    /**
     * 所有验证的结果。
     */
    results: ValidityResult[];

}
