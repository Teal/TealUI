define(["require", "exports"], function (require, exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    function tpl(tpl, data) {
        var end = "";
        tpl = "var $output=\"\",$t" + ("%>" + tpl + "<%").replace(/%>([\s\S]*?)<%(=?)/g, function (all, content, eq) {
            all = end + ";" + (content ? "$output+=" + JSON.stringify(content) + ";" : "");
            if (eq) {
                all += "$t =(";
                end = ");if($t!=null)$output+=$t";
            }
            else {
                end = "";
            }
            return all;
        });
        var func = new Function("$", "" + tpl + end + "return $output");
        if (data === undefined) {
            return func;
        }
        return func.call(data, data);
    }
    exports.default = tpl;
});
//# sourceMappingURL=tpl.js.map