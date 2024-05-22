const moment = require('moment-timezone');

/**
 * Return the local timezone
 * @returns {string}
 */
function getLocalLocale() {
    return moment().locale();
}

/**
 * Return the local timezone
 * @returns {string}
 */
function getLocalTimezone() {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
}

module.exports = {
    getLocalLocale,
    getLocalTimezone,
};
