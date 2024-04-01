# vintage-time

[![npm version](https://badge.fury.io/js/vintage-time.svg)](https://badge.fury.io/js/vintage-time)[![codecov](https://codecov.io/gh/fernando7jr/vintage-time/graph/badge.svg?token=OPIEI5SPCJ)](https://codecov.io/gh/fernando7jr/vintage-time)![example workflow](https://github.com/fernando7jr/vintage-time/actions/workflows/node.js.yml/badge.svg)[![contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat)](https://github.com/dwyl/esta/issues)


DateTime x DateOnly library with locale support. Compatible with sequelize, joi, momentjs and plain javascript Dates

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
date = new Date({year: 2024, month: 1, day: 1});
dateOnly = toDateTime(date.getTime());
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
date = new Date({year: 2024, month: 1, day: 1});
dateTime = toDateTime(date.getTime());
console.log(dateTime.toString()); // logs: "2024-01-01"

// # Create from a plain objects specifying the date and time part:
date = new Date({year: 2024, month: 1, day: 1, hour: 22, second: 1, timezone: 'UTC'});
dateTime = toDateTime(date.getTime());
console.log(dateTime.toString()); // logs: "2024-01-01T22:00:01.000Z"

// # Create from a plain objects specifying the date and time part: (Ommiting timezone automatically picks the local system timezone)
date = new Date({year: 2024, month: 1, day: 1, hour: 22, second: 1});
dateTime = toDateTime(date.getTime());
console.log(dateTime.toString()); // logs: "2024-01-01T22:00:01.000" + localTimezoneOffset

// # Create from a plain objects specifying the date and time part: (Timezone offset can be used instead of a timezone name)
date = new Date({year: 2024, month: 1, day: 1, hour: 22, second: 1, offset: 7});
dateTime = toDateTime(date.getTime());
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

Shortcut for calling `DateTime.now()` which returns a DateTime instance from the *current system timestamp*.

````javascript
const dateTime = toDateTime.now(); // Simillar to: toDateTime(new Date())
````
