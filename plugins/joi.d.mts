import {Extension, Root} from 'joi';

/**
 * Generates a schema object that matches a string data type or date data type. 
 * Accepts either a date-only or a date-time value.
 * Strings must be correctly formatted.
 * All values must be valid.
 */
export function anyDate(joi: Root): Extension;
/**
 * Generates a schema object that matches a string data type or date-only data type.
 * Strings must be correctly formatted as YYYY-MM-DD.
 * All values must be valid.
 */
export function dateOnly(joi: Root): Extension;
/**
 * Generates a schema object that matches a string data type or date-time data type.
 * Strings must be correctly formatted as an ISO date.
 * All values must be valid.
 */
export function dateTime(joi: Root): Extension;
