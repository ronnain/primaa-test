import { Observable, catchError, of, startWith, switchMap, map } from 'rxjs';
import { StatedData } from '../util/stated-data';

export function statedStream<T>(
  toCall: Observable<T>,
  initialValue?: T
): Observable<StatedData<T>> {
  return toCall.pipe(
    switchMap(() =>
      toCall.pipe(
        map(
          (result) =>
            ({
              isLoading: false,
              isLoaded: true,
              hasError: false,
              error: undefined,
              result,
            } as const satisfies StatedData<T>)
        ),
        startWith({
          isLoading: true,
          isLoaded: false,
          hasError: false,
          error: undefined,
          result: initialValue,
        } as const)
      )
    ),
    catchError((error) =>
      of({
        isLoading: false,
        isLoaded: false,
        hasError: true,
        error,
        result: undefined,
      } as const)
    )
  );
}
