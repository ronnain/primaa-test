import { RootContract } from '@primaa/blog-api-contract';
import { SafeAccount } from '@primaa/blog-types';
import { z } from 'zod';

type RouteRestrictedToTheOwner = {
  readonly routeRestrictedTo: {
    owner: true;
  };
};

/**
 * This mapping will find all the routes that have a metadata RouteAccessRestrictedTo
 */
type FindRoutesThatAuthorizeTheResourceOwner<
  T extends Record<string, { metadata?: RouteRestrictedToTheOwner; body: any }>,
  TEndPointsKeys,
  Acc extends Record<string, unknown> = {}
> = TEndPointsKeys extends readonly [infer Head, ...infer Tail] //Get the first element of the tuple
  ? Head extends keyof T //Check if the first element is a key of the contract, is mainly used to satisfies TS
    ? T[Head] extends T[Head] // Satisfies TS, ensure to TS that Head is a key of T
      ? T[Head]['metadata'] extends RouteRestrictedToTheOwner // check if the contract has a metadata key
        ? FindRoutesThatAuthorizeTheResourceOwner<
            // Add the route to the accumulator if the route has a metadata key
            T,
            Tail,
            Merge<
              Acc,
              {
                [key in Head]: (data: {
                  body: z.infer<T[Head]['body']>;
                }) => Promise<boolean>;
              }
            >
          >
        : FindRoutesThatAuthorizeTheResourceOwner<T, Tail, Acc> // Skip the route if it does not have a metadata key, and continue with the next one
      : Acc
    : Acc
  : Acc;

type FindAllRoutesThatAuthorizeTheResourceOwner<
  TRootContract extends Record<string, any>
> = {
  [key in keyof TRootContract]: FindRoutesThatAuthorizeTheResourceOwner<
    TRootContract[key],
    UnionToTuple<keyof TRootContract[key]>
  >;
};

type RoutesValidators = FindAllRoutesThatAuthorizeTheResourceOwner<
  typeof RootContract
>;

export type ValidateResourceOwnerForRoutes = {
  validateOwner: (account: SafeAccount) => RoutesValidators;
};

/**
 * Merge all the validators of all the subcontracts into a single type.
 * (It should be an union type with validators of all the subcontracts, but it is hard to works with union types in this case, so I merge them into a single type.)
 */
export type SubRouteValidators = UnionToIntersection<
  ExcludeEmpty<RoutesValidators[keyof RoutesValidators]>
>;

export type SubRouteValidatorsKeys = DistributiveKeyof<SubRouteValidators>;

type DistributiveKeyof<T> = T extends T ? keyof T : never;

type AtLeastOne<T, U = { [K in keyof T]: Pick<T, K> }> = Partial<T> &
  U[keyof U];

type ExcludeEmpty<T> = T extends AtLeastOne<T> ? T : never;

// https://github.com/ecyrbe/zodios/blob/main/src/utils.types.ts
/**
 * Merge two types into a single type
 * @param T - first type
 * @param U - second type
 */
type Merge<T, U> = Simplify<T & U>;

/**
 * Simplify a type by merging intersections if possible
 * @param T - type to simplify
 */
type Simplify<T> = T extends unknown ? { [K in keyof T]: T[K] } : T;

/**
 * merge all union types into a single type
 * @param T - union type
 */
type MergeUnion<T> = (T extends unknown ? (k: T) => void : never) extends (
  k: infer I
) => void
  ? { [K in keyof I]: I[K] }
  : never;

/**
 * Convert union to tuple
 * @param Union - Union of any types, can be union of complex, composed or primitive types
 * @returns Tuple of each elements in the union
 */
type UnionToTuple<Union, Tuple extends unknown[] = []> = [Union] extends [never]
  ? Tuple
  : UnionToTuple<
      Exclude<Union, GetUnionLast<Union>>,
      [GetUnionLast<Union>, ...Tuple]
    >;

/**
 * trick to combine multiple unions of objects into a single object
 * only works with objects not primitives
 * @param union - Union of objects
 * @returns Intersection of objects
 */
type UnionToIntersection<union> = (
  union extends any ? (k: union) => void : never
) extends (k: infer intersection) => void
  ? intersection
  : never;
/**
 * get last element of union
 * @param Union - Union of any types
 * @returns Last element of union
 */
type GetUnionLast<Union> = UnionToIntersection<
  Union extends any ? () => Union : never
> extends () => infer Last
  ? Last
  : never;
