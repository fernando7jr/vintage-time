import {Extension, Root} from 'joi';

/**
 * Generates a schema object that matches a string data type or date data type. 
 * Accepts either a date-only or a date-time value.
 * Strings must be correctly formatted.
 * All values must be valid.
 * @example
 * ````javascript
 * const {anyDate} = require('vintage-time/plugins/joi');
 * joi = joi.extend(anyDate);
 * 
 * const schema = joi.object().keys({date: joi.anyDate()});
 * // These are valid strings
 * schema.validate({date: '2020-07-19'});
 * schema.validate({date: '2020-07-19 00:00:00.000Z'});
 * schema.validate({date: '2020-07-19 00:00:00Z'});
 * schema.validate({date: '2020-07-19 00:00:00-03:00'});
 * schema.validate({date: '2020-07-19 01:20:03'});
 * schema.validate({date: '2020-07-19 01:20:03.657Z'});
 * schema.validate({date: '2020-07-19T00:00:00Z'});
 * schema.validate({date: '2020-07-19T00:00:00-03:00'});
 * schema.validate({date: '2020-07-19T01:20:03'});
 * schema.validate({date: '2020-07-19T01:20:03.657Z'});
 * 
 * // These are not
 * schema.validate({date: '07/19/2020'});
 * schema.validate({date: '2020/07/19'});
 * schema.validate({date: '01:20:03.657Z'});
 * schema.validate({date: '2020/07/19 at 3:00 PM'});
 * ````
 */
export function anyDate(joi: Root): Extension;

/**
 * Generates a schema object that matches a string data type or date-only data type.
 * Strings must be correctly formatted as YYYY-MM-DD.
 * All values must be valid.
 * @example
 * ````javascript
 * const {dateOnly} = require('vintage-time/plugins/joi');
 * joi = joi.extend(dateOnly);
 * 
 * const schema = joi.object().keys({date: joi.dateOnly()});
 * // These are valid strings
 * schema.validate({date: '2020-07-19'});
 * schema.validate({date: '1990-01-11'});
 * 
 * // These are not
 * schema.validate({date: '2020-07-19 00:00:00Z'});
 * schema.validate({date: '2020-07-19 00:00:00-03:00'});
 * schema.validate({date: '2020-07-19 01:20:03'});
 * schema.validate({date: '2020-07-19 01:20:03.657Z'});
 * schema.validate({date: '2020-07-19T01:20:03'});
 * schema.validate({date: '2020-07-19T01:20:03.657Z'});
 * schema.validate({date: '2020-07-19T00:00:00Z'});
 * schema.validate({date: '2020-07-19T00:00:00-03:00'});
 * schema.validate({date: '07/19/2020'});
 * schema.validate({date: '2020/07/19'});
 * schema.validate({date: '01:20:03.657Z'});
 * schema.validate({date: '2020/07/19 at 3:00 PM'});
 * ````
 */
export function dateOnly(joi: Root): Extension;

/**
 * Generates a schema object that matches a string data type or date-time data type.
 * Strings must be correctly formatted as an ISO date.
 * All values must be valid.
 * @example
 * ````javascript
 * const {dateTime} = require('vintage-time/plugins/joi');
 * joi = joi.extend(dateTime);
 * 
 * const schema = joi.object().keys({date: joi.dateTime()});
 * // These are valid strings
 * schema.validate({date: '2020-07-19 00:00:00.000Z'});
 * schema.validate({date: '2020-07-19 00:00:00Z'});
 * schema.validate({date: '2020-07-19 00:00:00-03:00'});
 * schema.validate({date: '2020-07-19 01:20:03'});
 * schema.validate({date: '2020-07-19 01:20:03.657Z'});
 * schema.validate({date: '2020-07-19T00:00:00Z'});
 * schema.validate({date: '2020-07-19T00:00:00-03:00'});
 * schema.validate({date: '2020-07-19T01:20:03'});
 * schema.validate({date: '2020-07-19T01:20:03.657Z'});
 * 
 * // These are not
 * schema.validate({date: '2020-07-19'});
 * schema.validate({date: '1990-01-11'});
 * schema.validate({date: '07/19/2020'});
 * schema.validate({date: '2020/07/19'});
 * schema.validate({date: '01:20:03.657Z'});
 * schema.validate({date: '2020/07/19 at 3:00 PM'});
 * ````
 */
export function dateTime(joi: Root): Extension;
