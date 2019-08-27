const assert  = require('assert');
var common = require('../scripts/common');

describe('common', function() {
    xit('LogFunction', function() {
        // TODO - add Sinon to monitor console.log outputs
        //   https://stackoverflow.com/questions/37097005/how-in-mocha-test-function-with-console-log-statement
        assert.strictEqual(true, true);
    });
    xit('LogVariable', function() {
        assert.strictEqual(true, true);
    });
    it('GetDate', function() {
        assert(common.GetDate("04 Nov 2009 19:55:41 GMT") instanceof Date);
        assert(common.GetDate("2009-11-04T19:55:41Z") instanceof Date);
        assert.strictEqual(common.GetDate("invalid string"), null);
    });
    it('FormatDate', function() {
        let testDate = new Date(2018, 11, 24, 16, 09, 30);
        let testFormat = "[w], [mmmm] [ddd], [yyyy] [12h]:[nn] [a]";
        assert.strictEqual(common.FormatDate(testDate, testFormat), "Mon, December 24th, 2018 4:09 PM");
        testFormat = "[ww], [mmm] [dd], [yy] [12hh]:[n]:[ss]";
        assert.strictEqual(common.FormatDate(testDate, testFormat), "Monday, Dec 24, 18 04:9:30");
        testFormat = "[u][w], [mmm] [d], [yyyy] [12h]:[nn]:[s]";
        assert.strictEqual(common.FormatDate(testDate, testFormat), "Mon, Dec 24, 2018 9:09:30");
    });
    it('PadZero', function() {
        assert.strictEqual(common.PadZero(1), "01");
        assert.strictEqual(common.PadZero(10), "10");
    });
    it('Get12Hour', function() {
        assert.strictEqual(common.Get12Hour(10), 10);
        assert.strictEqual(common.Get12Hour(12), 12);
        assert.strictEqual(common.Get12Hour(15), 3);
        assert.strictEqual(common.Get12Hour(24), 12);
    });
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
    it('ConvertAtomDateString', function() {
        assert.strictEqual(common.ConvertAtomDateString("2009-11-04T19:55:41Z"), "04 Nov 2009 19:55:41 GMT");
        assert.strictEqual(common.ConvertAtomDateString("invalid string"), "");
    });
    it('GetDaySuffix', function() {
        assert.strictEqual(common.GetDaySuffix(11), "11th");
        assert.strictEqual(common.GetDaySuffix(21), "21st");
        assert.strictEqual(common.GetDaySuffix(12), "12th");
        assert.strictEqual(common.GetDaySuffix(22), "22nd");
        assert.strictEqual(common.GetDaySuffix(13), "13th");
        assert.strictEqual(common.GetDaySuffix(23), "23rd");
        assert.strictEqual(common.GetDaySuffix(24), "24th");
    });
});
