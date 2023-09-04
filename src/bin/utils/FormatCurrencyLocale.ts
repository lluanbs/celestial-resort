/**
 * @fileoverview This module contains a function that formats a number into a locale-specific currency string.
 */

/**
 * This is a default exported anonymous function that takes a number and optionally a locale and a currency, 
 * then returns the number formatted as a locale-specific currency string using the `toLocaleString` method.
 *
 * @param {number} value - The number to be formatted.
 * @param {Intl.LocalesArgument} [locale='pt-BR'] - The locales to use for formatting. It defaults to 'pt-BR'.
 * @param {string} [currency='BRL'] - The currency to use in currency formatting. It defaults to 'BRL'.
 *
 * @returns {string} Returns the number formatted as a locale-specific currency string.
 *
 * @example
 * // returns "R$1,000.00"
 * functionName(1000)
 */
export default (value: number, locale: Intl.LocalesArgument = 'pt-BR', currency: string = "BRL") => {
    return value.toLocaleString(locale, { style: 'currency', currency });
};
