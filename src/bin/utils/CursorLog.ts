/**
 * @file This file is responsible for logging different types of messages to the console and a file. 
 * It uses ANSI escape codes to colorize console output.
 */

import format from "date-fns/format";
import FileLog from "./FileLog";

/**
 * @enum LogColorReference
 * @description Defines ANSI escape codes for various text attributes and colors.
 */
enum LogColorReference {
    Reset = "\x1b[0m",
    Bright = "\x1b[1m",
    Dim = "\x1b[2m",
    Underscore = "\x1b[4m",
    Blink = "\x1b[5m",
    Reverse = "\x1b[7m",
    Hidden = "\x1b[8m",
    FgBlack = "\x1b[30m",
    FgRed = "\x1b[31m",
    FgGreen = "\x1b[32m",
    FgYellow = "\x1b[33m",
    FgBlue = "\x1b[34m",
    FgMagenta = "\x1b[35m",
    FgCyan = "\x1b[36m",
    FgWhite = "\x1b[37m",
    FgGray = "\x1b[90m",
    BgBlack = "\x1b[40m",
    BgRed = "\x1b[41m",
    BgGreen = "\x1b[42m",
    BgYellow = "\x1b[43m",
    BgBlue = "\x1b[44m",
    BgMagenta = "\x1b[45m",
    BgCyan = "\x1b[46m",
    BgWhite = "\x1b[47m",
    BgGray = "\x1b[100m",
}

/**
 * @enum PrintLogType
 * @description Defines the type of log message.
 */
export enum PrintLogType {
    ERROR = 0,
    WARNING = 1,
    SUCCESS = 2,
    INFO = 3,
    DEBUG = 4,
}

const print = console.log;

/**
 * @function tintText
 * @description Applies a color to a given text string.
 *
 * @param {LogColorReference} color - The color to apply.
 * @param {string} text - The text to colorize.
 *
 * @returns {string} - The colorized text.
 */
function tintText(color: LogColorReference, text: string): string {
    return `${color}${text}${LogColorReference.Reset}`;
}

/**
 * @function getDate
 * @description Gets the current date and time in the format "dd/MM/yyyy HH:mm:ss".
 *
 * @returns {string} - The formatted date and time string.
 */
function getDate(): string {
    return format(new Date(), "dd/MM/yyyy HH:mm:ss");
};

/**
 * @function
 * @description Logs a message of a certain type to both the console and a file.
 *
 * @param {PrintLogType} printType - The type of log message.
 * @param {string} fileName - The name of the file where the log originated.
 * @param {any} [args] - Additional arguments to include in the log message.
 */
export default (printType: PrintLogType, fileName: string, args?: any) => {
    if (printType === PrintLogType.DEBUG) {
        FileLog(printType, args);
        print(tintText(LogColorReference.FgCyan, '[debug]'), tintText(LogColorReference.FgYellow, getDate()), tintText(LogColorReference.FgCyan, fileName), tintText(LogColorReference.Bright, args !== undefined ? args : ''));
    };

    if (printType === PrintLogType.INFO) {
        FileLog(printType, args);
        print(tintText(LogColorReference.FgGray, '[info]'), tintText(LogColorReference.FgYellow, getDate()), tintText(LogColorReference.FgCyan, fileName), tintText(LogColorReference.Bright, args !== undefined ? args : ''));
    };

    if (printType === PrintLogType.ERROR) {
        FileLog(printType, args);
        print(tintText(LogColorReference.FgRed, '[error]'), tintText(LogColorReference.FgYellow, getDate()), tintText(LogColorReference.FgCyan, fileName), tintText(LogColorReference.Bright, args !== undefined ? args : ''));
    };

    if (printType === PrintLogType.WARNING) {
        FileLog(printType, args);
        print(tintText(LogColorReference.FgYellow, '[warning]'), tintText(LogColorReference.FgYellow, getDate()), tintText(LogColorReference.FgCyan, fileName), tintText(LogColorReference.Bright, args !== undefined ? args : ''));
    };

    if (printType === PrintLogType.SUCCESS) {
        FileLog(printType, args);
        print(tintText(LogColorReference.FgGreen, '[success]'), tintText(LogColorReference.FgYellow, getDate()), tintText(LogColorReference.FgCyan, fileName), tintText(LogColorReference.Bright, args !== undefined ? args : ''));
    };
};
