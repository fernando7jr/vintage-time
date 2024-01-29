/**
 * Standard locale formats
 * @readonly
 * @enum {string}
 *
 * List of common locales:
 * af = Afrikaans
 * ar-dz = Arabic (Algeria)
 * ar-kw = Arabic (Kuwait)
 * ar-ly = Arabic (Libya)
 * ar-ma = Arabic (Morocco)
 * ar-sa = Arabic (Saudi Arabia)
 * ar-tn = Arabic (Tunisia)
 * ar = Arabic
 * az = Azerbaijani
 * be = Belarusian
 * bg = Bulgarian
 * bm = Bambara
 * bn = Bengali
 * bo = Tibetan
 * br = Breton
 * bs = Bosnian
 * ca = Catalan
 * cs = Czech
 * cv = Chuvash
 * cy = Welsh
 * da = Danish
 * de-at = German (Austria)
 * de-ch = German (Switzerland)
 * de = German
 * dv = Divehi
 * el = Greek
 * en-au = English (Australia)
 * en-ca = English (Canada)
 * en-gb = English (United Kingdom)
 * en-ie = English (Ireland)
 * en-nz = English (New Zealand)
 * eo = Esperanto
 * es-do = Spanish (Dominican Republic)
 * es-us = Spanish (United States)
 * es = Spanish
 * et = Estonian
 * eu = Basque
 * fa = Persian
 * fi = Finnish
 * fo = Faroese
 * fr-ca = French (Canada)
 * fr-ch = French (Switzerland)
 * fr = French
 * fy = Western Frisian
 * gd = Scottish Gaelic
 * gl = Galician
 * gom-latn = gom (Latin)
 * gu = Gujarati
 * he = Hebrew
 * hi = Hindi
 * hr = Croatian
 * hu = Hungarian
 * hy-am = Armenian (Armenia)
 * id = Indonesian
 * is = Icelandic
 * it = Italian
 * ja = Japanese
 * jv = Javanese
 * ka = Georgian
 * kk = Kazakh
 * km = Khmer
 * kn = Kannada
 * ko = Korean
 * ky = Kirghiz
 * lb = Luxembourgish
 * lo = Lao
 * lt = Lithuanian
 * lv = Latvian
 * me = me
 * mi = Maori
 * mk = Macedonian
 * ml = Malayalam
 * mr = Marathi
 * ms-my = Malay (Malaysia)
 * ms = Malay
 * mt = Maltese
 * my = Burmese
 * nb = Norwegian Bokmål
 * ne = Nepali
 * nl-be = Dutch (Belgium)
 * nl = Dutch
 * nn = Norwegian Nynorsk
 * pa-in = Punjabi (India)
 * pl = Polish
 * pt-br = Portuguese (Brazil)
 * pt = Portuguese
 * ro = Romanian
 * ru = Russian
 * sd = Sindhi
 * se = Northern Sami
 * si = Sinhala
 * sk = Slovak
 * sl = Slovenian
 * sq = Albanian
 * sr-cyrl = Serbian (Cyrillic)
 * sr = Serbian
 * ss = Swati
 * sv = Swedish
 * sw = Swahili
 * ta = Tamil
 * te = Telugu
 * tet = Tetum
 * th = Thai
 * tl-ph = Tagalog (Philippines)
 * tlh = Klingon
 * tr = Turkish
 * tzl = tzl
 * tzm-latn = tzm (Latin)
 * tzm = tzm
 * uk = Ukrainian
 * ur = Urdu
 * uz-latn = Uzbek (Latin)
 * uz = Uzbek
 * vi = Vietnamese
 * x-pseudo = x-pseudo
 * yo = Yoruba
 * zh-cn = Chinese (China)
 * zh-hk = Chinese (Hong Kong SAR China)
 * zh-tw = Chinese (Taiwan)
 */
export const LOCALE_FORMATS = {
    /** example for English `8:30 PM` */
    TIME_ONLY: 'LT',
    /** example for English `8:30:25 PM` */
    TIME_WITH_SECONDS: 'LTS',
    /** example for English `9/4/1986` */
    NUMERAL_DATE_SHORT: 'l',
    /** example for English `09/04/1986` */
    NUMERAL_DATE_LONG: 'L',
    /** example for English `Sep 4, 1986` */
    VERBAL_DATE_SHORT: 'll',
    /** example for English `September 4, 1986` */
    VERBAL_DATE_LONG: 'LL',
    /** example for English `Sep 4, 1986 8:30 PM` */
    VERBAL_DATE_TIME_SHORT: 'lll',
    /** example for English `September 4, 1986 8:30 PM` */
    VERBAL_DATE_TIME_LONG: 'LLL',
    /** example for English `Thu, Sep 4, 1986 8:30 PM` */
    VERBAL_DATE_TIME_WEEKDAY_SHORT: 'llll',
    /** example for English `Thursday, September 4, 1986 8:30 PM` */
    VERBAL_DATE_TIME_WEEKDAY_LONG: 'LLLL',
};
