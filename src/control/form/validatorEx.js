/**
 * @author xuld
 */
typeof include === "function" && include("ui/form/validator.js");

Validator.get = function (dom) {
    dom = Dom.get(dom);
    var dataField = dom.dataField();
    return dataField.validator || (dataField.validator = Validator.init(dom));
}

Validator.init = (function(){

    function initInput(dom) {
        var options = {
            target: dom,
            rules: {
                
            }
        };

        if(dom.getAttr('required')) {
            options.rules.required = true;
            dom.setAttr('required', null);
        }

        if(dom.getAttr('pattern')) {
            options.rules.pattern = new RegExp(dom.getAttr('pattern'));
            dom.setAttr('pattern', null);
        }

        if(dom.getAttr('minlength')) {
            var val = +dom.getAttr('minlength');
            if(val > 0) {
                options.rules.minLength = val;
                dom.setAttr('minlength', null);
            }
        }

        return new Validator(options);
    }

    function initForm(dom) {
        var options = {
            target: dom,
            rules: {
                
            }
        };

        dom.query('[name]').forEach(function (dom) {
            dom = new Dom(dom);
            rules[dom.getAttr('name')] = initInput(dom);
        });

        return new Validator.Form(options);
    }

    return function(target){

        if(target.node.tagName === 'FORM') {
            return initForm(target);
        } else {
            return initInput(target);
        }

    }

})();

