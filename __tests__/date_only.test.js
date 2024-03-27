const moment = require('moment-timezone');

const {DateOnly} = require('../date-only.cjs');
const {DateTime} = require('../date-time.cjs');
const {toDateOnly, toDateTime, isDateValid} = require('../index.cjs');

const DEFAULT_LOCALE = moment().locale();
const ENGLISH_LOCALE = 'en';
const CUSTOM_LOCALE = 'x-pseudo';

describe('DateOnly', () => {
    describe('static', () => {
        describe('isDateOnly', () => {
            it('should return true for DateOnly instances', () => {
                const result = DateOnly.isDateOnly(toDateOnly('2022-01-01'));
                expect(result).toBe(true);
            });

            it('should return true for DateOnly invalid instances', () => {
                const result = DateOnly.isDateOnly(DateOnly.invalid());
                expect(result).toBe(true);
            });

            it('should return false for anything else', () => {
                const cases = [
                    Infinity,
                    -Infinity,
                    NaN,
                    null,
                    undefined,
                    false,
                    true,
                    0,
                    1,
                    new Date().getTime(),
                    3.3,
                    '1',
                    '5.5',
                    String(new Date().getTime()),
                    '2023-01-01',
                    toDateTime('2023-01-01'),
                    {year: 2000, month: 2, day: 27},
                    moment(),
                    new Date(),
                    new Date().toString(),
                ];
                const result = cases.map((c) => DateOnly.isDateOnly(c));
                expect(result).toEqual(result.map(() => false));
            });
        });

        describe('now', () => {
            it('should get date now without a custom locale', () => {
                const date = new Date();
                const now = DateOnly.now();
                expect(date.valueOf()).toBeGreaterThanOrEqual(now.valueOf());
                expect(now.locale).toEqual(DEFAULT_LOCALE);
            });

            it('should get date now with a custom locale', () => {
                const date = new Date();
                const now = DateOnly.now(CUSTOM_LOCALE);
                expect(date.getTime()).toBeGreaterThanOrEqual(now.valueOf());
                expect(now.locale).not.toEqual(DEFAULT_LOCALE);
                expect(now.locale).toBe(CUSTOM_LOCALE);
            });
        });

        describe('invalid', () => {
            it('should get an invalid date', () => {
                const now = DateOnly.invalid();
                expect(now.valueOf()).toBeNaN();
                expect(now.toString()).toBe('Invalid date');
                expect(now.toJSON()).toBe('Invalid date');
                expect(now.isValid).toBe(false);
            });
        });

        describe('fromMomentDate', () => {
            it('should construct from a momentjs instance with time', () => {
                const value = moment('2023-09-05 17:44:36');
                const result = DateOnly.fromMomentDate(value);
                expect(result.toObject()).toEqual({
                    year: 2023,
                    month: 9,
                    day: 5,
                });
                expect(result.toJSON()).toBe('2023-09-05');
                expect(result.locale).toEqual(DEFAULT_LOCALE);
            });

            it('should construct from a momentjs instance without a custom locale', () => {
                const value = moment('2023-09-05');
                const result = DateOnly.fromMomentDate(value);
                expect(result.toObject()).toEqual({
                    year: 2023,
                    month: 9,
                    day: 5,
                });
                expect(result.toJSON()).toBe('2023-09-05');
                expect(result.locale).toEqual(DEFAULT_LOCALE);
            });

            it('should construct from a momentjs instance with a custom locale', () => {
                const value = moment('2023-09-05');
                const result = DateOnly.fromMomentDate(value, CUSTOM_LOCALE);
                expect(result.toObject()).toEqual({
                    year: 2023,
                    month: 9,
                    day: 5,
                });
                expect(result.toJSON()).toBe('2023-09-05');
                expect(result.locale).toEqual(CUSTOM_LOCALE);
            });

            it('should construct an invalid date', () => {
                const result = [
                    DateOnly.fromMomentDate(moment.invalid()),
                    DateOnly.fromMomentDate(moment.invalid(), CUSTOM_LOCALE),
                ];
                expect(result.map(isDateValid)).toEqual([false, false]);
            });
        });

        describe('fromJsDate', () => {
            it('should construct from a JS Date instance with time', () => {
                const value = new Date('2023-09-05 17:44:36');
                const result = DateOnly.fromJsDate(value);
                expect(result.toObject()).toEqual({
                    year: 2023,
                    month: 9,
                    day: 5,
                });
                expect(result.toJSON()).toBe('2023-09-05');
                expect(result.locale).toEqual(DEFAULT_LOCALE);
            });

            it('should construct from a JS Date instance without a custom locale', () => {
                const value = new Date('2023-09-05');
                const result = DateOnly.fromJsDate(value);
                expect(result.toObject()).toEqual({
                    year: 2023,
                    month: 9,
                    day: 5,
                });
                expect(result.toJSON()).toBe('2023-09-05');
                expect(result.locale).toEqual(DEFAULT_LOCALE);
            });

            it('should construct from a JS Date instance with a custom locale', () => {
                const value = new Date('2023-09-05');
                const result = DateOnly.fromJsDate(value, CUSTOM_LOCALE);
                expect(result.toObject()).toEqual({
                    year: 2023,
                    month: 9,
                    day: 5,
                });
                expect(result.toJSON()).toBe('2023-09-05');
                expect(result.locale).toEqual(CUSTOM_LOCALE);
            });

            it('should construct an invalid date', () => {
                const result = [DateOnly.fromJsDate(new Date(NaN)), DateOnly.fromJsDate(new Date(NaN), CUSTOM_LOCALE)];
                expect(result.map(isDateValid)).toEqual([false, false]);
            });
        });

        describe('fromDateTime', () => {
            it('should construct from a DateTime instance with time', () => {
                const value = toDateTime('2023-09-05 17:44:36');
                const result = DateOnly.fromDateTime(value);
                expect(result.toObject()).toEqual({
                    year: 2023,
                    month: 9,
                    day: 5,
                });
                expect(result.toJSON()).toBe('2023-09-05');
                expect(result.locale).toEqual(DEFAULT_LOCALE);
            });

            it('should construct from a DateTime instance without a custom locale', () => {
                const value = toDateTime('2023-09-05');
                const result = DateOnly.fromDateTime(value);
                expect(result.toObject()).toEqual({
                    year: 2023,
                    month: 9,
                    day: 5,
                });
                expect(result.toJSON()).toBe('2023-09-05');
                expect(result.locale).toEqual(DEFAULT_LOCALE);
            });

            it('should construct from a DateTime instance with a custom locale', () => {
                const value = toDateTime('2023-09-05');
                const result = DateOnly.fromDateTime(value, CUSTOM_LOCALE);
                expect(result.toObject()).toEqual({
                    year: 2023,
                    month: 9,
                    day: 5,
                });
                expect(result.toJSON()).toBe('2023-09-05');
                expect(result.locale).toEqual(CUSTOM_LOCALE);
            });

            it('should construct from a object with date properties', () => {
                const result = DateOnly.fromDateTime({
                    year: 2020,
                    month: 10,
                    day: 27,
                    hour: 9,
                    minute: 48,
                    second: 59,
                    milliseconds: 248,
                });
                expect(result.toObject()).toEqual({
                    year: 2020,
                    month: 10,
                    day: 27,
                });
                expect(result.toJSON()).toBe('2020-10-27');
                expect(result.locale).toEqual(DEFAULT_LOCALE);
            });

            it('should construct from a object with date properties with a custom locale', () => {
                const result = DateOnly.fromDateTime(
                    {year: 2020, month: 10, day: 27, hour: 9, minute: 48, second: 59, milliseconds: 248},
                    CUSTOM_LOCALE
                );
                expect(result.toObject()).toEqual({
                    year: 2020,
                    month: 10,
                    day: 27,
                });
                expect(result.toJSON()).toBe('2020-10-27');
                expect(result.locale).toEqual(CUSTOM_LOCALE);
            });

            it('should construct an invalid date', () => {
                const result = [
                    DateOnly.fromDateTime(DateTime.invalid()),
                    DateOnly.fromDateTime(DateTime.invalid(), CUSTOM_LOCALE),
                ];
                expect(result.map(isDateValid)).toEqual([false, false]);
            });
        });

        describe('fromDateOnly', () => {
            it('should construct from a DateOnly instance with time', () => {
                const value = toDateOnly('2023-09-05 17:44:36');
                const result = DateOnly.fromDateOnly(value);
                expect(result.toObject()).toEqual({
                    year: 2023,
                    month: 9,
                    day: 5,
                });
                expect(result.toJSON()).toBe('2023-09-05');
                expect(result.locale).toEqual(DEFAULT_LOCALE);
            });

            it('should construct from a DateOnly instance without a custom locale', () => {
                const value = toDateOnly('2023-09-05');
                const result = DateOnly.fromDateOnly(value);
                expect(result.toObject()).toEqual({
                    year: 2023,
                    month: 9,
                    day: 5,
                });
                expect(result.toJSON()).toBe('2023-09-05');
                expect(result.locale).toEqual(DEFAULT_LOCALE);
            });

            it('should construct from a DateOnly instance with a custom locale', () => {
                const value = toDateOnly('2023-09-05');
                const result = DateOnly.fromDateOnly(value, CUSTOM_LOCALE);
                expect(result.toObject()).toEqual({
                    year: 2023,
                    month: 9,
                    day: 5,
                });
                expect(result.toJSON()).toBe('2023-09-05');
                expect(result.locale).toEqual(CUSTOM_LOCALE);
            });

            it('should construct from a object with date properties', () => {
                const result = DateOnly.fromDateOnly({
                    year: 2020,
                    month: 10,
                    day: 27,
                    hour: 9,
                    minute: 48,
                    second: 59,
                    milliseconds: 248,
                });
                expect(result.toObject()).toEqual({
                    year: 2020,
                    month: 10,
                    day: 27,
                });
                expect(result.toJSON()).toBe('2020-10-27');
                expect(result.locale).toEqual(DEFAULT_LOCALE);
            });

            it('should construct from a object with date properties with a custom locale', () => {
                const result = DateOnly.fromDateOnly(
                    {year: 2020, month: 10, day: 27, hour: 9, minute: 48, second: 59, milliseconds: 248},
                    CUSTOM_LOCALE
                );
                expect(result.toObject()).toEqual({
                    year: 2020,
                    month: 10,
                    day: 27,
                });
                expect(result.toJSON()).toBe('2020-10-27');
                expect(result.locale).toEqual(CUSTOM_LOCALE);
            });

            it('should construct an invalid date', () => {
                const result = [
                    DateOnly.fromDateOnly(DateOnly.invalid()),
                    DateOnly.fromDateOnly(DateOnly.invalid(), CUSTOM_LOCALE),
                ];
                expect(result.map(isDateValid)).toEqual([false, false]);
            });
        });

        describe('fromAnyDate', () => {
            it('should construct from a momentjs instance with time', () => {
                const value = moment('2023-09-05 17:44:36');
                const result = DateOnly.fromAnyDate(value);
                expect(result.toObject()).toEqual({
                    year: 2023,
                    month: 9,
                    day: 5,
                });
                expect(result.toJSON()).toBe('2023-09-05');
                expect(result.locale).toEqual(DEFAULT_LOCALE);
            });

            it('should construct from a momentjs instance without a custom locale', () => {
                const value = moment('2023-09-05');
                const result = DateOnly.fromAnyDate(value);
                expect(result.toObject()).toEqual({
                    year: 2023,
                    month: 9,
                    day: 5,
                });
                expect(result.toJSON()).toBe('2023-09-05');
                expect(result.locale).toEqual(DEFAULT_LOCALE);
            });

            it('should construct from a momentjs instance with a custom locale', () => {
                const value = moment('2023-09-05');
                const result = DateOnly.fromAnyDate(value, CUSTOM_LOCALE);
                expect(result.toObject()).toEqual({
                    year: 2023,
                    month: 9,
                    day: 5,
                });
                expect(result.toJSON()).toBe('2023-09-05');
                expect(result.locale).toEqual(CUSTOM_LOCALE);
            });

            it('should construct from a JS Date instance with time', () => {
                const value = new Date('2023-09-05 17:44:36');
                const result = DateOnly.fromAnyDate(value);
                expect(result.toObject()).toEqual({
                    year: 2023,
                    month: 9,
                    day: 5,
                });
                expect(result.toJSON()).toBe('2023-09-05');
                expect(result.locale).toEqual(DEFAULT_LOCALE);
            });

            it('should construct from a JS Date instance without a custom locale', () => {
                const value = new Date('2023-09-05');
                const result = DateOnly.fromAnyDate(value);
                expect(result.toObject()).toEqual({
                    year: 2023,
                    month: 9,
                    day: 5,
                });
                expect(result.toJSON()).toBe('2023-09-05');
                expect(result.locale).toEqual(DEFAULT_LOCALE);
            });

            it('should construct from a JS Date instance with a custom locale', () => {
                const value = new Date('2023-09-05');
                const result = DateOnly.fromAnyDate(value, CUSTOM_LOCALE);
                expect(result.toObject()).toEqual({
                    year: 2023,
                    month: 9,
                    day: 5,
                });
                expect(result.toJSON()).toBe('2023-09-05');
                expect(result.locale).toEqual(CUSTOM_LOCALE);
            });

            it('should construct from a DateTime instance with time', () => {
                const value = toDateTime('2023-09-05 17:44:36');
                const result = DateOnly.fromAnyDate(value);
                expect(result.toObject()).toEqual({
                    year: 2023,
                    month: 9,
                    day: 5,
                });
                expect(result.toJSON()).toBe('2023-09-05');
                expect(result.locale).toEqual(DEFAULT_LOCALE);
            });

            it('should construct from a DateTime instance without a custom locale', () => {
                const value = toDateTime('2023-09-05');
                const result = DateOnly.fromAnyDate(value);
                expect(result.toObject()).toEqual({
                    year: 2023,
                    month: 9,
                    day: 5,
                });
                expect(result.toJSON()).toBe('2023-09-05');
                expect(result.locale).toEqual(DEFAULT_LOCALE);
            });

            it('should construct from a DateTime instance with a custom locale', () => {
                const value = toDateTime('2023-09-05');
                const result = DateOnly.fromAnyDate(value, CUSTOM_LOCALE);
                expect(result.toObject()).toEqual({
                    year: 2023,
                    month: 9,
                    day: 5,
                });
                expect(result.toJSON()).toBe('2023-09-05');
                expect(result.locale).toEqual(CUSTOM_LOCALE);
            });

            it('should construct from a DateOnly instance with time', () => {
                const value = toDateOnly('2023-09-05 17:44:36');
                const result = DateOnly.fromAnyDate(value);
                expect(result.toObject()).toEqual({
                    year: 2023,
                    month: 9,
                    day: 5,
                });
                expect(result.toJSON()).toBe('2023-09-05');
                expect(result.locale).toEqual(DEFAULT_LOCALE);
            });

            it('should construct from a DateOnly instance without a custom locale', () => {
                const value = toDateOnly('2023-09-05');
                const result = DateOnly.fromAnyDate(value);
                expect(result.toObject()).toEqual({
                    year: 2023,
                    month: 9,
                    day: 5,
                });
                expect(result.toJSON()).toBe('2023-09-05');
                expect(result.locale).toEqual(DEFAULT_LOCALE);
            });

            it('should construct from a DateOnly instance with a custom locale', () => {
                const value = toDateOnly('2023-09-05');
                const result = DateOnly.fromAnyDate(value, CUSTOM_LOCALE);
                expect(result.toObject()).toEqual({
                    year: 2023,
                    month: 9,
                    day: 5,
                });
                expect(result.toJSON()).toBe('2023-09-05');
                expect(result.locale).toEqual(CUSTOM_LOCALE);
            });

            it('should construct from a timestamp with time', () => {
                const value = new Date('2023-09-05 17:44:36');
                const result = DateOnly.fromAnyDate(value.getTime());
                expect(result.toObject()).toEqual({
                    year: 2023,
                    month: 9,
                    day: 5,
                });
                expect(result.toJSON()).toBe('2023-09-05');
                expect(result.locale).toEqual(DEFAULT_LOCALE);
                expect(result.toTimestamp()).toBeLessThan(value.getTime());
            });

            it('should construct from a timestamp without a custom locale', () => {
                const value = new Date(2023, 8, 5);
                const result = DateOnly.fromAnyDate(value.getTime());
                expect(result.toObject()).toEqual({
                    year: 2023,
                    month: 9,
                    day: 5,
                });
                expect(result.toJSON()).toBe('2023-09-05');
                expect(result.locale).toEqual(DEFAULT_LOCALE);
                expect(result.toTimestamp()).toEqual(value.getTime());
            });

            it('should construct from a timestamp with a custom locale', () => {
                const value = new Date(2023, 8, 5);
                const result = DateOnly.fromAnyDate(value.getTime(), CUSTOM_LOCALE);
                expect(result.toObject()).toEqual({
                    year: 2023,
                    month: 9,
                    day: 5,
                });
                expect(result.toJSON()).toBe('2023-09-05');
                expect(result.locale).toEqual(CUSTOM_LOCALE);
                expect(result.toTimestamp()).toEqual(value.getTime());
            });

            it('should construct from a date-time string without timezone', () => {
                const strings = ['2023-09-05 17:44:36', '2023-09-05 17:44:36.123'];
                for (const value of strings) {
                    const result = DateOnly.fromAnyDate(value);
                    expect(result.toObject()).toEqual({
                        year: 2023,
                        month: 9,
                        day: 5,
                    });
                    expect(result.toJSON()).toBe(value.slice(0, 10));
                    expect(result.locale).toEqual(DEFAULT_LOCALE);
                }
            });

            it('should construct from a date-time string with timezone (+)', () => {
                const strings = ['2023-09-05 17:44:36+14:00', '2023-09-05 17:44:36.123+14:00'];
                for (const value of strings) {
                    const result = DateOnly.fromAnyDate(value);
                    expect(result.toObject()).toEqual({
                        year: 2023,
                        month: 9,
                        day: 5,
                    });
                    expect(result.toJSON()).toBe(value.slice(0, 10));
                    expect(result.locale).toEqual(DEFAULT_LOCALE);
                }
            });

            it('should construct from a date-time string with timezone (-)', () => {
                const strings = ['2023-09-05 02:44:36-10:00', '2023-09-05 01:44:36.123-10:00'];
                for (const value of strings) {
                    const result = DateOnly.fromAnyDate(value);
                    expect(result.toObject()).toEqual({
                        year: 2023,
                        month: 9,
                        day: 5,
                    });
                    expect(result.toJSON()).toBe(value.slice(0, 10));
                    expect(result.locale).toEqual(DEFAULT_LOCALE);
                }
            });

            it('should construct from a date-time string with timezone (UTC)', () => {
                const strings = ['2023-09-05 02:44:36Z', '2023-09-05 01:44:36.123Z'];
                for (const value of strings) {
                    const result = DateOnly.fromAnyDate(value);
                    expect(result.toObject()).toEqual({
                        year: 2023,
                        month: 9,
                        day: 5,
                    });
                    expect(result.toJSON()).toBe(value.slice(0, 10));
                    expect(result.locale).toEqual(DEFAULT_LOCALE);
                }
            });

            it('should construct from a iso date string without timezone', () => {
                const strings = ['2023-09-05T17:44:36', '2023-09-05T17:44:36.123'];
                for (const value of strings) {
                    const result = DateOnly.fromAnyDate(value);
                    expect(result.toObject()).toEqual({
                        year: 2023,
                        month: 9,
                        day: 5,
                    });
                    expect(result.toJSON()).toBe(value.slice(0, 10));
                    expect(result.locale).toEqual(DEFAULT_LOCALE);
                }
            });

            it('should construct from a iso date string with timezone (+)', () => {
                const strings = ['2023-09-05T17:44:36+14:00', '2023-09-05T17:44:36.123+14:00'];
                for (const value of strings) {
                    const result = DateOnly.fromAnyDate(value);
                    expect(result.toObject()).toEqual({
                        year: 2023,
                        month: 9,
                        day: 5,
                    });
                    expect(result.toJSON()).toBe(value.slice(0, 10));
                    expect(result.locale).toEqual(DEFAULT_LOCALE);
                }
            });

            it('should construct from a iso date string with timezone (-)', () => {
                const strings = ['2023-09-05T02:44:36-10:00', '2023-09-05T01:44:36.123-10:00'];
                for (const value of strings) {
                    const result = DateOnly.fromAnyDate(value);
                    expect(result.toObject()).toEqual({
                        year: 2023,
                        month: 9,
                        day: 5,
                    });
                    expect(result.toJSON()).toBe(value.slice(0, 10));
                    expect(result.locale).toEqual(DEFAULT_LOCALE);
                }
            });

            it('should construct from a iso date string with timezone (UTC)', () => {
                const strings = ['2023-09-05T02:44:36Z', '2023-09-05T01:44:36.123Z'];
                for (const value of strings) {
                    const result = DateOnly.fromAnyDate(value);
                    expect(result.toObject()).toEqual({
                        year: 2023,
                        month: 9,
                        day: 5,
                    });
                    expect(result.toJSON()).toBe(value.slice(0, 10));
                    expect(result.locale).toEqual(DEFAULT_LOCALE);
                }
            });

            it('should construct from a date-only string without a custom locale', () => {
                const result = DateOnly.fromAnyDate('2023-09-05');
                expect(result.toObject()).toEqual({
                    year: 2023,
                    month: 9,
                    day: 5,
                });
                expect(result.toJSON()).toBe('2023-09-05');
                expect(result.locale).toEqual(DEFAULT_LOCALE);
            });

            it('should construct from a date-only string with a custom locale', () => {
                const result = DateOnly.fromAnyDate('2023-09-05', CUSTOM_LOCALE);
                expect(result.toObject()).toEqual({
                    year: 2023,
                    month: 9,
                    day: 5,
                });
                expect(result.toJSON()).toBe('2023-09-05');
                expect(result.locale).toEqual(CUSTOM_LOCALE);
            });

            it('should construct from a date string', () => {
                const value = '2020-10-27T09:48:59.248';
                const result = DateOnly.fromAnyDate(new Date(value).toString());
                expect(result.toObject()).toEqual({
                    year: 2020,
                    month: 10,
                    day: 27,
                });
                expect(result.toJSON()).toBe(value.slice(0, 10));
                expect(result.locale).toEqual(DEFAULT_LOCALE);
            });

            it('should construct from a date string with a custom locale', () => {
                const value = '2020-10-27T09:48:59.248';
                const result = DateOnly.fromAnyDate(new Date(value).toString(), CUSTOM_LOCALE);
                expect(result.toObject()).toEqual({
                    year: 2020,
                    month: 10,
                    day: 27,
                });
                expect(result.toJSON()).toBe(value.slice(0, 10));
                expect(result.locale).toEqual(CUSTOM_LOCALE);
            });

            it('should construct from a object with date properties', () => {
                const result = DateOnly.fromAnyDate({
                    year: 2020,
                    month: 10,
                    day: 27,
                    hour: 9,
                    minute: 48,
                    second: 59,
                    milliseconds: 248,
                });
                expect(result.toObject()).toEqual({
                    year: 2020,
                    month: 10,
                    day: 27,
                });
                expect(result.toJSON()).toBe('2020-10-27');
                expect(result.locale).toEqual(DEFAULT_LOCALE);
            });

            it('should construct from a object with date properties with a custom locale', () => {
                const result = DateOnly.fromAnyDate(
                    {year: 2020, month: 10, day: 27, hour: 9, minute: 48, second: 59, milliseconds: 248},
                    CUSTOM_LOCALE
                );
                expect(result.toObject()).toEqual({
                    year: 2020,
                    month: 10,
                    day: 27,
                });
                expect(result.toJSON()).toBe('2020-10-27');
                expect(result.locale).toEqual(CUSTOM_LOCALE);
            });

            it('should construct an invalid date', () => {
                const result = [
                    DateOnly.fromAnyDate(DateOnly.invalid()),
                    DateOnly.fromAnyDate(DateOnly.invalid(), CUSTOM_LOCALE),
                    DateOnly.fromAnyDate(null),
                    DateOnly.fromAnyDate(null, CUSTOM_LOCALE),
                    DateOnly.fromAnyDate(undefined),
                    DateOnly.fromAnyDate(undefined, CUSTOM_LOCALE),
                    DateOnly.fromAnyDate(NaN),
                    DateOnly.fromAnyDate(NaN, CUSTOM_LOCALE),
                ];
                expect(result.map(isDateValid)).toEqual(result.map(() => false));
            });
        });

        describe('fromFormat', () => {
            it('should parse MM/DD/YYYY', () => {
                const result = DateOnly.fromFormat('02/11/1998', 'MM/DD/YYYY');
                expect(result.toObject()).toEqual({
                    year: 1998,
                    month: 2,
                    day: 11,
                });
                expect(result.toJSON()).toBe('1998-02-11');
                expect(result.locale).toEqual(DEFAULT_LOCALE);
            });

            it('should parse MM/DD/YYYY with custom lcoale', () => {
                const result = DateOnly.fromFormat('02/11/1998', 'MM/DD/YYYY', CUSTOM_LOCALE);
                expect(result.toObject()).toEqual({
                    year: 1998,
                    month: 2,
                    day: 11,
                });
                expect(result.toJSON()).toBe('1998-02-11');
                expect(result.locale).toEqual(CUSTOM_LOCALE);
            });

            it('should parse DD/MM/YYYY', () => {
                const result = DateOnly.fromFormat('02/11/1998', 'DD/MM/YYYY');
                expect(result.toObject()).toEqual({
                    year: 1998,
                    month: 11,
                    day: 2,
                });
                expect(result.toJSON()).toBe('1998-11-02');
                expect(result.locale).toEqual(DEFAULT_LOCALE);
            });

            it('should parse DD/MM/YYYY with custom lcoale', () => {
                const result = DateOnly.fromFormat('02/11/1998', 'DD/MM/YYYY', CUSTOM_LOCALE);
                expect(result.toObject()).toEqual({
                    year: 1998,
                    month: 11,
                    day: 2,
                });
                expect(result.toJSON()).toBe('1998-11-02');
                expect(result.locale).toEqual(CUSTOM_LOCALE);
            });

            it('should fail to parse and return an invalid date', () => {
                const result = [
                    DateOnly.fromFormat('1998-02-11', 'MM/DD/YYYY'),
                    DateOnly.fromFormat('1998-02-11', 'MM/DD/YYYY', CUSTOM_LOCALE),
                ];
                expect(result.map(isDateValid)).toEqual([false, false]);
            });
        });
    });

    describe('properties', () => {
        describe('isDateOnly', () => {
            it('should always return true', () => {
                const values = [DateOnly.now(), DateOnly.invalid(), DateOnly.fromAnyDate('2025-12-17')];
                expect(values.map((v) => v.isDateOnly)).toEqual(values.map(() => true));
            });
        });

        describe('locale', () => {
            it('should get locale', () => {
                const defaultLocaleValues = [DateOnly.now(), DateOnly.invalid(), DateOnly.fromAnyDate('2025-12-17')];
                const customLocaleValues = [
                    DateOnly.now(CUSTOM_LOCALE),
                    DateOnly.fromAnyDate('2025-12-17', CUSTOM_LOCALE),
                ];
                expect(defaultLocaleValues.map((v) => v.locale)).toEqual(defaultLocaleValues.map(() => DEFAULT_LOCALE));
                expect(customLocaleValues.map((v) => v.locale)).toEqual(customLocaleValues.map(() => CUSTOM_LOCALE));
            });

            it('should not be settable', () => {
                const dateOnly = toDateOnly.now();
                dateOnly.locale = CUSTOM_LOCALE;
                expect(dateOnly.locale).toEqual(DEFAULT_LOCALE);
            });
        });

        const properties = {
            year: {new: 1999, old: 2023},
            month: {new: 7, old: 4},
            day: {new: 29, old: 1},
            week: {new: 14, old: 13},
            weekday: {new: 2, old: 6},
            dayOfYear: {new: 360, old: 91},
            quarter: {new: 3, old: 2},
        };

        describe.each(Object.keys(properties))('%s', (prop) => {
            const dateString = toDateOnly({
                year: properties.year.old,
                month: properties.month.old,
                day: properties.day.old,
            }).toString();
            const dateOnly = toDateOnly(dateString);
            const {new: newValue, old: oldValue} = properties[prop];

            it(`should get the ${prop}`, () => {
                expect(dateOnly[prop]).toEqual(oldValue);
                expect(dateOnly.toString()).toEqual(dateString);
            });

            it(`should set the ${prop}`, () => {
                dateOnly[prop] = newValue;
                expect(dateOnly[prop]).toEqual(newValue);
                expect(dateOnly.toString()).not.toEqual(dateString);
            });
        });
    });

    describe('methods', () => {
        describe('format', () => {
            const dateOnly = toDateOnly('2029-09-19', ENGLISH_LOCALE);

            it('should default format to LOCALE_FORMATS.VERBAL_DATE_LONG', () => {
                expect(dateOnly.format()).toBe('September 19, 2029');
            });

            it('should format to MM/DD/YYYY', () => {
                expect(dateOnly.format('MM/DD/YYYY')).toBe('09/19/2029');
            });
        });

        const UNUSED_TIME_UNITS = [
            'hour',
            'hours',
            'h',
            'minute',
            'minutes',
            'm',
            'second',
            'seconds',
            's',
            'millisecond',
            'milliseconds',
            'ms',
        ];
        describe('startOf', () => {
            const dateOnly = toDateOnly('2029-08-23');
            it.each(['year', 'years', 'y'])('should set date to start of %s', (unit) => {
                const result = dateOnly.startOf(unit);
                expect(result.toString()).not.toEqual(dateOnly.toString());
                expect(result.toObject()).toEqual({
                    year: 2029,
                    month: 1,
                    day: 1,
                });
            });

            it.each(['month', 'months', 'M'])('should set date to start of %s', (unit) => {
                const result = dateOnly.startOf(unit);
                expect(result.toString()).not.toEqual(dateOnly.toString());
                expect(result.toObject()).toEqual({
                    year: 2029,
                    month: 8,
                    day: 1,
                });
            });

            it.each(['week', 'weeks', 'w'])('should set date to start of %s', (unit) => {
                const result = dateOnly.startOf(unit);
                expect(result.toString()).not.toEqual(dateOnly.toString());
                expect(result.toObject()).toEqual({
                    year: 2029,
                    month: 8,
                    day: 19,
                });
            });

            it.each(['quarter', 'quarters', 'Q'])('should set date to start of %s', (unit) => {
                const result = dateOnly.startOf(unit);
                expect(result.toString()).not.toEqual(dateOnly.toString());
                expect(result.toObject()).toEqual({
                    year: 2029,
                    month: 7,
                    day: 1,
                });
            });

            it.each(['day', 'days', 'd', 'D', ...UNUSED_TIME_UNITS])(
                'should have no effect when settting the date to start of %s',
                (unit) => {
                    const result = dateOnly.startOf(unit);
                    expect(result.toString()).toEqual(dateOnly.toString());
                    expect(result.toObject()).toEqual(result.toObject());
                    expect(result.toTimestamp()).toEqual(result.toTimestamp());
                }
            );
        });

        describe('endOf', () => {
            const dateOnly = toDateOnly('2029-08-23');
            it.each(['year', 'years', 'y'])('should set date to start of %s', (unit) => {
                const result = dateOnly.endOf(unit);
                expect(result.toString()).not.toEqual(dateOnly.toString());
                expect(result.toObject()).toEqual({
                    year: 2029,
                    month: 12,
                    day: 31,
                });
            });

            it.each(['month', 'months', 'M'])('should set date to start of %s', (unit) => {
                const result = dateOnly.endOf(unit);
                expect(result.toString()).not.toEqual(dateOnly.toString());
                expect(result.toObject()).toEqual({
                    year: 2029,
                    month: 8,
                    day: 31,
                });
            });

            it.each(['week', 'weeks', 'w'])('should set date to start of %s', (unit) => {
                const result = dateOnly.endOf(unit);
                expect(result.toString()).not.toEqual(dateOnly.toString());
                expect(result.toObject()).toEqual({
                    year: 2029,
                    month: 8,
                    day: 25,
                });
            });

            it.each(['quarter', 'quarters', 'Q'])('should set date to start of %s', (unit) => {
                const result = dateOnly.endOf(unit);
                expect(result.toString()).not.toEqual(dateOnly.toString());
                expect(result.toObject()).toEqual({
                    year: 2029,
                    month: 9,
                    day: 30,
                });
            });

            it.each(['day', 'days', 'd', 'D', ...UNUSED_TIME_UNITS])(
                'should have no effect when settting the date to start of %s',
                (unit) => {
                    const result = dateOnly.endOf(unit);
                    expect(result.toString()).toEqual(dateOnly.toString());
                    expect(result.toObject()).toEqual(result.toObject());
                    expect(result.toTimestamp()).toEqual(result.toTimestamp());
                }
            );
        });

        describe('plus', () => {
            const dateOnly = toDateOnly('2029-08-23');

            it('should sum a duration object', () => {
                const result = dateOnly.plus({days: 7, month: 1});
                expect(result.toObject()).toEqual({
                    year: 2029,
                    month: 9,
                    day: 30,
                });
            });

            it('should sum a value for a given unit', () => {
                const result = dateOnly.plus(7, 'days');
                expect(result.toObject()).toEqual({
                    year: 2029,
                    month: 8,
                    day: 30,
                });
            });

            it('should have no effect if the unit is invalid or unhandled', () => {
                let result = dateOnly.plus(7, null);
                expect(result.equals(dateOnly)).toBe(true);
                result = dateOnly.plus({clocks: 9});
                expect(result.equals(dateOnly)).toBe(true);
            });
        });

        describe('minus', () => {
            const dateOnly = toDateOnly('2029-08-23');

            it('should sum a duration object', () => {
                const result = dateOnly.minus({days: 3, month: 1});
                expect(result.toObject()).toEqual({
                    year: 2029,
                    month: 7,
                    day: 20,
                });
            });

            it('should sum a value for a given unit', () => {
                const result = dateOnly.minus(3, 'days');
                expect(result.toObject()).toEqual({
                    year: 2029,
                    month: 8,
                    day: 20,
                });
            });

            it('should have no effect if the unit is invalid or unhandled', () => {
                let result = dateOnly.minus(7, null);
                expect(result.equals(dateOnly)).toBe(true);
                result = dateOnly.minus({clocks: 9});
                expect(result.equals(dateOnly)).toBe(true);
            });
        });
    });

    describe('compatibility', () => {
        it('should allow to construct a new moment object directly', () => {
            const dateOnly = DateOnly.now();
            expect(dateOnly).toBeInstanceOf(DateOnly);
            const m = moment(dateOnly);
            expect(moment.isMoment(m)).toBe(true);
            expect(m instanceof moment).toBe(true);
            expect(m instanceof DateOnly).toBe(false);
            expect(DateOnly.isDateOnly(m)).toBe(false);
            expect(m.format('YYYY-MM-DD')).toEqual(dateOnly.toJSON());
            expect({year: m.year(), month: m.month() + 1, day: m.date()}).toEqual(dateOnly.toObject());
        });

        it('should allow to construct a new JS Date object directly', () => {
            const dateOnly = DateOnly.now();
            expect(dateOnly).toBeInstanceOf(DateOnly);
            const jsDate = new Date(dateOnly);
            expect(jsDate instanceof Date).toBe(true);
            expect(jsDate instanceof DateOnly).toBe(false);
            expect(DateOnly.isDateOnly(jsDate)).toBe(false);
            expect(jsDate.toISOString()).toEqual(dateOnly.toISOString());
            expect({year: jsDate.getFullYear(), month: jsDate.getMonth() + 1, day: jsDate.getDate()}).toEqual(
                dateOnly.toObject()
            );
        });
    });
});
