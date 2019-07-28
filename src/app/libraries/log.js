import {createLogger, transports, format} from 'winston';
import env from 'env'; // eslint-disable-line

const {combine, timestamp, printf} = format;

const logLevel = 'info';

const logger = createLogger({
  level: logLevel,
  levels: {
    fatal: 0,
    crit: 1,
    warn: 2,
    info: 3,
    debug: 4,
    trace: 5,
  },
  transports: [
    new (transports.Console)({
      colorize: true,
      timestamp: true,
    }),
    new (transports.File)({
      filename: `${process.env.SRC_PATH}/app/logs/${process.env.APP_ALIAS}.log`,
    }),
  ],
  format: combine(
      timestamp(),
      printf((info) => {
        return `${info.timestamp} ${info.level}: ${info.message}`;
      })
  ),
});

const origLog = logger.log;

logger.log = (level, msg) => {
  if (msg instanceof Error) {
    const args = Array.prototype.slice.call(arguments);
    args[1] = msg.stack;
    origLog.apply(logger, args);
  } else {
    origLog.apply(logger, arguments);
  }
};

export default logger;
