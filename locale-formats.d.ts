export enum LOCALE_FORMATS {
    /** example for English `8:30 PM` */
    TIME_ONLY = 'LT',
    /** example for English `8:30:25 PM` */
    TIME_WITH_SECONDS = 'LTS',
    /** example for English `9/4/1986` */
    NUMERAL_DATE_SHORT = 'l',
    /** example for English `09/04/1986` */
    NUMERAL_DATE_LONG = 'L',
    /** example for English `Sep 4, 1986` */
    VERBAL_DATE_SHORT = 'll',
    /** example for English `September 4, 1986` */
    VERBAL_DATE_LONG = 'LL',
    /** example for English `Sep 4, 1986 8:30 PM` */
    VERBAL_DATE_TIME_SHORT = 'lll',
    /** example for English `September 4, 1986 8:30 PM` */
    VERBAL_DATE_TIME_LONG = 'LLL',
    /** example for English `Thu, Sep 4, 1986 8:30 PM` */
    VERBAL_DATE_TIME_WEEKDAY_SHORT = 'llll',
    /** example for English `Thursday, September 4, 1986 8:30 PM` */
    VERBAL_DATE_TIME_WEEKDAY_LONG = 'LLLL',
}
