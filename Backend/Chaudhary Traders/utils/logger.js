const fs = require('fs');
const path = require('path');
const winston = require('winston');

const logDir = path.join(process.cwd(), 'logs');

const logColors = {
  error: 'bold red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  verbose: 'cyan',
  debug: 'blue',
  silly: 'gray',
};

winston.addColors(logColors);

if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

const baseFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.errors({ stack: true }),
  winston.format.printf(({ timestamp, level, message, stack, ...meta }) => {
    const output = stack || message;
    const metadata = Object.keys(meta).length > 0 ? ` ${JSON.stringify(meta)}` : '';
    return `${timestamp} [${level}]: ${output}${metadata}`;
  })
);

const logger = winston.createLogger({
  level: 'info',
  format: baseFormat,
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(winston.format.colorize({ all: true }), baseFormat),
    }),
    new winston.transports.File({ filename: path.join(logDir, 'error.log'), level: 'error' }),
    new winston.transports.File({ filename: path.join(logDir, 'combined.log') }),
  ],
});

module.exports = logger;
