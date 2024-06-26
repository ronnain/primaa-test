import {
  CallHandler,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AuthRoleValidatorService } from './auth-role-validator.service';
import { Reflector } from '@nestjs/core';
import { AppRoute, AppRouter, isAppRoute } from '@ts-rest/core';
import {
  TsRestAppRouteMetadataKey,
  doesUrlMatchContractPath,
} from '@ts-rest/nest';
import { Observable, from, map, switchMap, take } from 'rxjs';
import { SafeAccount } from '@primaa/blog-types';
import {
  RouteAccessRestrictedTo,
  SubRoutePartPath,
} from '@primaa/blog-api-contract';
import {
  SubRouteValidators,
  SubRouteValidatorsKeys,
} from './ts-rest-auth-util';

/**
 * Make sure to call this interceptor after @TsRestHandler
 * It checks access to the route that implements metadata RouteAccessRestrictedTo.
 * If not, it throws a ForbiddenException.
 */
@Injectable()
export class AuthRolesRestrictedAccessInterceptor {
  constructor(
    private reflector: Reflector,
    private authRoleValidatorService: AuthRoleValidatorService
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      switchMap((response) => {
        const request = context.switchToHttp().getRequest();
        const routeFound = this.getAppRouteFromContext(context);
        const user: SafeAccount = request.user.safeAccount;

        return from(this.isAuthorized(user, routeFound, request.body)).pipe(
          take(1),
          map((isAuthorized) => ({ isAuthorized, response }))
        );
      }),
      map(({ isAuthorized, response }) => {
        if (!isAuthorized) {
          throw new ForbiddenException();
        }
        return response;
      })
    );
  }
  /**
   * Check access to the route that implements metadata RouteAccessRestrictedTo.
   * Check if the requestor can access by his role or if it is the owner of the resource.
   * The logic apply is a OR, if he can access by his role, the owner validator is not triggered.
   * Route without RouteAccessRestrictedTo are authorized by default.
   */
  private async isAuthorized(
    account: SafeAccount,
    route: {
      appRoute: AppRoute;
      routeKey: string;
    },
    body: any
  ): Promise<boolean> {
    if (!route.appRoute.metadata) {
      return true;
    }
    const METADATA = route.appRoute
      .metadata as Partial<RouteAccessRestrictedTo>;
    if (!METADATA.routeRestrictedTo) {
      return true;
    }
    const restrictedTo = METADATA.routeRestrictedTo;
    const mustCheckRole = 'roles' in restrictedTo;
    const mustCheckOwner = 'owner' in restrictedTo;

    if (!mustCheckRole && !mustCheckOwner) {
      return true; // for routes that not implements restrictions access
    }

    let requestorCanAccessByHisRole = false;
    let isOwnerAccessGranted = false;
    if (mustCheckRole) {
      requestorCanAccessByHisRole = restrictedTo.roles.includes(account.role);
    }

    if (mustCheckRole && requestorCanAccessByHisRole) {
      return true;
    }

    if (mustCheckOwner) {
      isOwnerAccessGranted = await this.checkOwnerAccess(
        route.appRoute.path,
        account,
        route.routeKey,
        body
      );
    }
    return mustCheckOwner && isOwnerAccessGranted;
  }

  /**
   *
   * @param path  will be like /api/articles/:articleId
   * @param account
   * @param routeKey
   * @param body
   * @returns
   */
  async checkOwnerAccess(
    path: string,
    account: SafeAccount,
    routeKey: string,
    body: any
  ) {
    const subContractPath = path.split('/')[2] as SubRoutePartPath; // eg: articles
    const validatorHandler =
      this.authRoleValidatorService.validateOwner(account);
    const subValidatorHandler = validatorHandler[
      subContractPath
    ] as SubRouteValidators;
    const routeMethodKey = routeKey as SubRouteValidatorsKeys;

    if (subValidatorHandler && routeMethodKey in subValidatorHandler) {
      //@ts-ignore
      const isOwner = await subValidatorHandler[routeMethodKey]({ body });
      return isOwner;
    }
    return true;
  }

  /**
   * Method from TsRestHandlerInterceptor (from the lib)
   * Returns the route of the current contract (ArticleContract...) that is defined at the controller level
   */
  private getAppRouteFromContext(ctx: ExecutionContext) {
    const req: Request = ctx.switchToHttp().getRequest();
    const appRoute = this.reflector.get<AppRoute | AppRouter | undefined>(
      TsRestAppRouteMetadataKey,
      ctx.getHandler()
    );

    if (!appRoute) {
      throw new Error(
        'Could not find app router or app route, ensure you are using the @TsRestHandler decorator on your method'
      );
    }

    if (isAppRoute(appRoute)) {
      throw new Error(
        'Can not handle appRoute with this method, only AppRouter is supported'
      );
    }

    const appRouter = appRoute;

    const foundAppRoute = Object.entries(appRouter).find(([, value]) => {
      if (isAppRoute(value)) {
        return (
          doesUrlMatchContractPath(
            value.path,
            //@ts-ignore
            'path' in req ? req.path : req.routeOptions.url
          ) && req.method === value.method
        );
      }

      return null;
    }) as [string, AppRoute] | undefined;

    if (!foundAppRoute) {
      throw new NotFoundException("Couldn't find route handler for this path");
    }
    return {
      appRoute: foundAppRoute[1],
      routeKey: foundAppRoute[0],
    };
  }
}
