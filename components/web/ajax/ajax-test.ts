import * as assert from "assert";
import ajax from "./ajax";

export function ajaxTest(done: Function) {
    ajax({
        type: "GET",
        url: "",
        data: null,
        success(data) {
            assert.ok(data);
            done();
        }
    });
}
