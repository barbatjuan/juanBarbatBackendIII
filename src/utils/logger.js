import winston from 'winston';
import dotenv from 'dotenv';

dotenv.config();

const { createLogger, format, transports } = winston;
const { combine, timestamp, printf, colorize } = format;

const customLevels = {
  levels: {
    fatal: 0,
    error: 1,
    warning: 2,
    info: 3,
    http: 4,
    debug: 5
  },
  colors: {
    fatal: 'magenta',
    error: 'red',
    warning: 'yellow',
    info: 'blue',
    http: 'cyan',
    debug: 'white'
  }
};

winston.addColors(customLevels.colors);

const devFormat = printf(({ level, message, timestamp, stack }) => {
  return `${timestamp} [${level}]: ${stack || message}`;
});

const prodFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} [${level}]: ${message}`;
});

let logger;

if (process.env.NODE_ENV === 'production') {
  logger = createLogger({
    levels: customLevels.levels,
    level: 'info',
    format: combine(
      timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      prodFormat
    ),
    transports: [
      new transports.Console({
        level: 'info',
        format: combine(colorize(), timestamp({ format: 'HH:mm:ss' }), devFormat)
      }),
      new transports.File({
        filename: 'errors.log',
        level: 'error',
        format: combine(timestamp(), prodFormat)
      })
    ]
  });
} else {
  logger = createLogger({
    levels: customLevels.levels,
    level: 'debug',
    format: combine(
      colorize(),
      timestamp({ format: 'HH:mm:ss' }),
      format.errors({ stack: true }),
      devFormat
    ),
    transports: [
      new transports.Console()
    ]
  });
}

const addLogger = (req, res, next) => {
  req.logger = logger;
  next();
};

export { logger, addLogger };
