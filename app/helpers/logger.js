const { createLogger, format, transports, config } = require('winston');
const appConfig = require('../config');
const DailyRotateFile = require('winston-daily-rotate-file');
const path = require('path');

const ERROR = 'error';
const INFO = 'info';

let errorLogger;
let infoLogger;

const initLogger = () => {

    errorLogger = createMyLogger(ERROR);
    infoLogger = createMyLogger(INFO);

    console.log('logger configured');
};


const createMyLogger = type => {

    const dailyRotates = new DailyRotateFile({
        filename: path.resolve(__dirname, `../../logs/${type}/%DATE%-${type}.log`),
        datePattern: 'DD-MM-YYYY',
        maxSize: '50m'
    });

    const logger = createLogger({
        format: format.combine(
            format.timestamp({
                format: 'DD-MM-YYYY HH:mm:ss'
            }),
            format.errors({ stack: true }),
            format.splat(),
            format.json()
        ),
        transports: [
            dailyRotates
        ]
    });

    if(appConfig.env !== 'test') {
        logger.add(new transports.Console({
            format: format.combine(
                format.colorize(),
                format.simple()
            )
        }));
    }

    return logger;
}

const logError = (err, id) => {
    errorLogger.log({
        level: ERROR,
        message: err,
        id
    });
}

const log = (msg, id) => {
    infoLogger.log({
        level: INFO,
        message: msg,
        id
    });
}

module.exports = { initLogger, logError, log }


// const logFormat = format.printf(({ level, message, label, timestamp }) => {
    //     return `${timestamp} [${label}] ${level}: ${message}`;
    // });