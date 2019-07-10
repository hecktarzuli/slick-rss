const assert  = require('assert');
var common = require('../scripts/common');

describe('common', function() {
    describe('Date Formatting', function() {
        it('GetMonthDate', function() {
            assert.strictEqual(common.GetMonthName(0), "January");
            assert.strictEqual(common.GetMonthName(11), "December");
            assert.strictEqual(common.GetMonthName(12), "");
        });
        it('GetWeekdayName', function() {
            assert.strictEqual(common.GetWeekdayName(0), "Sunday");
            assert.strictEqual(common.GetWeekdayName(6), "Saturday");
            assert.strictEqual(common.GetWeekdayName(7), "");
        });
        it('FormatDate', function() {
            var testDate = new Date(2018, 11, 24, 16, 09, 30);
            assert.strictEqual(common.FormatDate(testDate,
                "[w], [mmmm] [ddd], [yyyy] [12h]:[nn] [a]"),
                "Mon, December 24th, 2018 4:09 PM"
            );
            assert.strictEqual(common.FormatDate(testDate,
                "[ww], [mmm] [dd], [yy] [12hh]:[n]:[ss]"),
                "Monday, Dec 24, 18 04:9:30"
            );
            assert.strictEqual(common.FormatDate(testDate,
                "[u][w], [mmm] [d], [yyyy] [12h]:[nn]:[s]"),
                "Mon, Dec 24, 2018 9:09:30"
            );
        });
    });
});