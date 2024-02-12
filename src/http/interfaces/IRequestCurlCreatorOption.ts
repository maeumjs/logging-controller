import type { IWintonLogger } from '#/winston/interfaces/IWintonLogger';
import type { ICurlizeOptions } from 'jin-curlize';

export interface IRequestCurlCreatorOption {
  curl: ICurlizeOptions;
  excludes: Map<string, string>;
  logger: Readonly<IWintonLogger>;
}
