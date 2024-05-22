import moment from 'moment-timezone';

/**
 * Return the local timezone
 * @returns {string}
 */
export function getLocalLocale() {
    return moment().locale();
}

/**
 * Return the local timezone
 * @returns {string}
 */
export function getLocalTimezone() {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
}
