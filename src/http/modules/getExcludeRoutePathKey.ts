import type IFastMakerRoutePath from '#/http/interfaces/IFastMakerRoutePath';

export default function getExcludeRoutePathKey(
  route: Omit<IFastMakerRoutePath, 'filePath'>,
): string {
  return `${route.method}::${route.routePath}`;
}
