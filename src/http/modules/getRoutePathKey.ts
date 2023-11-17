import type { IFastMakerRoutePath } from '#/http/interfaces/IFastMakerRoutePath';
import { getHttpMethod } from '#/http/modules/getHttpMethod';

export function getRoutePathKey(route: Omit<IFastMakerRoutePath, 'filePath'>): string {
  return `${getHttpMethod(route.method)}::${route.routePath}`;
}
