const moment = require('moment-timezone');

const {LOCALE_FORMATS} = require('./locale-formats.cjs');
const {DATE_ONLY_REGEX} = require('./regex.cjs');
const {__isDateTimeObject} = require('./utils/date-time.cjs');
const {__isDateOnlyObject} = require('./utils/date-only.cjs');

const customInspectSymbol = Symbol && Symbol.for('nodejs.util.inspect.custom');

/**
 * @typedef {moment.Moment} Moment
 * @typedef {import('./date-time').DateTime} DateTime
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

const ALLOWED_UNITS = new Set([
    'year',
    'years',
    'y',
    'month',
    'months',
    'M',
    'week',
    'weeks',
    'w',
    'quarter',
    'quarters',
    'Q',
    'isoWeek',
    'isoWeeks',
    'W',
]);
const DAYS_UNITS = new Set(['day', 'days', 'd', 'D']);
const ISOWEEK_UNITS = new Set(['isoWeek', 'isoWeeks', 'W']);

/**
 * @param {*} value
 * @returns {value is DateTime}
 */
function __isDateTime(value) {
    if (!value) return false;
    return __isDateTimeObject(value);
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
            throw new Error(
                `Unsuppo/Users/fernando/projs/deel/backend/utils/date/locale-formats.js /Users/fernando/projs/deel/backend/utils/date/regex.js /Users/fernando/projs/deel/backend/utils/date/sequelize.jsrted value type "${_type}" for DateTime obejct notation`
            );
    }
}

class DateOnly {
    /** @type {Moment} */
    _innerDate;

    /**
     * Check if the value is DateOnly instance
     * @param {*} value
     * @returns {value is DateOnly}
     */
    static isDateOnly(value) {
        return Boolean(value instanceof DateOnly || value?.isDateOnly);
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
        return new DateOnly(moment(NaN));
    }

    /**
     * Construct a new date-only from a moment object value
     * @param {Moment} date any moment date
     * @param {string} locale optional locale if provided
     */
    static fromMomentDate(date, locale) {
        return new DateOnly(date, locale);
    }

    /**
     * Construct a new date-only from a plain js Date
     * @param {Date} date any plain js Date
     * @param {string} locale optional locale if provided
     */
    static fromJsDate(date, locale) {
        return new DateOnly(moment(date), locale);
    }

