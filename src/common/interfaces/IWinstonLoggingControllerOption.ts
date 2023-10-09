import type IRequestCurlCreatorOption from '#/http/interfaces/IRequestCurlCreatorOption';
import type IRequestLoggerOption from '#/http/interfaces/IRequestLoggerOption';
import type IWinstonContainerOption from '#/winston/interfaces/IWinstonContainerOption';
import type { PartialDeep } from 'type-fest';

export default interface IWinstonLoggingControllerOption {
  winston?: PartialDeep<IWinstonContainerOption>;
  request?: Partial<IRequestLoggerOption>;
  curl?: Partial<IRequestCurlCreatorOption>;
}
