import * as assert from "assert";
import * as ajaxSubmit from "./ajaxSubmit";

export function formDataTest() {
    document.getElementById("qunit-fixture")!.innerHTML = `<form action="" method="get" id="form">
    <input type="text" name="text" value="t1">
    <input type="text" name="text" value="t2" readonly="readonly"> 
    <input type="text" name="text" value="t3" disabled="disabled"> 
    <input type="checkbox" name="checkbox" value="c1" checked="checked"> 
    <input type="checkbox" name="checkbox" value="c2" checked="checked"> 
    <select name="multipleselect" multiple="multiple" size="2" id="s"> 
        <option value="s1">s1</option> 
        <option value="s2" selected="selected">s2</option> 
        <option value="s3">s3</option> 
        <option value="s4" selected="selected">s4</option> 
        <option value="s5">s5</option> 
    </select> 
    <input type="submit" value="提交">
</form>`;
    assert.deepEqual(ajaxSubmit.formData(document.getElementById("form") as HTMLFormElement), { "text": ["t1", "t2"], "checkbox": ["c1", "c2"], "multipleselect": ["s2", "s4"] });

    document.getElementById("qunit-fixture")!.innerHTML = `<form action="" method="get" id="form">
    <input type="text" name="text" value="t1">
    <input type="text" name="text" value="t2" readonly="readonly"> 
    <input type="text" name="text" value="t3" disabled="disabled"> 
    <input type="checkbox" name="checkbox" value="c1" checked="checked"> 
    <input type="checkbox" name="checkbox" value="c2" checked="checked"> 
    <select name="multipleselect" multiple="multiple" size="2" id="s"> 
        <option value="s1">s1</option> 
        <option value="s2" selected="selected">s2</option> 
        <option value="s3">s3</option> 
        <option selected="selected">s4</option> 
        <option value="s5">s5</option> 
    </select> 
    <input type="submit" value="提交">
</form>`;
    assert.deepEqual(ajaxSubmit.formData(document.getElementById("form") as HTMLFormElement), { "text": ["t1", "t2"], "checkbox": ["c1", "c2"], "multipleselect": ["s2", "s4"] });
}
