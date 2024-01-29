const ANY_DATE_REGEX = /^\d{4}-\d{2}-\d{2}([ T](0\d|1\d|2[0-3]):[0-5]\d:[0-5]\d(\.\d{1,3})?([+-][0-1]\d:[0-5]\d|Z))?$/;
const DATE_ONLY_REGEX = /^\d{4}-\d{2}-\d{2}$/;
const DATE_TIME_REGEX = /^\d{4}-\d{2}-\d{2}[ T](0\d|1\d|2[0-3]):[0-5]\d:[0-5]\d(\.\d{1,3})?([+-][0-1]\d:[0-5]\d|Z)$/;
const TIME_WITHOUT_ZONE_REGEX = /(0\d|1\d|2[0-3]):[0-5]\d:[0-5]\d(\.\d{1,3})?$/;
const TIME_ZONE_REGEX = /[+-][0-1]\d:[0-5]\d|Z$/;

function extractTimezoneOffset(value) {
    return TIME_ZONE_REGEX.exec(String(value))?.[0];
}

module.exports = {
    ANY_DATE_REGEX,
    DATE_ONLY_REGEX,
    DATE_TIME_REGEX,
    TIME_WITHOUT_ZONE_REGEX,
    TIME_ZONE_REGEX,
    extractTimezoneOffset,
};
