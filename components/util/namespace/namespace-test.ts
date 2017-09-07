import * as assert from "assert";
import namespace from "./namespace";

export function namespaceTest() {
    namespace("MyNameSpace.SubNamespace");
    assert.ok((window as any).MyNameSpace.SubNamespace);
    (window as any).MyNameSpace.SubNamespace = 1;
    namespace("MyNameSpace.SubNamespace");
    assert.strictEqual((window as any).MyNameSpace.SubNamespace, 1);
}
