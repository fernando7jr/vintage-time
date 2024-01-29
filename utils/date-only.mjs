/**
 *
 * @param {*} anyDate
 * @returns {anyDate is Record<'year' | 'month' | 'day' | 'date', string | number | undefined>}
 */
export function __isDateOnlyObject(anyDate) {
    if (typeof anyDate !== 'object') return false;
    else if ('isDateOnly' in anyDate && anyDate.isDateOnly === true) return true;
    const hasKey = (k) => k in anyDate && {string: 1, number: 1}[typeof anyDate[k]];
    return hasKey('year') || hasKey('month') || hasKey('day') || hasKey('date');
}
