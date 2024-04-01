import type {Moment, unitOfTime} from 'moment-timezone';

import { LOCALE_FORMATS } from './locale-formats.cts';
export { LOCALE_FORMATS } from './locale-formats.cts';

export type AnyDate = Date | Moment | DateOnly | DateTime | DateOnlyLike | DateTimeLike | string | number;

export type DateOnlyLike = Pick<DateOnly, 'year' | 'month' | 'day'>;
export type DiffUnit = unitOfTime.Diff
export type DateOnlyStartOfUnit = 'year' | 'years' | 'y' | 'month' | 'months' | 'M' | 'week' | 'weeks' | 'w' | 'quarter' | 'quarters' | 'Q' | 'isoWeek' | 'isoWeeks' | 'W'
export type DateOnlyEndOfUnit = DateOnlyStartOfUnit
export type DateOnlyAddUnit = DateOnlyStartOfUnit | 'day' | 'days' | 'd' | 'D'
export type DateOnlySubtractUnit = DateOnlyAddUnit
export type DateOnlyDuration = Record<DateOnlyAddUnit, number>

export class DateOnly {
    /**
     * Check if the value is DateOnly instance
     * @param value any value
     * @returns true when value is DateOnly, false otherwise
     */
    static isDateOnly(value: any): value is DateOnly;

    /**
     * Get a new date-only using the current system time for its value
     * @param locale optional locale if provided
     * @returns a new date-only using the current system time for its value
     */
    static now(locale?: string): DateOnly;

    /**
     * Get an invalid date-only
     * @returns a new date-onlybut its value is invalid
     * @example ```javascript
     * const validDateOnly = DateOnly.now();
     * const invalidDateOnly = DateOnly.invalid();
     * console.log(validDateOnly.isValid); // true
     * console.log(String(validDateOnly)); // '2023-12-08'
     * console.log(invalidDateOnly.isValid); // false
     * console.log(String(invalidDateOnly)); // 'Invalid date'
     * ```
     */
    static invalid(): DateOnly;

    /**
     * Construct a new date-only from a moment object value
     * @param date any moment date
     * @param locale optional locale if provided
     */
    static fromMomentDate(date: Moment, locale?: string): DateOnly;

    /**
     * Construct a new date-only from a plain js Date
     * @param date any plain js Date
     * @param locale optional locale if provided
     */
    static fromJsDate(date: Date, locale?: string): DateOnly;

    /**
     * Construct a new date-only from a DateTime isntance
     * @param dateTime any date-time object
     * @param locale optional locale if provided
     */
    static fromDateTime(dateTime: DateTime | DateTimeLike, locale?: string): DateOnly;

    /**
     * Construct a new date-only from a DateOnly isntance
     * @param dateOnly any date-only like object
     * @param locale optional locale if provided
     */
    static fromDateOnly(dateOnly: DateOnly | DateOnlyLike, locale?: string): DateOnly;

    /**
     * Construct a new date-only from any valid date value.
     * @param dateOnly any valid date. Empty (null or undefined) or NaN will return an invalid date
     * @param locale optional locale if provided
     */
    static fromAnyDate(anyDate: AnyDate, locale?: string): DateOnly;

    /**
     * Construct a new date-only from a date string in a specific.
     * This method uses moment format constructor.
     * @see [parsing guide](https://momentjs.com/guides/#/parsing/).
     * @param dateString any valid date string
     * @param format the `dateString` parsing format
     * @param locale optional locale if provided
     */
    static fromFormat(dateString: string, format: string, locale?: string): DateOnly;

    /**
     * DateOnly class which handles year, month and day only
     * @param date raw date object value
     * @param locale optional locale if provided
     */
    protected constructor(date: Date | Moment, locale?: string);

    readonly isDateOnly: true;

    /**
     * The locale set to this date
     * Defaults to the global locale if none was provided
     */
    readonly locale: string;

    /**
     * The year for this date.
     * Same as calling `new Date().getFullYear()` but it does not consider any timezone.
     */
    get year(): number;

    /**
     * The year for this date.
     * Same as calling `new Date().setFullYear(value)` but it does not consider any timezone.
     * @param value
     */
    set year(value: number);

