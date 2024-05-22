import moment from 'moment-timezone';

import {DateOnly} from './date-only.mjs';
import {DateTime} from './date-time.mjs';
import {getLocalTimezone} from './utils/local.mjs';

export {LOCALE_FORMATS} from './locale-formats.mjs';
export {DateOnly} from './date-only.mjs';
export {DateTime} from './date-time.mjs';

/** @typedef {Date | import('moment-timezone').Moment | DateOnly | DateTime | string | number} AnyDate */
/** @typedef {{locale?: string | boolean; toISOForm?: boolean; format?: string}} DateFormatingOptions */

/**
 * Get the default timezone.
 * @returns {string} the default timezone name
 */
export function getDefaultTimeZone() {
    return moment().tz() || getLocalTimezone();
}

/**
 * Set the default timezone to be used instead of the local timezone.
 * @param {string | undefined} timezone the timezone to be set as the default one. `undefined` resets it to the local timezone.
 */
export function setDefaultTimeZone(timezone) {
    moment.tz.setDefault(timezone ?? undefined);
}

/**
 * Extract the locale from a date value.
 * Please notice that only Moment, DateOnly and DateTime classes actually store a locale.
 * Other libraries might do so but need to be handled in this code too.
 * If there is no locale then undefined is returned which also means the default locale `en` should be used instead.
 * @param {AnyDate | null | undefined} anyDate any possible date
 * @returns {string | undefined} the locale for the date
 */
export function getDateLocale(anyDate) {
    if (!anyDate) return undefined;
    else if (anyDate instanceof Date) return undefined;
    else if (moment.isMoment(anyDate)) return anyDate.locale();
    else if (DateTime.isDateTime(anyDate) || DateOnly.isDateOnly(anyDate)) return anyDate.locale;
    return undefined;
}

/**
 * Check if the date value is valid or not
 * @param {AnyDate | null | undefined} anyDate any possible date
 * @returns {boolean}
 */
export function isDateValid(anyDate) {
    if (!anyDate) return false;
    else if (anyDate instanceof Date) return !isNaN(anyDate);
    else if (moment.isMoment(anyDate)) return anyDate.isValid();
    else if (DateTime.isDateTime(anyDate) || DateOnly.isDateOnly(anyDate)) return anyDate.isValid;
    return toDateTime(anyDate).isValid;
}

/**
 * Convert a date value to a plain JS Date object
 * @param {AnyDate | null | undefined} anyDate any possible date
 * @returns {Date | undefined}
 */
export function toJsDate(anyDate) {
    if (!anyDate) return undefined;
    else if (anyDate instanceof Date) return anyDate;
    else if (moment.isMoment(anyDate)) return anyDate.toDate();
    else if (DateTime.isDateTime(anyDate) || DateOnly.isDateOnly(anyDate)) return anyDate.toJsDate();
    return toDateTime(anyDate).toJsDate();
}

/**
 * Convert a date value to DateOnly object.
 * `null` or `undefined` values will return `undefined` instead.
 * @param {AnyDate | null | undefined} anyDate any possible date
 * @param {string} locale optional locale if provided
 * @returns {DateOnly | undefined}
 */
export function toDateOnly(anyDate, locale) {
    if (!anyDate) return undefined;
    return DateOnly.fromAnyDate(anyDate, locale);
}
/**
 * Get a new date-only using the current system time for its value.
 * Just a shortcut for `DateOnly.now(locale)`.
 * @param {string | undefined} locale optional locale if provided
 * @returns {DateOnly} a new date-only using the current system time for its value
 */
toDateOnly.now = (locale) => DateOnly.now(locale);

/**
 * Convert a date value to DateTime object.
 * `null` or `undefined` values will return `undefined` instead.
 * @param {AnyDate | null | undefined} anyDate any possible date
 * @param {string} locale optional locale if provided
 * @returns {DateTime | undefined}
 */
export function toDateTime(anyDate, locale) {
    if (!anyDate) return undefined;
    return DateTime.fromAnyDate(anyDate, locale);
}
/**
 * Get a new date-time using the current system time for its value.
 * Just a shortcut for `DateTime.now(locale)`.
 * @param {string | undefined} locale optional locale if provided
 * @returns {DateTime} a new date-time using the current system time for its value
 */
toDateTime.now = (locale) => DateTime.now(locale);
/**
 * Convert a date value to DateTime object in a specific timezone.
 * `null` or `undefined` values will return `undefined` instead.
 * Just a shortcut for `toDateTime(anyDate, locale).toTimezone(tz)`.
 * @param {AnyDate | null | undefined} anyDate any possible date
 * @param {string} tz the timezone for the date
 * @param {string} locale optional locale if provided
 * @returns {DateTime | undefined}
 */
toDateTime.tz = (anyDate, tz, locale) => toDateTime(anyDate, locale).toTimezone(tz);
/**
 * Convert a date value to DateTime object in a specific timezone but keeping the local time.
 * `null` or `undefined` values will return `undefined` instead.
 * Just a shortcut for `toDateTime(anyDate, locale).toTimezone(tz, true)`.
 * @param {AnyDate | null | undefined} anyDate any possible date
 * @param {string} tz the timezone for the date
 * @param {string} locale optional locale if provided
 * @returns {DateTime | undefined}
 */
toDateTime.as = (anyDate, tz, locale) => toDateTime(anyDate, locale).toTimezone(tz, true);

