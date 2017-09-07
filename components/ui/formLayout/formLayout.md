---
version: 0.0.1
author: xuld <xuld@vip.qq.com>
import:
    - typo/reset
    - typo/grid
---

# 表单布局
表单布局

## HTML
```html demo
<table class="x-form">
    <tr>
        <th><label>四字字段<span class="x-form-required">*</span>：</label></th>
        <td><input class="x-col-24"></td>
        <th><label>字段<span class="x-form-required">*</span>：</label></th>
        <td><input class="x-col-24"></td>
        <th><label>字段<span class="x-form-required">*</span>：</label></th>
        <td><input class="x-col-24"></td>
    </tr>
    <tr>
        <th><label>字段<span class="x-form-required">*</span>：</label></th>
        <td colspan="3"><input class="x-col-24"></td>
        <th><label>字段<span class="x-form-required">*</span>：</label></th>
        <td><input class="x-col-24"></td>
    </tr>
    <tr>
        <th><label>字段<span class="x-form-required">*</span>：</label></th>
        <td colspan="3">
            <div class="x-row">
                <div class="x-col x-col-12">
                    <input class="x-col-24">
                </div>
                <div class="x-col x-col-12">
                    <input class="x-col-24">
                </div>
            </div>
        </td>
        <th><label>字段<span class="x-form-required">*</span>：</label></th>
        <td><input class="x-col-24"></td>
    </tr>
</table>
```

## 基本用法

```tsx demo
import { VNode, from } from "ui/control";
import FormLayout, { FormRow, FormItem } from "ui/formLayout";

from(<FormLayout>
    <FormRow>
        <FormItem label="四字字段：">
            <input>
        </FormItem>
        <FormItem label="你好：">
            <input>
            <input>
        </FormItem>
    </FormRow>
</FormLayout>).renderTo(__demo__);
```
