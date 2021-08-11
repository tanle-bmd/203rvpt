import moment from 'moment';
import 'moment/locale/vi'
import config from '../../config';
import md5 from 'md5';
moment.locale('vi')
const SECONDS_IN_A_DAY = 60 * 60 * 24
/**
 * ==============================================================================
 * ====================================STRING====================================
 * ==============================================================================
 */

/**
 * Capitalizes the first letter of a string.
 * Example: capitalize('fooBar');       // 'FooBar'
 *          capitalize('fooBar', true); // 'Foobar'
 */
export const capitalize = ([first, ...rest]: string, lowerRest = false) =>
    first.toUpperCase() + (lowerRest ? rest.join('').toLowerCase() : rest.join(''));


/**
 * Capitalizes the first letter of a string.
 * Example: capitalize('fooBar');       // 'FooBar'
 *          capitalize('fooBar', true); // 'Foobar'
 */
export const isNumberPhoneVN = (phone: string) => {
    if (!phone || phone.length != 10) return false
    const regex = /((03|04|05|07|08|09)+([0-9]{8})\b)/g
    return regex.test(phone)
}


/**
 * Capitalizes the first letter of every word in a string.
 * Example: capitalizeEveryWord('hello world!'); // 'Hello World!'
 */
export const capitalizeEveryWord = (str: string) => str.replace(/\b[a-z]/g, char => char.toUpperCase());

/**
 * Converts a string to camelcase.
 * Example: toCamelCase('some_database_field_name');                              // 'someDatabaseFieldName'
 *          toCamelCase('Some label that needs to be camelized');                 // 'someLabelThatNeedsToBeCamelized'
 *          toCamelCase('some-javascript-property');                              // 'someJavascriptProperty'
 *          toCamelCase('some-mixed_string with spaces_underscores-and-hyphens'); // 'someMixedStringWithSpacesUnderscoresAndHyphens
 */
export const toCamelCase = (str: string) => {
    let s =
        str &&
        str
            .match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
            .map(x => x.slice(0, 1).toUpperCase() + x.slice(1).toLowerCase())
            .join('');
    return s.slice(0, 1).toLowerCase() + s.slice(1);
};

/**
 * Replaces all but the last num of characters with the specified mask character.
 * Example: mask(1234567890);           // '******7890'
 *          mask(1234567890, 3);        // '*******890'
 *          mask(1234567890, -4, '$');  // '$$$$567890'
 */
export const mask = (cc: string, num = 4, mask = '*') => `${cc}`.slice(-num).padStart(`${cc}`.length, mask);

/**
 * Format number to VND.
 * Example: formatVND(10000);           // '10.000'
 */
export function formatVND(num: number) {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')
}

/**
 * Format number to VND.
 * Example: randomString(6);           // 'bmakcn'
 * Example: randomString(7);           // 'kjskcnd'
 */
export const randomString = (length: number) => Math.random().toString(36).substring(length);

export function convertCityToSlug(str: string) {
    str = str
        .replace(/city/g, "")
        .replace("Thành phố", "")
        .trim()
        .toLowerCase()
    console.log('str:', str)
    return toSlug(str)
}

export function toSlug(str: string, separator: string = "") {
    str = str
        .toLowerCase()
        .replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a")
        .replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e")
        .replace(/ì|í|ị|ỉ|ĩ/g, "i")
        .replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o")
        .replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u")
        .replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y")
        .replace(/đ/g, "d")
        .replace(/\s+/g, "-")
        .replace(/[^A-Za-z0-9_-]/g, "")
        .replace(/-+/g, "-");
    if (separator) {
        return str.replace(/-/g, separator);
    }
    return str;
}

export const randomCode = (length: number) => md5(`${moment().valueOf()}`).substring(0, length).toUpperCase()

/**
 * ==============================================================================
 * ====================================OBJECT====================================
 * ==============================================================================
 */

/**
 * Check if object if empty
 * Example: isEmptyObject({})      // true
 *          isEmptyObject({a: 1})  // false
 */
export function isEmptyObject(object: Object): boolean {
    if (typeof object !== "object") return false
    if (!object) return false
    return !!Object.keys(object).length
}

/**
 * Picks the key-value pairs corresponding to the given keys from an object.
 * Example: pick({ a: 1, b: '2', c: 3 }, ['a', 'c']); // { 'a': 1, 'c': 3 }
 */
const pick = (obj: any, arr: string[]) =>
    arr.reduce((acc, curr) => (curr in obj && (acc[curr] = obj[curr]), acc), {});

/**
 * ==============================================================================
 * ====================================TIME====================================
 * ==============================================================================
 */