    /**
     * The month for this date.
     * Same as calling `new Date().getMonth() + 1` but it does not consider any timezone.
     */
    get month();

    /**
     * The month for this date.
     * Same as calling `new Date().setMonth(value - 1)` but it does not consider any timezone.
     * @param value
     */
    set month(value: number);

    /**
     * The day for this date.
     * Same as calling `new Date().getDate()` but it does not consider any timezone.
     */
    get day();

    /**
     * The day for this date.
     * Same as calling `new Date().setDate(value)` but it does not consider any timezone.
     * @param value
     */
    set day(value: number);

    /**
     * The week of the year for this date
     */
    get week(): number;

    /**
     * The week of the year for this date
     * @param value
     */
    set week(value: number);

    /**
     * The weekday for this date
     */
    get weekday();

    /**
     * The weekday for this date
     * @param value
     */
    set weekday(value: number);

    /**
     * The day of the year for this date
     * @returns {number}
     */
    get dayOfYear(): number;

    /**
     * The day of the year for this date
     * @param value
     */
    set dayOfYear(value: number);

    /**
     * The quarter for this date
     */
    get quarter(): number;

    /**
     * The quarter for this date
     * @param value
     */
    set quarter(value: number);

    /** 
     * Always return true to a DateOnly object
     * @returns whether this date is at the UTC timezone or not
     */
    get isUTC(): true;

    /**
     * Check if the date is valid.
     * @returns true if this is a valid date, false otherwise
     */
    get isValid(): boolean;

    /**
     * @returns true if this date year is a leap year, false otherwise
     */
    get isLeapYear(): boolean;

    /**
     * Format a date to string representation
     * @param format date format. Defaults to `LOCALE_FORMATS.VERBAL_DATE_LONG`
     * @returns date string using the provided formatting
     */
    format(format?: LOCALE_FORMATS | string): string;

    /**
     * Return a new DateOnly a the start of `unitOfTime`
     * @param unitOfTime unit of time to be used
     * @returns new DateOnly object at the start of `unitOfTime`
     */
    startOf(unitOfTime: DateOnlyStartOfUnit): DateOnly;

    /**
     * Return a new DateOnly a the end of `unitOfTime`
     * @param unitOfTime unit of time to be used
     * @returns new DateOnly object at the end of `unitOfTime`
     */
    endOf(unitOfTime: DateOnlyEndOfUnit): DateOnly;

    /**
     * Add a duration to this date and return a new DateOnly object with the resulting date
     * @param duration durtion object or numeric amount when used along an unit of time
     * @returns new DateOnly object after adding the duration
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
    plus(duration: DateOnlyDuration): DateOnly;
    /**
     * Add a duration to this date and return a new DateOnly object with the resulting date
     * @param amount durtion object or numeric amount when used along an unit of time
     * @param unitOfTime optional unit if used along an amount instead of duration object
     * @returns new DateOnly object after adding the duration
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
    plus(amount: number, unitOfTime: DateOnlyAddUnit): DateOnly;

    /**
     * Subtract a duration to this date and return a new DateOnly object with the resulting date
     * @param duration durtion object or numeric amount when used along an unit of time
     * @returns new DateOnly object after subtracting the duration
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
    minus(duration: DateOnlyDuration): DateOnly;
    /**
     * Subtract a duration to this date and return a new DateOnly object with the resulting date
     * @param amount durtion object or numeric amount when used along an unit of time
     * @param unitOfTime optional unit if used along an amount instead of duration object
     * @returns new DateOnly object after subtracting the duration
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
    minus(amount: number, unitOfTime: DateOnlySubtractUnit): DateOnly;

    /**
     * Get the difference between two dates
     * @param date any valid date value
     * @param unitOfTime optional unit of time for comparission. Defaults to millisecond
     * @param precise when false an integer is returned rather than a decimal number
     * @returns the difference
     */
    diff(date: AnyDate, unitOfTime?: DiffUnit, precise?: boolean): number;

    /**
     * Clone the DateOnly returning a new object with the same value
     */
    clone(): DateOnly;

