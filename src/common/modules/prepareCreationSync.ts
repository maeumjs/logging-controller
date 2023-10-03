import type ILogContainerOption from '#/common/interfaces/ILogContainerOption';
import getExistPath from '#/common/modules/getExistPath';
import { existsSync } from 'my-node-fp';
import fs from 'node:fs';
import path from 'node:path';
import type { LastArrayElement } from 'type-fest';

export default function prepareCreationSync(
  option: ILogContainerOption,
  application: LastArrayElement<ILogContainerOption['applications']>,
) {
  const logFilePath = getExistPath(
    false,
    option.develop(),
    { var: application.path.var, local: application.path.local },
    { var: application.filename.var, local: application.filename.local },
  );

  if (option.develop() && !existsSync(logFilePath.path)) {
    fs.mkdirSync(logFilePath.path, { recursive: true });
  }

  if (!existsSync(logFilePath.path)) {
    throw new Error(
      `log file path does not exist: ${logFilePath.path}${path.sep}${logFilePath.filename}`,
    );
  }

  return logFilePath;
}