export function convertHHMMToNumber(text: string): { minute: number, hour: number } {
    const hour = 0
    const minute = 0

    if (!text || !text.includes(':')) {
        return { hour: 0, minute: 0 }
    }

    const [hourText, minuteText] = text.split(':')
    return { hour: +hourText, minute: +minuteText }
}

export function getCurrentDateMMYY(): string {
    return moment().format('MMYY')
}

export function getCurrentDateDDMMYY(): string {
    return moment().format('DDMMYY')
}

export function getCurrentTimeInt(): number {
    return +(moment().valueOf() / 1000).toFixed()
}

export function getMonthInterval(date: Date) {
    let start = moment(date).startOf("months")
    let end = start.clone().add(1, "months")
    return {
        start: start.valueOf() / 1000,
        end: end.valueOf() / 1000
    }
}

export function convertFullDateToInt(date: Date): { start: number, end: number } {
    let time = +(date.getTime() / 1000).toFixed()
    let start = Math.round(time / SECONDS_IN_A_DAY) * SECONDS_IN_A_DAY
    return {
        start,
        end: start + SECONDS_IN_A_DAY
    }
}

export function convertIntToDDMMYY(int: number): string {
    return moment(int * 1000).format('DD/MM/YYYY')
}

export function convertIntToddddDDMMYY(int: number): string {
    return moment(int * 1000).locale('vi').format('dddd, DD/MM/YYYY')
}

export function convertDateToInt(date: Date): number {
    let time = +(date.getTime() / 1000).toFixed()
    return time * SECONDS_IN_A_DAY / SECONDS_IN_A_DAY
}

export function getMomentByDate(date: Date = new Date()): moment.Moment {
    return moment(date)
}

export function getMomentToday(): moment.Moment {
    return moment().startOf("day")
}

export function getTodayInterval(): { start: number, end: number } {
    let start = moment().startOf("day")
    let end = start.clone().add(1, "days")
    return {
        start: start.valueOf() / 1000,
        end: end.valueOf() / 1000
    }
}

export function getThisWeekInterval(): { start: number, end: number } {
    let start = moment().startOf("isoWeeks")
    let end = start.clone().add(1, "weeks")
    return {
        start: start.valueOf() / 1000,
        end: end.valueOf() / 1000
    }
}

export function getDateInterval(date: any): { start: number, end: number } {
    let start = moment(date).startOf("day")
    let end = start.clone().add(1, "days")
    return {
        start: start.valueOf() / 1000,
        end: end.valueOf() / 1000
    }
}

export function getThisMonthInterval(): { start: number, end: number } {
    let start = moment().startOf("months")
    let end = start.clone().add(1, "months")
    return {
        start: start.valueOf() / 1000,
        end: end.valueOf() / 1000
    }
}

export function getMomentBySecond(second: number): moment.Moment {
    return moment(second * 1000)
}

export function getMomentByMiliSecond(miliSecond: number): moment.Moment {
    return moment(miliSecond)
}

export function getWeekOfMonth(date: moment.Moment) {
    return date.isoWeek() - moment(date).startOf('month').isoWeek() + 1;
}

export function getFromToDate(from: Date = null, to: Date = null) {
    let { start, end } = getThisMonthInterval()
    if (from && to) {
        const dateFrom = convertFullDateToInt(from)
        start = dateFrom.start
        const dateTo = convertFullDateToInt(to)
        end = dateTo.end
    }
    return { start, end }
}

/**
 * ==============================================================================
 * ====================================NUMBER====================================
 * ==============================================================================
 */

/**
* Getting a random integer between two values
* Example: getRandomIntInclusive(0, 10);                              // 9
*/
export function getRandomIntInclusive(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive 
}

export function roundToThousand(value: number) {
    return (value / 1000 * 1000)
}

/**
 * ==============================================================================
 * ====================================UTILITY====================================
 * ==============================================================================
 */

/**
 * Use to add prefix of table in db
 * @param table table name in db
 */
export function addPrefix(table: string) {
    const prefix = config.PREFIX_TABLE || ""
    return prefix + table
}


/**
* Pads the current string with 0
* Example: leftPad(10, 6);                              // 000010
*/
export function leftPad(number: number, maxLength: number) {
    return `${number}`.padStart(maxLength, "0")
}


/**
* Logging follow format, easy to see
* Example: logSection('production mode');
*/
export function logSection(text: string) {
    text = text.toUpperCase()
    console.log('..........................................................................................');
    console.log(`......................................${text}......................................`);
    console.log('..........................................................................................');
}

export function sleep(ms: number) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}