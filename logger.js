/**
 * Project: Onslaught Discord Bot
 * File: logger.js
 * Author: Woofmagic
 * Created:2025-04-13
 * Last Modified: 2025-04-13
 *
 * Description:
 *  A detailed logger for the application.
 *
 * Notes:
 *
 * Changelog:
 * - 2025-04-13: Creation of the file.
 */


// (): Import libraries:

// (2): Import Winston
const winston = require('winston');

// (3): Import Luxon for accurate DateTimes:
const { DateTime } = require('luxon');

// () Constructor:
const winstonLogger = winston.createLogger({
	format: winston.format.combine(
		winston.format.timestamp({
			format: () => DateTime.now().toISO(),
		}),
		winston.format.printf(({ level, message, timestamp, filePath }) => {
			const status = level.toUpperCase() === 'ERROR' ? 'FAILED' : 'INFO';
			return `[${status}]:[${timestamp}]:[${filePath || 'unknown file'}]:${message}`;
		}),
	),
	transports: [
		new winston.transports.Console(),
		new winston.transports.File({ filename: 'logs/app.log' }),
	],
});


module.exports = {
	winstonLogger,
	logInformation: (filePath, message) =>
		winstonLogger.info(message, { filePath }),
	logWarning: (filePath, message) =>
		winstonLogger.warn(message, { filePath }),
	logError: (filePath, message) =>
		winstonLogger.error(message, { filePath }),
};