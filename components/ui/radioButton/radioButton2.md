# 单选按钮

```tsx demo
<div>
    <RadioButton name="xx" onChange={console.log}>你好</RadioButton>
    <RadioButton name="xx" onChange={console.log} checked>你好</RadioButton>
</div>
```

# 单选按钮
单选按钮。

## 原生样式
```htm
<label><input type="radio" name="radio1"> 默认</label>
<label><input type="radio" name="radio1"> 默认</label>
<label><input type="radio" name="radio1" disabled="disabled" checked="checked"> 禁用</label>
```

## 自定义样式
```htm
<label>
    <input type="radio" class="x-checkbox-button" name="radio1">
    <i class="x-icon">◯</i>
    <i class="x-icon">🖸</i>
    默认
</label>

<label>
    <input type="radio" class="x-checkbox-button" name="radio1">
    <i class="x-icon">◯</i>
    <i class="x-icon">🖸</i>
    默认
</label>

<label>
    <input type="radio" class="x-checkbox-button" disabled="disabled" name="radio1">
    <i class="x-icon">◯</i>
    <i class="x-icon">🖸</i>
    禁用
</label>
```


## 自动初始化
```htm
<label><input type="radio" name="radio1" x-role="checkBox"> 默认</label>
<label><input type="radio" name="radio1" x-role="checkBox" disabled="disabled" checked="checked"> 禁用</label>
```
