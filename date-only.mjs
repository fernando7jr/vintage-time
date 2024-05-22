import moment from 'moment-timezone';

import {LOCALE_FORMATS} from './locale-formats.mjs';
import {DATE_ONLY_REGEX} from './regex.mjs';
import {__isDateTimeObject} from './utils/date-time.mjs';
import {__isDateOnlyObject} from './utils/date-only.mjs';
import {getLocalLocale} from './utils/local.mjs';

/**
 * @typedef {moment.Moment} Moment
 * @typedef {import('./date-time.cjs').DateTime} DateTime
 * @typedef {DateOnly | DateTime | Date | Moment | string} AnyDate
 */
/**
 * @typedef {moment.unitOfTime.Diff} DiffUnit
 * @typedef {'year' | 'years' | 'y' | 'month' | 'months' | 'M' | 'week' | 'weeks' | 'w' | 'quarter' | 'quarters' | 'Q'} _Unit
 * @typedef {_Unit | 'isoWeek' | 'isoWeeks' | 'W'} StartOfUnit
 * @typedef {StartOfUnit} EndOfUnit
 * @typedef {StartOfUnit | 'day' | 'days' | 'd' | 'D'} AddUnit
 * @typedef {AddUnit} SubtractUnit
 * @typedef {Record<AddUnit, number>} Duration
 */

const ALLOWED_UNITS = new Set(['year', 'years', 'y', 'month', 'months', 'M', 'week', 'weeks', 'w', 'quarter', 'quarters', 'Q', 'isoWeek', 'isoWeeks', 'W']);
const DAYS_UNITS = new Set(['day', 'days', 'd', 'D']);

/**
 * @param {*} value
 * @returns {value is DateTime}
 */
function __isDateTime(value) {
    if (!value) return false;
    return __isDateTimeObject(value, true);
}

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
            throw new Error(`Unsupported value type "${_type}" for DateOnly obejct notation`);
    }
}

/**
 * Construct a Moment date object from a DateTime
 * @param {DateTime} dateTime
 */
function _momentDate(dateOnly) {
    return moment.utc({year: dateOnly._year, month: dateOnly._month - 1, date: dateOnly._day}).locale(dateOnly._locale);
}

/**
 * Copy a moment date object properties
 * @param {DateTime} dateOnly
 * @param {Moment} momentDate
 */
function _copyMomentDate(dateOnly, momentDate) {
    if (!momentDate.isValid()) {
        dateOnly._year = NaN;
        dateOnly._month = NaN;
        dateOnly._day = NaN;
    } else {
        dateOnly._year = momentDate.year();
        dateOnly._month = momentDate.month() + 1;
        dateOnly._day = momentDate.date();
    }
}

export class DateOnly {
    /** @type {number} */
    _year;
    /** @type {number} */
    _month;
    /** @type {number} */
    _day;
    /** @type {string|null} */
    _locale = null;

