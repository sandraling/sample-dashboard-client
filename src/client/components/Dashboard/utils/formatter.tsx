import * as moment from 'moment-timezone';

/**
 * Return number in abbreviated form, e.g. 1000 becomes 1K;
 * Rounded to no decimal places after abbreviating, e.g. 5678 becomes 6K.
 * Reference: https://gist.github.com/tobyjsullivan/96d37ca0216adee20fa95fe1c3eb56ac
 * @param value number to be abbreviated
 */
export const abbreviateNumber = (value: number) => {
    let newValue = value;
    const suffixes = ["", "K", "M", "B","T"];
    let suffixNum = 0;
    while (newValue >= 1000) {
      newValue /= 1000;
      suffixNum++;
    }

    return newValue.toFixed(0) + suffixes[suffixNum];
}

/**
 * Return amount converted to locale used format;
 * If currency is specified, return the amount formatted into a currency value.
 * No decimal points displayed if the amount is an integer.
 * @param amount numerical value
 * @param locale Unicode locale identifier
 * @param currency optional
 */
export const numberFormatter = (
    amount: number, 
    locale: string, 
    currency?: string
) => {
    let opt: {
        maximumFractionDigits: number,
        style?: string,
        currency?: string
    } = { maximumFractionDigits: 0 };
    if (currency) 
        opt = Object.assign(opt, { style: 'currency', currency });
    return new Intl.NumberFormat(locale, opt).format(amount);
}

/**
 * Convert string describing local date to UNIX timestamp (milliseconds)
 * @param time date string in local time format, e.g. '2012-05-20 EST'
 * @param locale locale in momentjs accepted format
 */
export const convertDateToUnix = (time: string, locale: string) => {
    return moment.tz(time.split(" ")[0], locale).valueOf();
}
