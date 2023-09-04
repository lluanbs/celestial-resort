/**
 * @fileoverview This module contains a function that removes non-alphanumeric characters from a string.
 */

/**
 * This is a default exported function that takes a string and removes all non-alphanumeric characters using a regular expression.
 *
 * @param {string} str - The input string.
 * @returns {string} The processed string with all non-alphanumeric characters removed.
 *
 * @example
 * // remove non-alphanumeric characters from a string
 * const result = functionName("Hello, World!");
 * console.log(result); // Outputs: "HelloWorld"
 */
export default (str: string): string => {
    return str.replace(/[^a-zA-Z0-9]/g, '');
};