    /**
     * Get the valueOf the inner date value (timestamp).
     * Same as calling `toTimestamp()` method.
     * @return Unix timestamp in milliseconds
     */
    valueOf(): number;

    /**
     * Return true when the date value is equal to this date-only.
     * This checks the value.
     * @param anyDate any date value
     */
    equals(anyDate: AnyDate): boolean;

    /**
     * Return a plain JS Date object based on this DateOnly value.
     * The Date object is going to be at the local timezone, so the date might be off by one day.
     * Same as calling `new Date(this.toTimestamp())` or `new Date(this.toISOString())`.
     * @returns an equivalent JS Date object for this DateOnly value
     */
    toJsDate(): Date;

    /**
     * Format this DateOnly to a ISO String (`YYYY-MM-DDT00:00:00.000Z`).
     * Since this is a DateOnly, the time part is always on UTC and at `00:00:00.000`.
     * @return an ISO String for this DateOnly
     */
    toISOString(): string;

    /**
     * Format this DateOnly to `YYYY-MM-DD`.
     * @return an string in the DateOnly format
     */
    toJSON(): string;

    /**
     * Same as calling the`toJSON()` method.
     */
    toString(): string;

    /**
     * Return the number of milliseconds since the Unix Epoch.
     * Same as calling `new Date().getTime()`.
     * @returns the timestamp for this DateOnly
     */
    toTimestamp(): number;

    /**
     * Return an plain object containing only the fields `year`, `month` and `day` of this DateOnly.
     * @returns an plain JS object representing this DateOnly.
     */
    toObject(): DateOnlyLike;
}

export type DateTimeLike = Pick<DateTime, 'year' | 'month' | 'day' | 'hour' | 'minute' | 'second' | 'millisecond'> & Partial<Pick<DateTime, 'timezone' | 'offset'>>;
export type DateTimeDiffUnit = unitOfTime.Diff;
export type DateTimeStartOfUnit = unitOfTime.StartOf;
export type DateTimeEndOfUnit = DateTimeStartOfUnit;
export type DateTimeAddUnit = unitOfTime.All;
export type DateTimeSubtractUnit = DateTimeAddUnit;
export type DateTimeDuration = Record<DateTimeAddUnit, number>

export class DateTime {
    /**
     * Check if the value is DateTime instance
     * @param value
     * @returns true if value is DateTime, false otherwise
     */
    static isDateTime(value: any): value is DateTime;

    /**
     * Get a new date-time using the current system time for its value
     * @param locale optional locale if provided
     * @returns a new date-time using the current system time for its value
     */
    static now(locale?: string): DateTime;

    /**
     * Get an invalid date-time
     * @returns a new date-time but its value is invalid
     * @example ```javascript
     * const validDateTime = DateTime.now();
     * const invalidDateTime = DateTime.invalid();
     * console.log(validDateTime.isValid); // true
     * console.log(String(validDateTime)); // '2023-12-08T09:32:29.436Z'
     * console.log(invalidDateTime.isValid); // false
     * console.log(String(invalidDateTime)); // 'Invalid date'
     * ```
     */
    static invalid(): DateTime;

    /**
     * Construct a new date-time from a moment object value
     * @param date any moment date
     * @param locale optional locale if provided
     */
    static fromMomentDate(date: Moment, locale?: string): DateTime

    /**
     * Construct a new date-time from a plain js Date
     * @param date any plain js Date
     * @param locale optional locale if provided
     */
    static fromJsDate(date: Date, locale?: string): DateTime;

    /**
     * Construct a new date-time from a DateTime isntance
     * @param dateTime any date-time object
     * @param locale optional locale if provided
     */
    static fromDateTime(dateTime: DateTime, locale?: string): DateTime;

    /**
     * Construct a new date-time from a DateOnly isntance
     * @param dateOnly any date-only object
     * @param locale optional locale if provided
     */
    static fromDateOnly(dateOnly: DateOnly, locale?: string): DateTime;

    /**
     * Construct a new date-time from any valid date value
     * @param dateOnly any valid date. Empty (null or undefined) or NaN will return an invalid date
     * @param locale optional locale if provided
     */
    static fromAnyDate(anyDate: AnyDate, locale?: string): DateTime;

