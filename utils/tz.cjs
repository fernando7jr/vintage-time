/**
 * Return the local timezone
 * @returns {string}
 */
function getLocalTimezone() {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
}

module.exports = {
    getLocalTimezone,
};
