import * as assert from "assert";
import cronJob, { isValidCronExpression } from "./cron";

export function cronJobTest(done: Function) {
    const job = cronJob("* * * * * *", () => {
        job.stop();
        assert.ok(1);
        done();
    });
}

export function isValidCronExpressionTest() {
    assert.equal(isValidCronExpression("*/2 * * * *"), true);
    assert.equal(isValidCronExpression("* * * * *"), true);
    assert.equal(isValidCronExpression("* * * * *"), true);
    assert.equal(isValidCronExpression("0 */5 * *"), false);
}
