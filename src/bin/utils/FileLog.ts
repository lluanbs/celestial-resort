/**
 * @fileoverview This module contains a function that logs messages using the winston logging library.
 */

import winston from 'winston';
import { PrintLogType } from './CursorLog';

/**
 * This is a default exported anonymous function that takes a log type and a message, 
 * then logs the message with the corresponding log level using winston.
 *
 * @param {PrintLogType} logType - The type of log. It can be INFO, SUCCESS, DEBUG, WARNING, or ERROR.
 * @param {string} message - The message to be logged.
 *
 * @example
 * // logs "This is an info message" with an info level
 * functionName(PrintLogType.INFO, "This is an info message")
 */
export default (logType: PrintLogType, message: string) => {
    const logger = winston.createLogger({
        level: 'info',
        defaultMeta: { service: 'user-service' },
        transports: [
            new winston.transports.File({
                filename: 'combined.log',
                format: winston.format.combine(
                    winston.format.timestamp({
                        format: 'YYYY-MM-DD HH:mm:ss'
                    }),
                    winston.format.json()
                )
            })
        ]
    });

    if (logType === PrintLogType.INFO || logType === PrintLogType.SUCCESS) logger.info(message);
    if (logType === PrintLogType.DEBUG) logger.debug(message);
    if (logType === PrintLogType.WARNING) logger.warn(message);
    if (logType === PrintLogType.ERROR) logger.error(message);
};