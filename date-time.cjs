const moment = require('moment-timezone');

const {LOCALE_FORMATS} = require('./locale-formats.cjs');
const {DATE_ONLY_REGEX, DATE_TIME_REGEX, TIME_WITHOUT_ZONE_REGEX, extractTimezoneOffset} = require('./regex.cjs');
const {__isDateTimeObject} = require('./utils/date-time.cjs');
const {__isDateOnlyObject} = require('./utils/date-only.cjs');
const {getLocalLocale, getLocalTimezone} = require('./utils/local.cjs');

/**
 * @typedef {moment.Moment} Moment
 * @typedef {moment.unitOfTime.Diff} DiffUnit
 * @typedef {moment.unitOfTime.StartOf} StartOfUnit
 * @typedef {StartOfUnit} EndOfUnit
 * @typedef {moment.unitOfTime.All} AddUnit
 * @typedef {AddUnit} SubtractUnit
 * @typedef {import('./date-time.cjs').DateOnly} DateOnly
 * @typedef {DateOnly | DateTime | Date | Moment | string} AnyDate
 * @typedef {Record<AddUnit, number>} Duration
 */

/**
 * @param {*} value
 * @returns {value is DateOnly}
 */
function __isDateOnly(value) {
    if (!value) return false;
    return __isDateOnlyObject(value);
}

/** @returns {number | string | undefined} */
function __getObjectValue(value) {
    if (value === undefined || value === null) return undefined;
    const _type = typeof value;
    switch (_type) {
        case 'string':
        case 'number':
            return value;
        case 'function':
            return value();
        default:
            throw new Error(`Unsupported value type "${_type}" for DateTime obejct notation`);
    }
}

/**
 * Construct a Moment date object from a DateTime
 * @param {DateTime} dateTime
 */
function _momentDate(dateTime) {
    let momentDate;
    if (dateTime._timezone) {
        momentDate = moment.tz(dateTime._timestamp, dateTime._timezone);
    } else {
        momentDate = moment(dateTime._timestamp).utcOffset(dateTime._offset || 0);
    }
    return momentDate.locale(dateTime.locale);
}

/**
 * Copy a moment date object properties
 * @param {DateTime} dateTime
 * @param {Moment} momentDate
 */
function _copyMomentDate(dateTime, momentDate) {
    dateTime._timestamp = momentDate.valueOf();
    dateTime._offset = momentDate.utcOffset();
    dateTime._timezone = dateTime._offset === 0 ? 'UTC' : momentDate.tz() ?? null;
}

class DateTime {
    /** @type {number} */
    _timestamp = 0;
    /** @type {string|null} */
    _timezone = null;
    /** @type {number} */
    _offset = 0;
    /** @type {string|null} */
    _locale = null;

    /**
     * Check if the value is DateTime instance
     * @param {*} value
     * @returns {value is DateTime}
     */
    static isDateTime(value) {
        return Boolean(value instanceof DateTime || value?.isDateTime);
    }

    /**
     * Compare two dates and return true if the first date has the same value as the second date.
     * If any of the dates is invalid then this method will return false.
     * @param {AnyDate} date any date value to be compared
     * @param {AnyDate} compareDate any date value to be compared
     * @returns {boolean} true if the first date equals the seocond date
     */
    static isEqual(date, compareDate) {
        const a = this.fromAnyDate(date);
        if (!a.isValid) return false;
        const b = this.fromAnyDate(compareDate);
        if (!b.isValid) return false;
        return a.equals(b);
    }

    /**
     * Compare two dates and return true if the first date is before the second date.
     * If any of the dates is invalid then this method will return false.
     * @param {AnyDate} date any date value to be compared
     * @param {AnyDate} compareDate any date value to be compared
     * @returns {boolean} true if the first date is before the second date
     */
    static isBefore(date, compareDate) {
        const a = this.fromAnyDate(date);
        if (!a.isValid) return false;
        const b = this.fromAnyDate(compareDate);
        if (!b.isValid) return false;
        return a < b;
    }

