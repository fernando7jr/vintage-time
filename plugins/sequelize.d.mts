import {DataTypes} from 'sequelize';

import {DateOnly} from '../date-only.mts';
import {DateTime} from '../date-time.mts';

/**
 * Get sequelize DATEONLY type properties
 * It includes getter and setter since DATEONLY in sequelize only accepts javascript Date objects but returns string on fetch
 * This function was created to address this inconsistency
 * @param propertyName the property name
 * @param strict defines whether or not to throw when the value is not an instance of DateOnly. Defaults to false
 * @returns the necessary sequelize configuration for the property to work with DATEONLY
 */
export function dateOnlyColumn(propertyName: string, strict?: boolean): {
    type: typeof DataTypes.DATEONLY,
    get(): DateOnly | null;
    set(value: any): void;
}

/**
 * Get sequelize DATETIME type properties
 * @param propertyName the property name
 * @param strict defines whether or not to throw when the value is not an instance of DateTime. Defaults to false
 * @returns the necessary sequelize configuration for the property to work with DATEONLY
 */
export function dateTimeColumn(propertyName: string, strict?: boolean): {
    type: typeof DataTypes.DATE,
    get(): DateTime | null;
    set(value: any): void;
};
