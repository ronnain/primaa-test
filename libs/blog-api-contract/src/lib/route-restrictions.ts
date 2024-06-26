import { RolesAccess } from '@primaa/blog-types';

export type RouteAccessRestrictedTo = Readonly<{
  routeRestrictedTo:
    | {
        roles: RolesAccess[];
      }
    | {
        owner: true;
      }
    | {
        roles: RolesAccess[];
        owner: true;
      };
}>;

export const RoutePartPath = {
  root: 'api',
  articles: 'articles',
  comments: 'comments',
  account: 'account',
  auth: 'auth',
} as const;
export type RoutePartPath = (typeof RoutePartPath)[keyof typeof RoutePartPath];
export type SubRoutePartPath = Exclude<RoutePartPath, 'api'>;
