## 输入框控件

输入框控件是一个抽象的控件基类，所有表单控件都继承于输入框控件。控件内部会自动生成一个隐藏域，以确保表单是数据可以被正确提交到服务器，通过 `getValue/setValue` 可以读写输入框的值。

## 基本用法

<aside class="doc-demo"><input type="text" x-role="input"></aside>

## API

##### 获取值

<pre>$('[x-role="input"]').role().getValue()</pre>

##### 设置值

<pre>$('[x-role="input"]').role().setValue('TealUI')</pre>

##### 设置禁用

<pre>$('[x-role="input"]').role().setState('disabled')</pre>

##### 取消禁用

<pre>$('[x-role="input"]').role().setState('disabled', false)</pre>

##### 设置只读

<pre>$('[x-role="input"]').role().setState('readOnly')</pre>

##### 获取只读

<pre>$('[x-role="input"]').role().getState('readOnly')</pre>