    /**
     * Compare two dates and return true if the first date is after the second date.
     * If any of the dates is invalid then this method will return false.
     * @param {AnyDate} date any date value to be compared
     * @param {AnyDate} compareDate any date value to be compared
     * @returns {boolean} true if the first date is after the second date
     */
    static isAfter(date, compareDate) {
        const a = this.fromAnyDate(date);
        if (!a.isValid) return false;
        const b = this.fromAnyDate(compareDate);
        if (!b.isValid) return false;
        return a > b;
    }

    /**
     * Compare two dates and return true if the first date is before or equal the second date.
     * If any of the dates is invalid then this method will return false.
     * @param {AnyDate} date any date value to be compared
     * @param {AnyDate} compareDate any date value to be compared
     * @returns {boolean} true if the first date is before or equal the second date
     */
    static isEqualOrBefore(date, compareDate) {
        const a = this.fromAnyDate(date);
        if (!a.isValid) return false;
        const b = this.fromAnyDate(compareDate);
        if (!b.isValid) return false;
        return a <= b;
    }

    /**
     * Compare two dates and return true if the first date is after ir equal the second date.
     * If any of the dates is invalid then this method will return false.
     * @param {AnyDate} date any date value to be compared
     * @param {AnyDate} compareDate any date value to be compared
     * @returns {boolean} true if the first date is after or equal the second date
     */
    static isEqualOrAfter(date, compareDate) {
        const a = this.fromAnyDate(date);
        if (!a.isValid) return false;
        const b = this.fromAnyDate(compareDate);
        if (!b.isValid) return false;
        return a >= b;
    }

    /**
     * Compare the date to `DateTime.now()` and return true if the first date is before `DateTime.now()`.
     * If the date is invalid then this method will return false.
     * @param {AnyDate | null | undefined} date any date value to be compared
     * @returns {boolean} true if the first date is before `DateTime.now()`
     */
    static isBeforeNow(date) {
        return this.isBefore(date, DateTime.now());
    }

    /**
     * Compare the date to `DateTime.now()` and return true if the first date is after `DateTime.now()`.
     * If the date is invalid then this method will return false.
     * @param {AnyDate | null | undefined} date any date value to be compared
     * @returns {boolean} true if the first date is after `DateTime.now()`
     */
    static isAfterNow(date) {
        return this.isAfter(date, DateTime.now());
    }

    /**
     * Compare the date to `DateTime.now()` and return true if the first date is before or equal `DateTime.now()`.
     * If the date is invalid then this method will return false.
     * @param {AnyDate | null | undefined} date any date value to be compared
     * @returns {boolean} true if the first date is before or equal `DateTime.now()`
     */
    static isEqualOrBeforeNow(date) {
        return this.isEqualOrBefore(date, DateTime.now());
    }

    /**
     * Compare the date to `DateTime.now()` and return true if the first date is after ir equal `DateTime.now()`.
     * If the date is invalid then this method will return false.
     * @param {AnyDate | null | undefined} date any date value to be compared
     * @returns {boolean} true if the first date is after or equal `DateTime.now()`
     */
    static isEqualOrAfterNow(date) {
        return this.isEqualOrAfter(date, DateTime.now());
    }

    /**
     * Return the min from a set of dates. Invalid values are not considered.
     * If the set is empty or there is no valid value then it returns `undefined`.
     * @param {Array<{AnyDate | null | undefined}>} dates set of date values
     * @returns {AnyDate | undefined} the item wich the value is the minumum from the set
     */
    static min(...dates) {
        let minAnyDate = undefined;
        let minDateTime = undefined;
        for (const anyDate of dates) {
            const dateTime = this.fromAnyDate(anyDate);
            if (!dateTime.isValid) continue;
            if (!minDateTime || dateTime < minDateTime) {
                minAnyDate = anyDate;
                minDateTime = dateTime;
            }
        }
        return minAnyDate;
    }

