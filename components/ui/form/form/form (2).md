# 表单布局
<link rel="stylesheet" href="reset.scss">
<link rel="stylesheet" href="form.scss">
<link rel="stylesheet" href="icon.scss">
<link rel="stylesheet" href="utility.scss">
<link rel="stylesheet" href="tip.scss">
<link rel="stylesheet" href="../tipBox/tipBox.scss">
<link rel="stylesheet" href="../textBox/textBox.scss">
<link rel="stylesheet" href="../button/button.scss">

## 水平布局

```htm
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

```htm
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
