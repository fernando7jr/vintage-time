const {DataTypes, Utils} = require('sequelize');
const {SequelizeMethod} = require('sequelize/lib/utils');

const {DateOnly, DateTime, toDateOnly, toDateTime, isDateValid} = require('../index.cjs');

/** @returns {value is SequelizeMethod} */
function isSequelizeMethod(value) {
    return value instanceof SequelizeMethod;
}
class DateOnlyDataType extends DataTypes.ABSTRACT.prototype.constructor {
    static get key() {
        return 'VINTAGE_DATETIME'
    }

    constructor(...args) {
        super(...args);
    }

    toSql() {
        return DataTypes.DATEONLY.prototype.toSql.call(this);
    }

    _stringify(date) {
        return toDateOnly(date).toJSON();
    }
}

class DateTimeDataType extends DataTypes.ABSTRACT.prototype.constructor {
    static get key() {
        return 'VINTAGE_DATETIME'
    }

    constructor(...args) {
        super(...args);
    }

    toSql() {
        return DataTypes.DATE.prototype.toSql.call(this);
    }

    _stringify(date) {
        return toDateTime(date).toJSON().replace(/Z$/, '+00:00');
    }
}

if (!DataTypes.VINTAGE_DATEONLY) {
    DataTypes.VINTAGE_DATEONLY = Utils.classToInvokable(DateOnlyDataType);
    DataTypes.VINTAGE_DATEONLY.prototype.key = DataTypes.VINTAGE_DATEONLY.key;
    DataTypes.VINTAGE_DATEONLY.types = DataTypes.DATEONLY.types;
    Object.keys(DataTypes.VINTAGE_DATEONLY.types).forEach(type => {
        const typeImplementations = DataTypes[type];
        typeImplementations.VINTAGE_DATEONLY = Utils.classToInvokable(class extends DateOnlyDataType {
            constructor(...args) {
                super(...args);
            }

            toSql() {
                return typeImplementations.DATEONLY.prototype.toSql.call(this);
            }
        });
    });
}
if (!DataTypes.VINTAGE_DATETIME) {
    DataTypes.VINTAGE_DATETIME = Utils.classToInvokable(DateTimeDataType);
    DataTypes.VINTAGE_DATETIME.prototype.key = DataTypes.VINTAGE_DATETIME.key;
    DataTypes.VINTAGE_DATETIME.types = DataTypes.DATE.types;
    Object.keys(DataTypes.VINTAGE_DATETIME.types).forEach(type => {
        const typeImplementations = DataTypes[type];
        typeImplementations.VINTAGE_DATETIME = Utils.classToInvokable(class extends DateTimeDataType {
            constructor(...args) {
                super(...args);
            }

            toSql() {
                return typeImplementations.DATE.prototype.toSql.call(this);
            }
        });
    });
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

            const dateOnlyValue = toDateOnly(value);
            if (!isDateValid(dateOnlyValue)) {
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
function dateOnlyColumn(propertyName, strict = false) {
    return {
        type: DateOnlyDataType,
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

            const dateTimeValue = toDateTime(value);
            if (!isDateValid(dateTimeValue)) {
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
function dateTimeColumn(propertyName, strict = false) {
    return {
        type: DateTimeDataType,
        ...dateTimeColumnGetterSetter(propertyName, strict),
    };
}

module.exports = {dateOnlyColumn, dateTimeColumn, DateOnlyDataType, DateTimeDataType};