    /**
     * Return the max from a set of dates. Invalid values are not considered.
     * If the set is empty or there is no valid value then it returns `undefined`.
     * @param {AnyDate | null | undefined} dates set of date values
     * @returns {AnyDate | undefined} the item wich the value is the maximum from the set
     */
    static max(...dates) {
        let maxAnyDate = undefined;
        let maxDateTime = undefined;
        for (const anyDate of dates) {
            const dateTime = this.fromAnyDate(anyDate);
            if (!dateTime.isValid) continue;
            if (!maxDateTime || dateTime > maxDateTime) {
                maxAnyDate = anyDate;
                maxDateTime = dateTime;
            }
        }
        return maxAnyDate;
    }

    /**
     * Get a new date-time using the current system time for its value
     * @param {string | undefined} locale optional locale if provided
     * @returns {DateTime} a new date-time using the current system time for its value
     */
    static now(locale) {
        return this.fromMomentDate(moment(), locale);
    }

    /**
     * Get an invalid date-time
     * @returns {DateTime} a new date-time but its value is invalid
     * @example ```javascript
     * const validDateTime = DateTime.now();
     * const invalidDateTime = DateTime.invalid();
     * console.log(validDateTime.isValid); // true
     * console.log(String(validDateTime)); // '2023-12-08T09:32:29.436Z'
     * console.log(invalidDateTime.isValid); // false
     * console.log(String(invalidDateTime)); // 'Invalid date'
     * ```
     */
    static invalid() {
        return new DateTime(NaN);
    }

    static _fromString(dateString, locale) {
        if (DATE_ONLY_REGEX.test(dateString)) {
            return this.fromDateOnly(dateString, locale);
        } else if (TIME_WITHOUT_ZONE_REGEX.test(dateString)) {
            return this.fromMomentDate(moment.tz(dateString, 'UTC'), locale);
        } else if (DATE_TIME_REGEX.test(dateString)) {
            const offset = extractTimezoneOffset(dateString);
            const momentDate = moment(dateString).utcOffset(offset === 'Z' ? '+00:00' : offset);
            return this.fromMomentDate(momentDate, locale);
        }
        const dateValue = new Date(dateString);
        if (isNaN(dateValue)) return this.invalid();
        return this.fromMomentDate(dateValue, locale);
    }

    /**
     * Construct a new date-time from a moment object value
     * @param {Moment} date any moment date
     * @param {string | undefined} locale optional locale if provided
     * @returns {DateTime}
     */
    static fromMomentDate(date, locale) {
        date = moment.isMoment(date) ? date : moment(date);
        if (!date.isValid()) return new DateTime(NaN, locale || date.locale());
        const dateTime = new DateTime(date, locale || date.locale());
        return dateTime;
    }

    /**
     * Construct a new date-time from a plain js Date
     * @param {Date} date any plain js Date
     * @param {string | undefined} locale optional locale if provided
     * @returns {DateTime}
     */
    static fromJsDate(date, locale) {
        return this.fromMomentDate(date, locale);
    }

