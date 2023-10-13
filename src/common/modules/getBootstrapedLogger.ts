import type IRequestCurlCreatorOption from '#/http/interfaces/IRequestCurlCreatorOption';
import type IRequestLoggerOption from '#/http/interfaces/IRequestLoggerOption';
import PinoContainer from '#/pino/PinoContainer';
import WinstonContainer from '#/winston/WinstonContainer';

export default function getBootstrapedLogger(
  name: string,
  option?:
    | Pick<Partial<IRequestLoggerOption>, 'logger'>
    | Pick<Partial<IRequestCurlCreatorOption>, 'logger'>,
) {
  if (option?.logger == null && WinstonContainer.isBootstrap) {
    return WinstonContainer.l(name);
  }

  if (option?.logger == null && PinoContainer.isBootstrap) {
    return PinoContainer.l(name);
  }

  if (option?.logger == null) {
    throw new Error('logger is a required value, Winston & Pino both not bootstraped');
  }

  return option.logger;
}
