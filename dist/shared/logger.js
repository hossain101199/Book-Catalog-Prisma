"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.infoLogger = exports.errorLogger = void 0;
// import path from 'path';
const winston_1 = require("winston");
// import DailyRotateFile from 'winston-daily-rotate-file';
// Custom Log Format
const myFormat = winston_1.format.printf(({ level, message, timestamp }) => {
    const date = new Date(timestamp);
    const hour = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    return `${date.toDateString()} ${hour} : ${minutes} : ${seconds} => ${level} => ${message}`;
});
const infoLogger = (0, winston_1.createLogger)({
    level: 'info',
    format: winston_1.format.combine(winston_1.format.timestamp(), myFormat),
    transports: [
        new winston_1.transports.Console(),
        // new DailyRotateFile({
        //   filename: path.join(
        //     // eslint-disable-next-line no-undef
        //     process.cwd(),
        //     'logs',
        //     'winston',
        //     'successes',
        //     '%DATE%-success.log'
        //   ),
        //   datePattern: 'HH-DD-MM-YYYY',
        //   zippedArchive: true,
        //   maxSize: '20m',
        //   maxFiles: '14d',
        // }),
    ],
});
exports.infoLogger = infoLogger;
const errorLogger = (0, winston_1.createLogger)({
    level: 'error',
    format: winston_1.format.combine(winston_1.format.timestamp(), myFormat),
    transports: [
        new winston_1.transports.Console(),
        // new DailyRotateFile({
        //   filename: path.join(
        //     // eslint-disable-next-line no-undef
        //     process.cwd(),
        //     'logs',
        //     'winston',
        //     'error',
        //     '%DATE%-error.log'
        //   ),
        //   datePattern: 'HH-DD-MM-YYYY',
        //   zippedArchive: true,
        //   maxSize: '20m',
        //   maxFiles: '14d',
        // }),
    ],
});
exports.errorLogger = errorLogger;