    /**
     * Construct a new date-time from a DateTime isntance
     * @param {DateTime} dateTime any date-time object
     * @param {string | undefined} locale optional locale if provided
     * @returns {DateTime}
     */
    static fromDateTime(dateTime, locale) {
        if (dateTime instanceof DateTime) {
            return new DateTime(dateTime, locale);
        } else if (typeof dateTime === 'string') {
            return DateTime._fromString(dateTime, locale);
        } else if (typeof dateTime === 'number') {
            return DateTime.fromJsDate(new Date(dateTime));
        } else if (typeof dateTime !== 'object') {
            return DateTime.invalid();
        }

        const month = __getObjectValue(dateTime.month);
        const obj = {
            year: __getObjectValue(dateTime.year),
            month: month ? month - 1 : undefined,
            date: __getObjectValue(dateTime.day) || __getObjectValue(dateTime.date),
            hour: __getObjectValue(dateTime.hour) || __getObjectValue(dateTime.hours),
            minute: __getObjectValue(dateTime.minute) || __getObjectValue(dateTime.minutes),
            second: __getObjectValue(dateTime.second) || __getObjectValue(dateTime.seconds),
            millisecond: __getObjectValue(dateTime.millisecond) || __getObjectValue(dateTime.milliseconds),
        };
        const tz = __getObjectValue(dateTime.timezone) || __getObjectValue(dateTime.tz);
        if (tz) return this.fromMomentDate(moment.tz(obj, tz), locale);
        const offset = __getObjectValue(dateTime.offset);
        if (offset) return this.fromMomentDate(moment(obj).utcOffset(offset, true), locale);
        return this.fromMomentDate(moment(obj), locale);
    }

    /**
     * Construct a new date-time from a DateOnly isntance
     * @param {DateOnly} dateOnly any date-only object
     * @param {string | undefined} locale optional locale if provided
     * @returns {DateTime}
     */
    static fromDateOnly(dateOnly, locale) {
        if (__isDateOnly(dateOnly) || __isDateTimeObject(dateOnly)) {
            return this.fromMomentDate(
                moment.tz(
                    {
                        year: dateOnly.year,
                        month: dateOnly.month - 1,
                        date: dateOnly.day || dateOnly.date,
                    },
                    'UTC'
                ),
                locale || dateOnly.locale
            );
        } else if (dateOnly === null || dateOnly === undefined) {
            return DateTime.invalid();
        }
        return this.fromMomentDate(moment.tz(String(dateOnly), 'UTC').startOf('day'), locale || dateOnly?.locale);
    }

    /**
     * Construct a new date-time from any valid date value
     * @param {AnyDate} dateOnly any valid date. Empty (null or undefined) or NaN will return an invalid date
     * @param {string | undefined} locale optional locale if provided
     * @returns {DateTime}
     */
    static fromAnyDate(anyDate, locale) {
        if (!anyDate) return this.invalid();
        else if (this.isDateTime(anyDate) || __isDateTimeObject(anyDate)) return this.fromDateTime(anyDate, locale);
        else if (__isDateOnly(anyDate)) return this.fromDateOnly(anyDate, locale);
        else if (moment.isMoment(anyDate)) return this.fromMomentDate(anyDate, locale);
        else if (anyDate instanceof Date) return this.fromJsDate(anyDate, locale);
        else if (typeof anyDate === 'number') return this.fromJsDate(new Date(anyDate), locale);
        else if (typeof anyDate === 'string') return this._fromString(anyDate, locale);
        return this.fromJsDate(new Date(String(anyDate)), locale);
    }

    /**
     * Construct a new date-time from a date string in a specific.
     * This method uses moment format constructor.
     * @see [parsing guide](https://momentjs.com/guides/#/parsing/).
     * @param {string} dateString any valid date string
     * @param {string} format the `dateString` parsing format
     * @param {string} locale optional locale if provided
     * @returns {DateTime}
     */
    static fromFormat(dateString, format, locale) {
        let momentDate = moment(dateString, format, true);
        const offset = extractTimezoneOffset(dateString);
        if (offset) momentDate = momentDate.utcOffset(offset === 'Z' ? '+00:00' : offset);
        return this.fromMomentDate(momentDate, locale);
    }

    /**
     * DateOnly class which handles year, month and day only
     * @param {Date|Moment} date raw date object value
     * @param {string | undefined} locale optional locale if provided
     */
    constructor(date, locale) {
        this._locale = locale || getLocalLocale();
        if (date instanceof DateTime) {
            this._timestamp = date._timestamp;
            this._timezone = date._timezone;
            this._offset = date._offset;
        } else if (typeof date === 'number') {
            this._timestamp = date;
        } else {
            _copyMomentDate(this, moment(date));
        }
    }

