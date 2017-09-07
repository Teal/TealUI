import * as assert from "assert";
import * as ieShim from "./ieShim";

export function ieShimTest() {

}


test("execScript", function () {
    
        expect(3);
    
        execScript("var globalEvalTest = true;");
        ok(window.globalEvalTest, "Test variable declarations are global");
    
        window.globalEvalTest = false;
    
        execScript("globalEvalTest = true;");
        ok(window.globalEvalTest, "Test variable assignments are global");
    
        window.globalEvalTest = false;
    
        execScript("this.globalEvalTest = true;");
        ok(window.globalEvalTest, "Test context (this) is the window object");
    
        window.globalEvalTest = undefined;
    });
    