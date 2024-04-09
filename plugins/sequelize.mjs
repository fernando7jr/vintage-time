import {DataTypes} from 'sequelize';
import {SequelizeMethod} from 'sequelize/lib/utils';

import {DateOnly} from '../date-only.mjs';
import {DateTime} from '../date-time.mjs';

/** @returns {value is SequelizeMethod} */
function isSequelizeMethod(value) {
    return value instanceof SequelizeMethod;
}

function dateOnlyColumnGetterSetter(propertyName, throwOnIncompatibleType) {
    return {
        get() {
            const value = this.getDataValue(propertyName);

            if (isSequelizeMethod(value)) return value;
            else if (!value) return null;

            return DateOnly.fromAnyDate(value);
        },
        set(value) {
            if (isSequelizeMethod(value)) {
                return;
            } else if (value === null || value === undefined) {
                this.setDataValue(propertyName, null);
                return;
            }

            if (throwOnIncompatibleType && !DateOnly.isDateOnly(value)) {
                throw new Error(`Expected a DateOnly value for "${propertyName}"`);
            }

            const dateOnlyValue = DateOnly.fromAnyDate(value);
            if (!dateOnlyValue.isValid) {
                throw new Error(`Can not set "Invalid date" to "${propertyName}"`);
            } else {
                this.setDataValue(propertyName, dateOnlyValue.toJSON());
            }
        },
    };
}

/**
 * Get sequelize DATEONLY type properties
 * It includes getter and setter since DATEONLY in sequelize only accepts javascript Date objects but returns string on fetch
 * This function was created to address this inconsistency
 * @param {string} propertyName the property name
 * @param {boolean} strict defines whether or not to throw when the value is not an instance of DateOnly
 * @returns the necessary sequelize configuration for the property to work with DATEONLY
 */
export function dateOnlyColumn(propertyName, strict = false) {
    return {
        type: DataTypes.DATEONLY,
        ...dateOnlyColumnGetterSetter(propertyName, strict),
    };
}

function dateTimeColumnGetterSetter(propertyName, throwOnIncompatibleType) {
    return {
        get() {
            const value = this.getDataValue(propertyName);
            
            if (isSequelizeMethod(value)) return value;
            else if (!value) return null;

            return DateTime.fromAnyDate(value);
        },
        set(value) {
            if (isSequelizeMethod(value)) {
                return;
            } else if (value === null || value === undefined) {
                this.setDataValue(propertyName, null);
                return;
            }

            if (throwOnIncompatibleType && !DateTime.isDateTime(value)) {
                throw new Error(`Expected a DateTime value for "${propertyName}"`);
            }

            const dateTimeValue = DateTime.fromAnyDate(value);
            if (!dateTimeValue.isValid) {
                throw new Error(`Can not set "Invalid date" to "${propertyName}"`);
            } else {
                this.setDataValue(propertyName, dateTimeValue.toJSON());
            }
        },
    };
}

/**
 * Get sequelize DATETIME type properties
 * @param {string} propertyName the property name
 * @param {boolean} strict defines whether or not to throw when the value is not an instance of DateTime
 * @returns the necessary sequelize configuration for the property to work with DATEONLY
 */
export function dateTimeColumn(propertyName, strict = false) {
    return {
        type: DataTypes.DATE,
        ...dateTimeColumnGetterSetter(propertyName, strict),
    };
}
