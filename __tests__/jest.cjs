const {toDateOnly, toDateTime} = require('../index.cjs');
const {DateOnly} = require('../date-only.cjs');
const {DateTime} = require('../date-time.cjs');

expect.extend({
    dateOnly(received, expected, enforceInstanceOf = false) {
        const expectedDateOnlyValue = toDateOnly(expected);
        if (enforceInstanceOf && !DateOnly.isDateOnly(received)) {
            return {
                pass: false,
                message: () => `Expected "${received}" to be DateOnly "${expectedDateOnlyValue.toJSON()}"`,
            };
        }
        const receivedDateOnlyValue = toDateOnly(received);

        if (DateOnly.isEqual(expectedDateOnlyValue, receivedDateOnlyValue)) {
            return {pass: true};
        }
        return {
            pass: false,
            message: () => `Expected "${receivedDateOnlyValue.toJSON()}" to be DateOnly "${expectedDateOnlyValue.toJSON()}"`,
        };
    },
    dateTime(received, expected, enforceInstanceOf = false) {
        const expectedDateTimeValue = toDateTime(expected);
        if (enforceInstanceOf && !DateTime.isDateTime(received)) {
            return {
                pass: false,
                message: () => `Expected "${received}" to be DateTime "${expectedDateTimeValue.toJSON()}"`,
            };
        }
        const receivedDateTimeValue = toDateTime(received);

        if (DateTime.isEqual(expectedDateTimeValue, receivedDateTimeValue)) {
            return {pass: true};
        }
        return {
            pass: false,
            message: () => `Expected "${receivedDateTimeValue.toJSON()}" to be DateTime "${expectedDateTimeValue.toJSON()}"`,
        };
    },
});
