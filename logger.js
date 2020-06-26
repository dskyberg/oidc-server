const winston = require('winston');

const winstonLogger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [
      new winston.transports.Console({
        format: winston.format.simple(),
        colorize: true,
      })
    ]
  });

  logger({ logger: winstonLogger });
  module.exports = logger;