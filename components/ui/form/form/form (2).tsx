import Control, { VNode, bind } from "ui/control";
import { CheckBoxBase } from "ui/checkBox";
import Input, { ValidityResult } from "ui/input";
import { scrollIntoViewIfNeeded } from "util/scroll";
import "./form.scss";

/**
 * 表示一个表单。
 */
export default class Form extends Control {

    elem: HTMLFormElement;

    protected render() {
        return <form class="x-form" onSubmit={this.handleSubmit} onReset={this.handleReset}></form>;
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
     * 是否异步提交表单。
     */
    async: boolean;

    /**
     * 是否禁用验证。
     */
    noValidate: boolean;

    /**
     * 提交的附加数据。
     */
    data: { [key: string]: any };

    /**
     * 最终提交的数据。
     */
    get value() {
        const result = { ...this.data };
        for (const input of this.inputs) {
            if (input.name && !input.disabled) {
                if (input instanceof CheckBoxBase) {
                    if (input.checked) {
                        if (Array.isArray(result[input.name])) {
                            result[input.name].push(input.value);
                        } else if (input.name in result) {
                            result[input.name] = [result[input.name], input.value];
                        } else {
                            result[input.name] = input.value;
                        }
                    }
                } else {
                    result[input.name] = input.value;
                }
            }
        }
        return result;
    }
    set value(value) {
        this.data = { ...value };
        for (const input of this.inputs) {
            if (input.name in value) {
                delete this.data[input.name];
                if (input instanceof CheckBoxBase) {
                    input.checked = value[input.name] === input.value || Array.isArray(value[input.name]) && value[input.name].indexOf(input.value) >= 0;
                } else {
                    input.value = value[input.name];
                }
            }
        }
    }

    /**
     * 是否禁用。禁用后数据不会被提交到服务端。
     */
    get disabled() {
        return (this.inputs[0] || 0).disabled;
    }
    set disabled(value: boolean) {
        this.inputs.forEach(input => { input.disabled = value; });
    }

    /**
     * 是否只读。
     */
    get readOnly() {
        return (this.inputs[0] || 0).readOnly;
    }
    set readOnly(value: boolean) {
        this.inputs.forEach(input => { input.readOnly = value; });
    }

    /**
     * 当前表单内的所有输入域。
     */
    get inputs() {
        return this.query("*").filter(ctrl => ctrl instanceof Input) as Input[];
    }

    /**
     * 判断当前表单是否需要验证。
     */
    get willValidate() {
        return !this.noValidate && !this.disabled;
    }

    /**
     * 处理表单提交事件。
     */
    protected handleSubmit = (e: Event) => {
        if (this.willValidate) {
            const result = this.reportValidity();
            if (result instanceof Promise) {
                // 立即终止当前表单提交。
                // 等待验证成功后重新提交。
                e.preventDefault();
                result.then(result => {
                    if (!result.valid) {
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
            if (!result.valid) {
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
    protected handleReset = (e: Event) => {
        this.inputs.forEach(input => input.reset());
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
     * @param result 当前验证的结果。
     * @return 如果验证失败则返回 true，如果正在执行异步验证则返回一个确认对象。
     */
    onValidate: (result: FormValidityResult) => void | boolean | Promise<boolean>;

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
        const result: FormValidityResult = {
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
            const inputResult = report ? input.reportValidity() : input.checkValidity();
            if (inputResult instanceof Promise) {
                promises.push(inputResult.then(inputResult => {
                    if (!inputResult.valid) {
                        result.valid = false;
                    }
                    result.inputs.push(input);
                    result.results.push(inputResult);
                }));
            } else {
                if (!inputResult.valid) {
                    result.valid = false;
                    firstError = firstError || input;
                }
                result.inputs.push(input);
                result.results.push(inputResult);
            }
        }
        if (this.onValidate) {
            const newResult = this.onValidate(result);
            if (newResult instanceof Promise) {
                promises.push(newResult.then(newResult => {
                    if (newResult === false) {
                        result.valid = newResult;
                    }
                }));
            } else if (newResult === false) {
                result.valid = newResult;
            }
        }
        if (promises.length) {
            return Promise.all(promises).then(() => result);
        }
        if (report && firstError) {
            scrollIntoViewIfNeeded(firstError.elem, true);
        }
        return result;
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
