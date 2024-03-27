const moment = require('moment-timezone');

const {
    isDateValid,
    getDateLocale,
    toJsDate,
    toDateOnly,
    toDateTime,
    formatToDateOnly,
    formatToDateTime,
    formatToDateOnlyWithLocale,
    formatToDateTimeWithLocale,
    LOCALE_FORMATS,
} = require('../index.cjs');
const {DateOnly} = require('../date-only.cjs');
const {DateTime} = require('../date-time.cjs');
const {getLocalTimezone} = require('../utils/tz.cjs');

const DEFAULT_LOCALE = moment().locale();
const ENGLISH_US_LOCALE = 'en-US';
const CUSTOM_LOCALE = 'ja';

const toISOStringLocalTZ = (date) => moment(new Date(date)).toISOString(true);
const extractYYYYMMDDString = (date) => String(date).slice(0, 10);

describe('Date & Locale utils', () => {
    describe('toDateOnly', () => {
        const cases = [
            '2000-01-03',
            '2000-02-04T22:33:44',
            '2000-03-05T22:33:44.222',
            '2000-04-06T22:33:44Z',
            '2000-05-07T22:33:44.222Z',
            '2000-06-08T22:33:44+03:00',
            '2000-07-09T22:33:44.222+03:00',
        ];

        it.each(cases)('should convert string value %s to date-only', (stringValue) => {
            const result = toDateOnly(stringValue);
            expect(result).toBeDefined();
            expect(result.isDateOnly).toBe(true);
            expect(result.toString()).toEqual(extractYYYYMMDDString(stringValue));
            expect(result.locale).toBe(DEFAULT_LOCALE);
        });

        it.each(cases)('should convert string value %s to date-only with custom locale', (stringValue) => {
            const result = toDateOnly(stringValue, CUSTOM_LOCALE);
            expect(result).toBeDefined();
            expect(result.isDateOnly).toBe(true);
            expect(result.toString()).toEqual(extractYYYYMMDDString(stringValue));
            expect(result.locale).toBe(CUSTOM_LOCALE);
        });

        it.each(cases.map((s) => ({stringValue: s, timestampValue: toDateTime(s).toTimestamp()})))(
            'should convert timestamp value $timestampValue to date-only',
            ({stringValue, timestampValue}) => {
                const result = toDateOnly(timestampValue);
                expect(result).toBeDefined();
                expect(result.isDateOnly).toBe(true);
                expect(result.toString()).toEqual(extractYYYYMMDDString(moment(timestampValue).toISOString(true)));
                expect(result.toTimestamp()).toBeLessThanOrEqual(timestampValue);
                expect(result.locale).toBe(DEFAULT_LOCALE);
            }
        );

        it.each(cases.map((s) => ({stringValue: s, timestampValue: new Date(moment.utc(s)).getTime()})))(
            'should convert timestamp value $timestampValue to date-only with custom locale',
            ({stringValue, timestampValue}) => {
                const result = toDateOnly(timestampValue, CUSTOM_LOCALE);
                expect(result).toBeDefined();
                expect(result.isDateOnly).toBe(true);
                expect(result.toString()).toEqual(extractYYYYMMDDString(moment(timestampValue).toISOString(true)));
                expect(result.toTimestamp()).toBeLessThanOrEqual(timestampValue);
                expect(result.locale).toBe(CUSTOM_LOCALE);
            }
        );

        it.each(cases)('should convert Date value %s to date-only', (stringValue) => {
            const dateValue = new Date(stringValue);
            const result = toDateOnly(dateValue);
            expect(result).toBeDefined();
            expect(result.isDateOnly).toBe(true);
            expect(result.toString()).toEqual(extractYYYYMMDDString(moment(dateValue).toISOString(true)));
            expect(result.locale).toBe(DEFAULT_LOCALE);
        });

        it.each(cases)('should convert Date value %s to date-only with custom locale', (stringValue) => {
            const dateValue = new Date(stringValue);
            const result = toDateOnly(dateValue, CUSTOM_LOCALE);
            expect(result).toBeDefined();
            expect(result.isDateOnly).toBe(true);
            expect(result.toString()).toEqual(extractYYYYMMDDString(moment(dateValue).toISOString(true)));
            expect(result.locale).toBe(CUSTOM_LOCALE);
        });

        it.each(cases)('should convert Moment value %s to date-only', (stringValue) => {
            const result = toDateOnly(moment.utc(stringValue));
            expect(result).toBeDefined();
            expect(result.isDateOnly).toBe(true);
            expect(result.toString()).toEqual(extractYYYYMMDDString(stringValue));
            expect(result.locale).toBe(DEFAULT_LOCALE);
        });

        it.each(cases)('should convert Moment value %s to date-only with custom locale', (stringValue) => {
            const result = toDateOnly(moment.utc(stringValue), CUSTOM_LOCALE);
            expect(result).toBeDefined();
            expect(result.isDateOnly).toBe(true);
            expect(result.toString()).toEqual(extractYYYYMMDDString(stringValue));
            expect(result.locale).toBe(CUSTOM_LOCALE);
        });

        it.each(cases)('should convert DateOnly value %s to date-only and don`t loose information', (stringValue) => {
            const dateOnly = toDateOnly(stringValue);
            const result = toDateOnly(dateOnly);
            expect(result).toBeDefined();
            expect(result.isDateOnly).toBe(true);
            expect(result.toString()).toEqual(extractYYYYMMDDString(stringValue));
            expect(result.locale).toBe(DEFAULT_LOCALE);
        });

        it.each(cases)(
            'should convert DateOnly value %s to date-only with custom locale and don`t loose information',
            (stringValue) => {
                const dateOnly = toDateOnly(stringValue, CUSTOM_LOCALE);
                const result = toDateOnly(dateOnly);
                expect(result).toBeDefined();
                expect(result.isDateOnly).toBe(true);
                expect(result.toString()).toEqual(extractYYYYMMDDString(stringValue));
                expect(result.locale).toBe(CUSTOM_LOCALE);
            }
        );

        it.each(cases)('should convert DateTime value %s to date-only', (stringValue) => {
            const dateTime = toDateTime(stringValue);
            const result = toDateOnly(dateTime);
            expect(result).toBeDefined();
            expect(result.isDateOnly).toBe(true);
            expect(result.toString()).toEqual(extractYYYYMMDDString(stringValue));
            expect(result.locale).toBe(DEFAULT_LOCALE);
        });

        it.each(cases)('should convert DateTime value %s to date-only with custom locale', (stringValue) => {
            const dateTime = toDateTime(stringValue);
            const result = toDateOnly(dateTime, CUSTOM_LOCALE);
            expect(result).toBeDefined();
            expect(result.isDateOnly).toBe(true);
            expect(result.toString()).toEqual(extractYYYYMMDDString(stringValue));
            expect(result.locale).toBe(CUSTOM_LOCALE);
        });

        it('should handle null and undefined values', () => {
            expect([toDateOnly(null), toDateOnly(undefined)]).toEqual([undefined, undefined]);
            expect([toDateOnly(null, CUSTOM_LOCALE), toDateOnly(undefined, CUSTOM_LOCALE)]).toEqual([
                undefined,
                undefined,
            ]);
        });

        it('should have a sub-method now', () => {
            let result = toDateOnly.now();
            expect(result).toBeDefined();
            expect(result.isDateOnly).toBe(true);
            expect(result.toTimestamp()).toBeGreaterThan(0);
            expect(result.toString()).not.toBe('Invalid date');
            expect(result.locale).toBe(DEFAULT_LOCALE);

            result = toDateOnly.now(CUSTOM_LOCALE);
            expect(result).toBeDefined();
            expect(result.isDateOnly).toBe(true);
            expect(result.toTimestamp()).toBeGreaterThan(0);
            expect(result.toString()).not.toBe('Invalid date');
            expect(result.locale).toBe(CUSTOM_LOCALE);
        });
    });

    describe('toDateTime', () => {
        const cases = [
            '2000-01-03',
            '2000-02-04T22:33:44',
            '2000-03-05T22:33:44.222',
            '2000-04-06T22:33:44Z',
            '2000-05-07T22:33:44.222Z',
            '2000-06-08T22:33:44+03:00',
            '2000-07-09T22:33:44.222+03:00',
        ];
        const expectedStringValueByCase = {
            '2000-01-03': '2000-01-03T00:00:00.000Z',
            '2000-02-04T22:33:44': '2000-02-04T22:33:44.000Z',
            '2000-03-05T22:33:44.222': '2000-03-05T22:33:44.222Z',
            '2000-04-06T22:33:44Z': '2000-04-06T22:33:44.000Z',
            '2000-05-07T22:33:44.222Z': '2000-05-07T22:33:44.222Z',
            '2000-06-08T22:33:44+03:00': '2000-06-08T19:33:44.000Z',
            '2000-07-09T22:33:44.222+03:00': '2000-07-09T19:33:44.222Z',
        };
        const getExpectedStringValue = (s) => expectedStringValueByCase[s];

        it.each(cases)('should convert string value %s to date-time', (stringValue) => {
            const result = toDateTime(stringValue);
            expect(result).toBeDefined();
            expect(result.isDateTime).toBe(true);
            expect(result.toISOString(true)).toEqual(getExpectedStringValue(stringValue));
            expect(result.locale).toBe(DEFAULT_LOCALE);
        });

        it.each(cases)('should convert string value %s to date-time with custom locale', (stringValue) => {
            const result = toDateTime(stringValue, CUSTOM_LOCALE);
            expect(result).toBeDefined();
            expect(result.isDateTime).toBe(true);
            expect(result.toISOString(true)).toEqual(getExpectedStringValue(stringValue));
            expect(result.locale).toBe(CUSTOM_LOCALE);
        });

        it.each(cases.map((s) => ({stringValue: s, timestampValue: moment.utc(s).valueOf()})))(
            'should convert timestamp value $timestampValue to date-time',
            ({stringValue, timestampValue}) => {
                const result = toDateTime(timestampValue);
                expect(result).toBeDefined();
                expect(result.isDateTime).toBe(true);
                expect(result.toISOString(true)).toEqual(getExpectedStringValue(stringValue));
                expect(result.toTimestamp()).toEqual(timestampValue);
                expect(result.locale).toBe(DEFAULT_LOCALE);
            }
        );

        it.each(cases.map((s) => ({stringValue: s, timestampValue: moment.utc(s).valueOf()})))(
            'should convert timestamp value $timestampValue to date-time with custom locale',
            ({stringValue, timestampValue}) => {
                const result = toDateTime(timestampValue, CUSTOM_LOCALE);
                expect(result).toBeDefined();
                expect(result.isDateTime).toBe(true);
                expect(result.toISOString(true)).toEqual(getExpectedStringValue(stringValue));
                expect(result.toTimestamp()).toEqual(timestampValue);
                expect(result.locale).toBe(CUSTOM_LOCALE);
            }
        );

        it.each(cases)('should convert Date value %s to date-time', (stringValue) => {
            const momentValue = moment.utc(stringValue);
            const result = toDateTime(new Date(momentValue));
            expect(result).toBeDefined();
            expect(result.isDateTime).toBe(true);
            expect(result.toISOString(true)).toEqual(getExpectedStringValue(stringValue));
            expect(result.locale).toBe(DEFAULT_LOCALE);
        });

        it.each(cases)('should convert Date value %s to date-time with custom locale', (stringValue) => {
            const momentValue = moment.utc(stringValue);
            const result = toDateTime(new Date(momentValue), CUSTOM_LOCALE);
            expect(result).toBeDefined();
            expect(result.isDateTime).toBe(true);
            expect(result.toISOString(true)).toEqual(getExpectedStringValue(stringValue));
            expect(result.locale).toBe(CUSTOM_LOCALE);
        });

        it.each(cases)('should convert Moment value %s to date-time', (stringValue) => {
            const momentValue = moment.utc(stringValue);
            const result = toDateTime(momentValue);
            expect(result).toBeDefined();
            expect(result.isDateTime).toBe(true);
            expect(result.toISOString(true)).toEqual(momentValue.toISOString(false));
            expect(result.locale).toBe(DEFAULT_LOCALE);
        });

        it.each(cases)('should convert Moment value %s to date-time with custom locale', (stringValue) => {
            const momentValue = moment.utc(stringValue);
            const result = toDateTime(momentValue, CUSTOM_LOCALE);
            expect(result).toBeDefined();
            expect(result.isDateTime).toBe(true);
            expect(result.toISOString(true)).toEqual(momentValue.toISOString(false));
            expect(result.locale).toBe(CUSTOM_LOCALE);
        });

        it.each(cases)('should convert DateOnly value %s to date-time and don`t loose information', (stringValue) => {
            const dateOnly = toDateOnly(stringValue);
            const result = toDateTime(dateOnly);
            expect(result).toBeDefined();
            expect(result.isDateTime).toBe(true);
            expect(result.toISOString(true)).toBe(`${extractYYYYMMDDString(stringValue)}T00:00:00.000Z`);
            expect(result.locale).toBe(DEFAULT_LOCALE);
        });

        it.each(cases)(
            'should convert DateOnly value %s to date-time with custom locale and don`t loose information',
            (stringValue) => {
                const dateOnly = toDateOnly(stringValue, CUSTOM_LOCALE);
                const result = toDateTime(dateOnly);
                expect(result).toBeDefined();
                expect(result.isDateTime).toBe(true);
                expect(result.toISOString(true)).toBe(`${extractYYYYMMDDString(stringValue)}T00:00:00.000Z`);
                expect(result.locale).toBe(CUSTOM_LOCALE);
            }
        );

        it.each(cases)('should convert DateTime value %s to date-time', (stringValue) => {
            const dateTime = toDateTime(stringValue);
            const result = toDateTime(dateTime);
            expect(result).toBeDefined();
            expect(result.isDateTime).toBe(true);
            expect(result.toString()).toEqual(dateTime.toString());
            expect(result.locale).toBe(DEFAULT_LOCALE);
        });

        it.each(cases)('should convert DateTime value %s to date-time with custom locale', (stringValue) => {
            const dateTime = toDateTime(stringValue);
            const result = toDateTime(dateTime, CUSTOM_LOCALE);
            expect(result).toBeDefined();
            expect(result.isDateTime).toBe(true);
            expect(result.toString()).toEqual(dateTime.toString());
            expect(result.locale).toBe(CUSTOM_LOCALE);
        });

        it('should handle null and undefined values', () => {
            expect([toDateTime(null), toDateTime(undefined)]).toEqual([undefined, undefined]);
            expect([toDateTime(null, CUSTOM_LOCALE), toDateTime(undefined, CUSTOM_LOCALE)]).toEqual([
                undefined,
                undefined,
            ]);
        });

        it('should have a sub-method now', () => {
            let result = toDateTime.now();
            expect(result).toBeDefined();
            expect(result.isDateTime).toBe(true);
            expect(result.toTimestamp()).toBeGreaterThan(0);
            expect(result.toString()).not.toBe('Invalid date');
            expect(result.locale).toBe(DEFAULT_LOCALE);

            result = toDateTime.now(CUSTOM_LOCALE);
            expect(result).toBeDefined();
            expect(result.isDateTime).toBe(true);
            expect(result.toTimestamp()).toBeGreaterThan(0);
            expect(result.toString()).not.toBe('Invalid date');
            expect(result.locale).toBe(CUSTOM_LOCALE);
        });
    });

    describe('toJsDate', () => {
        const cases = [
            '2000-01-03',
            '2000-02-04T22:33:44',
            '2000-03-05T22:33:44.222',
            '2000-04-06T22:33:44Z',
            '2000-05-07T22:33:44.222Z',
            '2000-06-08T22:33:44+03:00',
            '2000-07-09T22:33:44.222+03:00',
        ];
        const expectedStringValueByCase = {
            '2000-01-03': '2000-01-03T00:00:00.000Z',
            '2000-02-04T22:33:44': '2000-02-04T22:33:44.000Z',
            '2000-03-05T22:33:44.222': '2000-03-05T22:33:44.222Z',
            '2000-04-06T22:33:44Z': '2000-04-06T22:33:44.000Z',
            '2000-05-07T22:33:44.222Z': '2000-05-07T22:33:44.222Z',
            '2000-06-08T22:33:44+03:00': '2000-06-08T19:33:44.000Z',
            '2000-07-09T22:33:44.222+03:00': '2000-07-09T19:33:44.222Z',
        };
        const getExpectedStringValue = (s) => expectedStringValueByCase[s];

        it.each(cases)('should convert string value %s to JS date', (stringValue) => {
            const result = toJsDate(stringValue);
            expect(result).toBeInstanceOf(Date);
            expect(result.toISOString()).toEqual(getExpectedStringValue(stringValue));
        });

        it.each(cases.map((s) => ({stringValue: s, timestampValue: moment.utc(s).valueOf()})))(
            'should convert timestamp value $timestampValue to JS date',
            ({stringValue, timestampValue}) => {
                const result = toJsDate(stringValue);
                expect(result).toBeInstanceOf(Date);
                expect(result.toISOString(true)).toEqual(getExpectedStringValue(stringValue));
                expect(result.getTime()).toEqual(timestampValue);
            }
        );

        it.each(cases)('should convert Date value %s to JS date', (stringValue) => {
            const dateValue = new Date(stringValue);
            const result = toJsDate(dateValue);
            expect(result).toBeInstanceOf(Date);
            expect(result).toEqual(dateValue);
        });

        it.each(cases)('should convert Moment value %s to JS date', (stringValue) => {
            const momentDate = moment(stringValue);
            const result = toJsDate(momentDate);
            expect(result).toBeInstanceOf(Date);
            expect(result.toISOString()).toEqual(new Date(momentDate).toISOString());
        });

        it.each(cases)('should convert DateOnly value %s to JS date', (stringValue) => {
            const dateOnly = toDateOnly(stringValue);
            const result = toJsDate(dateOnly);
            expect(result).toBeInstanceOf(Date);
            const expectedString = `${extractYYYYMMDDString(stringValue)}T00:00:00.000Z`;
            expect(result.toISOString()).toBe(expectedString);
        });

        it.each(cases)('should convert DateTime value %s to JS date', (stringValue) => {
            const dateTime = toDateTime(stringValue);
            const result = toJsDate(dateTime);
            expect(result).toBeInstanceOf(Date);
            expect(result.toISOString()).toEqual(getExpectedStringValue(stringValue));
        });

        it('should handle null and undefined values', () => {
            expect([toDateTime(null), toDateTime(undefined)]).toEqual([undefined, undefined]);
        });
    });

    describe('isDateValid', () => {
        it('should return true when the date value is valid', () => {
            const cases = [
                '2000-01-03',
                '2000-02-04T22:33:44',
                '2000-03-05T22:33:44.222',
                '2000-04-06T22:33:44Z',
                '2000-05-07T22:33:44.222Z',
                '2000-06-08T22:33:44+03:00',
                '2000-07-09T22:33:44.222+03:00',
                new Date().getTime(),
                new Date(),
                moment(),
                toDateOnly(new Date()),
                toDateTime(new Date()),
            ];
            const result = cases.map((c) => isDateValid(c));
            expect(result).toEqual(cases.map(() => true));
        });

        it('should return false when the date value is invalid', () => {
            const cases = [
                'qwerty',
                '2-4-T22:34',
                '2000-99-99T22:33:44.222',
                null,
                undefined,
                NaN,
                new Date(NaN),
                moment(NaN),
                toDateOnly(NaN),
                toDateTime(NaN),
            ];
            const result = cases.map((c) => isDateValid(c));
            expect(result).toEqual(cases.map(() => false));
        });
    });

    describe('getDateLocale', () => {
        it('should return the correct locale', () => {
            expect([
                getDateLocale(moment()),
                getDateLocale(moment().locale(CUSTOM_LOCALE)),
                getDateLocale(DateOnly.now()),
                getDateLocale(DateOnly.now(CUSTOM_LOCALE)),
                getDateLocale(DateTime.now()),
                getDateLocale(DateTime.now(CUSTOM_LOCALE)),
            ]).toEqual([DEFAULT_LOCALE, CUSTOM_LOCALE, DEFAULT_LOCALE, CUSTOM_LOCALE, DEFAULT_LOCALE, CUSTOM_LOCALE]);
        });

        it('should return undefined', () => {
            expect([getDateLocale(null), getDateLocale(undefined), getDateLocale(new Date())]).toEqual([
                undefined,
                undefined,
                undefined,
            ]);
        });
    });

    describe('formatToDateOnly', () => {
        const cases = [
            '2000-01-03',
            '2000-02-04T22:33:44',
            '2000-03-05T22:33:44.222',
            '2000-04-06T22:33:44Z',
            '2000-05-07T22:33:44.222Z',
            '2000-06-08T22:33:44+03:00',
            '2000-07-09T22:33:44.222+03:00',
        ];

        const toISODate = (s) => `${s}T00:00:00.000Z`;

        it.each(cases)('should format string value %s to YYYY-MM-DD', (stringValue) => {
            const slicedStringValue = extractYYYYMMDDString(stringValue);
            expect(formatToDateOnly(stringValue)).toEqual(slicedStringValue);
            expect(formatToDateOnly(stringValue, {includeTimeAndZone: false})).toEqual(slicedStringValue);
        });

        it.each(cases)('should format string value %s to ISODate', (stringValue) => {
            const slicedStringValue = extractYYYYMMDDString(stringValue);
            expect(formatToDateOnly(stringValue, {includeTimeAndZone: true})).toBe(toISODate(slicedStringValue));
        });

        it.each(cases.map((s) => ({stringValue: s, timestampValue: toDateOnly(s).toTimestamp()})))(
            'should format timestamp value $timestampValue to YYYY-MM-DD',
            ({stringValue, timestampValue}) => {
                const slicedStringValue = extractYYYYMMDDString(stringValue);
                expect(formatToDateOnly(timestampValue)).toEqual(slicedStringValue);
                expect(formatToDateOnly(timestampValue, {includeTimeAndZone: false})).toEqual(slicedStringValue);
            }
        );

        it.each(cases.map((s) => ({stringValue: s, timestampValue: toDateOnly(s).toTimestamp()})))(
            'should format timestamp value $timestampValue to ISODate',
            ({stringValue, timestampValue}) => {
                const slicedStringValue = extractYYYYMMDDString(stringValue);
                expect(formatToDateOnly(timestampValue, {includeTimeAndZone: true})).toEqual(
                    toISODate(slicedStringValue)
                );
            }
        );

        it.each(cases)('should format Date value %s to YYYY-MM-DD', (stringValue) => {
            const dateValue = new Date(stringValue);
            const expectedStringValue = extractYYYYMMDDString(toISOStringLocalTZ(stringValue));
            expect(formatToDateOnly(dateValue)).toEqual(expectedStringValue);
            expect(formatToDateOnly(dateValue, {includeTimeAndZone: false})).toEqual(expectedStringValue);
        });

        it.each(cases)('should format Date value %s to ISODate', (stringValue) => {
            const dateValue = new Date(stringValue);
            const expectedStringValue = extractYYYYMMDDString(toISOStringLocalTZ(stringValue));
            expect(formatToDateOnly(dateValue, {includeTimeAndZone: true})).toEqual(toISODate(expectedStringValue));
        });

        it.each(cases)('should format DateOnly value %s to YYYY-MM-DD', (stringValue) => {
            const dateOnlyValue = toDateOnly(stringValue);
            const slicedStringValue = extractYYYYMMDDString(stringValue);
            expect(formatToDateOnly(dateOnlyValue)).toEqual(slicedStringValue);
            expect(formatToDateOnly(dateOnlyValue, {includeTimeAndZone: false})).toEqual(slicedStringValue);
        });

        it.each(cases)('should format DateOnly value %s to ISODate', (stringValue) => {
            const dateOnlyValue = toDateOnly(stringValue);
            const slicedStringValue = extractYYYYMMDDString(stringValue);
            expect(formatToDateOnly(dateOnlyValue, {includeTimeAndZone: true})).toEqual(toISODate(slicedStringValue));
        });

        it.each(cases)('should format DateTime value %s to YYYY-MM-DD', (stringValue) => {
            const dateTimeValue = toDateTime(stringValue);
            const slicedStringValue = extractYYYYMMDDString(stringValue);
            expect(formatToDateOnly(dateTimeValue)).toEqual(slicedStringValue);
            expect(formatToDateOnly(dateTimeValue, {includeTimeAndZone: false})).toEqual(slicedStringValue);
        });

        it.each(cases)('should format DateTime value %s to ISODate', (stringValue) => {
            const dateTimeValue = toDateTime(stringValue);
            const slicedStringValue = extractYYYYMMDDString(stringValue);
            expect(formatToDateOnly(dateTimeValue, {includeTimeAndZone: true})).toEqual(toISODate(slicedStringValue));
        });
    });

    describe('formatToDateTime', () => {
        const cases = [
            '2000-01-03',
            '2000-02-04T22:33:44',
            '2000-03-05T22:33:44.222',
            '2000-04-06T22:33:44Z',
            '2000-05-07T22:33:44.222Z',
            '2000-06-08T22:33:44+03:00',
            '2000-07-09T22:33:44.222+03:00',
        ];
        const expectedStringValueByCase = {
            '2000-01-03': '2000-01-03T00:00:00.000Z',
            '2000-02-04T22:33:44': '2000-02-04T22:33:44.000Z',
            '2000-03-05T22:33:44.222': '2000-03-05T22:33:44.222Z',
            '2000-04-06T22:33:44Z': '2000-04-06T22:33:44.000Z',
            '2000-05-07T22:33:44.222Z': '2000-05-07T22:33:44.222Z',
            '2000-06-08T22:33:44+03:00': '2000-06-08T19:33:44.000Z',
            '2000-07-09T22:33:44.222+03:00': '2000-07-09T19:33:44.222Z',
        };
        const getExpectedStringValue = (s) => expectedStringValueByCase[s];
        const toDateOnlyISODate = (s) => `${extractYYYYMMDDString(s)}T00:00:00.000Z`;

        it.each(cases)('should format %s to ISODate', (stringValue) => {
            expect(formatToDateTime(stringValue)).toEqual(getExpectedStringValue(stringValue));
        });

        it.each(cases.map((s) => ({stringValue: s, timestampValue: toDateTime(s).toTimestamp()})))(
            'should format timestamp value $timestampValue to ISODate',
            ({stringValue, timestampValue}) => {
                expect(formatToDateTime(timestampValue)).toEqual(getExpectedStringValue(stringValue));
            }
        );

        it.each(cases)('should format Date value %s to ISODate', (stringValue) => {
            const dateValue = new Date(stringValue);
            expect(formatToDateTime(dateValue)).toEqual(dateValue.toISOString());
        });

        it.each(cases)('should format DateOnly value %s to ISODate', (stringValue) => {
            const dateOnlyValue = toDateOnly(stringValue);
            expect(formatToDateTime(dateOnlyValue)).toEqual(toDateOnlyISODate(stringValue));
        });

        it.each(cases)('should format DateTime value %s to ISODate', (stringValue) => {
            const dateTimeValue = toDateTime(stringValue);
            expect(formatToDateTime(dateTimeValue)).toEqual(getExpectedStringValue(stringValue));
        });
    });

    describe('formatToDateOnlyWithLocale', () => {
        const cases = [
            '2000-01-03',
            '2000-02-04T22:33:44',
            '2000-03-05T22:33:44.222',
            '2000-04-06T22:33:44Z',
            '2000-05-07T22:33:44.222Z',
            '2000-06-08T02:33:44+03:00',
            '2000-07-09T22:33:44.222+03:00',
        ];
        const formattedDateEnglishUSLocaleByCase = {
            '2000-01-03': {
                timeOnly: '12:00 AM',
                timeWithSeconds: '12:00:00 AM',
                numeralDateShort: '1/3/2000',
                numeralDateLong: '01/03/2000',
                verbalDateShort: 'Jan 3, 2000',
                verbalDateLong: 'January 3, 2000',
                verbalDateTimeShort: 'Jan 3, 2000 12:00 AM',
                verbalDateTimeLong: 'January 3, 2000 12:00 AM',
                verbalDateTimeWeekdayShort: 'Mon, Jan 3, 2000 12:00 AM',
                verbalDateTimeWeekdayLong: 'Monday, January 3, 2000 12:00 AM',
            },
            '2000-02-04T22:33:44': {
                timeOnly: '12:00 AM',
                timeWithSeconds: '12:00:00 AM',
                numeralDateShort: '2/4/2000',
                numeralDateLong: '02/04/2000',
                verbalDateShort: 'Feb 4, 2000',
                verbalDateLong: 'February 4, 2000',
                verbalDateTimeShort: 'Feb 4, 2000 12:00 AM',
                verbalDateTimeLong: 'February 4, 2000 12:00 AM',
                verbalDateTimeWeekdayShort: 'Fri, Feb 4, 2000 12:00 AM',
                verbalDateTimeWeekdayLong: 'Friday, February 4, 2000 12:00 AM',
            },
            '2000-03-05T22:33:44.222': {
                timeOnly: '12:00 AM',
                timeWithSeconds: '12:00:00 AM',
                numeralDateShort: '3/5/2000',
                numeralDateLong: '03/05/2000',
                verbalDateShort: 'Mar 5, 2000',
                verbalDateLong: 'March 5, 2000',
                verbalDateTimeShort: 'Mar 5, 2000 12:00 AM',
                verbalDateTimeLong: 'March 5, 2000 12:00 AM',
                verbalDateTimeWeekdayShort: 'Sun, Mar 5, 2000 12:00 AM',
                verbalDateTimeWeekdayLong: 'Sunday, March 5, 2000 12:00 AM',
            },
            '2000-04-06T22:33:44Z': {
                timeOnly: '12:00 AM',
                timeWithSeconds: '12:00:00 AM',
                numeralDateShort: '4/6/2000',
                numeralDateLong: '04/06/2000',
                verbalDateShort: 'Apr 6, 2000',
                verbalDateLong: 'April 6, 2000',
                verbalDateTimeShort: 'Apr 6, 2000 12:00 AM',
                verbalDateTimeLong: 'April 6, 2000 12:00 AM',
                verbalDateTimeWeekdayShort: 'Thu, Apr 6, 2000 12:00 AM',
                verbalDateTimeWeekdayLong: 'Thursday, April 6, 2000 12:00 AM',
            },
            '2000-05-07T22:33:44.222Z': {
                timeOnly: '12:00 AM',
                timeWithSeconds: '12:00:00 AM',
                numeralDateShort: '5/7/2000',
                numeralDateLong: '05/07/2000',
                verbalDateShort: 'May 7, 2000',
                verbalDateLong: 'May 7, 2000',
                verbalDateTimeShort: 'May 7, 2000 12:00 AM',
                verbalDateTimeLong: 'May 7, 2000 12:00 AM',
                verbalDateTimeWeekdayShort: 'Sun, May 7, 2000 12:00 AM',
                verbalDateTimeWeekdayLong: 'Sunday, May 7, 2000 12:00 AM',
            },
            '2000-06-08T02:33:44+03:00': {
                timeOnly: '12:00 AM',
                timeWithSeconds: '12:00:00 AM',
                numeralDateShort: '6/8/2000',
                numeralDateLong: '06/08/2000',
                verbalDateShort: 'Jun 8, 2000',
                verbalDateLong: 'June 8, 2000',
                verbalDateTimeShort: 'Jun 8, 2000 12:00 AM',
                verbalDateTimeLong: 'June 8, 2000 12:00 AM',
                verbalDateTimeWeekdayShort: 'Thu, Jun 8, 2000 12:00 AM',
                verbalDateTimeWeekdayLong: 'Thursday, June 8, 2000 12:00 AM',
            },
            '2000-07-09T22:33:44.222+03:00': {
                timeOnly: '12:00 AM',
                timeWithSeconds: '12:00:00 AM',
                numeralDateShort: '7/9/2000',
                numeralDateLong: '07/09/2000',
                verbalDateShort: 'Jul 9, 2000',
                verbalDateLong: 'July 9, 2000',
                verbalDateTimeShort: 'Jul 9, 2000 12:00 AM',
                verbalDateTimeLong: 'July 9, 2000 12:00 AM',
                verbalDateTimeWeekdayShort: 'Sun, Jul 9, 2000 12:00 AM',
                verbalDateTimeWeekdayLong: 'Sunday, July 9, 2000 12:00 AM',
            },
        };
        const formattedDateCustomLocaleByCase = {
            '2000-01-03': {
                timeOnly: '00:00',
                timeWithSeconds: '00:00:00',
                numeralDateShort: '2000/01/03',
                numeralDateLong: '2000/01/03',
                verbalDateShort: '2000年1月3日',
                verbalDateLong: '2000年1月3日',
                verbalDateTimeShort: '2000年1月3日 00:00',
                verbalDateTimeLong: '2000年1月3日 00:00',
                verbalDateTimeWeekdayShort: '2000年1月3日(月) 00:00',
                verbalDateTimeWeekdayLong: '2000年1月3日 月曜日 00:00',
            },
            '2000-02-04T22:33:44': {
                timeOnly: '00:00',
                timeWithSeconds: '00:00:00',
                numeralDateShort: '2000/02/04',
                numeralDateLong: '2000/02/04',
                verbalDateShort: '2000年2月4日',
                verbalDateLong: '2000年2月4日',
                verbalDateTimeShort: '2000年2月4日 00:00',
                verbalDateTimeLong: '2000年2月4日 00:00',
                verbalDateTimeWeekdayShort: '2000年2月4日(金) 00:00',
                verbalDateTimeWeekdayLong: '2000年2月4日 金曜日 00:00',
            },
            '2000-03-05T22:33:44.222': {
                timeOnly: '00:00',
                timeWithSeconds: '00:00:00',
                numeralDateShort: '2000/03/05',
                numeralDateLong: '2000/03/05',
                verbalDateShort: '2000年3月5日',
                verbalDateLong: '2000年3月5日',
                verbalDateTimeShort: '2000年3月5日 00:00',
                verbalDateTimeLong: '2000年3月5日 00:00',
                verbalDateTimeWeekdayShort: '2000年3月5日(日) 00:00',
                verbalDateTimeWeekdayLong: '2000年3月5日 日曜日 00:00',
            },
            '2000-04-06T22:33:44Z': {
                timeOnly: '00:00',
                timeWithSeconds: '00:00:00',
                numeralDateShort: '2000/04/06',
                numeralDateLong: '2000/04/06',
                verbalDateShort: '2000年4月6日',
                verbalDateLong: '2000年4月6日',
                verbalDateTimeShort: '2000年4月6日 00:00',
                verbalDateTimeLong: '2000年4月6日 00:00',
                verbalDateTimeWeekdayShort: '2000年4月6日(木) 00:00',
                verbalDateTimeWeekdayLong: '2000年4月6日 木曜日 00:00',
            },
            '2000-05-07T22:33:44.222Z': {
                timeOnly: '00:00',
                timeWithSeconds: '00:00:00',
                numeralDateShort: '2000/05/07',
                numeralDateLong: '2000/05/07',
                verbalDateShort: '2000年5月7日',
                verbalDateLong: '2000年5月7日',
                verbalDateTimeShort: '2000年5月7日 00:00',
                verbalDateTimeLong: '2000年5月7日 00:00',
                verbalDateTimeWeekdayShort: '2000年5月7日(日) 00:00',
                verbalDateTimeWeekdayLong: '2000年5月7日 日曜日 00:00',
            },
            '2000-06-08T02:33:44+03:00': {
                timeOnly: '00:00',
                timeWithSeconds: '00:00:00',
                numeralDateShort: '2000/06/08',
                numeralDateLong: '2000/06/08',
                verbalDateShort: '2000年6月8日',
                verbalDateLong: '2000年6月8日',
                verbalDateTimeShort: '2000年6月8日 00:00',
                verbalDateTimeLong: '2000年6月8日 00:00',
                verbalDateTimeWeekdayShort: '2000年6月8日(木) 00:00',
                verbalDateTimeWeekdayLong: '2000年6月8日 木曜日 00:00',
            },
            '2000-07-09T22:33:44.222+03:00': {
                timeOnly: '00:00',
                timeWithSeconds: '00:00:00',
                numeralDateShort: '2000/07/09',
                numeralDateLong: '2000/07/09',
                verbalDateShort: '2000年7月9日',
                verbalDateLong: '2000年7月9日',
                verbalDateTimeShort: '2000年7月9日 00:00',
                verbalDateTimeLong: '2000年7月9日 00:00',
                verbalDateTimeWeekdayShort: '2000年7月9日(日) 00:00',
                verbalDateTimeWeekdayLong: '2000年7月9日 日曜日 00:00',
            },
        };
        const formatAll = (anyDate, locale) => ({
            timeOnly: formatToDateOnlyWithLocale(anyDate, {locale, format: LOCALE_FORMATS.TIME_ONLY}),
            timeWithSeconds: formatToDateOnlyWithLocale(anyDate, {locale, format: LOCALE_FORMATS.TIME_WITH_SECONDS}),
            numeralDateShort: formatToDateOnlyWithLocale(anyDate, {locale, format: LOCALE_FORMATS.NUMERAL_DATE_SHORT}),
            numeralDateLong: formatToDateOnlyWithLocale(anyDate, {locale, format: LOCALE_FORMATS.NUMERAL_DATE_LONG}),
            verbalDateShort: formatToDateOnlyWithLocale(anyDate, {locale, format: LOCALE_FORMATS.VERBAL_DATE_SHORT}),
            verbalDateLong: formatToDateOnlyWithLocale(anyDate, {locale, format: LOCALE_FORMATS.VERBAL_DATE_LONG}),
            verbalDateTimeShort: formatToDateOnlyWithLocale(anyDate, {
                locale,
                format: LOCALE_FORMATS.VERBAL_DATE_TIME_SHORT,
            }),
            verbalDateTimeLong: formatToDateOnlyWithLocale(anyDate, {
                locale,
                format: LOCALE_FORMATS.VERBAL_DATE_TIME_LONG,
            }),
            verbalDateTimeWeekdayShort: formatToDateOnlyWithLocale(anyDate, {
                locale,
                format: LOCALE_FORMATS.VERBAL_DATE_TIME_WEEKDAY_SHORT,
            }),
            verbalDateTimeWeekdayLong: formatToDateOnlyWithLocale(anyDate, {
                locale,
                format: LOCALE_FORMATS.VERBAL_DATE_TIME_WEEKDAY_LONG,
            }),
        });

        it.each(cases)('should format string value %s', (stringValue) => {
            const englishResults = formatAll(stringValue, ENGLISH_US_LOCALE);
            expect(englishResults).toEqual(formattedDateEnglishUSLocaleByCase[stringValue]);

            const customResults = formatAll(stringValue, CUSTOM_LOCALE);
            expect(customResults).toEqual(formattedDateCustomLocaleByCase[stringValue]);
        });
    });

    describe('formatToDateTimeWithLocale', () => {
        const cases = [
            '2000-01-03',
            '2000-02-04T22:33:44',
            '2000-03-05T22:33:44.222',
            '2000-04-06T22:33:44Z',
            '2000-05-07T22:33:44.222Z',
            '2000-06-08T02:33:44+03:00',
            '2000-07-09T22:33:44.222+03:00',
        ];
        const formattedDateEnglishUSLocaleByCase = {
            '2000-01-03': {
                timeOnly: '12:00 AM',
                timeWithSeconds: '12:00:00 AM',
                numeralDateShort: '1/3/2000',
                numeralDateLong: '01/03/2000',
                verbalDateShort: 'Jan 3, 2000',
                verbalDateLong: 'January 3, 2000',
                verbalDateTimeShort: 'Jan 3, 2000 12:00 AM',
                verbalDateTimeLong: 'January 3, 2000 12:00 AM',
                verbalDateTimeWeekdayShort: 'Mon, Jan 3, 2000 12:00 AM',
                verbalDateTimeWeekdayLong: 'Monday, January 3, 2000 12:00 AM',
            },
            '2000-02-04T22:33:44': {
                timeOnly: '10:33 PM',
                timeWithSeconds: '10:33:44 PM',
                numeralDateShort: '2/4/2000',
                numeralDateLong: '02/04/2000',
                verbalDateShort: 'Feb 4, 2000',
                verbalDateLong: 'February 4, 2000',
                verbalDateTimeShort: 'Feb 4, 2000 10:33 PM',
                verbalDateTimeLong: 'February 4, 2000 10:33 PM',
                verbalDateTimeWeekdayShort: 'Fri, Feb 4, 2000 10:33 PM',
                verbalDateTimeWeekdayLong: 'Friday, February 4, 2000 10:33 PM',
            },
            '2000-03-05T22:33:44.222': {
                timeOnly: '10:33 PM',
                timeWithSeconds: '10:33:44 PM',
                numeralDateShort: '3/5/2000',
                numeralDateLong: '03/05/2000',
                verbalDateShort: 'Mar 5, 2000',
                verbalDateLong: 'March 5, 2000',
                verbalDateTimeShort: 'Mar 5, 2000 10:33 PM',
                verbalDateTimeLong: 'March 5, 2000 10:33 PM',
                verbalDateTimeWeekdayShort: 'Sun, Mar 5, 2000 10:33 PM',
                verbalDateTimeWeekdayLong: 'Sunday, March 5, 2000 10:33 PM',
            },
            '2000-04-06T22:33:44Z': {
                timeOnly: '10:33 PM',
                timeWithSeconds: '10:33:44 PM',
                numeralDateShort: '4/6/2000',
                numeralDateLong: '04/06/2000',
                verbalDateShort: 'Apr 6, 2000',
                verbalDateLong: 'April 6, 2000',
                verbalDateTimeShort: 'Apr 6, 2000 10:33 PM',
                verbalDateTimeLong: 'April 6, 2000 10:33 PM',
                verbalDateTimeWeekdayShort: 'Thu, Apr 6, 2000 10:33 PM',
                verbalDateTimeWeekdayLong: 'Thursday, April 6, 2000 10:33 PM',
            },
            '2000-05-07T22:33:44.222Z': {
                timeOnly: '10:33 PM',
                timeWithSeconds: '10:33:44 PM',
                numeralDateShort: '5/7/2000',
                numeralDateLong: '05/07/2000',
                verbalDateShort: 'May 7, 2000',
                verbalDateLong: 'May 7, 2000',
                verbalDateTimeShort: 'May 7, 2000 10:33 PM',
                verbalDateTimeLong: 'May 7, 2000 10:33 PM',
                verbalDateTimeWeekdayShort: 'Sun, May 7, 2000 10:33 PM',
                verbalDateTimeWeekdayLong: 'Sunday, May 7, 2000 10:33 PM',
            },
            '2000-06-08T02:33:44+03:00': {
                timeOnly: '2:33 AM',
                timeWithSeconds: '2:33:44 AM',
                numeralDateShort: '6/8/2000',
                numeralDateLong: '06/08/2000',
                verbalDateShort: 'Jun 8, 2000',
                verbalDateLong: 'June 8, 2000',
                verbalDateTimeShort: 'Jun 8, 2000 2:33 AM',
                verbalDateTimeLong: 'June 8, 2000 2:33 AM',
                verbalDateTimeWeekdayShort: 'Thu, Jun 8, 2000 2:33 AM',
                verbalDateTimeWeekdayLong: 'Thursday, June 8, 2000 2:33 AM',
            },
            '2000-07-09T22:33:44.222+03:00': {
                timeOnly: '10:33 PM',
                timeWithSeconds: '10:33:44 PM',
                numeralDateShort: '7/9/2000',
                numeralDateLong: '07/09/2000',
                verbalDateShort: 'Jul 9, 2000',
                verbalDateLong: 'July 9, 2000',
                verbalDateTimeShort: 'Jul 9, 2000 10:33 PM',
                verbalDateTimeLong: 'July 9, 2000 10:33 PM',
                verbalDateTimeWeekdayShort: 'Sun, Jul 9, 2000 10:33 PM',
                verbalDateTimeWeekdayLong: 'Sunday, July 9, 2000 10:33 PM',
            },
        };
        const formattedDateCustomLocaleByCase = {
            '2000-01-03': {
                timeOnly: '00:00',
                timeWithSeconds: '00:00:00',
                numeralDateShort: '2000/01/03',
                numeralDateLong: '2000/01/03',
                verbalDateShort: '2000年1月3日',
                verbalDateLong: '2000年1月3日',
                verbalDateTimeShort: '2000年1月3日 00:00',
                verbalDateTimeLong: '2000年1月3日 00:00',
                verbalDateTimeWeekdayShort: '2000年1月3日(月) 00:00',
                verbalDateTimeWeekdayLong: '2000年1月3日 月曜日 00:00',
            },
            '2000-02-04T22:33:44': {
                timeOnly: '22:33',
                timeWithSeconds: '22:33:44',
                numeralDateShort: '2000/02/04',
                numeralDateLong: '2000/02/04',
                verbalDateShort: '2000年2月4日',
                verbalDateLong: '2000年2月4日',
                verbalDateTimeShort: '2000年2月4日 22:33',
                verbalDateTimeLong: '2000年2月4日 22:33',
                verbalDateTimeWeekdayShort: '2000年2月4日(金) 22:33',
                verbalDateTimeWeekdayLong: '2000年2月4日 金曜日 22:33',
            },
            '2000-03-05T22:33:44.222': {
                timeOnly: '22:33',
                timeWithSeconds: '22:33:44',
                numeralDateShort: '2000/03/05',
                numeralDateLong: '2000/03/05',
                verbalDateShort: '2000年3月5日',
                verbalDateLong: '2000年3月5日',
                verbalDateTimeShort: '2000年3月5日 22:33',
                verbalDateTimeLong: '2000年3月5日 22:33',
                verbalDateTimeWeekdayShort: '2000年3月5日(日) 22:33',
                verbalDateTimeWeekdayLong: '2000年3月5日 日曜日 22:33',
            },
            '2000-04-06T22:33:44Z': {
                timeOnly: '22:33',
                timeWithSeconds: '22:33:44',
                numeralDateShort: '2000/04/06',
                numeralDateLong: '2000/04/06',
                verbalDateShort: '2000年4月6日',
                verbalDateLong: '2000年4月6日',
                verbalDateTimeShort: '2000年4月6日 22:33',
                verbalDateTimeLong: '2000年4月6日 22:33',
                verbalDateTimeWeekdayShort: '2000年4月6日(木) 22:33',
                verbalDateTimeWeekdayLong: '2000年4月6日 木曜日 22:33',
            },
            '2000-05-07T22:33:44.222Z': {
                timeOnly: '22:33',
                timeWithSeconds: '22:33:44',
                numeralDateShort: '2000/05/07',
                numeralDateLong: '2000/05/07',
                verbalDateShort: '2000年5月7日',
                verbalDateLong: '2000年5月7日',
                verbalDateTimeShort: '2000年5月7日 22:33',
                verbalDateTimeLong: '2000年5月7日 22:33',
                verbalDateTimeWeekdayShort: '2000年5月7日(日) 22:33',
                verbalDateTimeWeekdayLong: '2000年5月7日 日曜日 22:33',
            },
            '2000-06-08T02:33:44+03:00': {
                timeOnly: '02:33',
                timeWithSeconds: '02:33:44',
                numeralDateShort: '2000/06/08',
                numeralDateLong: '2000/06/08',
                verbalDateShort: '2000年6月8日',
                verbalDateLong: '2000年6月8日',
                verbalDateTimeShort: '2000年6月8日 02:33',
                verbalDateTimeLong: '2000年6月8日 02:33',
                verbalDateTimeWeekdayShort: '2000年6月8日(木) 02:33',
                verbalDateTimeWeekdayLong: '2000年6月8日 木曜日 02:33',
            },
            '2000-07-09T22:33:44.222+03:00': {
                timeOnly: '22:33',
                timeWithSeconds: '22:33:44',
                numeralDateShort: '2000/07/09',
                numeralDateLong: '2000/07/09',
                verbalDateShort: '2000年7月9日',
                verbalDateLong: '2000年7月9日',
                verbalDateTimeShort: '2000年7月9日 22:33',
                verbalDateTimeLong: '2000年7月9日 22:33',
                verbalDateTimeWeekdayShort: '2000年7月9日(日) 22:33',
                verbalDateTimeWeekdayLong: '2000年7月9日 日曜日 22:33',
            },
        };
        const formatAll = (anyDate, locale) => ({
            timeOnly: formatToDateTimeWithLocale(anyDate, {locale, format: LOCALE_FORMATS.TIME_ONLY}),
            timeWithSeconds: formatToDateTimeWithLocale(anyDate, {locale, format: LOCALE_FORMATS.TIME_WITH_SECONDS}),
            numeralDateShort: formatToDateTimeWithLocale(anyDate, {locale, format: LOCALE_FORMATS.NUMERAL_DATE_SHORT}),
            numeralDateLong: formatToDateTimeWithLocale(anyDate, {locale, format: LOCALE_FORMATS.NUMERAL_DATE_LONG}),
            verbalDateShort: formatToDateTimeWithLocale(anyDate, {locale, format: LOCALE_FORMATS.VERBAL_DATE_SHORT}),
            verbalDateLong: formatToDateTimeWithLocale(anyDate, {locale, format: LOCALE_FORMATS.VERBAL_DATE_LONG}),
            verbalDateTimeShort: formatToDateTimeWithLocale(anyDate, {
                locale,
                format: LOCALE_FORMATS.VERBAL_DATE_TIME_SHORT,
            }),
            verbalDateTimeLong: formatToDateTimeWithLocale(anyDate, {
                locale,
                format: LOCALE_FORMATS.VERBAL_DATE_TIME_LONG,
            }),
            verbalDateTimeWeekdayShort: formatToDateTimeWithLocale(anyDate, {
                locale,
                format: LOCALE_FORMATS.VERBAL_DATE_TIME_WEEKDAY_SHORT,
            }),
            verbalDateTimeWeekdayLong: formatToDateTimeWithLocale(anyDate, {
                locale,
                format: LOCALE_FORMATS.VERBAL_DATE_TIME_WEEKDAY_LONG,
            }),
        });

        it.each(cases)('should format string value %s', (stringValue) => {
            const englishResults = formatAll(stringValue, ENGLISH_US_LOCALE);
            expect(englishResults).toEqual(formattedDateEnglishUSLocaleByCase[stringValue]);

            const customResults = formatAll(stringValue, CUSTOM_LOCALE);
            expect(customResults).toEqual(formattedDateCustomLocaleByCase[stringValue]);
        });
    });
});
