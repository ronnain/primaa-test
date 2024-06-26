import { RouteAccessRestrictedTo } from './route-restrictions';

export function provideMetadataRouteConfig<T extends RouteAccessRestrictedTo>(
  metadata: T
) {
  return metadata;
}
