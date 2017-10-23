import * as assert from "assert";
import * as chineseId from "./chineseId";

export function parseChineseIdTest() {
    assert.deepEqual(chineseId.parseChineseId("152500198909267865"), {
        birthday: new Date("Tue Sep 26 1989 00:00:00 GMT+0800"),
        city: 25,
        county: 0,
        province: 15,
        sex: false,
        valid: true
    });
}

export function getAgeFromChineseIdTest() {
    assert.strictEqual(chineseId.getAgeFromChineseId("152500198909267865", new Date("2010/1/1")), 20);
}
