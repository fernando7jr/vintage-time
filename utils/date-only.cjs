/**
 * Check if the object is DateOnly or DateOnlyLike
 * @param {*} anyDate
 * @returns {anyDate is Record<'year' | 'month' | 'day' | 'date', string | number | undefined>}
 */
function __isDateOnlyObject(anyDate) {
    if (typeof anyDate !== 'object' || !anyDate) return false;
    else if ('isDateOnly' in anyDate && anyDate.isDateOnly === true) return true;
    else if ('isDateTime' in anyDate && anyDate.isDateTime === true) return false;
    const hasKey = (k) => k in anyDate && {string: 1, number: 1}[typeof anyDate[k]];
    return hasKey('year') || hasKey('month') || hasKey('day') || hasKey('date');
}

module.exports = {__isDateOnlyObject};
