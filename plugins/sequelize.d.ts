import {DataTypes} from 'sequelize';

import {DateTime, DateOnly} from '../index.cts';

export class DateOnlyDataType extends DataTypes.ABSTRACT {
    static readonly key: 'VINTAGE_DATEONLY';

    toSql(): string;

    stringify(date): string;
}

export class DateTimeDataType extends DataTypes.ABSTRACT {
    static readonly key: 'VINTAGE_DATETIME';

    toSql(): string;

    stringify(date): string;
}

/**
 * Get sequelize DATEONLY type properties
 * It includes getter and setter since DATEONLY in sequelize only accepts javascript Date objects but returns string on fetch
 * This function was created to address this inconsistency
 * @param propertyName the property name
 * @param strict defines whether or not to throw when the value is not an instance of DateOnly. Defaults to false
 * @returns the necessary sequelize configuration for the property to work with DATEONLY
 * @example
 * ````javascript
 * const {dateOnlyColumn} = require('vintage-time/plugins/sequelize');
 * const model = sequelize.define('DateDummy', {
 *         startDate: {
 *             ...dateOnlyColumn('startDate'),
 *             allowNull: true,
 *         },
 *     },
 *     {tableName: 'dummies'}
 * );
 * 
 * // ...
 * 
 * const entry = model.findOne();
 * console.log(entry.startDate instanceof DateOnly); // true
 * ````
 */
export function dateOnlyColumn(propertyName: string, strict?: boolean): {
    type: DateOnlyDataType,
    get(): DateOnly | null;
    set(value: any): void;
};

/**
 * Get sequelize DATETIME type properties
 * @param propertyName the property name
 * @param strict defines whether or not to throw when the value is not an instance of DateTime. Defaults to false
 * @returns the necessary sequelize configuration for the property to work with DATEONLY
 * @example
 * ````javascript
 * const {dateTimeColumn} = require('vintage-time/plugins/sequelize');
 * const model = sequelize.define('DateDummy', {
 *         archivedAt: {
 *             ...dateTimeColumn('archivedAt'),
 *             allowNull: false,
 *             defaultValue: () => toDateTime.now(),
 *         },
 *     },
 *     {tableName: 'dummies'}
 * );
 * 
 * // ...
 * 
 * const entry = model.findOne();
 * console.log(entry.archivedAt instanceof DateTime); // true
 * ````
 */
export function dateTimeColumn(propertyName: string, strict?: boolean): {
    type: DateTimeDataType,
    get(): DateTime | null;
    set(value: any): void;
};
