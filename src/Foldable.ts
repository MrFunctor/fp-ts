/**
 * @since 3.0.0
 */
import type { Chain } from './Chain'
import { flow, pipe } from './function'
import type { ComposeF, HKT, Kind, Typeclass } from './HKT'
import type { Monoid } from './Monoid'

// -------------------------------------------------------------------------------------
// model
// -------------------------------------------------------------------------------------

/**
 * @category type classes
 * @since 3.0.0
 */
export interface Foldable<F extends HKT> extends Typeclass<F> {
  readonly reduce: <B, A>(b: B, f: (b: B, a: A) => B) => <S, R, E>(fa: Kind<F, S, R, E, A>) => B
  readonly foldMap: <M>(M: Monoid<M>) => <A>(f: (a: A) => M) => <S, R, E>(fa: Kind<F, S, R, E, A>) => M
  readonly reduceRight: <B, A>(b: B, f: (a: A, b: B) => B) => <S, R, E>(fa: Kind<F, S, R, E, A>) => B
}
// -------------------------------------------------------------------------------------
// combinators
// -------------------------------------------------------------------------------------

/**
 * `reduce` composition.
 *
 * @category combinators
 * @since 3.0.0
 */
export function reduce<F extends HKT, G extends HKT>(
  F: Foldable<F>,
  G: Foldable<G>
): Foldable<ComposeF<F, G>>['reduce'] {
  return (b, f) => F.reduce(b, (b, ga) => G.reduce(b, f)(ga))
}

/**
 * `foldMap` composition.
 *
 * @category combinators
 * @since 3.0.0
 */
export function foldMap<F extends HKT, G extends HKT>(
  F: Foldable<F>,
  G: Foldable<G>
): Foldable<ComposeF<F, G>>['foldMap'] {
  return (M) => flow(G.foldMap(M), F.foldMap(M))
}

/**
 * `reduceRight` composition.
 *
 * @category combinators
 * @since 3.0.0
 */
export function reduceRight<F extends HKT, G extends HKT>(
  F: Foldable<F>,
  G: Foldable<G>
): Foldable<ComposeF<F, G>>['reduceRight'] {
  return (b, f) => F.reduceRight(b, (ga, b) => G.reduceRight(b, f)(ga))
}

// -------------------------------------------------------------------------------------
// utils
// -------------------------------------------------------------------------------------

/**
 * Similar to 'reduce', but the result is encapsulated in a monad.
 *
 * Note: this function is not generally stack-safe, e.g., for monads which build up thunks a la `IO`.
 *
 * @example
 * import { reduceE } from 'fp-ts/Foldable'
 * import { Chain, some } from 'fp-ts/Option'
 * import { tree, Foldable } from 'fp-ts/Tree'
 * import { pipe } from 'fp-ts/function'
 *
 * const t = tree(1, [tree(2, []), tree(3, []), tree(4, [])])
 * assert.deepStrictEqual(pipe(t, reduceE(Foldable)(Chain)(some(0), (b, a) => (a > 2 ? some(b + a) : some(b)))), some(7))
 *
 * @since 3.0.0
 */
export function reduceE<F extends HKT>(
  F: Foldable<F>
): <M extends HKT>(
  M: Chain<M>
) => <GS, GR, GE, B, A>(
  mb: Kind<M, GS, GR, GE, B>,
  f: (b: B, a: A) => Kind<M, GS, GR, GE, B>
) => <FS, FR, FE>(fa: Kind<F, FS, FR, FE, A>) => Kind<M, GS, GR, GE, B> {
  return (M) => (mb, f) =>
    F.reduce(mb, (mb, a) =>
      pipe(
        mb,
        M.chain((b) => f(b, a))
      )
    )
}

/**
 * Fold a data structure, accumulating values in some `Monoid`, combining adjacent elements using the specified separator.
 *
 * @example
 * import { intercalate } from 'fp-ts/Foldable'
 * import { Monoid } from 'fp-ts/string'
 * import * as T from 'fp-ts/Tree'
 * import { pipe } from 'fp-ts/function'
 *
 * const t = T.tree('a', [T.tree('b', []), T.tree('c', []), T.tree('d', [])])
 * assert.strictEqual(pipe(t, intercalate(T.Foldable)(Monoid)('|')), 'a|b|c|d')
 *
 * @since 3.0.0
 */
export function intercalate<F extends HKT>(
  F: Foldable<F>
): <M>(M: Monoid<M>) => (sep: M) => <S, R, E>(fm: Kind<F, S, R, E, M>) => M {
  return <M>(M: Monoid<M>) => (sep: M) => <S, R, E>(fm: Kind<F, S, R, E, M>) => {
    const go = ([init, acc]: readonly [boolean, M], m: M): readonly [boolean, M] =>
      init ? [false, m] : [false, pipe(acc, M.concat(sep), M.concat(m))]
    return pipe(fm, F.reduce([true, M.empty], go))[1]
  }
}

/**
 * Transforms a `Foldable` into a read-only array.
 *
 * @example
 * import { toReadonlyArray } from 'fp-ts/Foldable'
 * import { Foldable, tree } from 'fp-ts/Tree'
 *
 * const t = tree(1, [tree(2, []), tree(3, []), tree(4, [])])
 * assert.deepStrictEqual(toReadonlyArray(Foldable)(t), [1, 2, 3, 4])
 *
 * @since 3.0.0
 */
export function toReadonlyArray<F extends HKT>(
  F: Foldable<F>
): <S, R, E, A>(fa: Kind<F, S, R, E, A>) => ReadonlyArray<A> {
  return <S, R, E, A>(fa: Kind<F, S, R, E, A>) =>
    pipe(
      fa,
      F.reduce([], (acc: Array<A>, a: A) => {
        acc.push(a)
        return acc
      })
    )
}