    /**
     * Construct a new date-time from a date string in a specific.
     * This method uses moment format constructor.
     * @see [parsing guide](https://momentjs.com/guides/#/parsing/).
     * @param dateString any valid date string
     * @param format the `dateString` parsing format
     * @param locale optional locale if provided
     */
    static fromFormat(dateString: string, format: string, locale?: string): DateTime;

    /**
     * DateOnly class which handles year, month and day only
     * @param {Date|Moment} date raw date object value
     * @param locale optional locale if provided
     */
    protected constructor(date: Date | Moment, locale?: string);

    readonly isDateTime: true;

    /**
     * The locale set to this date
     * @returns the locale set to this date. Defaults to the global locale if none was provided
     */
    readonly locale: string;

    readonly timezone: string | undefined;

    get offset(): string;

    /**
     * The year for this date.
     * Same as calling `new Date().getFullYear()`.
     */
    get year(): number;

    /**
     * The year for this date.
     * Same as calling `new Date().setFullYear(value)`.
     * @param value
     */
    set year(value: number);

    /**
     * The month for this date.
     * Same as calling `new Date().getMonth() + 1`.
     */
    get month();

    /**
     * The month for this date.
     * Same as calling `new Date().setMonth(value - 1)`.
     * @param value
     */
    set month(value: number);

    /**
     * The day for this date.
     * Same as calling `new Date().getDate()`.
     */
    get day();

    /**
     * The day for this date.
     * Same as calling `new Date().setDate(value)`.
     * @param value
     */
    set day(value: number);

    /**
     * The week of the year for this date
     */
    get week(): number;

    /**
     * The week of the year for this date
     * @param value
     */
    set week(value: number);

    /**
     * The weekday for this date
     */
    get weekday();

    /**
     * The weekday for this date
     * @param value
     */
    set weekday(value: number);

    /**
     * The day of the year for this date
     * @returns {number}
     */
    get dayOfYear(): number;

    /**
     * The day of the year for this date
     * @param value
     */
    set dayOfYear(value: number);

    /**
     * The quarter for this date
     */
    get quarter(): number;

    /**
     * The quarter for this date
     * @param value
     */
    set quarter(value: number);

    /**
     * The hours for this date
     */
    get hour(): number;

    /**
     * @param value
     */
    set hour(value: number);

    /**
     * The minutes for this date
     */
    get minute(): number;

    /**
     * @param value
     */
    set minute(value: number);

    /**
     * The seconds for this date
     */
    get second(): number;

    /**
     * @param value
     */
    set second(value: number);

    /**
     * The milliseconds for this date
     */
    get millisecond(): number;

    /**
     * @param value
     */
    set millisecond(value: number);

    /** 
     * @returns whether this date is at the UTC timezone or not
     */
    get isUTC(): true;

    /**
     * Check if the date is valid.
     * @returns true if this is a valid date, false otherwise
     */
    get isValid(): boolean;

    /**
     * @returns true if this date year is a leap year, false otherwise
     */
    get isLeapYear(): boolean;

    /**
     * Move this DateTime to a different timezone. The new offset is applied.
     * @param timezone the new timezone
     * @returns a new DateTime using the specified timezone
     */
    toTimezone(timezone: string): DateTime;

    /**
     * Same as calling `toTimezone('UTC')`
     * @returns a new DateTime using the UTC timezone
     */
    toUTC(): DateTime;

    /**
     * Format a date to string representation
     * @param format date format. Defaults to `LOCALE_FORMATS.VERBAL_DATE_TIME_LONG`
     * @returns date string using the provided formatting
     */
    format(format?: LOCALE_FORMATS | string): string;

    /**
     * Return a new DateTime a the start of `unitOfTime`
     * @param unitOfTime unit of time to be used
     * @returns new DateTime object at the start of `unitOfTime`
     */
    startOf(unitOfTime: DateTimeStartOfUnit): DateTime;

    /**
     * Return a new DateTime a the end of `unitOfTime`
     * @param unitOfTime unit of time to be used
     * @returns new DateTime object at the end of `unitOfTime`
     */
    endOf(unitOfTime: DateTimeEndOfUnit): DateTime;