    /**
     * Check if the value is DateOnly instance
     * @param {*} value
     * @returns {value is DateOnly}
     */
    static isDateOnly(value) {
        return Boolean(value instanceof DateOnly || value?.isDateOnly);
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
     * Compare the date to `DateOnly.now()` and return true if the first date is before `DateOnly.now()`.
     * If the date is invalid then this method will return false.
     * @param {AnyDate | null | undefined} date any date value to be compared
     * @returns {boolean} true if the first date is before `DateOnly.now()`
     */
    static isBeforeNow(date) {
        return this.isBefore(date, DateOnly.now());
    }

    /**
     * Compare the date to `DateOnly.now()` and return true if the first date is after `DateOnly.now()`.
     * If the date is invalid then this method will return false.
     * @param {AnyDate | null | undefined} date any date value to be compared
     * @returns {boolean} true if the first date is after `DateOnly.now()`
     */
    static isAfterNow(date) {
        return this.isAfter(date, DateOnly.now());
    }

    /**
     * Compare the date to `DateOnly.now()` and return true if the first date is before or equal `DateOnly.now()`.
     * If the date is invalid then this method will return false.
     * @param {AnyDate | null | undefined} date any date value to be compared
     * @returns {boolean} true if the first date is before or equal `DateOnly.now()`
     */
    static isEqualOrBeforeNow(date) {
        return this.isEqualOrBefore(date, DateOnly.now());
    }

    /**
     * Compare the date to `DateOnly.now()` and return true if the first date is after ir equal `DateOnly.now()`.
     * If the date is invalid then this method will return false.
     * @param {AnyDate | null | undefined} date any date value to be compared
     * @returns {boolean} true if the first date is after or equal `DateOnly.now()`
     */
    static isEqualOrAfterNow(date) {
        return this.isEqualOrAfter(date, DateOnly.now());
    }

    /**
     * Return the min from a set of dates. Invalid values are not considered.
     * If the set is empty or there is no valid value then it returns `undefined`.
     * @param {Array<{AnyDate | null | undefined}>} dates set of date values
     * @returns {AnyDate | undefined} the item wich the value is the minumum from the set
     */
    static min(...dates) {
        let minAnyDate = undefined;
        let minDateOnly = undefined;
        for (const anyDate of dates) {
            const dateOnly = this.fromAnyDate(anyDate);
            if (!dateOnly.isValid) continue;
            if (!minDateOnly || dateOnly < minDateOnly) {
                minAnyDate = anyDate;
                minDateOnly = dateOnly;
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
        let maxDateOnly = undefined;
        for (const anyDate of dates) {
            const dateOnly = this.fromAnyDate(anyDate);
            if (!dateOnly.isValid) continue;
            if (!maxDateOnly || dateOnly > maxDateOnly) {
                maxAnyDate = anyDate;
                maxDateOnly = dateOnly;
            }
        }
        return maxAnyDate;
    }

    /**
     * Get a new date-only using the current system time for its value
     * @param {string | undefined} locale optional locale if provided
     * @returns {DateOnly} a new date-only using the current system time for its value
     */
    static now(locale) {
        return new DateOnly(moment().tz('UTC').startOf('day'), locale);
    }

    /**
     * Get an invalid date-only
     * @returns {DateOnly} a new date-onlybut its value is invalid
     * @example ```javascript
     * const validDateOnly = DateOnly.now();
     * const invalidDateOnly = DateOnly.invalid();
     * console.log(validDateOnly.isValid); // true
     * console.log(String(validDateOnly)); // '2023-12-08'
     * console.log(invalidDateOnly.isValid); // false
     * console.log(String(invalidDateOnly)); // 'Invalid date'
     * ```
     */
    static invalid() {
        return new DateOnly(NaN);
    }

    /**
     * Construct a new date-only from a moment object value
     * @param {Moment} date any moment date
     * @param {string} locale optional locale if provided
     */
    static fromMomentDate(date, locale) {
        date = moment.isMoment(date) ? date : moment(date);
        if (!date.isValid()) return new DateOnly(NaN, locale || date.locale());
        return new DateOnly(
            {
                year: date.year(),
                month: date.month(),
                date: date.date(),
            },
            locale || date.locale()
        );
    }

    /**
     * Construct a new date-only from a plain js Date
     * @param {Date} date any plain js Date
     * @param {string} locale optional locale if provided
     */
    static fromJsDate(date, locale) {
        const momentDate = moment.utc({
            year: date.getFullYear(),
            month: date.getMonth(),
            date: date.getDate(),
        });
        return this.fromMomentDate(momentDate, locale);
    }

    /**
     * Construct a new date-only from a DateTime isntance
     * @param {DateTime} dateTime any date-time object
     * @param {string} locale optional locale if provided
     */
    static fromDateTime(dateTime, locale) {
        if (typeof dateTime === 'string') {
            return this.fromMomentDate(moment.tz(dateTime, 'UTC').startOf('day'), locale);
        } else if (__isDateTime(dateTime)) {
            const month = __getObjectValue(dateTime.month);
            return this.fromMomentDate(
                moment.tz(
                    {
                        year: __getObjectValue(dateTime.year),
                        month: month ? month - 1 : 0,
                        date: __getObjectValue(dateTime.day) || __getObjectValue(dateTime.date) || 1,
                    },
                    'UTC'
                ),
                locale || dateTime.locale
            );
        }
        return this.fromDateOnly(dateTime, locale);
    }

    /**
     * Construct a new date-only from a DateOnly isntance
     * @param {DateOnly} dateOnly any date-only object
     * @param {string} locale optional locale if provided
     */
    static fromDateOnly(dateOnly, locale) {
        if (dateOnly instanceof DateOnly) {
            return new DateOnly(dateOnly, locale || dateOnly._locale);
        } else if (typeof dateOnly === 'string') {
            return this.fromMomentDate(moment.tz(dateOnly, 'UTC'), locale);
        } else if (__isDateOnlyObject(dateOnly)) {
            const month = __getObjectValue(dateOnly.month);
            return this.fromMomentDate(
                moment.tz(
                    {
                        year: __getObjectValue(dateOnly.year),
                        month: month ? month - 1 : 0,
                        date: __getObjectValue(dateOnly.day) || __getObjectValue(dateOnly.date) || 1,
                    },
                    'UTC'
                ),
                locale || dateOnly.locale
            );
        }
        const dateValue = new Date(dateOnly);
        if (isNaN(dateValue)) return this.invalid();
        return this.fromMomentDate(moment.tz(String(dateOnly), 'UTC').startOf('day'), locale);
    }

    /**
     * Construct a new date-only from any valid date value.
     * @param {AnyDate} dateOnly any valid date. Empty (null or undefined) or NaN will return an invalid date
     * @param {string} locale optional locale if provided
     */
    static fromAnyDate(anyDate, locale) {
        if (!anyDate) return this.invalid();
        else if (this.isDateOnly(anyDate)) return this.fromDateOnly(anyDate, locale);
        else if (__isDateTime(anyDate)) return this.fromDateTime(anyDate, locale);
        else if (__isDateOnlyObject(anyDate)) return this.fromDateOnly(anyDate, locale);
        else if (moment.isMoment(anyDate)) return this.fromMomentDate(anyDate, locale);
        else if (anyDate instanceof Date) return this.fromJsDate(anyDate, locale);
        else if (typeof anyDate === 'number') return this.fromJsDate(new Date(anyDate), locale);
        anyDate = String(anyDate);
        const slicedDate = anyDate.length === 10 ? anyDate : anyDate.slice(0, 10);
        if (DATE_ONLY_REGEX.test(slicedDate)) return this.fromDateOnly(slicedDate, locale);
        return this.fromJsDate(new Date(String(anyDate)), locale);
    }

    /**
     * Construct a new date-only from a date string in a specific.
     * This method uses moment format constructor.
     * @see [parsing guide](https://momentjs.com/guides/#/parsing/).
     * @param {string} dateString any valid date string
     * @param {string} format the `dateString` parsing format
     * @param {string} locale optional locale if provided
     */
    static fromFormat(dateString, format, locale) {
        return this.fromMomentDate(moment(dateString, format, true).utc(true), locale);
    }

    /**
     * DateOnly class which handles year, month and day only
     * @param {Date|Moment} date raw date object value
     * @param {string} locale optional locale if provided
     * @private prefer to use any of the static methods instead
     */
    constructor(date, locale) {
        this._locale = locale || getLocalLocale();
        if (date instanceof DateOnly) {
            this._year = date._year;
            this._month = date._month;
            this._day = date._day;
        } else {
            _copyMomentDate(this, moment(date));
        }
    }

    get isDateOnly() {
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

    /**
     * The year for this date.
     * Same as calling `new Date().getFullYear()` but it does not consider any timezone.
     * @returns {number}
     */
    get year() {
        return this._year;
    }

    /**
     * The year for this date.
     * Same as calling `new Date().setFullYear(value)` but it does not consider any timezone.
     * @param {number} value
     */
    set year(value) {
        _copyMomentDate(this, _momentDate(this).year(value));
    }

    /**
     * The month for this date.
     * Same as calling `new Date().getMonth() + 1` but it does not consider any timezone.
     * @returns {number}
     */
    get month() {
        return this._month;
    }

    /**
     * The month for this date.
     * Same as calling `new Date().setMonth(value - 1)` but it does not consider any timezone.
     * @param {number} value
     */
    set month(value) {
        _copyMomentDate(this, _momentDate(this).month(value - 1));
    }

    /**
     * The day for this date.
     * Same as calling `new Date().getDate()` but it does not consider any timezone.
     * @returns {number}
     */
    get day() {
        return this._day;
    }

    /**
     * The day for this date.
     * Same as calling `new Date().setDate(value)` but it does not consider any timezone.
     * @param {number} value
     */
    set day(value) {
        _copyMomentDate(this, _momentDate(this).date(value));
    }

    /**
     * The week of the year for this date
     * @returns {number}
     */
    get week() {
        return _momentDate(this).week();
    }

    /**
     * The week of the year for this date
     * @param {number} value
     */
    set week(value) {
        _copyMomentDate(this, _momentDate(this).week(value));
    }

    /**
     * The weekday for this date
     * @returns {number}
     */
    get weekday() {
        return _momentDate(this).weekday();
    }

    /**
     * The weekday for this date
     * @param {number} value
     */
    set weekday(value) {
        _copyMomentDate(this, _momentDate(this).weekday(value));
    }

    /**
     * The day of the year for this date
     * @returns {number}
     */
    get dayOfYear() {
        return _momentDate(this).dayOfYear();
    }

    /**
     * The day of the year for this date
     * @param {number} value
     */
    set dayOfYear(value) {
        _copyMomentDate(this, _momentDate(this).dayOfYear(value));
    }

    /**
     * The quarter for this date
     * @returns {number}
     */
    get quarter() {
        return _momentDate(this).quarter();
    }

    /**
     * The quarter for this date
     * @param {number} value
     */
    set quarter(value) {
        _copyMomentDate(this, _momentDate(this).quarter(value));
    }

    /**
     * Always return true to a DateOnly object
     * @returns {true} whether this date is at the UTC timezone or not
     */
    get isUTC() {
        return true;
    }

    /**
     * Check if the date is valid.
     * @returns {boolean} true if this is a valid date, false otherwise
     */
    get isValid() {
        return !isNaN(this._year);
    }

    /**
     * @returns {boolean} true if this date year is a leap year, false otherwise
     */
    get isLeapYear() {
        return _momentDate(this).isLeapYear();
    }

    /**
     * Format a date to string representation
     * @param {string} format date format. Defaults to `LOCALE_FORMATS.VERBAL_DATE_LONG`
     * @returns {string} date string using the provided formatting
     */
    format(format = LOCALE_FORMATS.VERBAL_DATE_LONG) {
        return _momentDate(this).startOf('day').format(format);
    }

    /**
     * Resolve an unit of time to itself or `''` if it is not valid
     * @param {StartOfUnit | EndOfUnit | string} unitOfTime
     * @param {boolean} allowDays flag whether days unit of time are allowed or not
     * @returns {StartOfUnit | EndOfUnit | ''}
     */
    _resolveUnitOfTime(unitOfTime, {allowDays = false, allowIsoWeeks = true} = {}) {
        if (allowDays && DAYS_UNITS.has(unitOfTime)) return unitOfTime;
        return ALLOWED_UNITS.has(unitOfTime) ? unitOfTime : '';
    }

    /**
     * Return a new DateOnly a the start of `unitOfTime`
     * @param {StartOfUnit} unitOfTime unit of time to be used
     * @returns {DateOnly} new DateOnly object at the start of `unitOfTime`
     */
    startOf(unitOfTime) {
        unitOfTime = this._resolveUnitOfTime(unitOfTime);
        return DateOnly.fromMomentDate(_momentDate(this).startOf(unitOfTime));
    }

    /**
     * Return a new DateOnly a the end of `unitOfTime`
     * @param {EndOfUnit} unitOfTime unit of time to be used
     * @returns {DateOnly} new DateOnly object at the end of `unitOfTime`
     */
    endOf(unitOfTime) {
        unitOfTime = this._resolveUnitOfTime(unitOfTime);
        return DateOnly.fromMomentDate(_momentDate(this).endOf(unitOfTime));
    }

    /**
     * Add a duration to this date and return a new DateOnly object with the resulting date
     * @param {Duration | number} amountOrDuration durtion object or numeric amount when used along an unit of time
     * @param {AddUnit | undefined} unitOfTime optional unit if used along an amount instead of duration object
     * @returns {DateOnly} new DateOnly object after adding the duration
     * @example ```javascript
     * const dateOnly = toDateOnly('2023-01-01');
     *
     * // You can use the old form
     * const a = dateOnly.plus(1, 'day');
     * console.log(a.format()); // '2023-01-02'
     *
     * // Or pass a duration object
     * const b = dateOnly.plus({day: 1});
     * console.log(b.format()); // '2023-01-02'
     * const c = dateOnly.plus({days: 2, momths: 3});
     * console.log(c.format()); // '2023-04-03'
     * ```
     */
    plus(amountOrDuration, unitOfTime) {
        if (!isNaN(amountOrDuration)) {
            if (unitOfTime) return this.plus({[unitOfTime]: amountOrDuration});
        }

        const duration = {};
        for (const key in amountOrDuration) {
            if (!this._resolveUnitOfTime(key, {allowDays: true})) continue;
            const amount = amountOrDuration?.[key];
            if (!amount) continue;
            duration[key] = amount;
        }

        return DateOnly.fromMomentDate(_momentDate(this).add(duration));
    }

    /**
     * Subtract a duration to this date and return a new DateOnly object with the resulting date
     * @param {Duration | number} amountOrDuration durtion object or numeric amount when used along an unit of time
     * @param {SubtractUnit | undefined} unitOfTime optional unit if used along an amount instead of duration object
     * @returns {DateOnly} new DateOnly object after subtracting the duration
     * @example ```javascript
     * const dateOnly = toDateOnly('2023-01-01');
     *
     * // You can use the old form
     * const a = dateOnly.minus(1, 'day');
     * console.log(a.format()); // '2022-12-31'
     *
     * // Or pass a duration object
     * const b = dateOnly.minus({day: 1});
     * console.log(b.format()); // '2022-12-31'
     * const c = dateOnly.minus({days: 2, momths: 3});
     * console.log(c.format()); // '2022-09-29'
     * ```
     */
    minus(amountOrDuration, unitOfTime) {
        if (!isNaN(amountOrDuration)) {
            if (unitOfTime) return this.minus({[unitOfTime]: amountOrDuration});
        }

        const duration = {};
        for (const key in amountOrDuration) {
            if (!this._resolveUnitOfTime(key, {allowDays: true})) continue;
            const amount = amountOrDuration?.[key];
            if (!amount) continue;
            duration[key] = amount;
        }

        return DateOnly.fromMomentDate(_momentDate(this).subtract(duration));
    }

    /**
     * Set a duration to this date and return the same DateOnly instance.
     * Changes are performed in place.
     * @param {Duration | number} amountOrDuration durtion object or numeric amount when used along an unit of time
     * @param {AddUnit | undefined} unitOfTime optional unit if used along an amount instead of duration object
     * @returns {this} this DateOny after changes
     * @example ```javascript
     * const dateOnly = toDateOnly('2023-01-01');
     *
     * // You can use the old form
     * dateOnly.set(1, 'day');
     * console.log(dateOnly.format()); // '2023-01-02'
     *
     * // Or pass a duration object
     * dateOnly.set({day: 1});
     * console.log(dateOnly.format()); // '2023-01-02'
     * dateOnly.set({days: 2, momths: 3});
     * console.log(dateOnly.format()); // '2023-04-03'
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
            else if (!this._resolveUnitOfTime(sourceKey, {allowDays: true})) continue;

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
        const dateOnly = DateOnly.fromAnyDate(date);
        if (!this.isValid || !dateOnly.isValid) throw new Error(`Can not subtract "${this.toJSON()}" from "${dateOnly.toJSON()}"`);
        return _momentDate(this).diff(_momentDate(dateOnly), unitOfTime, precise);
    }

    /**
     * Clone the DateOnly returning a new object with the same value
     * @returns {DateOnly}
     */
    clone() {
        return new DateOnly(this, this._locale);
    }

    /**
     * Get the valueOf the inner date value (timestamp).
     * Same as calling `toTimestamp()` method.
     * @return {number} Unix timestamp in milliseconds
     */
    valueOf() {
        return this.toTimestamp();
    }

    /**
     * Return true when the date value is equal to this date-only.
     * This checks the value. Invalid dates always return false.
     * @param anyDate any date value
     */
    equals(anyDate) {
        if (!this.isValid) return false;
        const dateOnly = DateOnly.fromAnyDate(anyDate);
        if (!dateOnly.isValid) return false;
        return this.valueOf() === dateOnly.valueOf();
    }

    /**
     * Return a plain JS Date object based on this DateOnly value.
     * The Date object is going to be at the local timezone, so the date might be off by one day.
     * @returns {Date} an equivalent JS Date object for this DateOnly value
     */
    toJsDate() {
        return _momentDate(this).toDate();
    }

    /**
     * Format this DateOnly to a ISO String (`YYYY-MM-DDT00:00:00.000Z`).
     * Since this is a DateOnly, the time part is always on UTC and at `00:00:00.000`.
     * @return {string} an ISO String for this DateOnly
     */
    toISOString() {
        if (!this.isValid) return _momentDate(this).toString();
        return `${this.toJSON()}T00:00:00.000Z`;
    }

    /**
     * Format this DateOnly to `YYYY-MM-DD`.
     * @return {string} an string in the DateOnly format
     */
    toJSON() {
        if (!this.isValid) return _momentDate(this).toString();
        return this.format('YYYY-MM-DD');
    }

    /**
     * Same as calling the`toJSON()` method.
     */
    toString() {
        return this.toJSON();
    }

    /**
     * Return the number of milliseconds since the Unix Epoch.
     * Same as calling `new Date().getTime()`.
     * @returns {number} the timestamp for this DateOnly
     */
    toTimestamp() {
        return _momentDate(this).startOf('day').valueOf();
    }

    /**
     * Return an plain object containing only the fields `year`, `month` and `day` of this DateOnly.
     * @returns an plain JS object representing this DateOnly.
     */
    toObject() {
        return {
            year: this._year,
            month: this._month,
            day: this._day,
        };
    }

    /**
     * Return a debug string
     * @returns {string}
     * @example
     * ````javascript
     * console.log(toDateOnly('2023-04-15').debug()); // Print: "DateOnly(2023-04-15)"
     * ````
     */
    debug() {
        return `DateOnly(${this.toJSON()})`;
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
