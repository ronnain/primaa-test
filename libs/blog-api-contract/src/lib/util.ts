import { RouteAccessRestrictedTo } from './root.contract';

export function provideMetadataRouteConfig<T extends RouteAccessRestrictedTo>(
  metadata: T
) {
  return metadata;
}
