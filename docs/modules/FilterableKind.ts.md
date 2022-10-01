---
title: FilterableKind.ts
nav_order: 29
parent: Modules
---

## FilterableKind overview

`FilterableKind` represents data structures which can be _partitioned_ with effects in some `Applicative` functor.

Added in v3.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [model](#model)
  - [FilterableKind (interface)](#filterablekind-interface)
- [utils](#utils)
  - [filterKind](#filterkind)
  - [filterMapKind](#filtermapkind)
  - [partitionKind](#partitionkind)
  - [partitionMapKind](#partitionmapkind)

---

# model

## FilterableKind (interface)

**Signature**

```ts
export interface FilterableKind<T extends TypeLambda> extends TypeClass<T> {
  readonly partitionMapKind: <F extends TypeLambda>(
    F: Applicative<F>
  ) => <A, S, R, O, E, B, C>(
    f: (a: A) => Kind<F, S, R, O, E, Either<B, C>>
  ) => <TS, TR, TO, TE>(
    wa: Kind<T, TS, TR, TO, TE, A>
  ) => Kind<F, S, R, O, E, readonly [Kind<T, TS, TR, TO, TE, B>, Kind<T, TS, TR, TO, TE, C>]>
  readonly filterMapKind: <F extends TypeLambda>(
    F: Applicative<F>
  ) => <A, S, R, O, E, B>(
    f: (a: A) => Kind<F, S, R, O, E, Option<B>>
  ) => <TS, TR, TO, TE>(ta: Kind<T, TS, TR, TO, TE, A>) => Kind<F, S, R, O, E, Kind<T, TS, TR, TO, TE, B>>
}
```

Added in v3.0.0

# utils

## filterKind

**Signature**

```ts
export declare const filterKind: <G extends TypeLambda>(
  FilterableKindG: FilterableKind<G>
) => <F extends TypeLambda>(
  Applicative: Applicative<F>
) => <B extends A, S, R, O, E, A = B>(
  predicate: (a: A) => Kind<F, S, R, O, E, boolean>
) => <GS, GR, GO, GE>(self: Kind<G, GS, GR, GO, GE, B>) => Kind<F, S, R, O, E, Kind<G, GS, GR, GO, GE, B>>
```

Added in v3.0.0

## filterMapKind

**Signature**

```ts
export declare function filterMapKind<T extends TypeLambda>(
  T: Traversable<T>,
  C: Compactable<T>
): FilterableKind<T>['filterMapKind']
```

Added in v3.0.0

## partitionKind

**Signature**

```ts
export declare const partitionKind: <G extends TypeLambda>(
  FilterableKindG: FilterableKind<G>
) => <F extends TypeLambda>(
  Applicative: Applicative<F>
) => <B extends A, S, R, O, E, A = B>(
  predicate: (a: A) => Kind<F, S, R, O, E, boolean>
) => <GS, GR, GO, GE>(
  self: Kind<G, GS, GR, GO, GE, B>
) => Kind<F, S, R, O, E, readonly [Kind<G, GS, GR, GO, GE, B>, Kind<G, GS, GR, GO, GE, B>]>
```

Added in v3.0.0

## partitionMapKind

**Signature**

```ts
export declare function partitionMapKind<T extends TypeLambda>(
  T: Traversable<T>,
  C: Compactable<T>
): FilterableKind<T>['partitionMapKind']
```

Added in v3.0.0