import type { TFilePathKind } from '#/common/interfaces/ILogContainerOption';
import path from 'node:path';

export function getExistAbsolutePath(
  develop: boolean,
  exists: { local: boolean; var: boolean },
  dirs: { var: string; local: string },
  filenames: { var: string; local: string },
): { path: string; filename: string; on: TFilePathKind } {
  if (develop && exists.local) {
    return { path: path.resolve(dirs.local), filename: filenames.local, on: 'local' };
  }

  if (develop && !exists.local) {
    return { path: dirs.local, filename: filenames.local, on: 'local' };
  }

  if (exists.var) {
    return { path: path.resolve(dirs.var), filename: filenames.var, on: 'var' };
  }

  if (exists.local) {
    return { path: path.resolve(dirs.local), filename: filenames.local, on: 'local' };
  }

  return { path: dirs.local, filename: filenames.local, on: 'local' };
}
