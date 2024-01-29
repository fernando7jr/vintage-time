/**
 *
 * @param {*} anyDate
 * @returns {anyDate is Record<'year' | 'month' | 'day' | 'date' | 'hour' | 'hours' | 'minute' | 'minutes' | 'second' | 'seconds' | 'millisecond' | 'milliseconds', string | number | undefined>}
 */
function __isDateTimeObject(anyDate) {
    if (typeof anyDate !== 'object') return false;
    else if ('isDateTime' in anyDate && anyDate.isDateTime === true) return true;
    const hasKey = (k) => k in anyDate && {string: 1, number: 1}[typeof anyDate[k]];
    return (
        hasKey('year') ||
        hasKey('month') ||
        hasKey('day') ||
        hasKey('date') ||
        hasKey('hour') ||
        hasKey('hours') ||
        hasKey('minute') ||
        hasKey('minutes') ||
        hasKey('second') ||
        hasKey('seconds') ||
        hasKey('millisecond') ||
        hasKey('milliseconds')
    );
}

module.exports = {__isDateTimeObject};
