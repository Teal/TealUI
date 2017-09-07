import * as assert from "assert";
import parseChineseId from "./chineseId";

export function parseChineseIdTest() {
    assert.deepEqual(parseChineseId("152500198909267865"), {
        birthday: new Date("Tue Sep 26 1989 00:00:00 GMT+0800"),
        province: "内蒙古",
        sex: false,
        valid: true
    });
}
