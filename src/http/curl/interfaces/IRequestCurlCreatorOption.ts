import type { ICurlizeOptions } from 'jin-curlize';

export interface ICurlCreatorOption {
  curl: ICurlizeOptions;
  excludes: Map<string, string>;
}
