const {DataTypes} = require('sequelize');

const {DateOnly} = require('../date-only.cjs');
const {DateTime} = require('../date-time.cjs');

function dateOnlyColumnGetterSetter(propertyName, throwOnIncompatibleType) {
    return {
        get() {
            const value = this.getDataValue(propertyName);
            if (!value) return null;
            return DateOnly.fromAnyDate(value);
        },
        set(value) {
            if (value === null || value === undefined) {
                this.setDataValue(propertyName, null);
                return;
            }

            if (throwOnIncompatibleType && !DateOnly.isDateOnly(value)) {
                throw new Error(`Expected a DateOnly value for "${propertyName}"`);
            }

            const dateOnlyValue = DateOnly.fromAnyDate(value);
            if (dateOnlyValue === 'Invalid date') {
                throw new Error(`Can not set "Invalid date" to ${propertyName}`);
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
function dateOnlyColumn(propertyName, strict = false) {
    return {
        type: DataTypes.DATEONLY,
        ...dateOnlyColumnGetterSetter(propertyName, strict),
    };
}

function dateTimeColumnGetterSetter(propertyName, throwOnIncompatibleType) {
    return {
        get() {
            const value = this.getDataValue(propertyName);
            if (!value) return null;
            return DateTime.fromAnyDate(value);
        },
        set(value) {
            if (value === null || value === undefined) {
                this.setDataValue(propertyName, null);
                return;
            }

            if (throwOnIncompatibleType && !DateTime.isDateTime(value)) {
                throw new Error(`Expected a DateTime value for "${propertyName}"`);
            }

            const dateTimeValue = DateTime.fromAnyDate(value);
            if (dateTimeValue === 'Invalid date') {
                throw new Error(`Can not set "Invalid date" to ${propertyName}`);
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
function dateTimeColumn(propertyName, strict = false) {
    return {
        type: DataTypes.DATE,
        ...dateTimeColumnGetterSetter(propertyName, strict),
    };
}

module.exports = {dateOnlyColumn, dateTimeColumn};
