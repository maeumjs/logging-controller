import { $YMBOL_KEY_MAEUM_LOGGERS } from '#/common/symbols/SYMBOL_KEY_MAEUM_LOGGERS';
import type { MaeumLoggers } from '#/loggings/common/MaeumLoggers';
import type { IClassContainer } from '@maeum/tools';

export function interpretorErrorHandler(container: IClassContainer) {
  const logger = container.resolve<MaeumLoggers>($YMBOL_KEY_MAEUM_LOGGERS).l('unhandle-exception');

  process.on('uncaughtException', (err) => {
    logger.$('uncaughtException: ', err.message);
    logger.$('uncaughtException: ', err.stack);

    logger.error({
      id: 'uncaught-exception',
      status: 500,
      err,
    });
  });

  process.on('unhandledRejection', (reason) => {
    logger.$('unhandledRejection: ', reason);

    const message =
      reason == null ? 'unknown error by [unhandledRejection]' : JSON.stringify(reason);

    logger.error({
      id: 'unhandled-rejection',
      status: 500,
      err: new Error(message),
    });
  });
}