    /**
     * Construct a new date-only from a DateTime isntance
     * @param {DateTime} dateTime any date-time object
     * @param {string} locale optional locale if provided
     */
    static fromDateTime(dateTime, locale) {
        if (typeof dateTime === 'string') {
            return new DateOnly(moment.tz(dateTime, 'UTC').startOf('day'), locale);
        } else if (__isDateTime(dateTime)) {
            return new DateOnly(
                moment.tz({year: dateTime.year, month: dateTime.month - 1, date: dateTime.day || dateTime.date}, 'UTC'),
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
            return new DateOnly(dateOnly._innerDate, locale);
        } else if (typeof dateOnly === 'string') {
            return new DateOnly(moment.tz(dateOnly, 'UTC'), locale);
        } else if (typeof dateOnly === 'object') {
            const month = __getObjectValue(dateOnly.month);
            return new DateOnly(
                moment.tz(
                    {
                        year: __getObjectValue(dateOnly.year),
                        month: month ? month - 1 : undefined,
                        date: __getObjectValue(dateOnly.day) || __getObjectValue(dateOnly.date),
                    },
                    'UTC'
                ),
                locale || dateOnly.locale
            );
        }
        return new DateOnly(moment.tz(String(dateOnly), 'UTC').startOf('day'), locale);
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
        else if (typeof anyDate === 'string') {
            const slicedDate = anyDate.length === 10 ? anyDate : anyDate.slice(0, 10);
            if (DATE_ONLY_REGEX.test(slicedDate)) return this.fromDateOnly(slicedDate, locale);
        }
        return this.fromJsDate(new Date(new String(anyDate)), locale);
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
        this._innerDate = locale ? moment(date).locale(locale) : moment(date);
    }

    get isDateOnly() {
        return true;
    }

    /**
     * The locale set to this date
     * @returns {string} the locale set to this date. Defaults to the global locale if none was provided
     */
    get locale() {
        return this._innerDate.locale();
    }

    /**
     * The year for this date.
     * Same as calling `new Date().getFullYear()` but it does not consider any timezone.
     * @returns {number}
     */
    get year() {
        return this._innerDate.year();
    }

    /**
     * The year for this date.
     * Same as calling `new Date().setFullYear(value)` but it does not consider any timezone.
     * @param {number} value
     */
    set year(value) {
        this._innerDate = this._innerDate.year(value);
    }

    /**
     * The month for this date.
     * Same as calling `new Date().getMonth() + 1` but it does not consider any timezone.
     * @returns {number}
     */
    get month() {
        return this._innerDate.month() + 1;
    }

    /**
     * The month for this date.
     * Same as calling `new Date().setMonth(value - 1)` but it does not consider any timezone.
     * @param {number} value
     */
    set month(value) {
        this._innerDate.month(value - 1);
    }

    /**
     * The day for this date.
     * Same as calling `new Date().getDate()` but it does not consider any timezone.
     * @returns {number}
     */
    get day() {
        return this._innerDate.date();
    }

    /**
     * The day for this date.
     * Same as calling `new Date().setDate(value)` but it does not consider any timezone.
     * @param {number} value
     */
    set day(value) {
        this._innerDate = this._innerDate.date(value);
    }

    /**
     * The week of the year for this date
     * @returns {number}
     */
    get week() {
        return this._innerDate.week();
    }

    /**
     * The week of the year for this date
     * @param {number} value
     */
    set week(value) {
        this._innerDate = this._innerDate.week(value);
    }

    /**
     * The weekday for this date
     * @returns {number}
     */
    get weekday() {
        return this._innerDate.weekday();
    }

    /**
     * The weekday for this date
     * @param {number} value
     */
    set weekday(value) {
        this._innerDate = this._innerDate.weekday(value);
    }

    /**
     * The day of the year for this date
     * @returns {number}
     */
    get dayOfYear() {
        return this._innerDate.dayOfYear();
    }

    /**
     * The day of the year for this date
     * @param {number} value
     */
    set dayOfYear(value) {
        this._innerDate = this._innerDate.dayOfYear(value);
    }

    /**
     * The quarter for this date
     * @returns {number}
     */
    get quarter() {
        return this._innerDate.quarter();
    }

    /**
     * The quarter for this date
     * @param {number} value
     */
    set quarter(value) {
        this._innerDate = this._innerDate.quarter(value);
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
        return this._innerDate.isValid();
    }

    /**
     * @returns {boolean} true if this date year is a leap year, false otherwise
     */
    get isLeapYear() {
        return this._innerDate.isLeapYear();
    }

    /**
     * Format a date to string representation
     * @param {string} format date format. Defaults to `LOCALE_FORMATS.VERBAL_DATE_LONG`
     * @returns {string} date string using the provided formatting
     */
    format(format = LOCALE_FORMATS.VERBAL_DATE_LONG) {
        return this._innerDate.startOf('day').format(format);
    }

    /**
     * Resolve an unit of time to itself or `''` if it is not valid
     * @param {StartOfUnit | EndOfUnit | string} unitOfTime
     * @param {boolean} allowDays flag whether days unit of time are allowed or not
     * @returns {StartOfUnit | EndOfUnit | ''}
     */
    #resolveUnitOfTime(unitOfTime, {allowDays = false, allowIsoWeeks = true} = {}) {
        if (allowDays && DAYS_UNITS.has(unitOfTime)) return unitOfTime;
        else if (ISOWEEK_UNITS.has(unitOfTime)) return allowIsoWeeks ? unitOfTime : '';
        return ALLOWED_UNITS.has(unitOfTime) ? unitOfTime : '';
    }