    /**
     * Add a duration to this date and return a new DateTime object with the resulting date
     * @param duration durtion object or numeric amount when used along an unit of time
     * @returns new DateTime object after adding the duration
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
    plus(duration: DateTimeDuration): DateTime;
    /**
     * Add a duration to this date and return a new DateTime object with the resulting date
     * @param amount durtion object or numeric amount when used along an unit of time
     * @param unitOfTime optional unit if used along an amount instead of duration object
     * @returns new DateTime object after adding the duration
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
    plus(amount: number, unitOfTime: DateTimeAddUnit): DateTime;

    /**
     * Subtract a duration to this date and return a new DateTime object with the resulting date
     * @param duration durtion object or numeric amount when used along an unit of time
     * @param unitOfTime optional unit if used along an amount instead of duration object
     * @returns new DateTime object after subtracting the duration
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
    minus(duration: DateTimeDuration): DateTime;
    /**
     * Subtract a duration to this date and return a new DateTime object with the resulting date
     * @param amount durtion object or numeric amount when used along an unit of time
     * @param unitOfTime optional unit if used along an amount instead of duration object
     * @returns new DateTime object after subtracting the duration
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
    minus(amount: number, unitOfTime: DateTimeSubtractUnit): DateTime;

    /**
     * Get the difference between two dates
     * @param anyDate any valid date value
     * @param unitOfTime optional unit of time for comparission. Defaults to millisecond
     * @param precise when false an integer is returned rather than a decimal number
     * @returns the difference
     */
    diff(anyDate: AnyDate, unitOfTime?: DateTimeDiffUnit, precise?: boolean): number;

    /**
     * Clone the DateTime returning a new object with the same value
     * @returns
     */
    clone(): DateTime;

    /**
     * Return the number of milliseconds since the Unix Epoch.
     * Same as calling `new Date().getTime()`.
     * @returns the timestamp for this DateTime
     */
    valueOf(): number;

    /**
     * Return true when the date value is equal to this date-time.
     * This checks the value.
     * @param anyDate any date value
     */
    equals(anyDate: AnyDate): boolean;

    /**
     * Return a plain JS Date object based on this DateTime value.
     * The Date object is going to be at the local timezone, so the date might be off by one day.
     * Same as calling `new Date(this.toTimestamp())` or `new Date(this.toISOString())`.
     * @returns an equivalent JS Date object for this DateTime value
     */
    toJsDate(): Date;

    /**
     * Format this DateTime to a ISO String (`YYYY-MM-DDTHH:mm:ss.SSSZ`).
     * @param useUtc optional parameter to enforce the output to be at the UTC timezone. Offset difference is applied. Defaults to false.
     * @return an ISO String for this DateTime. Either at UTC or at its own timezone
     */
    toISOString(useUtc?: boolean): string;

    /**
     * Format this DateTime to `YYYY-MM-DDTHH:mm:ss.SSSZ`.
     * Same as calling `this.toISOString(false)`.
     * @return an string in the DateTime format
     */
    toJSON(): string;

    /**
     * Format this DateTime to `YYYY-MM-DDTHH:mm:ss.SSSZ`.
     * Same as calling the`toJSON()` method.
     * @return an string in the DateTime format
     */
    toString(): string;

    /**
     * Return the number of milliseconds since the Unix Epoch.
     * Same as calling `new Date().getTime()`.
     * @returns the timestamp for this DateTime
     */
    toTimestamp(): number;

    /**
     * Return an plain object containing only the fields `year`, `month`, `day`, `hour`, `minute`, `second`, `millisecond`, `timezone` and `offset` of this DateTime.
     * @returns an plain JS object representing this DateTime.
     */
    toObject(): DateTimeLike;
}

export type DateFormatingOptions = { locale?: string | boolean; toISOForm?: boolean; format?: string; };

/**
 * Extract the locale from a date value.
 * Please notice that only Moment, DateOnly and DateTime classes actually store a locale.
 * Other libraries might do so but need to be handled in this code too.
 * If there is no locale then undefined is returned which also means the default locale `en` should be used instead.
 * @param anyDate any possible date
 * @returns the locale for the date
 */
