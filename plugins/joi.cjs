const {isDateValid, toDateOnly, toDateTime} = require('../index.cjs');
const {ANY_DATE_REGEX, DATE_ONLY_REGEX, DATE_TIME_REGEX} = require('../regex.cjs');

/** @typedef {import('joi').ExtensionFactory} JoiExtensionFactory */

/** @return {value is (null | undefined)} */
function isEmpty(value) {
    return value === null || value === undefined;
}

/** @type {JoiExtensionFactory} */
const anyDate = (joi) => ({
    type: 'anyDate',
    base: joi
        .string()
        .regex(ANY_DATE_REGEX)
        .custom((value, helpers) => {
            if (isEmpty(value)) return value;
            const date = toDateTime(value);
            if (!isDateValid(date)) return helpers.error('Expected a valid date-only or date-time string');
            return date;
        }),
});

/** @type {JoiExtensionFactory} */
const dateOnly = (joi) => ({
    type: 'dateOnly',
    base: joi
        .string()
        .regex(DATE_ONLY_REGEX)
        .custom((value, helpers) => {
            if (isEmpty(value)) return value;
            const dateOnly = toDateOnly(value);
            if (!isDateValid(dateOnly)) return helpers.error('Expected a valid date-only string');
            return dateOnly;
        }),
});

/** @type {JoiExtensionFactory} */
const dateTime = (joi) => ({
    type: 'dateTime',
    base: joi
        .string()
        .regex(DATE_TIME_REGEX)
        .custom((value, helpers) => {
            if (isEmpty(value)) return value;
            const date = toDateTime(value);
            if (!isDateValid(date)) return helpers.error('Expected a valid date-time string');
            return date;
        }),
});

module.exports = {
    anyDate,
    dateOnly,
    dateTime,
};