    get isDateTime() {
        return true;
    }

    /**
     * The locale set to this date
     * @returns {string} the locale set to this date. Defaults to the global locale if none was provided
     */
    get locale() {
        return this._locale;
    }

    /**
     * The locale set to this date.
     * `null` and `undefined` values are changed to the default locale
     * @param {string | null} value
     */
    set locale(locale) {
        this._locale = locale || getLocalLocale();
    }

    get timezone() {
        if (this.isUTC) return 'UTC';
        if (this._timezone) return this._timezone;

        if (this._offset === moment().utcOffset()) return getLocalTimezone();
        return undefined;
    }

    get offset() {
        return this._offset === 0 ? 'UTC' : _momentDate(this).format('Z');
    }

    /**
     * @returns {number}
     */
    get year() {
        return _momentDate(this).year();
    }

    /**
     * @param {number} value
     */
    set year(value) {
        _copyMomentDate(this, _momentDate(this).year(value));
    }

    /**
     * @returns {number}
     */
    get month() {
        return _momentDate(this).month() + 1;
    }

    /**
     * @param {number} value
     */
    set month(value) {
        _copyMomentDate(this, _momentDate(this).month(value - 1));
    }

    /**
     * @returns {number}
     */
    get day() {
        return _momentDate(this).date();
    }

    /**
     * @param {number} value
     */
    set day(value) {
        _copyMomentDate(this, _momentDate(this).date(value));
    }

    /**
     * @returns {number}
     */
    get week() {
        return _momentDate(this).week();
    }

    /**
     * @param {number} value
     */
    set week(value) {
        _copyMomentDate(this, _momentDate(this).week(value));
    }

    /**
     * @returns {number}
     */
    get weekday() {
        return _momentDate(this).weekday();
    }

    /**
     * @param {number} value
     */
    set weekday(value) {
        _copyMomentDate(this, _momentDate(this).weekday(value));
    }

    /**
     * @returns {number}
     */
    get dayOfYear() {
        return _momentDate(this).dayOfYear();
    }

    /**
     * @param {number} value
     */
    set dayOfYear(value) {
        _copyMomentDate(this, _momentDate(this).dayOfYear(value));
    }

    /**
     * @returns {number}
     */
    get quarter() {
        return _momentDate(this).quarter();
    }

    /**
     * @param {number} value
     */
    set quarter(value) {
        _copyMomentDate(this, _momentDate(this).quarter(value));
    }

    /**
     * @returns {number}
     */
    get hour() {
        return _momentDate(this).hours();
    }

    /**
     * @param {number} value
     */
    set hour(value) {
        _copyMomentDate(this, _momentDate(this).hours(value));
    }

    /**
     * @returns {number}
     */
    get minute() {
        return _momentDate(this).minutes();
    }

    /**
     * @param {number} value
     */
    set minute(value) {
        _copyMomentDate(this, _momentDate(this).minutes(value));
    }

    /**
     * @returns {number}
     */
    get second() {
        return _momentDate(this).seconds();
    }

    /**
     * @param {number} value
     */
    set second(value) {
        _copyMomentDate(this, _momentDate(this).seconds(value));
    }

    /**
     * @returns {number}
     */
    get millisecond() {
        return _momentDate(this).milliseconds();
    }

    /**
     * @param {number} value
     */
    set millisecond(value) {
        _copyMomentDate(this, _momentDate(this).milliseconds(value));
    }

    /**
     * @returns {true} whether this date is at the UTC timezone or not
     */
    get isUTC() {
        return this._timezone === 'UTC' || _momentDate(this).isUTC() || this.offset === 'UTC';
    }

    /**
     * Check if the date is valid.
     * @returns {boolean} true if this is a valid date, false otherwise
     */
    get isValid() {
        return !isNaN(this._timestamp);
    }

