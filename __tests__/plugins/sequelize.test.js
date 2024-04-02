const {randomUUID} = require('crypto');
const {Sequelize, DataTypes} = require('sequelize');

const {DateOnly} = require('../../date-only.cjs');
const {DateTime} = require('../../date-time.cjs');
const {toDateOnly, toDateTime} = require('../../index.cjs');
const {dateOnlyColumn, dateTimeColumn} = require('../../plugins/sequelize.cjs');

describe('Date sequelize utils', () => {
    /** @typedef {{id: number; label: string; expiredAt?: DateOnly; storedAt: DateTime}} DateDummy */
    /** @typedef {Omit<DateDummy, 'id' | 'expiredAt' | 'storedAt'>} DateDummyCreationAttributes */
    /** @type {import('sequelize').ModelStatic<import('sequelize').Model<DateDummy, DateDummyCreationAttributes>>} */
    let model;
    /** @type {import('sequelize').ModelStatic<import('sequelize').Model<DateDummy, DateDummyCreationAttributes>>} */
    let modelStrict;
    /** @type {Sequelize} */
    let sequelize;
    beforeAll(async () => {
        sequelize = new Sequelize({
            dialect: 'sqlite',
            host: ':memory:',
            logging: false,
        });

        model = sequelize.define(
            'DateDummy',
            {
                id: {
                    type: DataTypes.SMALLINT,
                    autoIncrement: true,
                    primaryKey: true,
                },
                label: {
                    type: DataTypes.STRING(20),
                    allowNull: false,
                },
                expiredAt: {
                    ...dateOnlyColumn('expiredAt'),
                    allowNull: true,
                },
                storedAt: {
                    ...dateTimeColumn('storedAt'),
                    allowNull: false,
                    defaultValue: () => toDateTime.now(),
                },
            },
            {
                tableName: 'dummies',
                paranoid: false,
            }
        );

        modelStrict = sequelize.define(
            'DateDummy',
            {
                id: {
                    type: DataTypes.SMALLINT,
                    autoIncrement: true,
                    primaryKey: true,
                },
                label: {
                    type: DataTypes.STRING(20),
                    allowNull: false,
                },
                expiredAt: {
                    ...dateOnlyColumn('expiredAt', true),
                    allowNull: true,
                },
                storedAt: {
                    ...dateTimeColumn('storedAt', true),
                    allowNull: false,
                    defaultValue: () => toDateTime.now(),
                },
            },
            {
                tableName: 'dummies',
                paranoid: false,
            }
        );

        await sequelize.sync();
    });

    afterAll(async () => {
        await sequelize.close();
    });

    const getPlainObject = (d) => {
        if (!Array.isArray(d)) {
            return {label: d.label, expiredAt: d.expiredAt, storedAt: d.storedAt};
        }
        return d.map(({label, expiredAt, storedAt}) => ({label, expiredAt, storedAt}));
    };

    it('should create new dummy instances using DateTime and DateOnly values', async () => {
        const dateOnly = toDateOnly('2023-07-19');
        const dateTime = toDateTime('2022-11-29');

        const instances = await model.bulkCreate([
            {
                label: 'Test test #1',
                expiredAt: dateOnly,
                storedAt: dateTime,
            },
            {
                label: 'Test test #2',
                expiredAt: dateTime,
                storedAt: dateOnly,
            },
            {
                label: 'Test test #3',
                expiredAt: dateOnly,
                storedAt: dateOnly,
            },
            {
                label: 'Test test #4',
                expiredAt: dateTime,
                storedAt: dateTime,
            },
        ]);

        expect(getPlainObject(instances)).toEqual([
            {
                label: 'Test test #1',
                expiredAt: expect.dateOnly(dateOnly),
                storedAt: expect.dateTime(dateTime),
            },
            {
                label: 'Test test #2',
                expiredAt: expect.dateOnly(dateTime),
                storedAt: expect.dateTime(dateOnly),
            },
            {
                label: 'Test test #3',
                expiredAt: expect.dateOnly(dateOnly),
                storedAt: expect.dateTime(dateOnly),
            },
            {
                label: 'Test test #4',
                expiredAt: expect.dateOnly(dateTime),
                storedAt: expect.dateTime(dateTime),
            },
        ]);

        const [instance] = instances;
        expect(instance.storedAt).toBeInstanceOf(DateTime);
        expect(instance.expiredAt).toBeInstanceOf(DateOnly);
    });

    it('should update a dummy instances using DateTime and DateOnly values', async () => {
        const dateOnly = toDateOnly('2023-07-19');
        const dateTime = toDateTime('2022-11-29');

        const instance = await model.findOne();
        await instance.update({
            expiredAt: dateOnly.plus({days: 1}),
            storedAt: dateTime.plus({days: 1}),
        });
        expect(getPlainObject(instance)).toEqual({
            label: instance.label,
            expiredAt: expect.dateOnly(dateOnly.plus({days: 1})),
            storedAt: expect.dateTime(dateTime.plus({days: 1})),
        });
        let dbValue = await model.findOne({where: {id: instance.id}});
        expect(getPlainObject(dbValue)).toMatchObject({
            label: instance.label,
            expiredAt: expect.dateOnly(dateOnly.plus({day: 1})),
            storedAt: expect.dateTime(dateTime.plus({day: 1})),
        });

        instance.expiredAt = dateOnly.plus({days: 17});
        instance.storedAt = dateTime.minus({month: 1, year: 1});
        expect(getPlainObject(instance)).toEqual({
            label: instance.label,
            expiredAt: expect.dateOnly(dateOnly.plus({days: 17})),
            storedAt: expect.dateTime(dateTime.minus({month: 1, year: 1})),
        });
        await instance.save();
        dbValue = await model.findOne({where: {id: instance.id}});
        expect(getPlainObject(dbValue)).toEqual({
            label: instance.label,
            expiredAt: expect.dateOnly(dateOnly.plus({days: 17})),
            storedAt: expect.dateTime(dateTime.minus({month: 1, year: 1})),
        });
    });

    it('should query dummy using DateTime and DateOnly values', async () => {
        const label = randomUUID();
        const instances = await model.bulkCreate([
            {
                label,
                expiredAt: toDateOnly('2023-07-19'),
                storedAt: toDateTime('2022-11-29'),
            },
            {
                label,
                expiredAt: toDateOnly('2023-08-19'),
                storedAt: toDateTime('2022-10-29'),
            },
            {
                label,
                expiredAt: toDateOnly('2023-09-19'),
                storedAt: toDateTime('2022-09-29'),
            },
        ]);

        const expected = instances.slice(1).map((m) => ({
            label: m.label,
            expiredAt: expect.dateOnly(m.expiredAt),
            storedAt: expect.dateTime(m.storedAt),
        }));
        const result = await model.findAll({
            attributes: ['id', 'label', 'expiredAt', 'storedAt'],
            where: {
                label,
                expiredAt: {[Sequelize.Op.gt]: toDateOnly('2023-07-19')},
                storedAt: {[Sequelize.Op.lt]: toDateOnly('2022-11-29')},
            },
            order: [['id', 'ASC']],
        });
        expect(getPlainObject(result)).toEqual(expected);
    });

    it('should get and set properties to null or undefined', () => {
        const label = randomUUID();
        const instance = new model({
            label,
            expiredAt: toDateOnly('2023-07-19'),
            storedAt: toDateTime('2022-11-29'),
        });

        instance.expiredAt = null;
        expect(instance.expiredAt).toBeNull();
        instance.expiredAt = undefined;
        expect(instance.expiredAt).toBeNull();

        instance.storedAt = null;
        expect(instance.storedAt).toBeNull();
        instance.storedAt = undefined;
        expect(instance.storedAt).toBeNull();
    });

    it('should fail to set properties when date value is invalid', () => {
        const label = randomUUID();
        const instance = new model({
            label,
            expiredAt: toDateOnly('2023-07-19'),
            storedAt: toDateTime('2022-11-29'),
        });

        try {
            instance.expiredAt = Number.NaN;
            throw new Error('Should thrown an error');
        } catch (error) {
            expect(error).toBeInstanceOf(Error);
            expect(error.message).toBe('Can not set "Invalid date" to "expiredAt"');
        }

        try {
            instance.storedAt = Number.NaN;
            throw new Error('Should thrown an error');
        } catch (error) {
            expect(error).toBeInstanceOf(Error);
            expect(error.message).toBe('Can not set "Invalid date" to "storedAt"');
        }
    });

    it('should fail to set properties when type is unexpected', () => {
        const label = randomUUID();
        const instance = new modelStrict({
            label,
            expiredAt: toDateOnly('2023-07-19'),
            storedAt: toDateTime('2022-11-29'),
        });

        try {
            instance.expiredAt = instance.storedAt;
            throw new Error('Should thrown an error');
        } catch (error) {
            expect(error).toBeInstanceOf(Error);
            expect(error.message).toBe('Expected a DateOnly value for "expiredAt"');
        }

        try {
            instance.storedAt = instance.expiredAt;
            throw new Error('Should thrown an error');
        } catch (error) {
            expect(error).toBeInstanceOf(Error);
            expect(error.message).toBe('Expected a DateTime value for "storedAt"');
        }
    });
});
