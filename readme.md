# vintage-time

[![npm version](https://badge.fury.io/js/vintage-time.svg)](https://badge.fury.io/js/vintage-time)
[![codecov](https://codecov.io/gh/fernando7jr/vintage-time/graph/badge.svg?token=OPIEI5SPCJ)](https://codecov.io/gh/fernando7jr/vintage-time)
![node test and build workflow](https://github.com/fernando7jr/vintage-time/actions/workflows/node.js.yml/badge.svg)
[![contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat)](https://github.com/dwyl/esta/issues)


DateTime x DateOnly library with locale support. Compatible with sequelize, joi and plain javascript Dates

Distributed through the [npm packge vintage-time](https://www.npmjs.com/vintage-time)

## Installation

`npm install vintage-time`

or 

`yarn add vintage-time`

## Usage

This library defines a clear separation between values that should be DateOnly and those that should be DateTime.

For this end, we have two distinc classes that are (kinda) compatible to each other:

* *DateOnly* - only stores the date part (year, month and day). It completly ignores the timezone.
* *DateTime* - stores date and time (year, month, day, hour, minute, second, millisecond, timezone).

Examples:
````javascript
const date = new Date('2024-01-01 12:44:00.567');

const dateOnly = DateOnly.fromJsDate(date);
console.log(dateOnly.toString()); // logs: "2024-01-01"

const dateTime = DateTime.fromJsDate(date);
console.log(dateTime.toString()); // logs: "2024-01-01T12:44:00.567" + localTimezoneOffset
````

### Simplified usage

The library ships a set of helper functions that automatically handle most scenarios and return the appropriate result.

#### toDateOnly

This method converts a date compatible value into a DateOnly instance. So it works out of the box with values like: numbers, Date, string, Moment, DateTime and DateOnly.

An alternative to this method is to call `DateOnly.fromAnyDate` directly which handles almost the same scenarios. Another one would be to call any of the specialized factory methods depending on the input.

````javascript
let date, dateOnly;

// # Create from a plain objects:
date = {year: 2024, month: 1, day: 1};
dateOnly = toDateTime(date);
console.log(dateOnly.toString()); // logs: "2024-01-01"

// # Create from a Date object:
date = new Date('2024-01-01 12:44:00.567');
dateOnly = toDateTime(date);
console.log(dateOnly.toString()); // logs: "2024-01-01"

// # Create from a numeric timestamp:
date = new Date('2024-01-01 12:44:00.567');
dateOnly = toDateTime(date.getTime());
console.log(dateOnly.toString()); // logs: "2024-01-01"

// # Create from a Moment object:
date = moment('2024-01-01 12:44:00.567');
const dateOnly = toDateTime(date);
console.log(dateOnly.toString()); // logs: "2024-01-01"

// # Create from a formatted date-time string:
date = '2024-01-01 12:44:00.567'; // '2024-01-01T12:44:00.567' also works!
dateOnly = toDateTime(date);
console.log(dateOnly.toString()); // logs: "2024-01-01"

// # Create from a formatted date-only string:
date = '2024-01-10';
dateOnly = toDateTime(date);
console.log(dateOnly.toString()); // logs: "2024-01-10"

// # Create from a formatted date-time string: (Notice that the timezone is ignored when working with DateOnly)
date = '2024-01-01 12:44:00.567Z'; // '2024-01-01T12:44:00.567Z' also works!
dateOnly = toDateTime(date);
console.log(dateOnly.toString()); // logs: "2024-01-01"
date = '2024-01-01 12:44:00.567-10:00'; // '2024-01-01T12:44:00.567Z' also works!
dateOnly = toDateTime(date);
console.log(dateOnly.toString()); // logs: "2024-01-01"
date = '2024-01-01 12:44:00.567+10:00'; // '2024-01-01T12:44:00.567Z' also works!
dateOnly = toDateTime(date);
console.log(dateOnly.toString()); // logs: "2024-01-01"
````

Calling the method with null or undefined will always return undefined

#### toDateOnly.now

Shortcut for calling `DateOnly.now()` which returns a DateOnly instance from the *current system timestamp*.

````javascript
const dateOnly = toDateTime.now(); // Simillar to: toDateTime(new Date())
````

#### toDateTime

This method converts a date compatible value into a DateOnly instance. So it works out of the box with values like: numbers, Date, string, Moment, DateTime and DateOnly.

An alternative to this method is to call `DateOnly.fromAnyDate` directly which handles almost the same scenarios. Another one would be to call any of the specialized factory methods depending on the input.

````javascript
let date, dateTime;

// # Create from a plain objects specifying only the date part:
date = {year: 2024, month: 1, day: 1};
dateTime = toDateTime(date);
console.log(dateTime.toString()); // logs: "2024-01-01"

// # Create from a plain objects specifying the date and time part:
date = {year: 2024, month: 1, day: 1, hour: 22, second: 1, timezone: 'UTC'};
dateTime = toDateTime(date);
console.log(dateTime.toString()); // logs: "2024-01-01T22:00:01.000Z"

// # Create from a plain objects specifying the date and time part: (Ommiting timezone automatically picks the local system timezone)
date = {year: 2024, month: 1, day: 1, hour: 22, second: 1};
dateTime = toDateTime(date);
console.log(dateTime.toString()); // logs: "2024-01-01T22:00:01.000" + localTimezoneOffset

// # Create from a plain objects specifying the date and time part: (Timezone offset can be used instead of a timezone name)
date = {year: 2024, month: 1, day: 1, hour: 22, second: 1, offset: 7};
dateTime = toDateTime(date);
console.log(dateTime.toString()); // logs: "2024-01-01T22:00:01.000+07:00"

// # Create from a Date object:
date = new Date('2024-01-01 12:44:00.567');
dateTime = toDateTime(date);
console.log(dateTime.toString()); // logs: "2024-01-01T12:44:00.567" + localTimezoneOffset

// # Create from a numeric timestamp:
date = new Date('2024-01-01 12:44:00.567');
dateTime = toDateTime(date.getTime());
console.log(dateTime.toString()); // logs: "2024-01-01T12:44:00.567" + localTimezoneOffset

// # Create from a Moment object:
date = moment('2024-01-01 12:44:00.567');
const dateTime = toDateTime(date);
console.log(dateTime.toString()); // logs: "2024-01-01T12:44:00.567" + localTimezoneOffset

// # Create from a formatted date-time string:
date = '2024-01-01 12:44:00.567'; // '2024-01-01T12:44:00.567' also works!
dateTime = toDateTime(date);
console.log(dateTime.toString()); // logs: "2024-01-01T12:44:00.567" + localTimezoneOffset

// # Create from a formatted date-only string: (DateOnly instances are always treated as UTC dates)
date = '2024-01-10';
dateTime = toDateTime(date);
console.log(dateTime.toString()); // logs: "2024-01-10T00:00:00.000Z"

// # Create from a formatted date-time string: (The original timezone in the string is used)
date = '2024-01-01 12:44:00.567Z'; // '2024-01-01T12:44:00.567Z' also works!
dateTime = toDateTime(date);
console.log(dateOnly.toString()); // logs: "2024-01-01T12:44:00.567Z"
date = '2024-01-01 12:44:00.567-10:00'; // '2024-01-01T12:44:00.567Z' also works!
dateTime = toDateTime(date);
console.log(dateOnly.toString()); // logs: "2024-01-01T12:44:00.567-10:00"
date = '2024-01-01 12:44:00.567+10:00'; // '2024-01-01T12:44:00.567Z' also works!
dateTime = toDateTime(date);
console.log(dateOnly.toString()); // logs: "2024-01-01T12:44:00.567+10:00"
````

Calling the method with null or undefined will always return undefined

#### toDateTime.now

Shortcut for calling `DateTime.now(locale)` which returns a DateTime instance from the *current system timestamp*.

````javascript
const dateTime = toDateTime.now(); // Simillar to: toDateTime(new Date())
````

#### toDateTime.tz

Shortcut for calling `toDateTime(anyDate, locale).toTimezone(tz)` which returns a DateTime instance at a specific timezone.

````javascript
const dateTime = toDateTime.tz('2023-12-31', 'Asia/Jakarta'); // Change the TZ from UTC to +07:00
console.log(dateTime.toISOString(false)); // Output "2023-12-31T07:00:00.000+07:00"
````

#### toDateTime.as

It changes the timezone of the date-time but keeps the original date and time values:

- year
- month
- day
- hour
- minutes
- second
- millisecond

````javascript
let dateTime = toDateTime.tz('2023-12-31', 'Asia/Jakarta'); // Change the TZ from UTC to +07:00 (shift the offset to the new timezone)
console.log(dateTime.toISOString(false)); // Output "2023-12-31T07:00:00.000+07:00"
console.log(dateTime.toISOString(true)); // Output "2023-12-31T07:00:00.000+07:00"

DateTime.isEqual(dateTime, '2023-12-31'); // true

dateTime = toDateTime.as('2023-12-31', 'Asia/Jakarta'); // Change the TZ from UTC to +07:00 keeping the original date and time values
console.log(dateTime.toISOString(false)); // Output "2023-12-31T00:00:00.000+07:00"
console.log(dateTime.toISOString(true)); // Output "2023-12-30T17:00:00.000Z"

DateTime.isEqual(dateTime, '2023-12-31'); // false
````

### Comparing dates

The best approach is to use the built-in methods which check equality properly and convert all values to the proper date class.

* isEqual - checks equality between dates (`===` using `valueOf()`)
* isBefore - checks dateA < dateB
* isAfter - checks dateA > dateB
* isEqualBefore - checks dateA <= dateB
* isEqualAfter - checks dateA >= dateB

````javascript
const dateTimeA = toDateTime('2024-01-01T12:44:00.567Z');
const dateTimeB = toDateTime('2024-01-02T07:33:51.120-03:00');
const dateOnlyA = toDateOnly(toDateTime);
const dateOnlyB = toDateOnly(toDateTime);

// Use DateTime for comparing dates for both their date and time values
console.log(DateTime.isEqual(dateOnlyA, dateOnlyA)); // true
console.log(DateTime.isEqual(dateTimeA, dateTimeA)); // true
console.log(DateTime.isEqual(dateOnlyA, dateTimeA)); // false
console.log(DateTime.isEqual(dateTimeA, dateOnlyA)); // false
console.log(DateTime.isEqual(dateOnlyA, dateOnlyB)); // false
console.log(DateTime.isEqualOrBefore(dateOnlyA, dateOnlyB)); // true
console.log(DateTime.isBefore(dateOnlyA, dateOnlyB)); // true
console.log(DateTime.isEqualOrAfter(dateOnlyA, dateOnlyB)); // false
console.log(DateTime.isAfter(dateOnlyA, dateOnlyB)); // false

// Use DateOnly when time does not matter and you only want to check the date parts
console.log(DateOnly.isEqual(dateOnlyA, dateOnlyA)); // true
console.log(DateOnly.isEqual(dateTimeA, dateTimeA)); // true
console.log(DateOnly.isEqual(dateOnlyA, dateTimeA)); // true
console.log(DateOnly.isEqual(dateTimeA, dateOnlyA)); // true
console.log(DateOnly.isEqual(dateOnlyA, dateOnlyB)); // false
console.log(DateOnly.isEqualOrBefore(dateOnlyA, dateOnlyB)); // true
console.log(DateOnly.isBefore(dateOnlyA, dateOnlyB)); // true
console.log(DateOnly.isEqualOrAfter(dateOnlyA, dateOnlyB)); // false
console.log(DateOnly.isAfter(dateOnlyA, dateOnlyB)); // false
````

Still, it also works through the method `valueOf`. It implicitly works as long as both sides of the operator are values of the same type. In the other situations an explicitly call is necessary.

````javascript
const dateTimeA = toDateTime('2024-01-01T12:44:00.567Z');
const dateTimeB = toDateTime('2024-01-02T07:33:51.120-03:00');

console.log(dateTimeA < dateTimeB); // true
console.log(dateTimeA <= dateTimeB); // true
console.log(dateTimeA > dateTimeB); // false
console.log(dateTimeA >= dateTimeB); // false

// Equality - Note that we explicitly use `.valueOf()` here to avoid comparing by reference
console.log(dateTimeA.valueOf() === toDateOnly(dateTimeA).valueOf()); // true
console.log(dateTimeA.valueOf() !== dateTimeB.valueOf()); // true
console.log(dateTimeA.valueOf() !== dateTimeA.valueOf()); // false

const dateOnlyA = toDateOnly(toDateTime);
const dateOnlyB = toDateOnly(toDateTime);

console.log(dateOnlyA < dateOnlyB); // true
console.log(dateOnlyA <= dateOnlyB); // true
console.log(dateOnlyA > dateOnlyB); // false
console.log(dateOnlyA >= dateOnlyB); // false

// Equality - Note that we explicitly use `.valueOf()` here to avoid comparing by reference
console.log(dateOnlyA.valueOf() === toDateOnly(dateTimeA).valueOf()); // true
console.log(dateOnlyA.valueOf() !== dateOnlyB.valueOf()); // true
console.log(dateOnlyA.valueOf() !== dateOnlyA.valueOf()); // false
// 
````

## Plugins

### Sequelize

`vintage-time` requires sequelize `6.x` installed. Please make sure to have it installed in order to work.

*Even without using the plugin, sequelize already accepts both `DateOnly` and `DateTime` for queries.*

Since sequeize only supports JS natve Dates, we need to define getters and setters to our Date properties in order to use a different class.
This plugin offers two built-in methods to define the getters and setters.

#### dateOnlyColumn

````typescript
function dateOnlyColumn(propertyName: string, strict?: boolean): {
    type: typeof DataTypes.DATEONLY,
    get(): DateOnly | null;
    set(value: any): void;
};
````

Used to defined a `DateOnly` column (sequelize type **DATEONLY**).

````javascript
const {dateOnlyColumn} = require('vintage-time/plugins/sequelize');
const model = sequelize.define('DateDummy', {
        startDate: {
            ...dateOnlyColumn('startDate'),
            allowNull: true,
        },
    },
    {tableName: 'dummies'}
);

// ...

const entry = model.findOne();
console.log(entry.startDate instanceof DateOnly); // true
````

The parameter `strict` when `true` enforces that the setter should only accept DateOnly instances. Otherwise when `false` it attempts to convert any value to a `DateOnly` instance.

#### dateTimeColumn

````typescript
function dateTimeColumn(propertyName: string, strict?: boolean): {
    type: typeof DataTypes.DATEO,
    get(): DateTime | null;
    set(value: any): void;
};
````

Used to defined a `DateTime` column (sequelize type **DATE**).

````javascript
const {dateTimeColumn} = require('vintage-time/plugins/sequelize');
const model = sequelize.define('DateDummy', {
        archivedAt: {
            ...dateTimeColumn('archivedAt'),
            allowNull: false,
            defaultValue: () => toDateTime.now(),
        },
    },
    {tableName: 'dummies'}
);

// ...

const entry = model.findOne();
console.log(entry.archivedAt instanceof DateTime); // true
````

The parameter `strict` when `true` enforces that the setter should only accept DateOnly instances. Otherwise when `false` it attempts to convert any value to a `DateTime` instance.

### Joi

`vintage-time` requires joi `17.x` installed. Please make sure to have it installed in order to work.

The plugin exposes a set of validators to be used together with Joi validation schemas.

#### anyDate

Accepts both `DateOnl`y and `DateTime` compatible strings.
Unless it is set to `raw()`, the validator outputs a `DateTime` instance.

````javascript
const {anyDate} = require('vintage-time/plugins/joi');
joi = joi.extend(anyDate);

const schema = joi.object().keys({date: joi.anyDate()});
// These are valid strings
schema.validate({date: '2020-07-19'});
schema.validate({date: '2020-07-19 00:00:00.000Z'});
schema.validate({date: '2020-07-19 00:00:00Z'});
schema.validate({date: '2020-07-19 00:00:00-03:00'});
schema.validate({date: '2020-07-19 01:20:03'});
schema.validate({date: '2020-07-19 01:20:03.657Z'});
schema.validate({date: '2020-07-19T00:00:00Z'});
schema.validate({date: '2020-07-19T00:00:00-03:00'});
schema.validate({date: '2020-07-19T01:20:03'});
schema.validate({date: '2020-07-19T01:20:03.657Z'});

// These are not
schema.validate({date: '07/19/2020'});
schema.validate({date: '2020/07/19'});
schema.validate({date: '01:20:03.657Z'});
schema.validate({date: '2020/07/19 at 3:00 PM'});
````

#### dateOnly

Accepts `DateOnly` compatible strings.
Unless it is set to `raw()`, the validator outputs a `DateOnly` instance.

````javascript
const {dateOnly} = require('vintage-time/plugins/joi');
joi = joi.extend(dateOnly);

const schema = joi.object().keys({date: joi.dateOnly()});
// These are valid strings
schema.validate({date: '2020-07-19'});
schema.validate({date: '1990-01-11'});

// These are not
schema.validate({date: '2020-07-19 00:00:00Z'});
schema.validate({date: '2020-07-19 00:00:00-03:00'});
schema.validate({date: '2020-07-19 01:20:03'});
schema.validate({date: '2020-07-19 01:20:03.657Z'});
schema.validate({date: '2020-07-19T01:20:03'});
schema.validate({date: '2020-07-19T01:20:03.657Z'});
schema.validate({date: '2020-07-19T00:00:00Z'});
schema.validate({date: '2020-07-19T00:00:00-03:00'});
schema.validate({date: '07/19/2020'});
schema.validate({date: '2020/07/19'});
schema.validate({date: '01:20:03.657Z'});
schema.validate({date: '2020/07/19 at 3:00 PM'});
````

#### dateTime

Accepts `DateTime` compatible strings.
Unless it is set to `raw()`, the validator outputs a `DateTime` instance.

````javascript
const {dateTime} = require('vintage-time/plugins/joi');
joi = joi.extend(dateTime);

const schema = joi.object().keys({date: joi.dateTime()});
// These are valid strings
schema.validate({date: '2020-07-19 00:00:00.000Z'});
schema.validate({date: '2020-07-19 00:00:00Z'});
schema.validate({date: '2020-07-19 00:00:00-03:00'});
schema.validate({date: '2020-07-19 01:20:03'});
schema.validate({date: '2020-07-19 01:20:03.657Z'});
schema.validate({date: '2020-07-19T00:00:00Z'});
schema.validate({date: '2020-07-19T00:00:00-03:00'});
schema.validate({date: '2020-07-19T01:20:03'});
schema.validate({date: '2020-07-19T01:20:03.657Z'});

// These are not
schema.validate({date: '2020-07-19'});
schema.validate({date: '1990-01-11'});
schema.validate({date: '07/19/2020'});
schema.validate({date: '2020/07/19'});
schema.validate({date: '01:20:03.657Z'});
schema.validate({date: '2020/07/19 at 3:00 PM'});
````
