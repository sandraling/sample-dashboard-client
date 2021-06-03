/**
 * Return the time that is n month(s) before date.
 * Time unit being number of milliseconds since Unix epoch.
 * Reference: https://stackoverflow.com/questions/24049164/javascript-get-timestamp-of-1-month-ago/24049314
 * @param time time of reference, represented in number of milliseconds since Unix epoch
 * @param n number of months ago
 */
export const getMonthsAgoDate = (time: number, n: number): number => {
    let d = new Date(time);
    let m = d.getMonth();
    let y = d.getFullYear();
    d.setMonth(d.getMonth() - n);

    return d.getTime();
}