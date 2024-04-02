const moment = require('moment-timezone');

const {DateOnly} = require('../date-only.cjs');
const {DateTime} = require('../date-time.cjs');
const {toDateOnly, toDateTime, isDateValid} = require('../index.cjs');
const {getLocalTimezone} = require('../utils/tz.cjs');

const DEFAULT_LOCALE = moment().locale();
const ENGLISH_LOCALE = 'en';
const CUSTOM_LOCALE = 'x-pseudo';

const UTC_TZ = 'UTC';
const UTC_TZ_OFFSET = 'UTC';
const DEFAULT_TZ = getLocalTimezone();
const DEFAULT_TZ_OFFSET = ((o) => (o === '+00:00' ? 'UTC' : o))(moment().format('Z'));
const CUSTOM_TZ = 'America/Sao_Paulo';
const CUSTOM_TZ_OFFSET = moment().tz(CUSTOM_TZ).format('Z');

describe('DateTime', () => {
    describe('static', () => {
        describe('isDateTime', () => {
            it('should return true for DateTime instances', () => {
                const result = DateTime.isDateTime(toDateTime('2022-01-01'));
                expect(result).toBe(true);
            });

            it('should return true for DateTime invalid instances', () => {
                const result = DateTime.isDateTime(DateTime.invalid());
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
                    toDateOnly('2023-01-01'),
                    {year: 2000, month: 2, day: 27},
                    moment(),
                    new Date(),
                    new Date().toString(),
                ];
                const result = cases.map((c) => DateTime.isDateTime(c));
                expect(result).toEqual(result.map(() => false));
            });
        });

        describe('isEqual', () => {
            const datesA = [
                DateOnly.fromAnyDate('2023-01-01'),
                DateTime.fromAnyDate('2023-01-01'),
                '2023-01-01',
            ];
            const dateTimesA = [
                DateTime.fromAnyDate('2023-01-01T23:59:59.123Z'),
                '2023-01-01T23:59:59.123Z',
            ];
            const datesB = [
                DateOnly.fromAnyDate('2023-01-02'),
                DateTime.fromAnyDate('2023-01-02'),
                '2023-01-02',
            ];
            const dateTimesB = [
                DateTime.fromAnyDate('2023-01-02T23:59:59.123Z'),
                '2023-01-02T23:59:59.123Z',
            ];
            const invalidDates = [
                DateOnly.invalid(),
                DateTime.invalid(),
                null,
                undefined,
                '2023-02-31',
                '9999-44-99',
            ]

            const compareFn = (a, b) => DateTime.isEqual(a, b);

            it('should return true when both dates have the same value', () => {
                for (const dateA of datesA) {
                    for (const dateB of datesA) {
                        expect(compareFn(dateA, dateB)).toBe(true);
                    }
                }
                for (const dateA of datesB) {
                    for (const dateB of datesB) {
                        expect(compareFn(dateA, dateB)).toBe(true);
                    }
                }
                for (const dateA of dateTimesA) {
                    for (const dateB of dateTimesA) {
                        expect(compareFn(dateA, dateB)).toBe(true);
                    }
                }
                for (const dateA of dateTimesB) {
                    for (const dateB of dateTimesB) {
                        expect(compareFn(dateA, dateB)).toBe(true);
                    }
                }
            });

            it('should return false when the dates are different', () => {
                for (const dateA of datesA) {
                    for (const dateB of dateTimesA) {
                        expect(compareFn(dateA, dateB)).toBe(false);
                    }
                    for (const dateB of datesB) {
                        expect(compareFn(dateA, dateB)).toBe(false);
                    }
                    for (const dateB of dateTimesB) {
                        expect(compareFn(dateA, dateB)).toBe(false);
                    }
                }
            });

            it('should return false when at least one of the values is invalid', () => {
                for (const dateA of datesA) {
                    for (const dateB of invalidDates) {
                        expect(compareFn(dateA, dateB)).toBe(false);
                        expect(compareFn(dateB, dateA)).toBe(false);
                        expect(compareFn(dateB, dateB)).toBe(false);
                    }
                }
                for (const dateA of dateTimesA) {
                    for (const dateB of invalidDates) {
                        expect(compareFn(dateA, dateB)).toBe(false);
                        expect(compareFn(dateB, dateA)).toBe(false);
                        expect(compareFn(dateB, dateB)).toBe(false);
                    }
                }
            });
        });

        describe('isEqualOrBefore', () => {
            const datesA = [
                DateOnly.fromAnyDate('2023-01-01'),
                DateTime.fromAnyDate('2023-01-01'),
                '2023-01-01',
            ];
            const dateTimesA = [
                DateTime.fromAnyDate('2023-01-01T23:59:59.123Z'),
                '2023-01-01T23:59:59.123Z',
            ];
            const datesB = [
                DateOnly.fromAnyDate('2023-01-02'),
                DateTime.fromAnyDate('2023-01-02'),
                '2023-01-02',
            ];
            const dateTimesB = [
                DateTime.fromAnyDate('2023-01-02T23:59:59.123Z'),
                '2023-01-02T23:59:59.123Z',
            ];
            const invalidDates = [
                DateOnly.invalid(),
                DateTime.invalid(),
                null,
                undefined,
                '2023-02-31',
                '9999-44-99',
            ]

            const compareFn = (a, b) => DateTime.isEqualOrBefore(a, b);

            it('should return true when the first date is equal or before the second date', () => {
                for (const dateA of datesA) {
                    for (const dateB of datesA) {
                        expect(compareFn(dateA, dateB)).toBe(true);
                    }
                    for (const dateB of datesB) {
                        expect(compareFn(dateA, dateB)).toBe(true);
                    }
                    for (const dateB of dateTimesA) {
                        expect(compareFn(dateA, dateB)).toBe(true);
                    }
                    for (const dateB of datesB) {
                        expect(compareFn(dateA, dateB)).toBe(true);
                    }
                }
                for (const dateA of datesB) {
                    for (const dateB of datesB) {
                        expect(compareFn(dateA, dateB)).toBe(true);
                    }
                }
            });

            it('should return false when the first date is not equal or before the second date', () => {
                for (const dateA of datesA) {
                    for (const dateB of dateTimesA) {
                        expect(compareFn(dateB, dateA)).toBe(false);
                    }
                    for (const dateB of datesB) {
                        expect(compareFn(dateB, dateA)).toBe(false);
                    }
                    for (const dateB of dateTimesB) {
                        expect(compareFn(dateB, dateA)).toBe(false);
                    }
                }
            });

            it('should return false when at least one of the values is invalid', () => {
                for (const dateA of datesA) {
                    for (const dateB of invalidDates) {
                        expect(compareFn(dateA, dateB)).toBe(false);
                        expect(compareFn(dateB, dateA)).toBe(false);
                        expect(compareFn(dateB, dateB)).toBe(false);
                    }
                }
                for (const dateA of dateTimesA) {
                    for (const dateB of invalidDates) {
                        expect(compareFn(dateA, dateB)).toBe(false);
                        expect(compareFn(dateB, dateA)).toBe(false);
                        expect(compareFn(dateB, dateB)).toBe(false);
                    }
                }
            });
        });

        describe('isEqualOrAfter', () => {
            const datesB = [
                DateOnly.fromAnyDate('2023-01-01'),
                DateTime.fromAnyDate('2023-01-01'),
                '2023-01-01',
            ];
            const dateTimesB = [
                DateTime.fromAnyDate('2023-01-01T23:59:59.123Z'),
                '2023-01-01T23:59:59.123Z',
            ];
            const datesA = [
                DateOnly.fromAnyDate('2023-01-02'),
                DateTime.fromAnyDate('2023-01-02'),
                '2023-01-02',
            ];
            const dateTimesA = [
                DateTime.fromAnyDate('2023-01-02T23:59:59.123Z'),
                '2023-01-02T23:59:59.123Z',
            ];
            const invalidDates = [
                DateOnly.invalid(),
                DateTime.invalid(),
                null,
                undefined,
                '2023-02-31',
                '9999-44-99',
            ]

            const compareFn = (a, b) => DateTime.isEqualOrAfter(a, b);

            it('should return true when the first date is equal or after the second date', () => {
                for (const dateA of datesA) {
                    for (const dateB of datesA) {
                        expect(compareFn(dateA, dateB)).toBe(true);
                    }
                    for (const dateB of dateTimesA) {
                        expect(compareFn(dateB, dateA)).toBe(true);
                    }
                    for (const dateB of datesB) {
                        expect(compareFn(dateA, dateB)).toBe(true);
                    }
                    for (const dateB of dateTimesB) {
                        expect(compareFn(dateA, dateB)).toBe(true);
                    }
                }
                for (const dateA of datesB) {
                    for (const dateB of datesB) {
                        expect(compareFn(dateA, dateB)).toBe(true);
                    }
                }
            });

            it('should return false when the first date is not equal or after the second date', () => {
                for (const dateA of datesA) {
                    for (const dateB of dateTimesA) {
                        expect(compareFn(dateA, dateB)).toBe(false);
                    }
                    for (const dateB of datesB) {
                        expect(compareFn(dateB, dateA)).toBe(false);
                    }
                    for (const dateB of dateTimesB) {
                        expect(compareFn(dateB, dateA)).toBe(false);
                    }
                }
            });

            it('should return false when at least one of the values is invalid', () => {
                for (const dateA of datesA) {
                    for (const dateB of invalidDates) {
                        expect(compareFn(dateA, dateB)).toBe(false);
                        expect(compareFn(dateB, dateA)).toBe(false);
                        expect(compareFn(dateB, dateB)).toBe(false);
                    }
                }
                for (const dateA of dateTimesA) {
                    for (const dateB of invalidDates) {
                        expect(compareFn(dateA, dateB)).toBe(false);
                        expect(compareFn(dateB, dateA)).toBe(false);
                        expect(compareFn(dateB, dateB)).toBe(false);
                    }
                }
            });
        });

        describe('isBefore', () => {
            const datesA = [
                DateOnly.fromAnyDate('2023-01-01'),
                DateTime.fromAnyDate('2023-01-01'),
                '2023-01-01',
            ];
            const dateTimesA = [
                DateTime.fromAnyDate('2023-01-01T23:59:59.123Z'),
                '2023-01-01T23:59:59.123Z',
            ];
            const datesB = [
                DateOnly.fromAnyDate('2023-01-02'),
                DateTime.fromAnyDate('2023-01-02'),
                '2023-01-02',
            ];
            const dateTimesB = [
                DateTime.fromAnyDate('2023-01-02T23:59:59.123Z'),
                '2023-01-02T23:59:59.123Z',
            ];
            const invalidDates = [
                DateOnly.invalid(),
                DateTime.invalid(),
                null,
                undefined,
                '2023-02-31',
                '9999-44-99',
            ]

            const compareFn = (a, b) => DateTime.isBefore(a, b);

            it('should return true when the first date is before the second date', () => {
                for (const dateA of datesA) {
                    for (const dateB of dateTimesA) {
                        expect(compareFn(dateA, dateB)).toBe(true);
                    }
                    for (const dateB of datesB) {
                        expect(compareFn(dateA, dateB)).toBe(true);
                    }
                    for (const dateB of dateTimesB) {
                        expect(compareFn(dateA, dateB)).toBe(true);
                    }
                }
            });

            it('should return false when the first date is not before the second date', () => {
                for (const dateA of datesA) {
                    for (const dateB of datesB) {
                        expect(compareFn(dateB, dateA)).toBe(false);
                        expect(compareFn(dateA, dateA)).toBe(false);
                        expect(compareFn(dateB, dateB)).toBe(false);
                    }
                    for (const dateB of dateTimesB) {
                        expect(compareFn(dateB, dateA)).toBe(false);
                        expect(compareFn(dateA, dateA)).toBe(false);
                        expect(compareFn(dateB, dateB)).toBe(false);
                    }
                    for (const dateB of dateTimesA) {
                        expect(compareFn(dateB, dateA)).toBe(false);
                        expect(compareFn(dateA, dateA)).toBe(false);
                        expect(compareFn(dateB, dateB)).toBe(false);
                    }
                }
            });

            it('should return false when at least one of the values is invalid', () => {
                for (const dateA of datesA) {
                    for (const dateB of invalidDates) {
                        expect(compareFn(dateA, dateB)).toBe(false);
                        expect(compareFn(dateB, dateA)).toBe(false);
                        expect(compareFn(dateB, dateB)).toBe(false);
                    }
                }
                for (const dateA of dateTimesA) {
                    for (const dateB of invalidDates) {
                        expect(compareFn(dateA, dateB)).toBe(false);
                        expect(compareFn(dateB, dateA)).toBe(false);
                        expect(compareFn(dateB, dateB)).toBe(false);
                    }
                }
            });
        });

        describe('isAfter', () => {
            const datesB = [
                DateOnly.fromAnyDate('2023-01-01'),
                DateTime.fromAnyDate('2023-01-01'),
                '2023-01-01',
            ];
            const dateTimesB = [
                DateTime.fromAnyDate('2023-01-01T23:59:59.123Z'),
                '2023-01-01T23:59:59.123Z',
            ];
            const datesA = [
                DateOnly.fromAnyDate('2023-01-02'),
                DateTime.fromAnyDate('2023-01-02'),
                '2023-01-02',
            ];
            const dateTimesA = [
                DateTime.fromAnyDate('2023-01-02T23:59:59.123Z'),
                '2023-01-02T23:59:59.123Z',
            ];
            const invalidDates = [
                DateOnly.invalid(),
                DateTime.invalid(),
                null,
                undefined,
                '2023-02-31',
                '9999-44-99',
            ]

            const compareFn = (a, b) => DateTime.isAfter(a, b);

            it('should return true when the first date is after the second date', () => {
                for (const dateA of datesA) {
                    for (const dateB of dateTimesA) {
                        expect(compareFn(dateB, dateA)).toBe(true);
                    }
                    for (const dateB of datesB) {
                        expect(compareFn(dateA, dateB)).toBe(true);
                    }
                    for (const dateB of dateTimesB) {
                        expect(compareFn(dateA, dateB)).toBe(true);
                    }
                }
            });

            it('should return false when the first date is not after the second date', () => {
                for (const dateA of datesA) {
                    for (const dateB of dateTimesA) {
                        expect(compareFn(dateA, dateB)).toBe(false);
                        expect(compareFn(dateA, dateA)).toBe(false);
                        expect(compareFn(dateB, dateB)).toBe(false);
                    }
                    for (const dateB of datesB) {
                        expect(compareFn(dateA, dateA)).toBe(false);
                        expect(compareFn(dateB, dateA)).toBe(false);
                        expect(compareFn(dateB, dateB)).toBe(false);
                    }
                    for (const dateB of dateTimesB) {
                        expect(compareFn(dateB, dateA)).toBe(false);
                        expect(compareFn(dateA, dateA)).toBe(false);
                        expect(compareFn(dateB, dateB)).toBe(false);
                    }
                }
            });

            it('should return false when at least one of the values is invalid', () => {
                for (const dateA of datesA) {
                    for (const dateB of invalidDates) {
                        expect(compareFn(dateA, dateB)).toBe(false);
                        expect(compareFn(dateB, dateA)).toBe(false);
                        expect(compareFn(dateB, dateB)).toBe(false);
                    }
                }
                for (const dateA of dateTimesA) {
                    for (const dateB of invalidDates) {
                        expect(compareFn(dateA, dateB)).toBe(false);
                        expect(compareFn(dateB, dateA)).toBe(false);
                        expect(compareFn(dateB, dateB)).toBe(false);
                    }
                }
            });
        });

        describe('now', () => {
            it('should get date now without a custom locale', () => {
                const date = new Date();
                const now = DateTime.now();
                expect(date.valueOf()).toBeGreaterThanOrEqual(now.valueOf() - 1);
                expect(now.locale).toEqual(DEFAULT_LOCALE);
                expect(now.offset).toEqual(DEFAULT_TZ_OFFSET);
            });

            it('should get date now with a custom locale', () => {
                const date = new Date();
                const now = DateTime.now(CUSTOM_LOCALE);
                expect(now.valueOf()).toBeGreaterThanOrEqual(date.getTime());
                expect(now.locale).not.toEqual(DEFAULT_LOCALE);
                expect(now.locale).toBe(CUSTOM_LOCALE);
                expect(now.offset).toEqual(DEFAULT_TZ_OFFSET);
            });
        });

        describe('invalid', () => {
            it('should get an invalid date', () => {
                const now = DateTime.invalid();
                expect(now.valueOf()).toBeNaN();
                expect(now.toString()).toBe('Invalid date');
                expect(now.toJSON()).toBe('Invalid date');
                expect(now.isValid).toBe(false);
            });
        });

        describe('fromMomentDate', () => {
            it('should construct from a momentjs instance with time', () => {
                const value = moment.utc('2023-09-05T17:44:36.008Z');
                const result = DateTime.fromMomentDate(value);
                expect(result.toObject()).toEqual({
                    year: 2023,
                    month: 9,
                    day: 5,
                    hour: 17,
                    minute: 44,
                    second: 36,
                    millisecond: 8,
                    offset: UTC_TZ_OFFSET,
                    timezone: UTC_TZ,
                });
                expect(result.toJSON()).toBe('2023-09-05T17:44:36.008Z');
                expect(result.locale).toEqual(DEFAULT_LOCALE);
            });

            it('should construct from a momentjs instance without a custom locale', () => {
                const value = moment.utc('2023-09-05');
                const result = DateTime.fromMomentDate(value);
                expect(result.toObject()).toEqual({
                    year: 2023,
                    month: 9,
                    day: 5,
                    hour: 0,
                    minute: 0,
                    second: 0,
                    millisecond: 0,
                    offset: UTC_TZ_OFFSET,
                    timezone: UTC_TZ,
                });
                expect(result.toJSON()).toBe('2023-09-05T00:00:00.000Z');
                expect(result.locale).toEqual(DEFAULT_LOCALE);
            });

            it('should construct from a momentjs instance with a custom locale', () => {
                const value = moment.utc('2023-09-05');
                const result = DateTime.fromMomentDate(value, CUSTOM_LOCALE);
                expect(result.toObject()).toEqual({
                    year: 2023,
                    month: 9,
                    day: 5,
                    hour: 0,
                    minute: 0,
                    second: 0,
                    millisecond: 0,
                    offset: UTC_TZ_OFFSET,
                    timezone: UTC_TZ,
                });
                expect(result.toJSON()).toBe('2023-09-05T00:00:00.000Z');
                expect(result.locale).toEqual(CUSTOM_LOCALE);
            });

            it('should construct from a momentjs instance with timezone', () => {
                const value = moment.tz('2023-09-05 17:44:36.008', CUSTOM_TZ);
                const result = DateTime.fromMomentDate(value);
                expect(result.toObject()).toEqual({
                    year: 2023,
                    month: 9,
                    day: 5,
                    hour: 17,
                    minute: 44,
                    second: 36,
                    millisecond: 8,
                    offset: CUSTOM_TZ_OFFSET,
                    timezone: CUSTOM_TZ,
                });
                expect(result.toJSON()).toBe('2023-09-05T20:44:36.008Z');
                expect(result.locale).toEqual(DEFAULT_LOCALE);
            });

            it('should construct an invalid date', () => {
                const result = [
                    DateTime.fromMomentDate(moment.invalid()),
                    DateTime.fromMomentDate(moment.invalid(), CUSTOM_LOCALE),
                ];
                expect(result.map(isDateValid)).toEqual([false, false]);
            });
        });

        describe('fromJsDate', () => {
            it('should construct from a JS Date instance with time', () => {
                const value = new Date('2023-09-05 17:44:36Z');
                const result = DateTime.fromJsDate(value).toUTC();
                expect(result.toObject()).toEqual({
                    year: 2023,
                    month: 9,
                    day: 5,
                    hour: 17,
                    minute: 44,
                    second: 36,
                    millisecond: 0,
                    offset: UTC_TZ_OFFSET,
                    timezone: UTC_TZ,
                });
                expect(result.toJSON()).toBe('2023-09-05T17:44:36.000Z');
                expect(result.locale).toEqual(DEFAULT_LOCALE);
            });

            it('should construct from a JS Date instance without a custom locale', () => {
                const value = new Date('2023-09-05');
                const result = DateTime.fromJsDate(value).toUTC();
                expect(result.toObject()).toEqual({
                    year: 2023,
                    month: 9,
                    day: 5,
                    hour: 0,
                    minute: 0,
                    second: 0,
                    millisecond: 0,
                    offset: UTC_TZ_OFFSET,
                    timezone: UTC_TZ,
                });
                expect(result.toJSON()).toBe('2023-09-05T00:00:00.000Z');
                expect(result.locale).toEqual(DEFAULT_LOCALE);
            });

            it('should construct from a JS Date instance with a custom locale', () => {
                const value = new Date('2023-09-05');
                const result = DateTime.fromJsDate(value, CUSTOM_LOCALE).toUTC();
                expect(result.toObject()).toEqual({
                    year: 2023,
                    month: 9,
                    day: 5,
                    hour: 0,
                    minute: 0,
                    second: 0,
                    millisecond: 0,
                    offset: UTC_TZ_OFFSET,
                    timezone: UTC_TZ,
                });
                expect(result.toJSON()).toBe('2023-09-05T00:00:00.000Z');
                expect(result.locale).toEqual(CUSTOM_LOCALE);
            });

            it('should construct from a JS Date instance with timezone', () => {
                const value = moment.tz('2023-09-05 17:44:36.008', CUSTOM_TZ);
                const result = DateTime.fromMomentDate(value);
                expect(result.toObject()).toEqual({
                    year: 2023,
                    month: 9,
                    day: 5,
                    hour: 17,
                    minute: 44,
                    second: 36,
                    millisecond: 8,
                    offset: CUSTOM_TZ_OFFSET,
                    timezone: CUSTOM_TZ,
                });
                expect(result.toJSON()).toBe('2023-09-05T20:44:36.008Z');
                expect(result.locale).toEqual(DEFAULT_LOCALE);
                expect(result.timezone).toEqual(CUSTOM_TZ);
            });

            it('should construct an invalid date', () => {
                const result = [DateTime.fromJsDate(new Date(NaN)), DateTime.fromJsDate(new Date(NaN), CUSTOM_LOCALE)];
                expect(result.map(isDateValid)).toEqual([false, false]);
            });
        });

        describe('fromDateTime', () => {
            it('should construct from a DateTime instance with time', () => {
                const value = toDateTime('2023-09-05 17:44:36');
                const result = DateTime.fromDateTime(value);
                expect(result.toObject()).toEqual({
                    year: 2023,
                    month: 9,
                    day: 5,
                    hour: 17,
                    minute: 44,
                    second: 36,
                    millisecond: 0,
                    offset: UTC_TZ_OFFSET,
                    timezone: UTC_TZ,
                });
                expect(result.toJSON()).toBe('2023-09-05T17:44:36.000Z');
                expect(result.locale).toEqual(DEFAULT_LOCALE);
            });

            it('should construct from a DateTime instance without a custom locale', () => {
                const value = toDateTime('2023-09-05');
                const result = DateTime.fromDateTime(value);
                expect(result.toObject()).toEqual({
                    year: 2023,
                    month: 9,
                    day: 5,
                    hour: 0,
                    minute: 0,
                    second: 0,
                    millisecond: 0,
                    offset: UTC_TZ_OFFSET,
                    timezone: UTC_TZ,
                });
                expect(result.toJSON()).toBe('2023-09-05T00:00:00.000Z');
                expect(result.locale).toEqual(DEFAULT_LOCALE);
            });

            it('should construct from a DateTime instance with a custom locale', () => {
                const value = toDateTime('2023-09-05');
                const result = DateTime.fromDateTime(value, CUSTOM_LOCALE);
                expect(result.toObject()).toEqual({
                    year: 2023,
                    month: 9,
                    day: 5,
                    hour: 0,
                    minute: 0,
                    second: 0,
                    millisecond: 0,
                    offset: UTC_TZ_OFFSET,
                    timezone: UTC_TZ,
                });
                expect(result.toJSON()).toBe('2023-09-05T00:00:00.000Z');
                expect(result.locale).toEqual(CUSTOM_LOCALE);
            });

            it('should construct from a object with date properties', () => {
                const result = DateTime.fromDateTime({
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
                    hour: 9,
                    minute: 48,
                    second: 59,
                    millisecond: 248,
                    offset: DEFAULT_TZ_OFFSET,
                    timezone: DEFAULT_TZ,
                });
                expect(result.toJSON()).toBe(new Date('2020-10-27T09:48:59.248').toISOString());
                expect(result.locale).toEqual(DEFAULT_LOCALE);
            });

            it('should construct from a object with date properties with a custom locale', () => {
                const result = DateTime.fromDateTime(
                    {year: 2020, month: 10, day: 27, hour: 9, minute: 48, second: 59, milliseconds: 248},
                    CUSTOM_LOCALE
                );
                expect(result.toObject()).toEqual({
                    year: 2020,
                    month: 10,
                    day: 27,
                    hour: 9,
                    minute: 48,
                    second: 59,
                    millisecond: 248,
                    offset: DEFAULT_TZ_OFFSET,
                    timezone: DEFAULT_TZ,
                });
                expect(result.toJSON()).toBe(new Date('2020-10-27T09:48:59.248').toISOString());
                expect(result.locale).toEqual(CUSTOM_LOCALE);
            });

            it('should construct from a object with date properties including offset too', () => {
                const result = DateTime.fromDateTime({
                    year: 2020,
                    month: 10,
                    day: 27,
                    hour: 9,
                    minute: 48,
                    second: 59,
                    milliseconds: 248,
                    offset: CUSTOM_TZ_OFFSET,
                });
                expect(result.toObject()).toEqual({
                    year: 2020,
                    month: 10,
                    day: 27,
                    hour: 9,
                    minute: 48,
                    second: 59,
                    millisecond: 248,
                    offset: CUSTOM_TZ_OFFSET,
                    timezone: undefined,
                });
                expect(result.toJSON()).toBe('2020-10-27T12:48:59.248Z');
                expect(result.locale).toEqual(DEFAULT_LOCALE);
            });

            it('should construct from a object with date properties including timezone too', () => {
                const result = DateTime.fromDateTime({
                    year: 2020,
                    month: 10,
                    day: 27,
                    hour: 9,
                    minute: 48,
                    second: 59,
                    milliseconds: 248,
                    timezone: CUSTOM_TZ,
                });
                expect(result.toObject()).toEqual({
                    year: 2020,
                    month: 10,
                    day: 27,
                    hour: 9,
                    minute: 48,
                    second: 59,
                    millisecond: 248,
                    offset: CUSTOM_TZ_OFFSET,
                    timezone: CUSTOM_TZ,
                });
                expect(result.toJSON()).toBe('2020-10-27T12:48:59.248Z');
                expect(result.locale).toEqual(DEFAULT_LOCALE);
                expect(result.timezone).toEqual(CUSTOM_TZ);
            });

            it('should construct from a DateTime instance with timezone', () => {
                const value = toDateTime('2023-09-05 17:44:36.008-03:00');
                const result = DateTime.fromDateTime(value);
                expect(result.toObject()).toEqual({
                    year: 2023,
                    month: 9,
                    day: 5,
                    hour: 17,
                    minute: 44,
                    second: 36,
                    millisecond: 8,
                    offset: CUSTOM_TZ_OFFSET,
                    timezone: undefined,
                });
                expect(result.toJSON()).toBe('2023-09-05T20:44:36.008Z');
                expect(result.locale).toEqual(DEFAULT_LOCALE);
                expect(result.offset).toEqual(CUSTOM_TZ_OFFSET);
            });

            it('should construct an invalid date', () => {
                const result = [
                    DateTime.fromDateTime(DateTime.invalid()),
                    DateTime.fromDateTime(DateTime.invalid(), CUSTOM_LOCALE),
                ];
                expect(result.map(isDateValid)).toEqual([false, false]);
            });

            it('should handle weird DateTime object', () => {
                const result = DateTime.fromDateTime({
                    year: () => 2020,
                    month: '02',
                    day: 1,
                    tz: UTC_TZ,
                });
                expect(result).toBeInstanceOf(DateTime);
                expect(result.isDateTime).toBe(true);
                expect(result.toObject()).toEqual({
                    year: 2020,
                    month: 2,
                    day: 1,
                    hour: 0,
                    minute: 0,
                    second: 0,
                    millisecond: 0,
                    offset: UTC_TZ_OFFSET,
                    timezone: UTC_TZ,
                });
                expect(result.toJSON()).toBe('2020-02-01T00:00:00.000Z');
                expect(result.locale).toEqual(DEFAULT_LOCALE);
                expect(result.timezone).toBe('UTC');
            });

            it('should thrown on unexpected DateTime object', () => {
                try {
                    DateTime.fromDateTime({
                        year: {value: 2022},
                        month: '02',
                        day: 1,
                        tz: UTC_TZ,
                    });
                    throw new Error('Should thrown an error');
                } catch (error) {
                    expect(error).toBeInstanceOf(Error);
                    expect(error.message).toBe('Unsupported value type "object" for DateTime obejct notation');
                }
            });
        });

        describe('fromDateOnly', () => {
            it('should construct from a DateOnly instance without a custom locale', () => {
                const value = toDateOnly('2023-09-05');
                const result = DateTime.fromDateOnly(value);
                expect(result.toObject()).toEqual({
                    year: 2023,
                    month: 9,
                    day: 5,
                    hour: 0,
                    minute: 0,
                    second: 0,
                    millisecond: 0,
                    offset: UTC_TZ_OFFSET,
                    timezone: UTC_TZ,
                });
                expect(result.toJSON()).toBe('2023-09-05T00:00:00.000Z');
                expect(result.locale).toEqual(DEFAULT_LOCALE);
            });

            it('should construct from a DateOnly instance with a custom locale', () => {
                const value = toDateOnly('2023-09-05');
                const result = DateTime.fromDateOnly(value, CUSTOM_LOCALE);
                expect(result.toObject()).toEqual({
                    year: 2023,
                    month: 9,
                    day: 5,
                    hour: 0,
                    minute: 0,
                    second: 0,
                    millisecond: 0,
                    offset: UTC_TZ_OFFSET,
                    timezone: UTC_TZ,
                });
                expect(result.toJSON()).toBe('2023-09-05T00:00:00.000Z');
                expect(result.locale).toEqual(CUSTOM_LOCALE);
            });

            it('should construct from a object with date properties', () => {
                const result = DateTime.fromDateOnly({year: 2020, month: 10, day: 27});
                expect(result.toObject()).toEqual({
                    year: 2020,
                    month: 10,
                    day: 27,
                    hour: 0,
                    minute: 0,
                    second: 0,
                    millisecond: 0,
                    offset: UTC_TZ_OFFSET,
                    timezone: UTC_TZ,
                });
                expect(result.toJSON()).toBe('2020-10-27T00:00:00.000Z');
                expect(result.locale).toEqual(DEFAULT_LOCALE);
            });

            it('should construct from a object with date properties with a custom locale', () => {
                const result = DateTime.fromDateOnly({year: 2020, month: 10, day: 27}, CUSTOM_LOCALE);
                expect(result.toObject()).toEqual({
                    year: 2020,
                    month: 10,
                    day: 27,
                    hour: 0,
                    minute: 0,
                    second: 0,
                    millisecond: 0,
                    offset: UTC_TZ_OFFSET,
                    timezone: UTC_TZ,
                });
                expect(result.toJSON()).toBe('2020-10-27T00:00:00.000Z');
                expect(result.locale).toEqual(CUSTOM_LOCALE);
            });

            it('should construct from a object with date properties and ignore non date-only properties timezone too', () => {
                const result = DateTime.fromDateOnly({
                    year: 2020,
                    month: 10,
                    day: 27,
                    hour: 9,
                    minute: 48,
                    second: 59,
                    milliseconds: 248,
                    timezone: CUSTOM_TZ,
                });
                expect(result.toObject()).toEqual({
                    year: 2020,
                    month: 10,
                    day: 27,
                    hour: 0,
                    minute: 0,
                    second: 0,
                    millisecond: 0,
                    offset: UTC_TZ_OFFSET,
                    timezone: UTC_TZ,
                });
                expect(result.toJSON()).toBe('2020-10-27T00:00:00.000Z');
                expect(result.locale).toEqual(DEFAULT_LOCALE);
                expect(result.timezone).toBe('UTC');
            });

            it('should construct an invalid date', () => {
                const result = [
                    DateTime.fromDateOnly(DateOnly.invalid()),
                    DateTime.fromDateOnly(DateOnly.invalid(), CUSTOM_LOCALE),
                ];
                expect(result.map(isDateValid)).toEqual([false, false]);
            });

            it('should handle malformed DateOnly object', () => {
                const result = DateTime.fromDateOnly({
                    isDateTime: true,
                    year: 2020,
                    month: 2,
                    day: 1,
                });
                expect(result).toBeInstanceOf(DateTime);
                expect(result.isDateTime).toBe(true);
                expect(result.toObject()).toEqual({
                    year: 2020,
                    month: 2,
                    day: 1,
                    hour: 0,
                    minute: 0,
                    second: 0,
                    millisecond: 0,
                    offset: UTC_TZ_OFFSET,
                    timezone: UTC_TZ,
                });
                expect(result.toJSON()).toBe('2020-02-01T00:00:00.000Z');
                expect(result.locale).toEqual(DEFAULT_LOCALE);
                expect(result.timezone).toBe('UTC');
            });
        });

        describe('fromAnyDate', () => {
            it('should construct from a momentjs instance with time', () => {
                const value = moment.utc('2023-09-05 17:44:36');
                const result = DateTime.fromAnyDate(value);
                expect(result.toObject()).toEqual({
                    year: 2023,
                    month: 9,
                    day: 5,
                    hour: 17,
                    minute: 44,
                    second: 36,
                    millisecond: 0,
                    offset: UTC_TZ_OFFSET,
                    timezone: UTC_TZ,
                });
                expect(result.toJSON()).toBe('2023-09-05T17:44:36.000Z');
                expect(result.locale).toEqual(DEFAULT_LOCALE);
            });

            it('should construct from a momentjs instance without a custom locale', () => {
                const value = moment.utc('2023-09-05');
                const result = DateTime.fromAnyDate(value);
                expect(result.toObject()).toEqual({
                    year: 2023,
                    month: 9,
                    day: 5,
                    hour: 0,
                    minute: 0,
                    second: 0,
                    millisecond: 0,
                    offset: UTC_TZ_OFFSET,
                    timezone: UTC_TZ,
                });
                expect(result.toJSON()).toBe('2023-09-05T00:00:00.000Z');
                expect(result.locale).toEqual(DEFAULT_LOCALE);
            });

            it('should construct from a momentjs instance with a custom locale', () => {
                const value = moment.utc('2023-09-05');
                const result = DateTime.fromAnyDate(value, CUSTOM_LOCALE);
                expect(result.toObject()).toEqual({
                    year: 2023,
                    month: 9,
                    day: 5,
                    hour: 0,
                    minute: 0,
                    second: 0,
                    millisecond: 0,
                    offset: UTC_TZ_OFFSET,
                    timezone: UTC_TZ,
                });
                expect(result.toJSON()).toBe('2023-09-05T00:00:00.000Z');
                expect(result.locale).toEqual(CUSTOM_LOCALE);
            });

            it('should construct from a JS Date instance with time', () => {
                const value = new Date('2023-09-05T17:44:36.000Z');
                const result = DateTime.fromAnyDate(value).toUTC();
                expect(result.toObject()).toEqual({
                    year: 2023,
                    month: 9,
                    day: 5,
                    hour: 17,
                    minute: 44,
                    second: 36,
                    millisecond: 0,
                    offset: UTC_TZ_OFFSET,
                    timezone: UTC_TZ,
                });
                expect(result.toJSON()).toBe('2023-09-05T17:44:36.000Z');
                expect(result.locale).toEqual(DEFAULT_LOCALE);
            });

            it('should construct from a JS Date instance without a custom locale', () => {
                const value = new Date('2023-09-05');
                const result = DateTime.fromAnyDate(value).toUTC();
                expect(result.toObject()).toEqual({
                    year: 2023,
                    month: 9,
                    day: 5,
                    hour: 0,
                    minute: 0,
                    second: 0,
                    millisecond: 0,
                    offset: UTC_TZ_OFFSET,
                    timezone: UTC_TZ,
                });
                expect(result.toJSON()).toBe('2023-09-05T00:00:00.000Z');
                expect(result.locale).toEqual(DEFAULT_LOCALE);
            });

            it('should construct from a JS Date instance with a custom locale', () => {
                const value = new Date('2023-09-05');
                const result = DateTime.fromAnyDate(value, CUSTOM_LOCALE).toUTC();
                expect(result.toObject()).toEqual({
                    year: 2023,
                    month: 9,
                    day: 5,
                    hour: 0,
                    minute: 0,
                    second: 0,
                    millisecond: 0,
                    offset: UTC_TZ_OFFSET,
                    timezone: UTC_TZ,
                });
                expect(result.toJSON()).toBe('2023-09-05T00:00:00.000Z');
                expect(result.locale).toEqual(CUSTOM_LOCALE);
            });

            it('should construct from a DateTime instance with time', () => {
                const value = toDateTime('2023-09-05 17:44:36');
                const result = DateTime.fromAnyDate(value);
                expect(result.toObject()).toEqual({
                    year: 2023,
                    month: 9,
                    day: 5,
                    hour: 17,
                    minute: 44,
                    second: 36,
                    millisecond: 0,
                    offset: UTC_TZ_OFFSET,
                    timezone: UTC_TZ,
                });
                expect(result.toJSON()).toBe('2023-09-05T17:44:36.000Z');
                expect(result.locale).toEqual(DEFAULT_LOCALE);
            });

            it('should construct from a DateTime instance without a custom locale', () => {
                const value = toDateTime('2023-09-05');
                const result = DateTime.fromAnyDate(value);
                expect(result.toObject()).toEqual({
                    year: 2023,
                    month: 9,
                    day: 5,
                    hour: 0,
                    minute: 0,
                    second: 0,
                    millisecond: 0,
                    offset: UTC_TZ_OFFSET,
                    timezone: UTC_TZ,
                });
                expect(result.toJSON()).toBe('2023-09-05T00:00:00.000Z');
                expect(result.locale).toEqual(DEFAULT_LOCALE);
            });

            it('should construct from a DateTime instance with a custom locale', () => {
                const value = toDateTime('2023-09-05');
                const result = DateTime.fromAnyDate(value, CUSTOM_LOCALE);
                expect(result.toObject()).toEqual({
                    year: 2023,
                    month: 9,
                    day: 5,
                    hour: 0,
                    minute: 0,
                    second: 0,
                    millisecond: 0,
                    offset: UTC_TZ_OFFSET,
                    timezone: UTC_TZ,
                });
                expect(result.toJSON()).toBe('2023-09-05T00:00:00.000Z');
                expect(result.locale).toEqual(CUSTOM_LOCALE);
            });

            it('should construct from a DateOnly instance with time', () => {
                const value = toDateOnly('2023-09-05 17:44:36');
                const result = DateTime.fromAnyDate(value);
                expect(result.toObject()).toEqual({
                    year: 2023,
                    month: 9,
                    day: 5,
                    hour: 0,
                    minute: 0,
                    second: 0,
                    millisecond: 0,
                    offset: UTC_TZ_OFFSET,
                    timezone: UTC_TZ,
                });
                expect(result.toJSON()).toBe('2023-09-05T00:00:00.000Z');
                expect(result.locale).toEqual(DEFAULT_LOCALE);
            });

            it('should construct from a DateOnly instance without a custom locale', () => {
                const value = toDateOnly('2023-09-05');
                const result = DateTime.fromAnyDate(value);
                expect(result.toObject()).toEqual({
                    year: 2023,
                    month: 9,
                    day: 5,
                    hour: 0,
                    minute: 0,
                    second: 0,
                    millisecond: 0,
                    offset: UTC_TZ_OFFSET,
                    timezone: UTC_TZ,
                });
                expect(result.toJSON()).toBe('2023-09-05T00:00:00.000Z');
                expect(result.locale).toEqual(DEFAULT_LOCALE);
            });

            it('should construct from a DateOnly instance with a custom locale', () => {
                const value = toDateOnly('2023-09-05');
                const result = DateTime.fromAnyDate(value, CUSTOM_LOCALE);
                expect(result.toObject()).toEqual({
                    year: 2023,
                    month: 9,
                    day: 5,
                    hour: 0,
                    minute: 0,
                    second: 0,
                    millisecond: 0,
                    offset: UTC_TZ_OFFSET,
                    timezone: UTC_TZ,
                });
                expect(result.toJSON()).toBe('2023-09-05T00:00:00.000Z');
                expect(result.locale).toEqual(CUSTOM_LOCALE);
            });

            it('should construct from a timestamp with time', () => {
                const value = new Date('2023-09-05T17:44:36.000Z');
                const result = DateTime.fromAnyDate(value.getTime()).toUTC();
                expect(result.toObject()).toEqual({
                    year: 2023,
                    month: 9,
                    day: 5,
                    hour: 17,
                    minute: 44,
                    second: 36,
                    millisecond: 0,
                    offset: UTC_TZ_OFFSET,
                    timezone: UTC_TZ,
                });
                expect(result.toJSON()).toBe('2023-09-05T17:44:36.000Z');
                expect(result.locale).toEqual(DEFAULT_LOCALE);
                expect(result.toTimestamp()).toEqual(value.getTime());
            });

            it('should construct from a timestamp without a custom locale', () => {
                const value = new Date('2023-09-05');
                const result = DateTime.fromAnyDate(value.getTime()).toUTC();
                expect(result.toObject()).toEqual({
                    year: 2023,
                    month: 9,
                    day: 5,
                    hour: 0,
                    minute: 0,
                    second: 0,
                    millisecond: 0,
                    offset: UTC_TZ_OFFSET,
                    timezone: UTC_TZ,
                });
                expect(result.toJSON()).toBe('2023-09-05T00:00:00.000Z');
                expect(result.locale).toEqual(DEFAULT_LOCALE);
                expect(result.toTimestamp()).toEqual(value.getTime());
            });

            it('should construct from a timestamp with a custom locale', () => {
                const value = new Date(2023, 8, 5);
                const result = DateTime.fromAnyDate(value.getTime(), CUSTOM_LOCALE);
                expect(result.toObject()).toEqual({
                    year: 2023,
                    month: 9,
                    day: 5,
                    hour: 0,
                    minute: 0,
                    second: 0,
                    millisecond: 0,
                    offset: DEFAULT_TZ_OFFSET,
                    timezone: DEFAULT_TZ,
                });
                expect(result.toISOString(true)).toBe(value.toISOString());
                expect(result.locale).toEqual(CUSTOM_LOCALE);
                expect(result.toTimestamp()).toEqual(value.getTime());
            });

            it('should construct from a date-time string without timezone', () => {
                const strings = ['2023-09-05 17:44:36', '2023-09-05 17:44:36.123'];
                for (const value of strings) {
                    const hasMilliseconds = value.includes('.');
                    const result = DateTime.fromAnyDate(value);
                    expect(result.toObject()).toEqual({
                        year: 2023,
                        month: 9,
                        day: 5,
                        hour: 17,
                        minute: 44,
                        second: 36,
                        millisecond: hasMilliseconds ? 123 : 0,
                        offset: UTC_TZ_OFFSET,
                        timezone: UTC_TZ,
                    });
                    expect(result.toJSON()).toBe(`${value.replace(' ', 'T')}${hasMilliseconds ? '' : '.000'}Z`);
                    expect(result.locale).toEqual(DEFAULT_LOCALE);
                }
            });

            it('should construct from a date-time string with timezone (+)', () => {
                const strings = [
                    {value: '2023-09-05 12:44:36+14:00', expected: '2023-09-04T22:44:36.000Z'},
                    {value: '2023-09-05 12:44:36.123+14:00', expected: '2023-09-04T22:44:36.123Z'},
                ];
                for (const {value, expected} of strings) {
                    const hasMilliseconds = value.includes('.');
                    const result = DateTime.fromAnyDate(value);
                    expect(result.toObject()).toEqual({
                        year: 2023,
                        month: 9,
                        day: 5,
                        hour: 12,
                        minute: 44,
                        second: 36,
                        millisecond: hasMilliseconds ? 123 : 0,
                        offset: '+14:00',
                    });
                    expect(result.toJSON()).toEqual(expected);
                    expect(result.locale).toEqual(DEFAULT_LOCALE);
                }
            });

            it('should construct from a date-time string with timezone (-)', () => {
                const strings = [
                    {value: '2023-09-05 17:44:36-10:00', expected: '2023-09-06T03:44:36.000Z'},
                    {value: '2023-09-05 17:44:36.123-10:00', expected: '2023-09-06T03:44:36.123Z'},
                ];
                for (const {value, expected} of strings) {
                    const hasMilliseconds = value.includes('.');
                    const result = DateTime.fromAnyDate(value);
                    expect(result.toObject()).toEqual({
                        year: 2023,
                        month: 9,
                        day: 5,
                        hour: 17,
                        minute: 44,
                        second: 36,
                        millisecond: hasMilliseconds ? 123 : 0,
                        offset: '-10:00',
                    });
                    expect(result.toJSON()).toEqual(expected);
                    expect(result.locale).toEqual(DEFAULT_LOCALE);
                }
            });

            it('should construct from a date-time string with timezone (UTC)', () => {
                const strings = ['2023-09-05 01:44:36Z', '2023-09-05 01:44:36.123Z'];
                for (const value of strings) {
                    const hasMilliseconds = value.includes('.');
                    const result = DateTime.fromAnyDate(value);
                    expect(result.toObject()).toEqual({
                        year: 2023,
                        month: 9,
                        day: 5,
                        hour: 1,
                        minute: 44,
                        second: 36,
                        millisecond: hasMilliseconds ? 123 : 0,
                        offset: UTC_TZ_OFFSET,
                        timezone: UTC_TZ,
                    });
                    expect(result.toJSON()).toBe(
                        `${value.slice(0, value.length - 1).replace(' ', 'T')}${hasMilliseconds ? '' : '.000'}Z`
                    );
                    expect(result.locale).toEqual(DEFAULT_LOCALE);
                }
            });

            it('should construct from a iso date string without timezone', () => {
                const strings = ['2023-09-05T17:44:36', '2023-09-05T17:44:36.123'];
                for (const value of strings) {
                    const hasMilliseconds = value.includes('.');
                    const result = DateTime.fromAnyDate(value);
                    expect(result.toObject()).toEqual({
                        year: 2023,
                        month: 9,
                        day: 5,
                        hour: 17,
                        minute: 44,
                        second: 36,
                        millisecond: hasMilliseconds ? 123 : 0,
                        offset: UTC_TZ_OFFSET,
                        timezone: UTC_TZ,
                    });
                    expect(result.toJSON()).toBe(`${value}${hasMilliseconds ? '' : '.000'}Z`);
                    expect(result.locale).toEqual(DEFAULT_LOCALE);
                }
            });

            it('should construct from a iso date string with timezone (+)', () => {
                const strings = [
                    {value: '2023-09-05T17:44:36+14:00', expected: '2023-09-05T03:44:36.000Z'},
                    {value: '2023-09-05T17:44:36.123+14:00', expected: '2023-09-05T03:44:36.123Z'},
                ];
                for (const {value, expected} of strings) {
                    const hasMilliseconds = value.includes('.');
                    const result = DateTime.fromAnyDate(value);
                    expect(result.toObject()).toEqual({
                        year: 2023,
                        month: 9,
                        day: 5,
                        hour: 17,
                        minute: 44,
                        second: 36,
                        millisecond: hasMilliseconds ? 123 : 0,
                        offset: '+14:00',
                        timezone: undefined,
                    });
                    expect(result.toJSON()).toEqual(expected);
                    expect(result.locale).toEqual(DEFAULT_LOCALE);
                }
            });

            it('should construct from a iso date string with timezone (-)', () => {
                const strings = [
                    {value: '2023-09-05T01:44:36-10:00', expected: '2023-09-05T11:44:36.000Z'},
                    {value: '2023-09-05T01:44:36.123-10:00', expected: '2023-09-05T11:44:36.123Z'},
                ];
                for (const {value, expected} of strings) {
                    const hasMilliseconds = value.includes('.');
                    const result = DateTime.fromAnyDate(value);
                    expect(result.toObject()).toEqual({
                        year: 2023,
                        month: 9,
                        day: 5,
                        hour: 1,
                        minute: 44,
                        second: 36,
                        millisecond: hasMilliseconds ? 123 : 0,
                        offset: '-10:00',
                        timezone: undefined,
                    });
                    expect(result.toJSON()).toEqual(expected);
                    expect(result.locale).toEqual(DEFAULT_LOCALE);
                }
            });

            it('should construct from a iso date string with timezone (UTC)', () => {
                const strings = ['2023-09-05T01:44:36Z', '2023-09-05T01:44:36.123Z'];
                for (const value of strings) {
                    const hasMilliseconds = value.includes('.');
                    const result = DateTime.fromAnyDate(value);
                    expect(result.toObject()).toEqual({
                        year: 2023,
                        month: 9,
                        day: 5,
                        hour: 1,
                        minute: 44,
                        second: 36,
                        millisecond: hasMilliseconds ? 123 : 0,
                        offset: UTC_TZ_OFFSET,
                        timezone: UTC_TZ,
                    });
                    expect(result.toJSON()).toBe(
                        `${value.slice(0, value.length - 1)}${hasMilliseconds ? '' : '.000'}Z`
                    );
                    expect(result.locale).toEqual(DEFAULT_LOCALE);
                }
            });

            it('should construct from a date-only string without a custom locale', () => {
                const result = DateTime.fromAnyDate('2023-09-05');
                expect(result.toObject()).toEqual({
                    year: 2023,
                    month: 9,
                    day: 5,
                    hour: 0,
                    minute: 0,
                    second: 0,
                    millisecond: 0,
                    offset: UTC_TZ_OFFSET,
                    timezone: UTC_TZ,
                });
                expect(result.toJSON()).toBe('2023-09-05T00:00:00.000Z');
                expect(result.locale).toEqual(DEFAULT_LOCALE);
            });

            it('should construct from a date-only string with a custom locale', () => {
                const result = DateTime.fromAnyDate('2023-09-05', CUSTOM_LOCALE);
                expect(result.toObject()).toEqual({
                    year: 2023,
                    month: 9,
                    day: 5,
                    hour: 0,
                    minute: 0,
                    second: 0,
                    millisecond: 0,
                    offset: UTC_TZ_OFFSET,
                    timezone: UTC_TZ,
                });
                expect(result.toJSON()).toBe('2023-09-05T00:00:00.000Z');
                expect(result.locale).toEqual(CUSTOM_LOCALE);
            });

            it('should construct from a date string', () => {
                const value = '2020-10-27T09:48:02.248';
                // This transformation is lossy
                const result = DateTime.fromAnyDate(new Date(value).toString());
                expect(result.toObject()).toEqual({
                    year: 2020,
                    month: 10,
                    day: 27,
                    hour: 9,
                    minute: 48,
                    second: 2,
                    millisecond: 0,
                    offset: DEFAULT_TZ_OFFSET,
                    timezone: DEFAULT_TZ,
                });
                expect(result.toJSON()).toBe(new Date('2020-10-27T09:48:02.000').toISOString());
                expect(result.locale).toEqual(DEFAULT_LOCALE);
            });

            it('should construct from a date string with a custom locale', () => {
                const value = '2020-10-27T09:48:59.248';
                // This transformation is lossy
                const result = DateTime.fromAnyDate(new Date(value).toString(), CUSTOM_LOCALE);
                expect(result.toObject()).toEqual({
                    year: 2020,
                    month: 10,
                    day: 27,
                    hour: 9,
                    minute: 48,
                    second: 59,
                    millisecond: 0,
                    offset: DEFAULT_TZ_OFFSET,
                    timezone: DEFAULT_TZ,
                });
                expect(result.toJSON()).toBe(new Date('2020-10-27T09:48:59.000').toISOString());
                expect(result.locale).toEqual(CUSTOM_LOCALE);
            });

            it('should construct from a object with date properties', () => {
                const result = DateTime.fromAnyDate({year: 2020, month: 10, day: 27, hour: 9, minute: 48, second: 59});
                expect(result.toObject()).toEqual({
                    year: 2020,
                    month: 10,
                    day: 27,
                    hour: 9,
                    minute: 48,
                    second: 59,
                    millisecond: 0,
                    offset: DEFAULT_TZ_OFFSET,
                    timezone: DEFAULT_TZ,
                });
                expect(result.toJSON()).toBe(new Date('2020-10-27T09:48:59.000').toISOString());
                expect(result.locale).toEqual(DEFAULT_LOCALE);
            });

            it('should construct from a object with date properties including offset too', () => {
                const result = DateTime.fromAnyDate({
                    year: 2020,
                    month: 10,
                    day: 27,
                    hour: 9,
                    minute: 48,
                    second: 59,
                    millisecond: 1,
                    offset: CUSTOM_TZ_OFFSET,
                    timezone: undefined,
                });
                expect(result.toObject()).toEqual({
                    year: 2020,
                    month: 10,
                    day: 27,
                    hour: 9,
                    minute: 48,
                    second: 59,
                    millisecond: 1,
                    offset: CUSTOM_TZ_OFFSET,
                    timezone: undefined,
                });
                expect(result.toJSON()).toBe('2020-10-27T12:48:59.001Z');
                expect(result.locale).toEqual(DEFAULT_LOCALE);
            });

            it('should construct from a object with date properties with a custom locale', () => {
                const result = DateTime.fromAnyDate(
                    {year: 2020, month: 10, day: 27, hour: 9, minute: 48, second: 59, milliseconds: 248},
                    CUSTOM_LOCALE
                );
                expect(result.toObject()).toEqual({
                    year: 2020,
                    month: 10,
                    day: 27,
                    hour: 9,
                    minute: 48,
                    second: 59,
                    millisecond: 248,
                    offset: DEFAULT_TZ_OFFSET,
                    timezone: DEFAULT_TZ,
                });
                expect(result.toJSON()).toBe(new Date('2020-10-27T09:48:59.248').toISOString());
                expect(result.locale).toEqual(CUSTOM_LOCALE);
            });

            it('should construct an invalid date', () => {
                const result = [
                    DateTime.fromAnyDate(DateOnly.invalid()),
                    DateTime.fromAnyDate(DateOnly.invalid(), CUSTOM_LOCALE),
                    DateTime.fromAnyDate(null),
                    DateTime.fromAnyDate(null, CUSTOM_LOCALE),
                    DateTime.fromAnyDate(undefined),
                    DateTime.fromAnyDate(undefined, CUSTOM_LOCALE),
                    DateTime.fromAnyDate(NaN),
                    DateTime.fromAnyDate(NaN, CUSTOM_LOCALE),
                ];
                expect(result.map(isDateValid)).toEqual(result.map(() => false));
            });
        });

        describe('fromFormat', () => {
            it('should parse MM/DD/YYYY', () => {
                const result = DateTime.fromFormat('02/11/1998', 'MM/DD/YYYY');
                expect(result.toObject()).toEqual({
                    year: 1998,
                    month: 2,
                    day: 11,
                    hour: 0,
                    minute: 0,
                    second: 0,
                    millisecond: 0,
                    offset: DEFAULT_TZ_OFFSET,
                    timezone: DEFAULT_TZ,
                });
                expect(result.toJSON()).toBe(new Date('1998-02-11T00:00:00.000').toISOString());
                expect(result.locale).toEqual(DEFAULT_LOCALE);
            });

            it('should parse MM/DD/YYYY with custom locale', () => {
                const result = DateTime.fromFormat('02/11/1998', 'MM/DD/YYYY', CUSTOM_LOCALE);
                expect(result.toObject()).toEqual({
                    year: 1998,
                    month: 2,
                    day: 11,
                    hour: 0,
                    minute: 0,
                    second: 0,
                    millisecond: 0,
                    offset: DEFAULT_TZ_OFFSET,
                    timezone: DEFAULT_TZ,
                });
                expect(result.toJSON()).toBe(new Date('1998-02-11T00:00:00.000').toISOString());
                expect(result.locale).toEqual(CUSTOM_LOCALE);
            });

            it('should parse DD/MM/YYYY', () => {
                const result = DateTime.fromFormat('02/11/1998', 'DD/MM/YYYY');
                expect(result.toObject()).toEqual({
                    year: 1998,
                    month: 11,
                    day: 2,
                    hour: 0,
                    minute: 0,
                    second: 0,
                    millisecond: 0,
                    offset: DEFAULT_TZ_OFFSET,
                    timezone: DEFAULT_TZ,
                });
                expect(result.toJSON()).toBe(new Date('1998-11-02T00:00:00.000').toISOString());
                expect(result.locale).toEqual(DEFAULT_LOCALE);
            });

            it('should parse DD/MM/YYYY with custom locale', () => {
                const result = DateTime.fromFormat('02/11/1998', 'DD/MM/YYYY', CUSTOM_LOCALE);
                expect(result.toObject()).toEqual({
                    year: 1998,
                    month: 11,
                    day: 2,
                    hour: 0,
                    minute: 0,
                    second: 0,
                    millisecond: 0,
                    offset: DEFAULT_TZ_OFFSET,
                    timezone: DEFAULT_TZ,
                });
                expect(result.toJSON()).toBe(new Date('1998-11-02T00:00:00.000').toISOString());
                expect(result.locale).toEqual(CUSTOM_LOCALE);
            });

            it('should parse MM/DD/YYYY HH:mm:ss', () => {
                const result = DateTime.fromFormat('02/11/1998 22:15:44', 'MM/DD/YYYY HH:mm:ss');
                expect(result.toObject()).toEqual({
                    year: 1998,
                    month: 2,
                    day: 11,
                    hour: 22,
                    minute: 15,
                    second: 44,
                    millisecond: 0,
                    offset: DEFAULT_TZ_OFFSET,
                    timezone: DEFAULT_TZ,
                });
                expect(result.toJSON()).toBe(new Date('1998-02-11T22:15:44.000').toISOString());
                expect(result.locale).toEqual(DEFAULT_LOCALE);
            });

            it('should parse MM/DD/YYYY HH:mm:ss with custom locale', () => {
                const result = DateTime.fromFormat('02/11/1998 22:15:44', 'MM/DD/YYYY HH:mm:ss', CUSTOM_LOCALE);
                expect(result.toObject()).toEqual({
                    year: 1998,
                    month: 2,
                    day: 11,
                    hour: 22,
                    minute: 15,
                    second: 44,
                    millisecond: 0,
                    offset: DEFAULT_TZ_OFFSET,
                    timezone: DEFAULT_TZ,
                });
                expect(result.toJSON()).toBe(new Date('1998-02-11T22:15:44.000').toISOString());
                expect(result.locale).toEqual(CUSTOM_LOCALE);
            });

            it('should parse DD/MM/YYYY HH:mm:ss', () => {
                const result = DateTime.fromFormat('02/11/1998 22:15:44', 'DD/MM/YYYY HH:mm:ss');
                expect(result.toObject()).toEqual({
                    year: 1998,
                    month: 11,
                    day: 2,
                    hour: 22,
                    minute: 15,
                    second: 44,
                    millisecond: 0,
                    offset: DEFAULT_TZ_OFFSET,
                    timezone: DEFAULT_TZ,
                });
                expect(result.toJSON()).toBe(new Date('1998-11-02T22:15:44.000').toISOString());
                expect(result.locale).toEqual(DEFAULT_LOCALE);
            });

            it('should parse DD/MM/YYYY HH:mm:ss with custom locale', () => {
                const result = DateTime.fromFormat('02/11/1998 22:15:44', 'DD/MM/YYYY HH:mm:ss', CUSTOM_LOCALE);
                expect(result.toObject()).toEqual({
                    year: 1998,
                    month: 11,
                    day: 2,
                    hour: 22,
                    minute: 15,
                    second: 44,
                    millisecond: 0,
                    offset: DEFAULT_TZ_OFFSET,
                    timezone: DEFAULT_TZ,
                });
                expect(result.toJSON()).toBe(new Date('1998-11-02T22:15:44.000').toISOString());
                expect(result.locale).toEqual(CUSTOM_LOCALE);
            });

            it('should parse DD/MM/YYYY HH:mm:ssZ', () => {
                const result = DateTime.fromFormat('02/11/1998 22:15:44+13:30', 'DD/MM/YYYY HH:mm:ssZ');
                expect(result.toObject()).toEqual({
                    year: 1998,
                    month: 11,
                    day: 2,
                    hour: 22,
                    minute: 15,
                    second: 44,
                    millisecond: 0,
                    offset: '+13:30',
                    timezone: undefined,
                });
                expect(result.toJSON()).toBe('1998-11-02T08:45:44.000Z');
                expect(result.locale).toEqual(DEFAULT_LOCALE);
            });

            it('should parse DD/MM/YYYY HH:mm:ssZ with custom locale', () => {
                const result = DateTime.fromFormat('02/11/1998 22:15:44+13:30', 'DD/MM/YYYY HH:mm:ssZ', CUSTOM_LOCALE);
                expect(result.toObject()).toEqual({
                    year: 1998,
                    month: 11,
                    day: 2,
                    hour: 22,
                    minute: 15,
                    second: 44,
                    millisecond: 0,
                    offset: '+13:30',
                    timezone: undefined,
                });
                expect(result.toJSON()).toBe('1998-11-02T08:45:44.000Z');
                expect(result.locale).toEqual(CUSTOM_LOCALE);
            });

            it('should fail to parse and return an invalid date', () => {
                const result = [
                    DateTime.fromFormat('1998-02-11', 'MM/DD/YYYY'),
                    DateTime.fromFormat('1998-02-11', 'MM/DD/YYYY', CUSTOM_LOCALE),
                    DateTime.fromFormat('02/11/1998', 'MM/DD/YYYY HH:mm:ss'),
                    DateTime.fromFormat('02/11/1998', 'MM/DD/YYYY HH:mm:ss', CUSTOM_LOCALE),
                ];
                expect(result.map(isDateValid)).toEqual(result.map(() => false));
            });
        });
    });

    describe('properties', () => {
        describe('isDateTime', () => {
            it('should always return true', () => {
                const values = [DateTime.now(), DateTime.invalid(), DateTime.fromAnyDate('2025-12-17')];
                expect(values.map((v) => v.isDateTime)).toEqual(values.map(() => true));
            });
        });

        describe('locale', () => {
            it('should get locale', () => {
                const defaultLocaleValues = [DateTime.now(), DateTime.invalid(), DateTime.fromAnyDate('2025-12-17')];
                const customLocaleValues = [
                    DateTime.now(CUSTOM_LOCALE),
                    DateTime.fromAnyDate('2025-12-17', CUSTOM_LOCALE),
                ];
                expect(defaultLocaleValues.map((v) => v.locale)).toEqual(defaultLocaleValues.map(() => DEFAULT_LOCALE));
                expect(customLocaleValues.map((v) => v.locale)).toEqual(customLocaleValues.map(() => CUSTOM_LOCALE));
            });

            it('should not be settable', () => {
                const dateTime = toDateTime.now();
                dateTime.locale = CUSTOM_LOCALE;
                expect(dateTime.locale).toEqual(DEFAULT_LOCALE);
            });
        });

        describe('offset', () => {
            it('should get the default offset', () => {
                const values = [
                    DateTime.now(),
                    DateTime.fromAnyDate({
                        year: 2024,
                        month: 10,
                        day: 3,
                        hour: 4,
                        minute: 5,
                        second: 6,
                        millisecond: 0,
                    }),
                ];
                expect(values.map((v) => v.offset)).toEqual(values.map(() => DEFAULT_TZ_OFFSET));
            });

            it('should get UTC offset', () => {
                const values = [DateTime.fromAnyDate('2025-12-17'), DateTime.fromDateOnly('2025-12-17')];
                expect(values.map((v) => v.offset)).toEqual(values.map(() => UTC_TZ_OFFSET));
            });

            it('should get the custom offset', () => {
                const value = DateTime.now().toTimezone(CUSTOM_TZ);
                expect(value.offset).toEqual(CUSTOM_TZ_OFFSET);
            });

            it('should not be settable', () => {
                const dateTime = toDateTime.now();
                dateTime.offset = CUSTOM_TZ_OFFSET;
                expect(dateTime.offset).toBe(DEFAULT_TZ_OFFSET);
            });
        });

        describe('timezone', () => {
            it('should get the default timezone', () => {
                const values = [
                    DateTime.now(),
                    DateTime.fromAnyDate({
                        year: 2024,
                        month: 10,
                        day: 3,
                        hour: 4,
                        minute: 5,
                        second: 6,
                        millisecond: 0,
                    }),
                ];
                expect(values.map((v) => v.timezone)).toEqual(values.map(() => DEFAULT_TZ));
            });

            it('should get UTC timezone', () => {
                const values = [DateTime.fromAnyDate('2025-12-17'), DateTime.fromDateOnly('2025-12-17')];
                expect(values.map((v) => v.timezone)).toEqual(values.map(() => UTC_TZ));
            });

            it('should get the custom timezone', () => {
                const value = DateTime.now().toTimezone(CUSTOM_TZ);
                expect(value.timezone).toEqual(CUSTOM_TZ);
            });

            it('should not be settable', () => {
                const dateTime = toDateTime.now();
                dateTime.timezone = CUSTOM_TZ;
                expect(dateTime.timezone).toBe(DEFAULT_TZ);
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
            hour: {new: 6, old: 11},
            minute: {new: 23, old: 32},
            second: {new: 46, old: 32},
            millisecond: {new: 6, old: 32},
        };

        describe.each(Object.keys(properties))('%s', (prop) => {
            const dateTime = toDateTime({
                year: properties.year.old,
                month: properties.month.old,
                day: properties.day.old,
                hour: properties.hour.old,
                minute: properties.minute.old,
                second: properties.second.old,
                millisecond: properties.millisecond.old,
                timezone: CUSTOM_TZ,
            });
            const dateString = dateTime.toString();
            const {new: newValue, old: oldValue} = properties[prop];

            it(`should get the ${prop}`, () => {
                expect(dateTime[prop]).toEqual(oldValue);
                expect(dateTime.toString()).toEqual(dateString);
            });

            it(`should set the ${prop}`, () => {
                dateTime[prop] = newValue;
                expect(dateTime[prop]).toEqual(newValue);
                expect(dateTime.toString()).not.toEqual(dateString);
            });
        });
    });

    describe('methods', () => {
        describe('format', () => {
            const dateTime = toDateTime('2029-09-19T20:30:00Z', ENGLISH_LOCALE);

            it('should default format to LOCALE_FORMATS.VERBAL_DATE_TIME_LONG', () => {
                expect(dateTime.format()).toBe('September 19, 2029 8:30 PM');
            });

            it('should format to MM/DD/YYYY', () => {
                expect(dateTime.format('MM/DD/YYYY')).toBe('09/19/2029');
            });

            it('should format to MM/DD/YYYY HH:mm:ssZ', () => {
                expect(dateTime.format('MM/DD/YYYY HH:mm:ssZ')).toBe('09/19/2029 20:30:00+00:00');
            });
        });

        describe('startOf', () => {
            const dateTime = toDateTime('2029-08-23T03:15:47.007Z');
            it.each(['year', 'years', 'y'])('should set date to start of %s', (unit) => {
                const result = dateTime.startOf(unit);
                expect(result.toString()).not.toEqual(dateTime.toString());
                expect(result.toObject()).toEqual({
                    year: 2029,
                    month: 1,
                    day: 1,
                    hour: 0,
                    minute: 0,
                    second: 0,
                    millisecond: 0,
                    offset: UTC_TZ,
                    timezone: UTC_TZ_OFFSET,
                });
            });

            it.each(['month', 'months', 'M'])('should set date to start of %s', (unit) => {
                const result = dateTime.startOf(unit);
                expect(result.toString()).not.toEqual(dateTime.toString());
                expect(result.toObject()).toEqual({
                    year: 2029,
                    month: 8,
                    day: 1,
                    hour: 0,
                    minute: 0,
                    second: 0,
                    millisecond: 0,
                    offset: UTC_TZ,
                    timezone: UTC_TZ_OFFSET,
                });
            });

            it.each(['week', 'weeks', 'w'])('should set date to start of %s', (unit) => {
                const result = dateTime.startOf(unit);
                expect(result.toString()).not.toEqual(dateTime.toString());
                expect(result.toObject()).toEqual({
                    year: 2029,
                    month: 8,
                    day: 19,
                    hour: 0,
                    minute: 0,
                    second: 0,
                    millisecond: 0,
                    offset: UTC_TZ,
                    timezone: UTC_TZ_OFFSET,
                });
            });

            it.each(['quarter', 'quarters', 'Q'])('should set date to start of %s', (unit) => {
                const result = dateTime.startOf(unit);
                expect(result.toString()).not.toEqual(dateTime.toString());
                expect(result.toObject()).toEqual({
                    year: 2029,
                    month: 7,
                    day: 1,
                    hour: 0,
                    minute: 0,
                    second: 0,
                    millisecond: 0,
                    offset: UTC_TZ,
                    timezone: UTC_TZ_OFFSET,
                });
            });

            it.each(['day', 'days', 'd', 'D'])(
                'should have no effect when settting the date to start of %s',
                (unit) => {
                    const result = dateTime.startOf(unit);
                    expect(result.toString()).not.toEqual(dateTime.toString());
                    expect(result.toObject()).toEqual({
                        year: 2029,
                        month: 8,
                        day: 23,
                        hour: 0,
                        minute: 0,
                        second: 0,
                        millisecond: 0,
                        offset: UTC_TZ,
                        timezone: UTC_TZ_OFFSET,
                    });
                }
            );

            it.each(['hour', 'hours', 'h'])('should have no effect when settting the date to start of %s', (unit) => {
                const result = dateTime.startOf(unit);
                expect(result.toString()).not.toEqual(dateTime.toString());
                expect(result.toObject()).toEqual({
                    year: 2029,
                    month: 8,
                    day: 23,
                    hour: 3,
                    minute: 0,
                    second: 0,
                    millisecond: 0,
                    offset: UTC_TZ,
                    timezone: UTC_TZ_OFFSET,
                });
            });

            it.each(['minute', 'minutes', 'm'])(
                'should have no effect when settting the date to start of %s',
                (unit) => {
                    const result = dateTime.startOf(unit);
                    expect(result.toString()).not.toEqual(dateTime.toString());
                    expect(result.toObject()).toEqual({
                        year: 2029,
                        month: 8,
                        day: 23,
                        hour: 3,
                        minute: 15,
                        second: 0,
                        millisecond: 0,
                        offset: UTC_TZ,
                        timezone: UTC_TZ_OFFSET,
                    });
                }
            );

            it.each(['second', 'seconds', 's'])(
                'should have no effect when settting the date to start of %s',
                (unit) => {
                    const result = dateTime.startOf(unit);
                    expect(result.toString()).not.toEqual(dateTime.toString());
                    expect(result.toObject()).toEqual({
                        year: 2029,
                        month: 8,
                        day: 23,
                        hour: 3,
                        minute: 15,
                        second: 47,
                        millisecond: 0,
                        offset: UTC_TZ,
                        timezone: UTC_TZ_OFFSET,
                    });
                }
            );

            it('should have no effect when settting the date to start of something unhandled', () => {
                for (const unit of [null, '', 'world', 'millisecond', 'milliseconds', 'ms']) {
                    const result = dateTime.startOf(unit);
                    expect(result.toString()).toEqual(dateTime.toString());
                    expect(result.toObject()).toEqual(result.toObject());
                    expect(result.toTimestamp()).toEqual(result.toTimestamp());
                }
            });
        });

        describe('endOf', () => {
            const dateTime = toDateTime('2029-08-23T03:15:47.007Z');
            it.each(['year', 'years', 'y'])('should set date to start of %s', (unit) => {
                const result = dateTime.endOf(unit);
                expect(result.toString()).not.toEqual(dateTime.toString());
                expect(result.toObject()).toEqual({
                    year: 2029,
                    month: 12,
                    day: 31,
                    hour: 23,
                    minute: 59,
                    second: 59,
                    millisecond: 999,
                    offset: UTC_TZ,
                    timezone: UTC_TZ_OFFSET,
                });
            });

            it.each(['month', 'months', 'M'])('should set date to start of %s', (unit) => {
                const result = dateTime.endOf(unit);
                expect(result.toString()).not.toEqual(dateTime.toString());
                expect(result.toObject()).toEqual({
                    year: 2029,
                    month: 8,
                    day: 31,
                    hour: 23,
                    minute: 59,
                    second: 59,
                    millisecond: 999,
                    offset: UTC_TZ,
                    timezone: UTC_TZ_OFFSET,
                });
            });

            it.each(['week', 'weeks', 'w'])('should set date to start of %s', (unit) => {
                const result = dateTime.endOf(unit);
                expect(result.toString()).not.toEqual(dateTime.toString());
                expect(result.toObject()).toEqual({
                    year: 2029,
                    month: 8,
                    day: 25,
                    hour: 23,
                    minute: 59,
                    second: 59,
                    millisecond: 999,
                    offset: UTC_TZ,
                    timezone: UTC_TZ_OFFSET,
                });
            });

            it.each(['quarter', 'quarters', 'Q'])('should set date to start of %s', (unit) => {
                const result = dateTime.endOf(unit);
                expect(result.toString()).not.toEqual(dateTime.toString());
                expect(result.toObject()).toEqual({
                    year: 2029,
                    month: 9,
                    day: 30,
                    hour: 23,
                    minute: 59,
                    second: 59,
                    millisecond: 999,
                    offset: UTC_TZ,
                    timezone: UTC_TZ_OFFSET,
                });
            });

            it.each(['day', 'days', 'd', 'D'])(
                'should have no effect when settting the date to start of %s',
                (unit) => {
                    const result = dateTime.endOf(unit);
                    expect(result.toString()).not.toEqual(dateTime.toString());
                    expect(result.toObject()).toEqual({
                        year: 2029,
                        month: 8,
                        day: 23,
                        hour: 23,
                        minute: 59,
                        second: 59,
                        millisecond: 999,
                        offset: UTC_TZ,
                        timezone: UTC_TZ_OFFSET,
                    });
                }
            );

            it.each(['hour', 'hours', 'h'])('should have no effect when settting the date to start of %s', (unit) => {
                const result = dateTime.endOf(unit);
                expect(result.toString()).not.toEqual(dateTime.toString());
                expect(result.toObject()).toEqual({
                    year: 2029,
                    month: 8,
                    day: 23,
                    hour: 3,
                    minute: 59,
                    second: 59,
                    millisecond: 999,
                    offset: UTC_TZ,
                    timezone: UTC_TZ_OFFSET,
                });
            });

            it.each(['minute', 'minutes', 'm'])(
                'should have no effect when settting the date to start of %s',
                (unit) => {
                    const result = dateTime.endOf(unit);
                    expect(result.toString()).not.toEqual(dateTime.toString());
                    expect(result.toObject()).toEqual({
                        year: 2029,
                        month: 8,
                        day: 23,
                        hour: 3,
                        minute: 15,
                        second: 59,
                        millisecond: 999,
                        offset: UTC_TZ,
                        timezone: UTC_TZ_OFFSET,
                    });
                }
            );

            it.each(['second', 'seconds', 's'])(
                'should have no effect when settting the date to start of %s',
                (unit) => {
                    const result = dateTime.endOf(unit);
                    expect(result.toString()).not.toEqual(dateTime.toString());
                    expect(result.toObject()).toEqual({
                        year: 2029,
                        month: 8,
                        day: 23,
                        hour: 3,
                        minute: 15,
                        second: 47,
                        millisecond: 999,
                        offset: UTC_TZ,
                        timezone: UTC_TZ_OFFSET,
                    });
                }
            );

            it('should have no effect when settting the date to start of something unhandled', () => {
                for (const unit of [null, '', 'world', 'millisecond', 'milliseconds', 'ms']) {
                    const result = dateTime.startOf(unit);
                    expect(result.toString()).toEqual(dateTime.toString());
                    expect(result.toObject()).toEqual(result.toObject());
                    expect(result.toTimestamp()).toEqual(result.toTimestamp());
                }
            });
        });

        describe('plus', () => {
            const dateTime = toDateTime('2029-08-23');

            it('should sum a duration object', () => {
                const result = dateTime.plus({days: 7, month: 1, hours: 2});
                expect(result.toObject()).toEqual({
                    year: 2029,
                    month: 9,
                    day: 30,
                    hour: 2,
                    minute: 0,
                    second: 0,
                    millisecond: 0,
                    offset: UTC_TZ,
                    timezone: UTC_TZ_OFFSET,
                });
            });

            it('should sum a value for a given unit', () => {
                const result = dateTime.plus(7, 'days');
                expect(result.toObject()).toEqual({
                    year: 2029,
                    month: 8,
                    day: 30,
                    hour: 0,
                    minute: 0,
                    second: 0,
                    millisecond: 0,
                    offset: UTC_TZ,
                    timezone: UTC_TZ_OFFSET,
                });
            });

            it('should have no effect if the unit is invalid or unhandled', () => {
                let result = dateTime.plus(7, null);
                expect(result.equals(dateTime)).toBe(true);
                result = dateTime.plus({clocks: 9});
                expect(result.equals(dateTime)).toBe(true);
            });
        });

        describe('minus', () => {
            const dateTime = toDateTime('2029-08-23');

            it('should sum a duration object', () => {
                const result = dateTime.minus({days: 3, month: 1});
                expect(result.toObject()).toEqual({
                    year: 2029,
                    month: 7,
                    day: 20,
                    hour: 0,
                    minute: 0,
                    second: 0,
                    millisecond: 0,
                    offset: UTC_TZ,
                    timezone: UTC_TZ_OFFSET,
                });
            });

            it('should sum a value for a given unit', () => {
                const result = dateTime.minus(3, 'days');
                expect(result.toObject()).toEqual({
                    year: 2029,
                    month: 8,
                    day: 20,
                    hour: 0,
                    minute: 0,
                    second: 0,
                    millisecond: 0,
                    offset: UTC_TZ,
                    timezone: UTC_TZ_OFFSET,
                });
            });

            it('should have no effect if the unit is invalid or unhandled', () => {
                let result = dateTime.minus(7, null);
                expect(result.equals(dateTime)).toBe(true);
                result = dateTime.minus({clocks: 9});
                expect(result.equals(dateTime)).toBe(true);
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
