import type { IFastMakerRoutePath } from '#/http/common/interfaces/IFastMakerRoutePath';
import { getHttpMethod } from '#/http/common/modules/getHttpMethod';

export function getRoutePathKey(route: Omit<IFastMakerRoutePath, 'filePath'>): string {
  return `${getHttpMethod(route.method)}::${route.routePath}`;
}
