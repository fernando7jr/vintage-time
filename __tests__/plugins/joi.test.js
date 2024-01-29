const JoiModule = require('joi');

const {DateOnly} = require('../../date-only.cjs');
const {DateTime} = require('../../date-time.cjs');
const {formatToDateOnly, toDateTime} = require('../../index.cjs');
const {anyDate, dateOnly, dateTime} = require('../../plugins/joi.cjs');

describe('Joi Date Extensions', () => {
    const joi = JoiModule.extend(anyDate, dateOnly, dateTime);

    const validate = (joiSchema, v) => {
        const {value, error} = joiSchema.validate(v);
        return {value, isValid: error === null || error === undefined, error};
    };

    describe('anyDate', () => {
        const schema = joi.anyDate();

        it.each([
            '2023-01-01',
            '1990-10-12',
            '2023-01-01T00:00:00Z',
            '2023-01-01 00:00:00Z',
            '2023-01-01 00:00:00-03:00',
        ])('should accept "%s"', (value) => {
            const result = validate(schema, value);
            expect(result.isValid).toBe(true);
            expect(result.value).toBeInstanceOf(DateTime);
            expect(formatToDateOnly(result.value)).toEqual(formatToDateOnly(value));
        });

        it.each(['01/01/2000', '2000/01/01', '99-02-15', '2023-01-01 00:00:00', '2023-01-01 00:00:00', 1425215164236])(
            'should reject "%s"',
            (value) => {
                expect(validate(schema, value)).toMatchObject({isValid: false});
            }
        );
    });

    describe('dateOnly', () => {
        const schema = joi.dateOnly();

        it.each(['2023-01-01', '1990-10-12'])('should accept "%s"', (value) => {
            const result = validate(schema, value);
            expect(result.isValid).toBe(true);
            expect(result.value).toBeInstanceOf(DateOnly);
            expect(formatToDateOnly(result.value)).toEqual(value);
        });

        it.each([
            '01/01/2000',
            '2000/01/01',
            '99-02-15',
            '2023-01-01T00:00:00',
            '2023-01-01T00:00:00Z',
            '2023-01-01 00:00:00',
            '2023-01-01 00:00:00Z',
            '2023-01-01 00:00:00-03:00',
            1425215164236,
        ])('should reject "%s"', (value) => {
            expect(validate(schema, value)).toMatchObject({isValid: false});
        });
    });

    describe('dateTime', () => {
        const schema = joi.dateTime();

        it.each([
            '2023-01-01T00:00:00Z',
            '2023-01-01T15:12:33.123Z',
            '2023-01-01 00:00:00Z',
            '2023-01-01 00:00:00-03:00',
            '2023-01-01 00:00:00+03:00',
        ])('should accept "%s"', (value) => {
            const result = validate(schema, value);
            expect(result.isValid).toBe(true);
            expect(result.value).toBeInstanceOf(DateTime);
            expect(result.value.valueOf()).toEqual(toDateTime(value).valueOf());
        });

        it.each([
            '2023-01-01T00:00:00',
            '2023-01-01 00:00:00',
            '01/01/2000',
            '2000/01/01',
            '99-02-15',
            '2023-01-01',
            '1990-10-12',
            1425215164236,
        ])('should reject "%s"', (value) => {
            expect(validate(schema, value)).toMatchObject({isValid: false});
        });
    });
});
