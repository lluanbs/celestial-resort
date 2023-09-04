/**
 * @fileoverview This module contains a function that converts a date string into a specific format.
 */

/**
 * This is a default exported anonymous function that takes a date string and returns it in the "dd/MM/yyyy HH:mm:ss" format.
 *
 * @param {string} dateString - A string representing a date. This should be compatible with JavaScript's Date object constructor.
 *
 * @returns {string} Returns a string representing the date in "dd/MM/yyyy HH:mm:ss" format.
 *
 * @example
 * // returns "02/04/2022 12:00:00"
 * functionName("2022-04-02T12:00:00Z")
 */
export default (dateString: string) => {
    const date = new Date(dateString);

    const day = String(date.getUTCDate()).padStart(2, '0');
    const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Months are 0-indexed in JS
    const year = date.getUTCFullYear();

    const hours = String(date.getUTCHours()).padStart(2, '0');
    const minutes = String(date.getUTCMinutes()).padStart(2, '0');
    const seconds = String(date.getUTCSeconds()).padStart(2, '0');

    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
};