    /**
     * Return a new DateOnly a the start of `unitOfTime`
     * @param {StartOfUnit} unitOfTime unit of time to be used
     * @returns {DateOnly} new DateOnly object at the start of `unitOfTime`
     */
    startOf(unitOfTime) {
        unitOfTime = this.#resolveUnitOfTime(unitOfTime);
        return DateOnly.fromMomentDate(moment(this._innerDate).startOf(unitOfTime));
    }

    /**
     * Return a new DateOnly a the end of `unitOfTime`
     * @param {EndOfUnit} unitOfTime unit of time to be used
     * @returns {DateOnly} new DateOnly object at the end of `unitOfTime`
     */
    endOf(unitOfTime) {
        unitOfTime = this.#resolveUnitOfTime(unitOfTime);
        return DateOnly.fromMomentDate(moment(this._innerDate).endOf(unitOfTime));
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
            if (!this.#resolveUnitOfTime(key, {allowDays: true})) continue;
            const amount = amountOrDuration?.[key];
            if (!amount) continue;
            duration[key] = amount;
        }

        return DateOnly.fromMomentDate(moment(this._innerDate).add(duration));
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
            if (!this.#resolveUnitOfTime(key, {allowDays: true})) continue;
            const amount = amountOrDuration?.[key];
            if (!amount) continue;
            duration[key] = amount;
        }

        return DateOnly.fromMomentDate(moment(this._innerDate).subtract(duration));
    }

    /**
     * Get the difference between two dates
     * @param {AnyDate} date any valid date value
     * @param {DiffUnit | undefined} unitOfTime optional unit of time for comparission. Defaults to millisecond
     * @param {boolean | undefined} precise when false an integer is returned rather than a decimal number
     * @returns {number} the difference
     */
    diff(date, unitOfTime, precise) {
        const dateOnly = DateOnly.fromAnyDate(date);
        return this._innerDate.diff(dateOnly._innerDate, unitOfTime, precise);
    }

    /**
     * Clone the DateOnly returning a new object with the same value
     * @returns {DateOnly}
     */
    clone() {
        return DateOnly.fromMomentDate(moment(this._innerDate));
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
     * This checks the value.
     * @param anyDate any date value
     */
    equals(anyDate) {
        const dateOnly = DateOnly.fromAnyDate(anyDate);
        return this.valueOf() === dateOnly.valueOf();
    }

    /**
     * Return a plain JS Date object based on this DateOnly value.
     * The Date object is going to be at the local timezone, so the date might be off by one day.
     * @returns {Date} an equivalent JS Date object for this DateOnly value
     */
    toJsDate() {
        return this._innerDate.toDate();
    }

    /**
     * Format this DateOnly to a ISO String (`YYYY-MM-DDT00:00:00.000Z`).
     * Since this is a DateOnly, the time part is always on UTC and at `00:00:00.000`.
     * @return {string} an ISO String for this DateOnly
     */
    toISOString() {
        if (!this.isValid) return this._innerDate.toString();
        return `${this.toJSON()}T00:00:00.000Z`;
    }

    /**
     * Format this DateOnly to `YYYY-MM-DD`.
     * @return {string} an string in the DateOnly format
     */
    toJSON() {
        if (!this.isValid) return this._innerDate.toString();
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
        return this._innerDate.startOf('day').valueOf();
    }

    /**
     * Return an plain object containing only the fields `year`, `month` and `day` of this DateOnly.
     * @returns an plain JS object representing this DateOnly.
     */
    toObject() {
        const obj = this._innerDate.toObject();
        return {
            year: obj.years,
            month: obj.months + 1,
            day: obj.date,
        };
    }

    // MomentJs/Sequelize Compatibility layer
    get [Symbol.toStringTag]() {
        return 'Date';
    }

    // For better debugging
    [Symbol.for('nodejs.util.inspect.custom')]() {
        return `DateOnly(${this.toJSON()})`;
    }

    /** @deprecated This method is for compatibility only, prefer to use `toTimestamp` instead */
    getTime() {
        return this.toTimestamp();
    }
}

module.exports = {DateOnly};