export function getDateLocale(anyDate: AnyDate | null | undefined): string | undefined;

/**
 * Check if the date value is valid or not
 * @param anyDate any possible date
 * @returns true when the date is valid, false otherwise
 */
export function isDateValid(anyDate: AnyDate | null | undefined): boolean;

/**
 * Convert a date value to a plain JS Date object
 * @param anyDate any possible date
 * @returns a plain JS Date object or undefined if the input is null or undefined
 */
export function toJsDate(anyDate: AnyDate | null | undefined): Date | undefined;

export interface ToDateOnly {
    /**
     * Convert a date value to DateOnly object.
     * `null` or `undefined` values will return `undefined` instead.
     * @param anyDate any possible date
     * @param locale optional locale if provided
     * @returns a new date-only object or undefined
     */
    (anyDate: AnyDate | null | undefined, locale?: string): DateOnly | undefined;

    /**
     * Get a new date-only using the current system time for its value.
     * Just a shortcut for `DateOnly.now(locale)`.
     * @param locale optional locale if provided
     * @returns a new date-only using the current system time for its value
     */
    now(locale?: string): DateOnly;
}
export const toDateOnly: ToDateOnly;

export interface ToDateTime {
    /**
     * Convert a date value to DateTime object.
     * `null` or `undefined` values will return `undefined` instead.
     * @param anyDate any possible date
     * @param locale optional locale if provided
     * @returns a new date-only object or undefined
     */
    (anyDate: AnyDate | null | undefined, locale?: string): DateTime | undefined;

    /**
     * Get a new date-time using the current system time for its value.
     * Just a shortcut for `DateTime.now(locale)`.
     * @param locale optional locale if provided
     * @returns a new date-time using the current system time for its value
     */
    now(locale?: string): DateTime;

    /**
     * Convert a date value to DateTime object in a specific timezone.
     * `null` or `undefined` values will return `undefined` instead.
     * Just a shortcut for `toDateTime(anyDate, locale).toTimezone(tz)`.
     * @param anyDate any possible date
     * @param tz the timezone for the date
     * @param locale optional locale if provided
     * @returns a new date-time at the specific timezone or undefined
     */
    (anyDate: AnyDate | null | undefined, tz: string, locale?: string): DateTime | undefined;
}
export const toDateTime: ToDateTime;

/**
 * Format a date to a date-only format but without applying locale
 * @param anyDate any possible date
 * @param options optional formating options to customize the output
 * @param options.includeTimeAndZone optional flag for when toISOForm is enabled. It overrides the ISOString pattern to be a full ISOString which includes the time and zone as well.
 * @returns the formatted date string
 */
export function formatToDateOnly(anyDate: AnyDate | null | undefined, options?: { includeTimeAndZone?: boolean; }): string;

/**
 * Format a date to a date-time format but without applying locale
 * @param anyDate any possible date
 * @returns the formatted date string
 */
export function formatToDateTime(anyDate: AnyDate | null | undefined): string;

/**
 * Format a date to a date-only ormat applying locale
 * @param anyDate any possible date
 * @param options optional formating options to customize the output
 * @param options.locale optional locale string. Defaults to the current locale set to the date or the default system locale
 * @param options.format optional format string pattern. Defaults to `LOCALE_FORMATS.VERBAL_DATE_LONG`. @see `LOCALE_FORMATS`
 * @returns the formatted date string applying the locale
 */
export function formatToDateOnlyWithLocale(anyDate: AnyDate | null | undefined, options?: { locale?: string; format?: string; }): string;

/**
 * Format a date to a date-time format applying locale
 * @param anyDate any possible date
 * @param options optional formating options to customize the output
 * @param options.locale optional locale string. Defaults to the current locale set to the date or the default system locale
 * @param options.format optional format string pattern. Defaults to `LOCALE_FORMATS.VERBAL_DATE_TIME_LONG`. @see `LOCALE_FORMATS`
 * @returns the formatted date string applying the locale
 */
export function formatToDateTimeWithLocale(anyDate: AnyDate | null | undefined, options?: { locale?: string; format?: string; }): string;
