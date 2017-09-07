import ajax, { Ajax } from "ux/ajax";

/**
 * Ajax 异步提交表单。
 * @param formElem 要提交的表单元素。
 * @param success 成功回调函数。
 * @param error 错误回调函数。
 * @param options 附加的额外选项。
 * @return 如果未设置任何回调函数则返回一个确认对象。
 * @example ajaxSubmit(document.getElementById("form"))
 */
export default function ajaxSubmit(formElem: HTMLFormElement, success?: Ajax["success"], error?: Ajax["error"], options?: Partial<Ajax>) {
	return ajax({
		type: formElem.method,
		url: formElem.action,
		contentType: formElem.enctype,
		withCredentials: true,
		data: formData(formElem),
		success: success,
		error: error,
		...options
	});
}

/**
 * 获取表单的数据。
 * @param formElem 表单元素。
 * @param disabled 是否包含被禁用的元素。
 * @return 返回表单数据。
 * @example formData(document.getElementById("form"))
 */
export function formData(formElem: HTMLFormElement, disabled = false) {
	const result: { [key: string]: string | string[] } = {};
	let formData: FormData | undefined;
	for (const input of formElem as any as (HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement)[]) {
		const name = input.name;
		if (name && (disabled || !input.disabled)) {
			switch (input.type) {
				case "select-multiple":
					for (const option of (input as HTMLSelectElement).options as any as HTMLOptionElement[]) {
						if (option.selected) {
							addValue(result, name, option.value || option.text);
						}
					}
					break;
				case "radio":
					if ((input as HTMLInputElement).checked) {
						addValue(result, name, input.value || "on");
					}
					break;
				case "checkbox":
					if ((input as HTMLInputElement).checked) {
						addValue(result, name, input.value || "on");
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
					addValue(result, name, input.value);
					break;
			}
		}
	}
	if (formData) {
		for (const key in result) {
			const value = result[key];
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
	return result;
}

function addValue(result: { [key: string]: string | string[] }, key: string, value: string) {
	const exists = result[key];
	if (Array.isArray(exists)) {
		exists.push(value);
	} else if (exists != undefined) {
		result[key] = [exists, value];
	} else {
		result[key] = value;
	}
}
