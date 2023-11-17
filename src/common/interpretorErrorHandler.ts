import { getBootstrapedLogger } from '#/common/modules/getBootstrapedLogger';

export function interpretorErrorHandler() {
  const logger = getBootstrapedLogger('unhandle-exception');

  process.on('uncaughtException', (err) => {
    logger.$('uncaughtException: ', err.message);
    logger.$('uncaughtException: ', err.stack);

    const loggerFunction = logger.$kind === 'pino' ? logger.fatal : logger.crit;

    loggerFunction({
      id: 'uncaught-exception',
      status: 500,
      err,
    });
  });

  process.on('unhandledRejection', (reason) => {
    logger.$('unhandledRejection: ', reason);

    const message =
      reason == null ? 'unknown error by [unhandledRejection]' : JSON.stringify(reason);

    const loggerFunction = logger.$kind === 'pino' ? logger.fatal : logger.crit;

    loggerFunction({
      id: 'unhandled-rejection',
      status: 500,
      err: new Error(message),
    });
  });
}