/**
 * Format a date to a date-only format
 * @param {AnyDate | null | undefined} anyDate any possible date
 * @param {(DateFormatingOptions & {includeTimeAndZone?: boolean}) | undefined} options optional formating options to customize the output
 * @param {string | boolean | undefined} options.locale optional locale string or boolean for whether locale should be applied or not
 * @param {string | undefined} options.format optional format string pattern. Defaults to DateOnly `LL` which translates to `YYYY-MM-DD` at the specific locale
 * @param {boolean | undefined} options.toISOForm optional flag for forcing an ISOString output. Since it is a date-only the format string pattern will be `YYYY-MM-DD`
 * @param {boolean | undefined} options.includeTimeAndZone optional flag for when toISOForm is enabled. It overrides the ISOString pattern to be a full ISOString which includes the time and zone as well.
 * @returns {string | undefined}
 */
function __formatToDateOnly(anyDate, options) {
    if (!anyDate) return undefined;
    const {toISOForm = false, format, includeTimeAndZone = false} = options;
    if (toISOForm) {
        const dateOnly = toDateOnly(anyDate);
        return includeTimeAndZone ? dateOnly.toISOString() : dateOnly.toJSON();
    }

    const locale = (() => {
        const {locale} = options;
        if (!locale || typeof locale === 'string') return locale;
        throw new Error('Locale must be an string');
    })();
    const dateOnly = toDateOnly(anyDate, locale);
    return dateOnly.format(format);
}

/**
 * Format a date to a date-time format
 * @param {AnyDate | null | undefined} anyDate any possible date
 * @param {string | boolean | undefined} options.locale optional locale string or boolean for whether locale should be applied or not
 * @param {string | undefined} options.format optional format string pattern. Defaults to DateTime default format
 * @param {boolean | undefined} options.toISOForm optional flag for forcing an ISOString output
 * @returns {string | undefined}
 */
function __formatToDateTime(anyDate, options) {
    if (!anyDate) return undefined;
    const {toISOForm = false, format} = options;
    if (toISOForm) {
        return toDateTime(anyDate).toISOString(true);
    }

    const locale = (() => {
        const {locale} = options;
        if (!locale || typeof locale === 'string') return locale;
        throw new Error('Locale must be an string');
    })();
    const dateTime = toDateTime(anyDate, locale);
    return dateTime.format(format);
}

/**
 * Format a date to a date-only format but without applying locale
 * @param {AnyDate | null | undefined} anyDate any possible date
 * @param {object} options optional formating options to customize the output
 * @param {boolean | undefined} options.includeTimeAndZone optional flag for when toISOForm is enabled. It overrides the ISOString pattern to be a full ISOString which includes the time and zone as well.
 * @returns {string | undefined}
 */
export function formatToDateOnly(anyDate, options) {
    return __formatToDateOnly(anyDate, {toISOForm: true, includeTimeAndZone: options?.includeTimeAndZone});
}

/**
 * Format a date to a date-time format but without applying locale
 * @param {AnyDate | null | undefined} anyDate any possible date
 * @returns {string | undefined}
 */
export function formatToDateTime(anyDate) {
    return __formatToDateTime(anyDate, {toISOForm: true});
}

/**
 * Format a date to a date-only ormat applying locale
 * @param {AnyDate | null | undefined} anyDate any possible date
 * @param {object} options optional formating options to customize the output
 * @param {string | undefined} options.locale optional locale string. Defaults to the current locale set to the date or the default system locale
 * @param {string | undefined} options.format optional format string pattern. Defaults to `LOCALE_FORMATS.VERBAL_DATE_LONG`. @see `LOCALE_FORMATS`
 * @returns {string | undefined}
 */
export function formatToDateOnlyWithLocale(anyDate, options) {
    const {locale, format} = options || {};
    return __formatToDateOnly(anyDate, {locale: locale || moment().locale(), format});
}

/**
 * Format a date to a date-time format applying locale
 * @param {AnyDate | null | undefined} anyDate any possible date
 * @param {object} options optional formating options to customize the output
 * @param {string | undefined} options.locale optional locale string. Defaults to the current locale set to the date or the default system locale
 * @param {string | undefined} options.format optional format string pattern. Defaults to `LOCALE_FORMATS.VERBAL_DATE_TIME_LONG`. @see `LOCALE_FORMATS`
 * @returns {string | undefined}
 */
export function formatToDateTimeWithLocale(anyDate, options) {
    const {locale, format} = options || {};
    return __formatToDateTime(anyDate, {locale: locale || moment().locale(), format});
}

/**
 * Convert a duration input into an specific time unit.
 * Returns `NaN` when the duration is invalid.
 * @param {moment.FromTo | moment.DurationInputObject} durationInput any valid duration input
 * @param {moment.unitOfTime.Base} toTimeUnit the time unit to have the duration converted into
 * @param {boolean} precise whether to return the precise result or round it to the nearest integer (`Math.floor` is used). Defaults to `true`
 * @returns {number} the amount in the requested time unit. `NaN` when the duration is invalid.
 */
export function convertDurationToTimeUnit(durationInput, toTimeUnit, precise = true) {
    const duration = moment.duration(durationInput);
    if (!duration.isValid()) return NaN;
    const result = duration.as(toTimeUnit);
    if (precise) return result;
    return Math.floor(result);
}
