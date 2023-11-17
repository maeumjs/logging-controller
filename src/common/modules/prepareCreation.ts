import type { ILogContainerOption } from '#/common/interfaces/ILogContainerOption';
import { getExistPath } from '#/common/modules/getExistPath';
import { exists } from 'my-node-fp';
import fs from 'node:fs';
import path from 'node:path';
import type { LastArrayElement } from 'type-fest';

export async function prepareCreation(
  option: ILogContainerOption,
  application: LastArrayElement<ILogContainerOption['applications']>,
) {
  const logFilePath = await getExistPath(
    true,
    option.develop(),
    { var: application.path.var, local: application.path.local },
    { var: application.filename.var, local: application.filename.local },
  );

  if (option.develop() && !(await exists(logFilePath.path))) {
    await fs.promises.mkdir(logFilePath.path, { recursive: true });
    const absPath = path.resolve(logFilePath.path);
    logFilePath.path = absPath;
  }

  if (!(await exists(logFilePath.path))) {
    throw new Error(
      `log file path does not exist: ${logFilePath.path}${path.sep}${logFilePath.filename}`,
    );
  }

  return logFilePath;
}
