import type { CE_LOGGING_ACTION_CODE } from '#/http/const-enum/CE_LOGGING_ACTION_CODE';

export default interface IHTTPLogRecordAction {
  request: {
    querystring: CE_LOGGING_ACTION_CODE;
    params: CE_LOGGING_ACTION_CODE;
    headers: CE_LOGGING_ACTION_CODE;
    body: CE_LOGGING_ACTION_CODE;
  };

  reply: {
    headers: CE_LOGGING_ACTION_CODE;
    payload: CE_LOGGING_ACTION_CODE;
  };

  other: CE_LOGGING_ACTION_CODE;
}
