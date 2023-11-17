import type { TFilePathKind } from '#/common/interfaces/ILogContainerOption';
import { getExistAbsolutePath } from '#/common/modules/getExistAbsolutePath';
import { exists, existsSync } from 'my-node-fp';

export function getExistPath<T extends boolean>(
  async: T,
  develop: boolean,
  dirs: {
    var: string;
    local: string;
  },
  filenames: { var: string; local: string },
): T extends true
  ? Promise<{ path: string; filename: string; on: TFilePathKind }>
  : { path: string; filename: string; on: TFilePathKind };
export function getExistPath<T extends boolean>(
  async: T,
  develop: boolean,
  dirs: {
    var: string;
    local: string;
  },
  filenames: { var: string; local: string },
): { path: string; filename: string } | Promise<{ path: string; filename: string }> {
  if (async) {
    return (async () => {
      const varPathExists = await exists(dirs.var);
      const localPathExists = await exists(dirs.local);

      return getExistAbsolutePath(
        develop,
        { local: localPathExists, var: varPathExists },
        dirs,
        filenames,
      );
    })();
  }

  const varPathExists = existsSync(dirs.var);
  const localPathExists = existsSync(dirs.local);

  return getExistAbsolutePath(
    develop,
    { local: localPathExists, var: varPathExists },
    dirs,
    filenames,
  );
}
