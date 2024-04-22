const moment = require('moment-timezone');

const {DateOnly} = require('../date-only.cjs');
const {DateTime} = require('../date-time.cjs');
const {toDateOnly, toDateTime, isDateValid, formatToDateTime} = require('../index.cjs');

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

        describe('isEqual', () => {
            const datesA = [
                DateOnly.fromAnyDate('2023-01-01'),
                DateTime.fromAnyDate('2023-01-01'),
                DateTime.fromAnyDate('2023-01-01T23:59:59.999Z'),
                '2023-01-01',
                '2023-01-01T23:59:59.999Z',
            ];
            const datesB = [
                DateOnly.fromAnyDate('2023-01-02'),
                DateTime.fromAnyDate('2023-01-02'),
                DateTime.fromAnyDate('2023-01-02T23:59:59.999Z'),
                '2023-01-02',
                '2023-01-02T23:59:59.999Z',
            ];
            const invalidDates = [DateOnly.invalid(), DateTime.invalid(), null, undefined, '2023-02-31', '9999-44-99'];

            const compareFn = (a, b) => DateOnly.isEqual(a, b);

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
            });

            it('should return false when the dates are different', () => {
                for (const dateA of datesA) {
                    for (const dateB of datesB) {
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
            });
        });

        describe('isEqualOrBefore', () => {
            const datesA = [
                DateOnly.fromAnyDate('2023-01-01'),
                DateTime.fromAnyDate('2023-01-01'),
                DateTime.fromAnyDate('2023-01-01T23:59:59.999Z'),
                '2023-01-01',
                '2023-01-01T23:59:59.999Z',
            ];
            const datesB = [
                DateOnly.fromAnyDate('2023-01-02'),
                DateTime.fromAnyDate('2023-01-02'),
                DateTime.fromAnyDate('2023-01-02T23:59:59.999Z'),
                '2023-01-02',
                '2023-01-02T23:59:59.999Z',
            ];
            const invalidDates = [DateOnly.invalid(), DateTime.invalid(), null, undefined, '2023-02-31', '9999-44-99'];

            const compareFn = (a, b) => DateOnly.isEqualOrBefore(a, b);

            it('should return true when the first date is equal or before the second date', () => {
                for (const dateA of datesA) {
                    for (const dateB of datesA) {
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
                    for (const dateB of datesB) {
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
            });
        });

        describe('isEqualOrAfter', () => {
            const datesB = [
                DateOnly.fromAnyDate('2023-01-01'),
                DateTime.fromAnyDate('2023-01-01'),
                DateTime.fromAnyDate('2023-01-01T23:59:59.999Z'),
                '2023-01-01',
                '2023-01-01T23:59:59.999Z',
            ];
            const datesA = [
                DateOnly.fromAnyDate('2023-01-02'),
                DateTime.fromAnyDate('2023-01-02'),
                DateTime.fromAnyDate('2023-01-02T23:59:59.999Z'),
                '2023-01-02',
                '2023-01-02T23:59:59.999Z',
            ];
            const invalidDates = [DateOnly.invalid(), DateTime.invalid(), null, undefined, '2023-02-31', '9999-44-99'];

            const compareFn = (a, b) => DateOnly.isEqualOrAfter(a, b);

            it('should return true when the first date is equal or after the second date', () => {
                for (const dateA of datesA) {
                    for (const dateB of datesA) {
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

            it('should return false when the first date is not equal or after the second date', () => {
                for (const dateA of datesA) {
                    for (const dateB of datesB) {
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
            });
        });

        describe('isBefore', () => {
            const datesA = [
                DateOnly.fromAnyDate('2023-01-01'),
                DateTime.fromAnyDate('2023-01-01'),
                DateTime.fromAnyDate('2023-01-01T23:59:59.999Z'),
                '2023-01-01',
                '2023-01-01T23:59:59.999Z',
            ];
            const datesB = [
                DateOnly.fromAnyDate('2023-01-02'),
                DateTime.fromAnyDate('2023-01-02'),
                DateTime.fromAnyDate('2023-01-02T23:59:59.999Z'),
                '2023-01-02',
                '2023-01-02T23:59:59.999Z',
            ];
            const invalidDates = [DateOnly.invalid(), DateTime.invalid(), null, undefined, '2023-02-31', '9999-44-99'];

            const compareFn = (a, b) => DateOnly.isBefore(a, b);

            it('should return true when the first date is before the second date', () => {
                for (const dateA of datesA) {
                    for (const dateB of datesB) {
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
            });
        });

        describe('isAfter', () => {
            const datesB = [
                DateOnly.fromAnyDate('2023-01-01'),
                DateTime.fromAnyDate('2023-01-01'),
                DateTime.fromAnyDate('2023-01-01T23:59:59.999Z'),
                '2023-01-01',
                '2023-01-01T23:59:59.999Z',
            ];
            const datesA = [
                DateOnly.fromAnyDate('2023-01-02'),
                DateTime.fromAnyDate('2023-01-02'),
                DateTime.fromAnyDate('2023-01-02T23:59:59.999Z'),
                '2023-01-02',
                '2023-01-02T23:59:59.999Z',
            ];
            const invalidDates = [DateOnly.invalid(), DateTime.invalid(), null, undefined, '2023-02-31', '9999-44-99'];

            const compareFn = (a, b) => DateOnly.isAfter(a, b);

            it('should return true when the first date is after the second date', () => {
                for (const dateA of datesA) {
                    for (const dateB of datesB) {
                        expect(compareFn(dateA, dateB)).toBe(true);
                    }
                }
            });

            it('should return false when the first date is not after the second date', () => {
                for (const dateA of datesA) {
                    for (const dateB of datesB) {
                        expect(compareFn(dateA, dateA)).toBe(false);
                        expect(compareFn(dateB, dateA)).toBe(false);
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
            });
        });

        describe('isEqualOrBeforeNow', () => {
            const invalidDates = [DateOnly.invalid(), DateTime.invalid(), null, undefined, '2023-02-31', '9999-44-99'];

            const NOW = DateOnly.now();
            const compareFn = (a) => DateOnly.isEqualOrBeforeNow(a);

            it('should return true when the first date is equal or before now', () => {
                expect(compareFn(NOW.minus({days: 1}))).toBe(true);
                expect(compareFn(NOW.minus({month: 1}))).toBe(true);
            });

            it('should return false when the first date is not equal or before the second date', () => {
                expect(compareFn(NOW.plus({days: 1}))).toBe(false);
                expect(compareFn(NOW.plus({month: 1}))).toBe(false);
            });

            it('should return false when at least one of the values is invalid', () => {
                for (const date of invalidDates) {
                    expect(compareFn(date)).toBe(false);
                    expect(compareFn(date)).toBe(false);
                    expect(compareFn(date)).toBe(false);
                }
            });
        });

        describe('isEqualOrAfterNow', () => {
            const invalidDates = [DateOnly.invalid(), DateTime.invalid(), null, undefined, '2023-02-31', '9999-44-99'];

            const NOW = DateOnly.now();
            const compareFn = (a) => DateOnly.isEqualOrAfterNow(a);

            it('should return true when the first date is equal or before now', () => {
                expect(compareFn(NOW.plus({days: 1}))).toBe(true);
                expect(compareFn(NOW.plus({month: 1}))).toBe(true);
            });

            it('should return false when the first date is not equal or before the second date', () => {
                expect(compareFn(NOW.minus({days: 1}))).toBe(false);
                expect(compareFn(NOW.minus({month: 1}))).toBe(false);
            });

            it('should return false when at least one of the values is invalid', () => {
                for (const date of invalidDates) {
                    expect(compareFn(date)).toBe(false);
                    expect(compareFn(date)).toBe(false);
                    expect(compareFn(date)).toBe(false);
                }
            });
        });

        describe('isBeforeNow', () => {
            const invalidDates = [DateOnly.invalid(), DateTime.invalid(), null, undefined, '2023-02-31', '9999-44-99'];

            const NOW = DateOnly.now();
            const compareFn = (a) => DateOnly.isBeforeNow(a);

            it('should return true when the first date is equal or before now', () => {
                expect(compareFn(NOW.minus({days: 1}))).toBe(true);
                expect(compareFn(NOW.minus({month: 1}))).toBe(true);
            });

            it('should return false when the first date is not equal or before the second date', () => {
                expect(compareFn(NOW.plus({days: 1}))).toBe(false);
                expect(compareFn(NOW.plus({month: 1}))).toBe(false);
            });

            it('should return false when at least one of the values is invalid', () => {
                for (const date of invalidDates) {
                    expect(compareFn(date)).toBe(false);
                    expect(compareFn(date)).toBe(false);
                    expect(compareFn(date)).toBe(false);
                }
            });
        });

        describe('isAfterNow', () => {
            const invalidDates = [DateOnly.invalid(), DateTime.invalid(), null, undefined, '2023-02-31', '9999-44-99'];

            const NOW = DateOnly.now();
            const compareFn = (a) => DateOnly.isAfterNow(a);

            it('should return true when the first date is equal or before now', () => {
                expect(compareFn(NOW.plus({days: 1}))).toBe(true);
                expect(compareFn(NOW.plus({month: 1}))).toBe(true);
            });

            it('should return false when the first date is not equal or before the second date', () => {
                expect(compareFn(NOW.minus({days: 1}))).toBe(false);
                expect(compareFn(NOW.minus({month: 1}))).toBe(false);
            });

            it('should return false when at least one of the values is invalid', () => {
                for (const date of invalidDates) {
                    expect(compareFn(date)).toBe(false);
                    expect(compareFn(date)).toBe(false);
                    expect(compareFn(date)).toBe(false);
                }
            });
        });

        describe('min', () => {
            it('should get the minimum value', () => {
                const values = ['2023-01-01', '2023-10-09 20:33:44.000Z', toDateOnly(NaN), toDateTime('1999-02-99')];
                expect(DateOnly.min(...values)).toBe('2023-01-01');
                expect(DateOnly.min(...values.reverse())).toBe('2023-01-01');
            });

            it('should return undefined when the list is empty', () => {
                expect(DateOnly.min()).toEqual(undefined);
            });
        });

        describe('max', () => {
            it('should get the minimum value', () => {
                const values = ['2023-01-01', '2023-10-09 20:33:44.000Z', toDateOnly(NaN), toDateTime('1999-02-99')];
                expect(DateOnly.max(...values)).toBe('2023-10-09 20:33:44.000Z');
                expect(DateOnly.max(...values.reverse())).toBe('2023-10-09 20:33:44.000Z');
            });

            it('should return undefined when the list is empty', () => {
                expect(DateOnly.max()).toEqual(undefined);
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
                expect(now.toISOString()).toBe('Invalid date');
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

            it('should construct from a momentjs constructor param', () => {
                const value = '2023-09-05';
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
                    DateOnly.fromMomentDate(NaN),
                    DateOnly.fromMomentDate(moment.invalid(), CUSTOM_LOCALE),
                ];
                expect(result.map(isDateValid)).toEqual([false, false, false]);
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
                    {
                        year: 2020,
                        month: 10,
                        day: 27,
                        hour: 9,
                        minute: 48,
                        second: 59,
                        milliseconds: 248,
                    },
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

            it('should construct from a DateTime string', () => {
                const result = DateOnly.fromDateTime(
                    formatToDateTime({
                        year: 2020,
                        month: 10,
                        day: 27,
                        hour: 9,
                        minute: 48,
                        second: 59,
                        milliseconds: 248,
                    }),
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
                    DateOnly.fromDateTime(NaN),
                ];
                expect(result.map(isDateValid)).toEqual([false, false, false]);
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
                    {
                        year: 2020,
                        month: 10,
                        day: 27,
                        hour: 9,
                        minute: 48,
                        second: 59,
                        milliseconds: 248,
                    },
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
                const result = [DateOnly.fromDateOnly(DateOnly.invalid()), DateOnly.fromDateOnly(DateOnly.invalid(), CUSTOM_LOCALE)];
                expect(result.map(isDateValid)).toEqual([false, false]);
            });

            it('should handle weird DateOnly object', () => {
                const result = DateOnly.fromDateOnly({
                    year: () => 2020,
                    month: '02',
                    day: 1,
                });
                expect(result).toBeInstanceOf(DateOnly);
                expect(result.isDateOnly).toBe(true);
                expect(result.toObject()).toEqual({
                    year: 2020,
                    month: 2,
                    day: 1,
                });
                expect(result.toJSON()).toBe('2020-02-01');
                expect(result.locale).toEqual(DEFAULT_LOCALE);
            });

            it('should fallback to Object.toString method', () => {
                const result = DateOnly.fromDateOnly({
                    toString() {
                        return '2020-02-01T00:00:00.000Z';
                    },
                });
                expect(result).toBeInstanceOf(DateOnly);
                expect(result.isDateOnly).toBe(true);
                expect(result.toObject()).toEqual({
                    year: 2020,
                    month: 2,
                    day: 1,
                });
                expect(result.toJSON()).toBe('2020-02-01');
                expect(result.locale).toEqual(DEFAULT_LOCALE);
            });

            it('should thrown on unexpected DateOnly object', () => {
                try {
                    DateOnly.fromDateOnly({
                        year: {value: 2022},
                        month: '02',
                        day: 1,
                    });
                    throw new Error('Should thrown an error');
                } catch (error) {
                    expect(error).toBeInstanceOf(Error);
                    expect(error.message).toBe('Unsupported value type "object" for DateOnly obejct notation');
                }
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

            it('should construct from a localised date string', () => {
                const value = 'Mon Apr 22 2024 14:47:30 GMT+0300';
                const result = DateOnly.fromAnyDate(value);
                expect(result.toObject()).toEqual({
                    year: 2024,
                    month: 4,
                    day: 22,
                });
                expect(result.toJSON()).toBe('2024-04-22');
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
                    {
                        year: 2020,
                        month: 10,
                        day: 27,
                        hour: 9,
                        minute: 48,
                        second: 59,
                        milliseconds: 248,
                    },
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
                const result = [DateOnly.fromFormat('1998-02-11', 'MM/DD/YYYY'), DateOnly.fromFormat('1998-02-11', 'MM/DD/YYYY', CUSTOM_LOCALE)];
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
                const customLocaleValues = [DateOnly.now(CUSTOM_LOCALE), DateOnly.fromAnyDate('2025-12-17', CUSTOM_LOCALE)];
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

        describe('isUTC', () => {
            it('should always return true', () => {
                const values = [DateOnly.now(), DateOnly.invalid(), DateOnly.fromAnyDate('2025-12-17')];
                expect(values.map((v) => v.isUTC)).toEqual(values.map(() => true));
            });
        });

        describe('isLeapYear', () => {
            const leapYears = [2000, 2004, 2008, 2012, 2016, 2020, 2024, 2028, 2032, 2036, 2040, 2044, 2048];

            it('should return true for leap years', () => {
                expect(leapYears.map((y) => toDateOnly({year: y}).isLeapYear)).toEqual(leapYears.map(() => true));
            });

            it('should return false for non leap years', () => {
                const leapYearsSet = new Set(leapYears);
                const dates = [];
                for (let y = 2001; y < 2048; y += 1) {
                    if (leapYearsSet.has(y)) continue;
                    dates.push(toDateOnly({year: y}));
                }
                expect(dates.map((d) => d.isLeapYear)).toEqual(dates.map(() => false));
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

        const UNUSED_TIME_UNITS = ['hour', 'hours', 'h', 'minute', 'minutes', 'm', 'second', 'seconds', 's', 'millisecond', 'milliseconds', 'ms'];
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

            it.each(['day', 'days', 'd', 'D', ...UNUSED_TIME_UNITS])('should have no effect when settting the date to start of %s', (unit) => {
                const result = dateOnly.startOf(unit);
                expect(result.toString()).toEqual(dateOnly.toString());
                expect(result.toObject()).toEqual(result.toObject());
                expect(result.toTimestamp()).toEqual(result.toTimestamp());
            });
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

            it.each(['day', 'days', 'd', 'D', ...UNUSED_TIME_UNITS])('should have no effect when settting the date to start of %s', (unit) => {
                const result = dateOnly.endOf(unit);
                expect(result.toString()).toEqual(dateOnly.toString());
                expect(result.toObject()).toEqual(result.toObject());
                expect(result.toTimestamp()).toEqual(result.toTimestamp());
            });
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
                result = dateOnly.plus({months: 0});
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
                result = dateOnly.minus({months: 0});
                expect(result.equals(dateOnly)).toBe(true);
            });
        });

        describe('debug', () => {
            it('should return a debug string', () => {
                const date = toDateOnly('2023-04-15');
                expect(date.debug()).toBe('DateOnly(2023-04-15)');
                expect(date[Symbol.for('nodejs.util.inspect.custom')]()).toBe('DateOnly(2023-04-15)');
            });
        });

        describe('clone', () => {
            it('should clone and return another instance with the same values', () => {
                const date = toDateOnly('2023-04-15');
                const clonedDate = date.clone();
                expect(date === clonedDate).toBe(false);
                expect(date.valueOf()).toEqual(clonedDate.valueOf());
                expect(date.toObject()).toEqual(clonedDate.toObject());
                expect(date.toString()).toEqual(clonedDate.toString());
                expect(date.equals(clonedDate)).toBe(true);
            });

            it('should also work with invalid dates', () => {
                const date = DateOnly.invalid();
                const clonedDate = date.clone();
                expect(date === clonedDate).toBe(false);
                expect(date.valueOf()).toEqual(clonedDate.valueOf());
                expect(date.toObject()).toEqual(clonedDate.toObject());
                expect(date.toString()).toEqual(clonedDate.toString());
                expect(date.equals(clonedDate)).toBe(false);
            });
        });

        describe('equals', () => {
            it('should check the valueOf for equality', () => {
                const date = toDateOnly('2023-04-15');
                const clonedDate = date.clone();
                expect(date.equals(clonedDate)).toBe(true);
            });

            it('should return false if any of the dates are invalid', () => {
                const date = toDateOnly('2023-04-15');
                const invalidDate = DateOnly.invalid();
                expect(date.equals(invalidDate)).toBe(false);
                expect(invalidDate.equals(date)).toBe(false);
                expect(invalidDate.equals(invalidDate)).toBe(false);
            });
        });

        describe('diff', () => {
            const dateA = toDateOnly('2024-01-01');
            const dateB = toDateOnly('2024-02-03');
            const properties = {
                year: Math.abs(dateA.year - dateB.year),
                month: Math.abs(dateA.month - dateB.month),
                day: Math.abs(dateA.dayOfYear - dateB.dayOfYear),
                week: Math.abs(dateA.week - dateB.week),
                quarter: Math.abs(dateA.quarter - dateB.quarter),
            };

            it.each(Object.keys(properties))('should get the difference in %ss', (prop) => {
                const diffAmount = properties[prop];
                expect(dateA.diff(dateB, prop)).toEqual(!diffAmount ? 0 : -diffAmount);
                expect(dateB.diff(dateA, prop)).toEqual(diffAmount);
            });

            it('should get the precise difference', () => {
                const diffObj = {
                    year: dateB.diff(dateA, 'year', true),
                    month: dateB.diff(dateA, 'month', true),
                    day: dateB.diff(dateA, 'day', true),
                    week: dateB.diff(dateA, 'week', true),
                    quarter: dateB.diff(dateA, 'quarter', true),
                };
                expect(diffObj.year).toEqual(0.08870967741935483);
                expect(diffObj.month).toEqual(1.064516129032258);
                expect(diffObj.day).toEqual(33);
                expect(diffObj.week).toEqual(4.714285714285714);
                expect(diffObj.quarter).toEqual(0.3548387096774193);
            });

            it('should throw if any of the dates is invalid', () => {
                const invalidDate = DateOnly.invalid();
                expect(() => dateA.diff(invalidDate, 'year')).toThrow('Can not subtract "2024-01-01" from "Invalid date"');
                expect(() => invalidDate.diff(dateA, 'year')).toThrow('Can not subtract "Invalid date" from "2024-01-01"');
                expect(() => invalidDate.diff(invalidDate, 'year')).toThrow('Can not subtract "Invalid date" from "Invalid date"');
            });
        });

        describe('set', () => {
            it('should set a duration object', () => {
                const dateOnly = toDateOnly('2029-08-23');
                const result = dateOnly.set({days: 7, month: 1});
                expect(result.toObject()).toEqual({
                    year: 2029,
                    month: 1,
                    day: 7,
                });
                expect(result.equals(dateOnly)).toBe(true);
            });

            it('should set a value for a given unit', () => {
                const dateOnly = toDateOnly('2029-08-23');
                const result = dateOnly.set(7, 'days');
                expect(result.toObject()).toEqual({
                    year: 2029,
                    month: 8,
                    day: 7,
                });
                expect(result.equals(dateOnly)).toBe(true);
            });

            it('should have no effect if the unit is invalid or unhandled', () => {
                const dateOnly = toDateOnly('2029-08-23');
                const dateObj = dateOnly.toObject();
                let result = dateOnly.set(7, null);
                expect(result.equals(dateOnly)).toBe(true);
                expect(result.toObject()).toEqual(dateObj);
                result = dateOnly.set({clocks: 9});
                expect(result.equals(dateOnly)).toBe(true);
                expect(result.toObject()).toEqual(dateObj);
            });
        });
    });

    describe('compatibility', () => {
        it('should allow to construct a new JS Date object directly', () => {
            const dateOnly = DateOnly.now();
            expect(dateOnly).toBeInstanceOf(DateOnly);
            const jsDate = new Date(dateOnly);
            expect(jsDate instanceof Date).toBe(true);
            expect(jsDate instanceof DateOnly).toBe(false);
            expect(DateOnly.isDateOnly(jsDate)).toBe(false);
            expect(jsDate.toISOString()).toEqual(dateOnly.toISOString());
            expect({
                year: jsDate.getFullYear(),
                month: jsDate.getMonth() + 1,
                day: jsDate.getDate(),
            }).toEqual(dateOnly.toObject());
        });

        it('should contain replace, startsWith and endsWith methods which are used by sequelize', () => {
            const dateOnly = DateOnly.now();
            const dateString = dateOnly.toJSON();
            expect(dateOnly.replace("'", '')).toEqual(dateString);
            expect(dateOnly.startsWith(dateString)).toBe(true);
            expect(dateOnly.startsWith(dateString[0])).toBe(true);
            expect(dateOnly.endsWith(dateString)).toBe(true);
            expect(dateOnly.endsWith(dateString.at(-1))).toBe(true);
        });

        it('should be correctly asserted using expect.toEqual', () => {
            const dateOnly1 = toDateOnly('2023-01-02');
            const dateOnly2 = toDateOnly({year: 2023, month: 1, day: 2});
            const dateOnly3 = toDateOnly('2023-01-02T00:00:00Z');
            const dateOnly4 = toDateOnly(moment.utc('2023-01-02T00:00:00Z'));
            const dateOnly5 = toDateOnly(new Date('2023-01-02T00:00:00.000Z'));
            expect(dateOnly1).toEqual(dateOnly1.clone());
            expect(dateOnly2).toEqual(dateOnly2.clone());
            expect(dateOnly3).toEqual(dateOnly3.clone());
            expect(dateOnly4).toEqual(dateOnly4.clone());
            expect(dateOnly5).toEqual(dateOnly5.clone());
            expect(dateOnly5).toEqual(dateOnly5.clone());
            expect(dateOnly1).toEqual(dateOnly2);
            expect(dateOnly1).toEqual(dateOnly3);
            expect(dateOnly1).toEqual(dateOnly4);
            expect(dateOnly1).toEqual(dateOnly5);
            expect(dateOnly1.toJSON()).toEqual(dateOnly2.toJSON());
            expect(dateOnly1.toJSON()).toEqual(dateOnly3.toJSON());
            expect(dateOnly1.toJSON()).toEqual(dateOnly4.toJSON());
            expect(dateOnly1.toJSON()).toEqual(dateOnly5.toJSON());
            expect(dateOnly1.toObject()).toEqual(dateOnly2.toObject());
            expect(dateOnly1.toObject()).toEqual(dateOnly3.toObject());
            expect(dateOnly1.toObject()).toEqual(dateOnly4.toObject());
            expect(dateOnly1.toObject()).toEqual(dateOnly5.toObject());
            expect(dateOnly2).toEqual(dateOnly3);
            expect(dateOnly2).toEqual(dateOnly4);
            expect(dateOnly3).toEqual(dateOnly4);
        });

        it('should be correctly asserted using expect.toMatchObject', () => {
            const dateOnly = DateOnly.now().set({year: 2001});
            const dateString = dateOnly.toJSON();
            expect({dateOnly, dateString}).toMatchObject({
                dateOnly: dateOnly.clone(),
                dateString,
            });
        });
    });
});
