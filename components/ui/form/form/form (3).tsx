import { Control, VNode, bind } from "control";
import "./form.scss";
import { Input } from "input/input";

/**
 * 表示一个表单。
 */
export class Form extends Control {

    elem: HTMLFormElement;

    /**
     * 当被子类重写时负责渲染当前控件。
     * @return 返回一个虚拟节点。
     */
    protected render() {
        return <form class="x-form" onSubmit={this.handleSubmit}></form>;
    }

    noValidate: boolean;

    protected handleSubmit = (e: Event) => {

        // 验证表单内所有字段。
        if (!this.noValidate) {
            const result = this.reportValidity();
            if (result instanceof Promise) {
                // 立即终止当前表单提交。
                // 等待验证成功后重新提交。
                e.preventDefault();
                result.then(result => {
                    if (result.length) {
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
            if (result.length) {
                e.preventDefault();
                return;
            }
        }

        // 验证通过开始提交。
        if (this.onBeforeSubmit && this.onBeforeSubmit(e) === false) {
            e.preventDefault();
            return;
        }

        // 异步提交。
        if (this.async) {
            e.preventDefault();
        } else {
            this.onSubmit && this.onSubmit(e);
        }
    }

    submit() {
        this.elem.submit();
    }

    reset() {
        this.elem.reset();
    }

    @bind("", "action")
    action: string;

    async: boolean;

    onBeforeSubmit: (e: Event) => void | boolean;

    onSubmit: (e: Event) => void;

    /**
     * 当前表单内的所有输入控件。
     */
    get inputs() {
        const result: Input[] = [];
        const elems = this.elem.getElementsByTagName("*");
        for (let i = 0; elems[i]; i++) {
            const elem = elems[i] as HTMLElement;
            if (elem.__control__ instanceof Input) {
                result.push(elem.__control__);
            }
        }
        return result;
    }

    /**
     * 验证当期表单内的所有输入域。
     * @return 返回验证后的出错的字段列表。如果返回空数组说明验证成功。
     */
    checkValidity() {
        const inputs = this.inputs;
        const promises: Promise<string>[] = [];
        const result: Input[] = [];
        for (const input of inputs) {
            const inputResult = input.checkValidity();
            if (inputResult instanceof Promise) {
                promises.push(inputResult.then(r => {
                    if (r) {
                        result.push(input);
                    }
                    return r;
                }));
            } else if (inputResult) {
                result.push(input);
            }
        }
        if (promises.length) {
            return Promise.all(promises).then(() => result);
        }
        return result;
    }

    /**
     * 向用户报告验证结果。
     */
    reportValidity() {
        const inputs = this.inputs;
        const promises: Promise<string>[] = [];
        const result: Input[] = [];
        for (const input of inputs) {
            const inputResult = input.reportValidity();
            if (inputResult instanceof Promise) {
                promises.push(inputResult.then(r => {
                    if (r) {
                        result.push(input);
                    }
                    return r;
                }));
            } else if (inputResult) {
                result.push(input);
            }
        }
        if (promises.length) {
            return Promise.all(promises).then(() => result);
        }
        return result;
    }

    /**
     * 清空验证结果。
     */
    resetValidity() {
        this.inputs.forEach(input => input.resetValidity());
    }

}

export default Form;
