/**
 * Check if the object is DateTime or DateTimeLike
 * @param {*} anyDate
 * @param {boolean} checkTimeOnly
 * @returns {anyDate is Record<'year' | 'month' | 'day' | 'date' | 'hour' | 'hours' | 'minute' | 'minutes' | 'second' | 'seconds' | 'millisecond' | 'milliseconds', string | number | undefined>}
 */
export function __isDateTimeObject(anyDate, checkTimeOnly = false) {
    if (typeof anyDate !== 'object' || !anyDate) return false;
    else if ('isDateTime' in anyDate && anyDate.isDateTime === true) return true;
    else if ('isDateOnly' in anyDate && anyDate.isDateOnly === true) return false;
    const hasKey = (k) => k in anyDate && {string: 1, number: 1}[typeof anyDate[k]];
    return (
        (checkTimeOnly ? false : hasKey('year') || hasKey('month') || hasKey('day') || hasKey('date')) ||
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
