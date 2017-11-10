define(["require", "exports", "assert", "./cron"], function (require, exports, assert, cron_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function cronJobTest(done) {
        var job = cron_1.default("* * * * * *", function () {
            job.stop();
            assert.ok(1);
            done();
        });
    }
    exports.cronJobTest = cronJobTest;
    function isValidCronExpressionTest() {
        assert.equal(cron_1.isValidCronExpression("*/2 * * * *"), true);
        assert.equal(cron_1.isValidCronExpression("* * * * *"), true);
        assert.equal(cron_1.isValidCronExpression("* * * * *"), true);
        assert.equal(cron_1.isValidCronExpression("0 */5 * *"), false);
    }
    exports.isValidCronExpressionTest = isValidCronExpressionTest;
});
//# sourceMappingURL=cron-test.js.map