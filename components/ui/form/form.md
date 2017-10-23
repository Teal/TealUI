---
version: 0.0.1
author: xuld <xuld@vip.qq.com>
import:
    - typo/reset
    - typo/icon
    - typo/util
    - typo/tip
---
# 表单布局

```jsx demo
import { VNode, render } from "ui/control";
import Form from "ui/form";
import { ListItem } from "ui/listBox";
import Select from "ui/select";
import TextBox from "ui/textBox";
import Button from "ui/button";

render(
    __root__,
    <Form class="x-form-horizontal" method="GET" onValidate={()=>false}>
        <div class="x-form-field">
            <label class="x-form-label">账号名<span class="x-tip x-tip-error">*</span>:</label>
            <div class="x-form-input"><TextBox name="uid" value="默认值"></TextBox></div>
            
            <label class="x-form-label">身份证<span class="x-tip x-tip-error">*</span>:</label>
            <div class="x-form-input"><TextBox name="cid" pattern={/^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}(\d|x|X)$/}></TextBox></div>
        </div>
        <div class="x-form-field">
            <label class="x-form-label">选择框<span class="x-tip x-tip-error">*</span>:</label>
            <div class="x-form-input">
                <Select name="sb" placeholder="请选择">
                    <ListItem>A</ListItem>
                    <ListItem>B</ListItem>
                    <ListItem>C</ListItem>
                    <ListItem>D</ListItem>
                </Select>
            </div>

            <label class="x-form-label"></label>
            <div class="x-form-input">
                <Button type="submit" class="x-button-primary x-space"><i class="x-icon">🔍</i> 查询</Button>
                <Button type="reset">重置</Button>
            </div>
        </div>
    </Form>
)
```

## 水平布局

```html demo
<form class="x-form" action="###">
     <div class="x-form-field">
        <label class="x-form-label">账号名<span class="x-tip x-tip-error">*</span>:</label>
        <div class="x-form-input"><input type="text" class="x-textbox"></div>
        
        <label class="x-form-label">账号<span class="x-tip x-tip-error">*</span>:</label>
        <div class="x-form-input"><input type="text" class="x-textbox"></div>
        
        <label class="x-form-label">账号<span class="x-tip x-tip-error">*</span>:</label>
        <div class="x-form-input">
            <input type="text" class="x-textbox"><br>
            <input type="text" class="x-textbox">
        </div>
     </div>
     
     <div class="x-form-field">
        <label class="x-form-label">账号名字<span class="x-tip x-tip-error">*</span>:</label>
        <div class="x-form-input">
            <textarea class="x-textbox"></textarea>
        </div>
        
        <label class="x-form-label">账<span class="x-tip x-tip-error">*</span>:</label>
        <div class="x-form-input"><input type="text" class="x-textbox"></div>

        <label class="x-form-label">账<span class="x-tip x-tip-error">*</span>:</label>
        <div class="x-form-input"><input type="text" class="x-textbox"></div>
     </div>
     
     <div class="x-form-field">
        <label class="x-form-label"></label>
        <div class="x-form-input"><input type="button" class="x-button" value="提交"></div>
     </div>
</form>
```

```html demo
<form class="x-form" action="###">
    <div class="x-form-field">
        <label class="x-form-label">账号名<span class="x-tip x-tip-error">*</span>:</label>
        <div class="x-form-input">
            <input type="text" class="x-textbox x-textbox-error">
            <span class="x-tipbox x-tipbox-error">错误</span>
        </div>
    </div>
    <div class="x-form-field">
        <label class="x-form-label">验证码:</label>
        <div class="x-form-input">
            <input type="text" class="x-textbox" />
            <a href="###"><img src="../../../assets/resources/100x100.png" height="34" /></a>
            <a href="###">看不清，换一张</a>
        </div>
    </div>
    <div class="x-form-field">
        <label class="x-form-label"></label>
        <div class="x-form-input">
            <label><input type="checkbox" checked /> 同意<a href="###">用户协议</a></label>
        </div>
    </div>
    <div class="x-form-field">
        <label class="x-form-label"></label>
        <div class="x-form-input">
            <button type="submit" class="x-button">确定</button>
        </div>
    </div>
</form>
```

当在手机上，水平布局会自动改为垂直布局。

> 另参考 [表单验证(validator)](validator.html)。
