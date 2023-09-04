/**
 * @fileoverview This module contains a function that constructs a full file path and checks if the file exists.
 */

import * as fs from 'fs';
import * as path from 'path';

/**
 * This is a default exported function that takes a file path and a file name, constructs a full file path using them,
 * and then checks if the file at that path exists. If the file exists, the function returns the full file path;
 * otherwise, it returns null.
 *
 * @param {string} filePath - The directory path of the file.
 * @param {string} fileName - The name of the file.
 * @returns {string | null} The full file path if the file exists; null otherwise.
 *
 * @example
 * // check if a file exists and get its full path
 * const result = functionName("/usr/local", "example.txt");
 * console.log(result); // Outputs: "/usr/local/example.txt" if the file exists, null otherwise
 */
export default (filePath: string, fileName: string): string | null => {
    const fullPath = path.join(filePath, fileName);
    if (fs.existsSync(fullPath)) return fullPath;
    return null;
};