    /**
     * @returns {boolean} true if this date year is a leap year, false otherwise
     */
    get isLeapYear() {
        return _momentDate(this).isLeapYear();
    }

    /**
     * Move this DateTime to a different timezone. The new offset is applied.
     * @param {string} timezone the new timezone
     * @param {boolean} keepLocalTime optional boolean for keeping the original date and time instead of shifting to the new offset. Defaults to `false`
     * @returns {DateTime} a new DateTime using the specified timezone
     */
    toTimezone(timezone, keepLocalTime = false) {
        let momentDate = moment(this._timestamp).tz(timezone);
        if (keepLocalTime) {
            const thisMoment = _momentDate(this);
            momentDate.set({
                year: thisMoment.year(),
                month: thisMoment.month(),
                date: thisMoment.date(),
                hours: thisMoment.hours(),
                minutes: thisMoment.minutes(),
                seconds: thisMoment.seconds(),
                milliseconds: thisMoment.milliseconds(),
            });
        }
        return DateTime.fromMomentDate(momentDate, this._locale);
    }

    /**
     * Same as calling `toTimezone('UTC')`
     * @returns {DateTime} a new DateTime using the UTC timezone
     */
    toUTC() {
        return this.toTimezone('UTC');
    }

    /**
     * Format a date to string representation
     * @param {string} format date format. Defaults to `LOCALE_FORMATS.VERBAL_DATE_TIME_LONG`
     * @returns {string} date string using the provided formatting
     */
    format(format = LOCALE_FORMATS.VERBAL_DATE_TIME_LONG) {
        return _momentDate(this).format(format);
    }

    /**
     * Return a new DateTime a the start of `unitOfTime`
     * @param {StartOfUnit} unitOfTime unit of time to be used
     * @returns {DateTime} new DateTime object at the start of `unitOfTime`
     */
    startOf(unitOfTime) {
        return DateTime.fromMomentDate(_momentDate(this).startOf(unitOfTime));
    }

    /**
     * Return a new DateTime a the end of `unitOfTime`
     * @param {EndOfUnit} unitOfTime unit of time to be used
     * @returns {DateTime} new DateTime object at the end of `unitOfTime`
     */
    endOf(unitOfTime) {
        return DateTime.fromMomentDate(_momentDate(this).endOf(unitOfTime));
    }

    /**
     * Add a duration to this date and return a new DateTime object with the resulting date
     * @param {Duration | number} amountOrDuration durtion object or numeric amount when used along an unit of time
     * @param {AddUnit | undefined} unitOfTime optional unit if used along an amount instead of duration object
     * @returns {DateTime} new DateTime object after adding the duration
     * @example ```javascript
     * const dateOnly = toDateOnly('2023-01-01');
     *
     * // You can use the old form
     * const a = dateTime.plus(1, 'day');
     * console.log(a.format()); // '2023-01-02'
     *
     * // Or pass a duration object
     * const b = dateTime.plus({day: 1});
     * console.log(b.format()); // '2023-01-02'
     * const c = dateTime.plus({days: 2, momths: 3});
     * console.log(c.format()); // '2023-04-03'
     * ```
     */
    plus(amountOrDuration, unitOfTime) {
        if (!isNaN(amountOrDuration)) {
            if (unitOfTime) return this.plus({[unitOfTime]: amountOrDuration});
        }

        const duration = {};
        for (const key in amountOrDuration) {
            const amount = amountOrDuration?.[key];
            if (!amount) continue;
            duration[key] = amount;
        }

        return DateTime.fromMomentDate(_momentDate(this).add(duration));
    }

