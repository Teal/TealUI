import ajax, { Ajax } from "web/ajax";

/**
 * 异步提交表单数据。
 * @param elem 要提交的表单元素。
 * @param success 成功回调函数。
 * @param error 错误回调函数。
 * @param options 附加的额外选项。
 * @return 返回请求对象。
 * @example ajaxSubmit(document.getElementById("form"))
 */
export default function ajaxSubmit(elem: HTMLFormElement, success?: Ajax["success"], error?: Ajax["error"], options?: Partial<Ajax>) {
    const data = formData(elem);
    options = {
        type: elem.method,
        url: elem.action,
        withCredentials: true,
        data: data,
        success: success,
        error: error,
        ...options
    };
    if(!(data instanceof FormData) && !options.contentType) {
        options.contentType = elem.enctype;
    }
    return ajax(options);
}

/**
 * 获取表单的数据。
 * @param formElem 表单元素。
 * @param disabled 是否包含被禁用的元素。
 * @return 返回表单数据。如果表单不包含文件域，返回 JSON 对象。否则返回 FormData 对象。
 * @example formData(document.getElementById("form"))
 */
export function formData(formElem: HTMLFormElement, disabled = false) {
    const r: { [key: string]: string | string[] } = {};
    let formData: FormData | undefined;
    for (const input of formElem as any as (HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement)[]) {
        const name = input.name;
        if (name && (disabled || !input.disabled)) {
            switch (input.type) {
                case "select-multiple":
                    for (const option of (input as HTMLSelectElement).options as any as HTMLOptionElement[]) {
                        if (option.selected) {
                            addValue(r, name, option.value || option.text);
                        }
                    }
                    break;
                case "radio":
                    if ((input as HTMLInputElement).checked) {
                        addValue(r, name, input.value || "on");
                    }
                    break;
                case "checkbox":
                    if ((input as HTMLInputElement).checked) {
                        addValue(r, name, input.value || "on");
                    }
                    break;
                case "file":
                    formData = formData || new FormData();
                    if ((input as HTMLInputElement).files) {
                        for (const file of (input as HTMLInputElement).files! as any as File[]) {
                            formData.append(name, file);
                        }
                    }
                    break;
                default:
                    addValue(r, name, input.value);
                    break;
            }
        }
    }
    if (formData) {
        for (const key in r) {
            const value = r[key];
            if (Array.isArray(value)) {
                for (const item of value) {
                    formData.append(key, item);
                }
            } else {
                formData.append(key, value);
            }
        }
        return formData;
    }
    return r;
}

function addValue(r: { [key: string]: string | string[] }, key: string, value: string) {
    const exists = r[key];
    if (Array.isArray(exists)) {
        exists.push(value);
    } else if (exists != undefined) {
        r[key] = [exists, value];
    } else {
        r[key] = value;
    }
}
