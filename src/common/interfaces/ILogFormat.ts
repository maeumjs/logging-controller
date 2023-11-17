export interface ILogFormat {
  /**
   * 로그 상태 값: 시스템 로그 또는 HTTP 로그 등을 기록할 때도 로그 상태 값을 로깅한다.
   * 일관성 및 편의성을 위해 HTTP 상태 값을 사용한다.
   * 예를들면, fastify.js 서버를 실행하는 것을 성공하면 status에 200을 기록한다. 반면,
   * HTTP 요청에 대한 로그를 기록할 때도 HTTP 요청 처리 결과를 status에 기록한다.
   *
   * Log status values: Log status values are also logging when logging system log reocrds or
   * HTTP log records, etc. For consistency and convenience, we use HTTP status values.
   * For example, if we successfully run the fastify.js server, we write 200 to status. Whereas,
   * When we log HTTP requests, we also log the result of the HTTP request processing to status.
   */
  status: number;

  /**
   * 현재 로그가 만들어진 시각을 기록한다. epoch time은 사용하지 않는다. 여러지역에 서버를 운영할 경우,
   * epoch time은 반드시 UTC로 변경해서 기록해야하는 문제점이 있다. 로그에 기록할 때, 실제로 로그를
   * 활용할 때 모두 변환이 필요하기 때문에 로그 용량을 절감해야 하는 상황이 아니라면 iso8601 형식으로
   * 기록한다.
   *
   * Logs the time the current log record was created. Do not use epoch time.
   * If you have servers in multiple regions, epoch time must be converted to UTC to be recorded.
   * When writing to logs, use the ISO8601 format unless you need to reduce the size of
   * your logs because all of the conversion is required when you actually utilize the logs.
   */
  timestamp: string;

  /**
   * HTTP 요청에 대한 로그를 기록할 때 duration 값을 기록한다. 시스템 로그인 경우 duration이
   * 없을 수도 있으므로 필수 값은 아니다.
   *
   * Log the duration value when logging logs for HTTP requests.
   * This is not a required value, as duration may not be present when
   * logging in to the system.
   */
  duration?: number;

  /**
   * 로그를 구분하기 위한 값. 예를들면 HTTP 요청인 경우 http-request-get, http-request-post 등을 기록하고
   * 시스템 로그인 경우 system 등을 기록한다.
   *
   * A value to differentiate between logs. For example, if it is an HTTP request,
   * log http-request-get, http-request-post, etc, if it is a system log, log system, etc.
   *
   * - http-request-get
   * - http-request-post
   * - http-request-put
   * - http-request-patch
   * - http-request-delete
   * - sys
   * - mq
   */
  id: string;

  /**
   * HTTP 요청인 경우, 각 요청의 Request ID를 기록한다.
   *
   * For HTTP requests, record the Request ID of each request.
   */
  tid?: string;

  /**
   * 오류가 있을 경우 오류 메시지
   *
   * Error message if there is an error log record
   * */
  errMsg?: string;

  /**
   * 오류가 있을 경우 스택 트레이스
   *
   * Error stacktrace if there is an error log record
   * */
  errStk?: string;

  /**
   * 로그의 상세 내용을 기록한다. HTTP 요청인 경우 request, reply 값과 url, curl 명령어, error 등
   * 문제를 해결하기 위한 다양한 값을 기록할 수 있을 것이다.
   *
   * Log the details of the log. For HTTP requests, you can log the request and
   * reply values, as well as various values for troubleshooting, such as
   * request url, curl commands, errors, etc.
   */
  body: unknown;
}