    /**
     * Subtract a duration to this date and return a new DateTime object with the resulting date
     * @param {Duration | number} amountOrDuration durtion object or numeric amount when used along an unit of time
     * @param {SubtractUnit | undefined} unitOfTime optional unit if used along an amount instead of duration object
     * @returns {DateTime} new DateTime object after subtracting the duration
     * @example ```javascript
     * const dateOnly = toDateOnly('2023-01-01');
     *
     * // You can use the old form
     * const a = dateTime.minus(1, 'day');
     * console.log(a.format()); // '2022-12-31'
     *
     * // Or pass a duration object
     * const b = dateTime.minus({day: 1});
     * console.log(b.format()); // '2022-12-31'
     * const c = dateTime.minus({days: 2, momths: 3});
     * console.log(c.format()); // '2022-09-29'
     * ```
     */
    minus(amountOrDuration, unitOfTime) {
        if (!isNaN(amountOrDuration)) {
            if (unitOfTime) return this.minus({[unitOfTime]: amountOrDuration});
        }

        const duration = {};
        for (const key in amountOrDuration) {
            const amount = amountOrDuration?.[key];
            if (!amount) continue;
            duration[key] = amount;
        }

        return DateTime.fromMomentDate(_momentDate(this).subtract(duration));
    }

    /**
     * Set a duration to this date and return the same DateTime instance.
     * Changes are performed in place.
     * @param {Duration | number} amountOrDuration durtion object or numeric amount when used along an unit of time
     * @param {AddUnit | undefined} unitOfTime optional unit if used along an amount instead of duration object
     * @returns {this} this DateOny after changes
     * @example ```javascript
     * const dateTime = toDateTime('2023-01-01T00:00:00.000Z');
     *
     * // You can use the old form
     * dateTime.set(1, 'day');
     * console.log(dateTime.format()); // '2023-01-02T00:00:00.000Z'
     *
     * // Or pass a duration object
     * dateTime.set({day: 1, hours: 4});
     * console.log(dateTime.format()); // '2023-01-02T04:00:00.000Z'
     * dateTime.set({days: 2, momths: 3});
     * console.log(dateTime.format()); // '2023-04-03T00:00:00.000Z'
     * ```
     */
    set(amountOrDuration, unitOfTime) {
        if (!isNaN(amountOrDuration)) {
            if (unitOfTime) return this.set({[unitOfTime]: amountOrDuration});
        }

        const DATE_KEYS = new Set(['day', 'days']);
        const MONTH_KEYS = new Set(['month', 'months', 'M']);
        const duration = {};
        for (const sourceKey in amountOrDuration) {
            let targetKey = sourceKey;
            if (DATE_KEYS.has(sourceKey.toLowerCase())) targetKey = 'date';

            let amount = amountOrDuration?.[sourceKey];
            if (MONTH_KEYS.has(targetKey)) amount -= 1;
            duration[targetKey] = amount;
        }

        _copyMomentDate(this, _momentDate(this).set(duration));
        return this;
    }

    /**
     * Get the difference between two dates.
     * If any of the dates is invalid then an error is thrown.
     * @param {AnyDate} date any valid date value
     * @param {DiffUnit | undefined} unitOfTime optional unit of time for comparission. Defaults to millisecond
     * @param {boolean | undefined} precise when false an integer is returned rather than a decimal number
     * @returns {number} the difference
     */
    diff(date, unitOfTime, precise) {
        const dateTime = DateTime.fromAnyDate(date);
        if (!this.isValid || !dateTime.isValid) throw new Error(`Can not subtract "${this.toJSON()}" from "${dateTime.toJSON()}"`);
        return _momentDate(this).diff(_momentDate(dateTime), unitOfTime, precise);
    }

    /**
     * Clone the DateTime returning a new object with the same value
     * @returns {DateTime}
     */
    clone() {
        return new DateTime(this, this._locale);
    }

    /**
     * Return the number of milliseconds since the Unix Epoch.
     * Same as calling `new Date().getTime()`.
     * @returns {number} the timestamp for this DateTime
     */
    valueOf() {
        return _momentDate(this).valueOf();
    }

