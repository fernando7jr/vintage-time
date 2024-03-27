import { DateOnly } from './date-only.mjs';
import { DateTime } from './date-time.mjs';

export { DateOnly } from './date-only.mjs';
export { DateTime } from './date-time.mjs';

export type AnyDate = Date | import('moment-timezone').Moment | DateOnly | DateTime | string | number;
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
