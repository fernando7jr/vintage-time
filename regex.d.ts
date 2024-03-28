// /^\d{4}-\d{2}-\d{2}([ T](0\d|1\d|2[0-3]):[0-5]\d:[0-5]\d(\.\d{1,3})?([+-][0-1]\d:[0-5]\d|Z))?$/
export declare const ANY_DATE_REGEX: RegExp;
// /^\d{4}-\d{2}-\d{2}$/
export declare const DATE_ONLY_REGEX: RegExp;
// /^\d{4}-\d{2}-\d{2}[ T](0\d|1\d|2[0-3]):[0-5]\d:[0-5]\d(\.\d{1,3})?([+-][0-1]\d:[0-5]\d|Z)$/
export declare const DATE_TIME_REGEX: RegExp;
// /(0\d|1\d|2[0-3]):[0-5]\d:[0-5]\d(\.\d{1,3})?$/
export declare const TIME_WITHOUT_ZONE_REGEX: RegExp;
// /[+-][0-1]\d:[0-5]\d|Z$/
export declare const TIME_ZONE_REGEX: RegExp;

export function extractTimezoneOffset(value: string): string;