    /**
     * Return true when the date value is equal to this date-time.
     * This checks the value. Invalid dates always return false.
     * @param anyDate any date value
     */
    equals(anyDate) {
        if (!this.isValid) return false;
        const dateTime = DateTime.fromAnyDate(anyDate);
        if (!dateTime.isValid) return false;
        return this.valueOf() === dateTime.valueOf();
    }

    /**
     * Return a plain JS Date object based on this DateTime value.
     * The Date object is going to be at the local timezone, so the date might be off by one day.
     * Same as calling `new Date(this.toTimestamp())` or `new Date(this.toISOString())`.
     * @returns {Date} an equivalent JS Date object for this DateTime value
     */
    toJsDate() {
        return _momentDate(this).toDate();
    }

    /**
     * Format this DateTime to a ISO String (`YYYY-MM-DDTHH:mm:ss.SSSZ`).
     * @param useUtc optional parameter to enforce the output to be at the UTC timezone. Offset difference is applied. Defaults to false.
     * @return {string} an ISO String for this DateTime. Either at UTC or at its own timezone
     */
    toISOString(useUtc = false) {
        if (!this.isValid) return _momentDate(this).toString();
        return _momentDate(this)
            .toISOString(!useUtc)
            .replace(/\+00:00$/, 'Z');
    }

    /**
     * Format this DateTime to `YYYY-MM-DDTHH:mm:ss.SSSZ`.
     * Same as calling `this.toISOString(false)`.
     * @return {string} an string in the DateTime format
     */
    toJSON() {
        if (!this.isValid) return _momentDate(this).toString();
        return _momentDate(this).toISOString();
    }

    /**
     * Format this DateTime to `YYYY-MM-DDTHH:mm:ss.SSSZ`.
     * Same as calling `toJSON()`.
     * @return {string} an string in the DateTime format
     */
    toString() {
        return this.toISOString();
    }

    /**
     * Return the number of milliseconds since the Unix Epoch.
     * Same as calling `new Date().getTime()`.
     * @returns {number} the timestamp for this DateTime
     */
    toTimestamp() {
        return _momentDate(this).valueOf();
    }

    /**
     * Return an plain object containing only the fields `year`, `month`, `day`, `hour`, `minute`, `second`, `millisecond`, `timezone` and `offset` of this DateTime.
     * @returns an plain JS object representing this DateTime.
     */
    toObject() {
        const obj = _momentDate(this).toObject();
        return {
            year: obj.years,
            month: obj.months + 1,
            day: obj.date,
            hour: obj.hours,
            minute: obj.minutes,
            second: obj.seconds,
            millisecond: obj.milliseconds,
            offset: this.offset,
            timezone: this.timezone,
        };
    }

    /**
     * Return a debug string
     * @returns {string}
     * @example
     * ````javascript
     * console.log(toDateTime('2023-04-15').debug()); // Print: "DateTime(2023-04-15T00:00:00.000Z)"
     * console.log(toDateTime('2023-04-15T22:13:14.333Z').debug()); // Print: "DateTime(2023-04-15 22:13:14.333Z)"
     * ````
     */
    debug() {
        return `DateTime(${this.toISOString(false).replace('T', ' ')})`;
    }

    // For better debugging
    [Symbol.for('nodejs.util.inspect.custom')]() {
        return this.debug();
    }

    /** @deprecated Some sequelzie versions look for this method instead of relying on MomentJs */
    replace(regex, replacement) {
        return this.toJSON().replace(regex, replacement);
    }

    /** @deprecated Some sequelzie versions look for this method instead of relying on MomentJs */
    startsWith(value) {
        return this.toJSON().startsWith(value);
    }

    /** @deprecated Some sequelzie versions look for this method instead of relying on MomentJs */
    endsWith(value) {
        return this.toJSON().endsWith(value);
    }
}

module.exports = {DateTime};
