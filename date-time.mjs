import moment from 'moment-timezone';

import {LOCALE_FORMATS} from './locale-formats.mjs';
import {DATE_ONLY_REGEX, DATE_TIME_REGEX, TIME_WITHOUT_ZONE_REGEX, extractTimezoneOffset} from './regex.mjs';
import {__isDateTimeObject} from './utils/date-time.mjs';
import {__isDateOnlyObject} from './utils/date-only.mjs';
import {getLocalTimezone} from './utils/tz.cjs';

/**
 * @typedef {moment.Moment} Moment
 * @typedef {moment.unitOfTime.StartOf} StartOfUnit
 * @typedef {StartOfUnit} EndOfUnit
 * @typedef {moment.unitOfTime.All} AddUnit
 * @typedef {AddUnit} SubtractUnit
 * @typedef {import('./date-time').DateTime} DateTime
 * @typedef {DateOnly | DateTime | Date | Moment | string} AnyDate
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

export class DateTime {
    /** @type {Moment} */
    _innerDate;

    /**
     * Check if the value is DateTime instance
     * @param {*} value
     * @returns {value is DateTime}
     */
    static isDateTime(value) {
        return Boolean(value instanceof DateTime || value?.isDateTime);
    }

    /**
     * Get a new date-time using the current system time for its value
     * @param {string | undefined} locale optional locale if provided
     * @returns {DateTime} a new date-time using the current system time for its value
     */
    static now(locale) {
        return new DateTime(moment(), locale);
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
        return new DateTime(moment(NaN));
    }

    /**
     * Construct a new date-only from a moment object value
     * @param {Moment} date any moment date
     * @param {string | undefined} locale optional locale if provided
     */
    static fromMomentDate(date, locale) {
        return new DateTime(date, locale);
    }

    /**
     * Construct a new date-only from a plain js Date
     * @param {Date} date any plain js Date
     * @param {string | undefined} locale optional locale if provided
     */
    static fromJsDate(date, locale) {
        return new DateTime(moment(date), locale);
    }

    /**
     * Construct a new date-only from a DateTime isntance
     * @param {DateTime} dateTime any date-time object
     * @param {string | undefined} locale optional locale if provided
     */
    static fromDateTime(dateTime, locale) {
        if (dateTime instanceof DateTime) {
            return new DateTime(dateTime._innerDate, locale);
        } else if (typeof dateTime === 'string') {
            return new DateTime(moment(dateTime), locale);
        } else if (typeof dateTime === 'object') {
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
            if (tz) return new DateTime(moment.tz(obj, tz), locale);
            const offset = __getObjectValue(dateTime.offset);
            if (offset) return new DateTime(moment(obj).utcOffset(offset, true), locale);
            return new DateTime(moment(obj), locale);
        }
        return new DateTime(moment(String(dateTime)), locale);
    }

    /**
     * Construct a new date-only from a DateOnly isntance
     * @param {DateOnly} dateOnly any date-only object
     * @param {string | undefined} locale optional locale if provided
     */
    static fromDateOnly(dateOnly, locale) {
        if (__isDateOnly(dateOnly)) {
            return new DateTime(
                moment.tz({year: dateOnly.year, month: dateOnly.month - 1, date: dateOnly.day}, 'UTC'),
                locale || dateOnly.locale
            );
        } else if (typeof dateOnly === 'object' || __isDateTimeObject(dateOnly)) {
            return this.fromDateTime(
                {year: dateOnly.year, month: dateOnly.month, day: dateOnly.day || dateOnly.date, timezone: 'UTC'},
                locale
            );
        }
        return new DateTime(moment.tz(String(dateOnly), 'UTC'), locale || dateOnly.locale);
    }

    /**
     * Construct a new date-only from any valid date value
     * @param {AnyDate} dateOnly any valid date. Empty (null or undefined) or NaN will return an invalid date
     * @param {string | undefined} locale optional locale if provided
     */
    static fromAnyDate(anyDate, locale) {
        if (!anyDate) return this.invalid();
        else if (this.isDateTime(anyDate) || __isDateTimeObject(anyDate)) return this.fromDateTime(anyDate, locale);
        else if (__isDateOnly(anyDate)) return this.fromDateOnly(anyDate, locale);
        else if (moment.isMoment(anyDate)) return this.fromMomentDate(anyDate, locale);
        else if (anyDate instanceof Date) return this.fromJsDate(anyDate, locale);
        else if (typeof anyDate === 'number') return this.fromJsDate(new Date(anyDate), locale);
        else if (typeof anyDate === 'string') {
            if (DATE_ONLY_REGEX.test(anyDate)) return this.fromDateOnly(anyDate, locale);
            else if (TIME_WITHOUT_ZONE_REGEX.test(anyDate))
                return this.fromMomentDate(moment.tz(anyDate, 'UTC'), locale);
            else if (DATE_TIME_REGEX.test(anyDate)) {
                const offset = extractTimezoneOffset(anyDate);
                const momentDate = moment(anyDate).utcOffset(offset === 'Z' ? '+00:00' : offset);
                return this.fromMomentDate(momentDate, locale);
            }
        }
        return this.fromJsDate(new Date(new String(anyDate)), locale);
    }

    /**
     * Construct a new date-time from a date string in a specific.
     * This method uses moment format constructor.
     * @see [parsing guide](https://momentjs.com/guides/#/parsing/).
     * @param {string} dateString any valid date string
     * @param {string} format the `dateString` parsing format
     * @param {string} locale optional locale if provided
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
        this._innerDate = locale ? moment(date).locale(locale) : moment(date);
    }

    get [Symbol.toStringTag]() {
        return 'Date';
    }

    get isDateTime() {
        return true;
    }

    /**
     * The locale set to this date
     * @returns {string} the locale set to this date. Defaults to the global locale if none was provided
     */
    get locale() {
        return this._innerDate.locale();
    }

    get timezone() {
        if (this.isUTC) return 'UTC';
        const tz = this._innerDate.tz();
        if (tz) return tz;

        const offset = this._innerDate.utcOffset();
        if (offset === moment().utcOffset()) return getLocalTimezone();
        return undefined;
    }

    get offset() {
        const offset = this._innerDate.format('Z');
        return offset === '+00:00' ? 'UTC' : offset;
    }

    /**
     * @returns {number}
     */
    get year() {
        return this._innerDate.year();
    }

    /**
     * @param {number} value
     */
    set year(value) {
        this._innerDate = this._innerDate.year(value);
    }

    /**
     * @returns {number}
     */
    get month() {
        return this._innerDate.month() + 1;
    }

    /**
     * @param {number} value
     */
    set month(value) {
        this._innerDate.month(value - 1);
    }

    /**
     * @returns {number}
     */
    get day() {
        return this._innerDate.date();
    }

    /**
     * @param {number} value
     */
    set day(value) {
        this._innerDate = this._innerDate.date(value);
    }

    /**
     * @returns {number}
     */
    get week() {
        return this._innerDate.week();
    }

    /**
     * @param {number} value
     */
    set week(value) {
        this._innerDate = this._innerDate.week(value);
    }

    /**
     * @returns {number}
     */
    get weekday() {
        return this._innerDate.weekday();
    }

    /**
     * @param {number} value
     */
    set weekday(value) {
        this._innerDate = this._innerDate.weekday(value);
    }

    /**
     * @returns {number}
     */
    get dayOfYear() {
        return this._innerDate.dayOfYear();
    }

    /**
     * @param {number} value
     */
    set dayOfYear(value) {
        this._innerDate = this._innerDate.dayOfYear(value);
    }

    /**
     * @returns {number}
     */
    get quarter() {
        return this._innerDate.quarter();
    }

    /**
     * @param {number} value
     */
    set quarter(value) {
        this._innerDate = this._innerDate.quarter(value);
    }

    /**
     * @returns {number}
     */
    get hour() {
        return this._innerDate.hours();
    }

    /**
     * @param {number} value
     */
    set hour(value) {
        this._innerDate = this._innerDate.hours(value);
    }

    /**
     * @returns {number}
     */
    get minute() {
        return this._innerDate.minutes();
    }

    /**
     * @param {number} value
     */
    set minute(value) {
        this._innerDate = this._innerDate.minutes(value);
    }

    /**
     * @returns {number}
     */
    get second() {
        return this._innerDate.seconds();
    }

    /**
     * @param {number} value
     */
    set second(value) {
        this._innerDate = this._innerDate.seconds(value);
    }

    /**
     * @returns {number}
     */
    get millisecond() {
        return this._innerDate.milliseconds();
    }

    /**
     * @param {number} value
     */
    set millisecond(value) {
        this._innerDate = this._innerDate.milliseconds(value);
    }

    get isUTC() {
        return this._innerDate.isUTC() || this.offset === 'UTC';
    }

    get isValid() {
        return this._innerDate.isValid();
    }

    get isLeapYear() {
        return this._innerDate.isLeapYear();
    }

    toTimezone(timezone) {
        return DateTime.fromMomentDate(moment.tz(this._innerDate, timezone));
    }

    toUTC() {
        return this.toTimezone('UTC');
    }

    /**
     * Format a date to string representation
     * @param {string} format date format. Defaults to `LOCALE_FORMATS.VERBAL_DATE_TIME_LONG`
     * @returns {string} date string using the provided formatting
     */
    format(format = LOCALE_FORMATS.VERBAL_DATE_TIME_LONG) {
        return this._innerDate.format(format);
    }

    /**
     * Return a new DateTime a the start of `unitOfTime`
     * @param {StartOfUnit} unitOfTime unit of time to be used
     * @returns {DateTime} new DateTime object at the start of `unitOfTime`
     */
    startOf(unitOfTime) {
        return DateTime.fromMomentDate(moment(this._innerDate).startOf(unitOfTime));
    }

    /**
     * Return a new DateTime a the end of `unitOfTime`
     * @param {EndOfUnit} unitOfTime unit of time to be used
     * @returns {DateTime} new DateTime object at the end of `unitOfTime`
     */
    endOf(unitOfTime) {
        return DateTime.fromMomentDate(moment(this._innerDate).endOf(unitOfTime));
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

        return DateTime.fromMomentDate(moment(this._innerDate).add(duration));
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

        return DateTime.fromMomentDate(moment(this._innerDate).subtract(duration));
    }

    /**
     * Get the difference between two dates
     * @param {AnyDate} date any valid date value
     * @param {DiffUnit | undefined} unitOfTime optional unit of time for comparission. Defaults to millisecond
     * @param {boolean | undefined} precise when false an integer is returned rather than a decimal number
     * @returns {number} the difference
     */
    diff(date, unitOfTime, precise) {
        const dateOnly = DateTime.fromAnyDate(date);
        return this._innerDate.diff(dateOnly._innerDate, unitOfTime, precise);
    }

    /**
     * Clone the DateOnly returning a new object with the same value
     * @returns {DateTime}
     */
    clone() {
        return DateTime.fromMomentDate(moment(this._innerDate));
    }

    /**
     * @return {number} Unix timestamp in milliseconds
     */
    valueOf() {
        return this._innerDate.valueOf();
    }

    equals(date) {
        const dateTime = DateTime.fromAnyDate(date);
        return this.valueOf() === dateTime.valueOf();
    }

    toJsDate() {
        return this._innerDate.toDate();
    }

    toISOString(useUtc = false) {
        if (!this.isValid) return this._innerDate.toString();
        return this._innerDate.toISOString(!useUtc);
    }

    toJSON() {
        if (!this.isValid) return this._innerDate.toString();
        return this._innerDate.toJSON();
    }

    toString() {
        return this.toISOString();
    }

    toTimestamp() {
        return this._innerDate.valueOf();
    }

    toObject() {
        const obj = this._innerDate.toObject();
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

    // MomentJs/Sequelize Compatibility layer
    get [Symbol.toStringTag]() {
        return 'Date';
    }

    // For better debugging
    [Symbol.for('nodejs.util.inspect.custom')]() {
        return `DateTime(${this.toISOString(false)})`;
    }

    /** @deprecated This method is for compatibility only, prefer to use `toTimestamp` instead */
    getTime() {
        return this.toTimestamp();
    }
}
