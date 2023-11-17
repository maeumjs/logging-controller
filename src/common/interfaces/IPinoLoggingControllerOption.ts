import type { IRequestCurlCreatorOption } from '#/http/interfaces/IRequestCurlCreatorOption';
import type { IRequestLoggerOption } from '#/http/interfaces/IRequestLoggerOption';
import type { IPinoContainerOption } from '#/pino/interfaces/IPinoContainerOption';
import type { PartialDeep } from 'type-fest';

export interface IPinoLoggingControllerOption {
  pino?: PartialDeep<IPinoContainerOption>;
  request?: Partial<IRequestLoggerOption>;
  curl?: Partial<IRequestCurlCreatorOption>;
}
