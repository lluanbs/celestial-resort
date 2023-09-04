/**
 * @fileoverview This module contains a function that converts a date string in "dd/MM/yyyy HH:mm:ss" format into ISO string.
 */

/**
 * This is a default exported anonymous function that takes a date string in "dd/MM/yyyy HH:mm:ss" format and returns it as an ISO string.
 *
 * @param {string} dateString - A string representing a date in "dd/MM/yyyy HH:mm:ss" format.
 *
 * @returns {string} Returns a string representing the date in ISO format.
 *
 * @example
 * // returns "2022-04-02T12:00:00.000Z"
 * functionName("02/04/2022 12:00:00")
 */
export default (dateString: string) => {
    const [datePart, timePart] = dateString.split(' ');
    const [day, month, year] = datePart.split('/').map(part => parseInt(part, 10));
    const [hour, minute, second] = timePart.split(':').map(part => parseInt(part, 10));

    const dateObject = new Date(year, month - 1, day, hour, minute, second);

    return dateObject.toISOString();
};
