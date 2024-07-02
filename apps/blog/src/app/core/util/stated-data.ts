export type StatedData<T> =
  | {
      readonly isLoading: false;
      readonly isLoaded: true;
      readonly hasError: false;
      readonly error: undefined;
      readonly result: T;
    }
  | {
      readonly isLoading: true;
      readonly isLoaded: false;
      readonly hasError: false;
      readonly error: undefined;
      readonly result: T | undefined;
    }
  | {
      readonly isLoading: false;
      readonly isLoaded: false;
      readonly hasError: true;
      readonly error: any;
      readonly result: undefined;
    };
