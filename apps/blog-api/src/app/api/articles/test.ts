import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';

@Injectable()
export class AfterHandlerGuard implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      tap((response) => {
        console.log('context', context);
        const request = context.switchToHttp().getRequest();
        const user = request.user;

        // Logique de vérification après le @TsRestHandler
        if (!this.isAuthorized(user, response)) {
          throw new UnauthorizedException();
        }
      })
    );
  }

  private isAuthorized(user: any, response: any): boolean {
    // Ajoutez votre logique de vérification ici
    // Par exemple, vérifiez si l'utilisateur est admin ou propriétaire de la ressource
    return true;
  }
}
