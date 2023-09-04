/**
 * @fileoverview This module contains a function that returns the basename of a file.
 */

import path from 'path';

/**
 * This is a default exported function that takes a filename and returns its basename using Node.js path.basename method.
 *
 * @param {typeof __filename} file - The full path of the file.
 * @returns {string} The basename of the file.
 *
 * @example
 * // get the basename of a file
 * const basename = functionName(__filename);
 */
export default (file: typeof __filename): string => path.basename(file);