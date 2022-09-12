/**
 * A `FunctorWithIndex` is a type constructor which supports a mapping operation `mapWithIndex`.
 *
 * `mapWithIndex` can be used to turn functions `i -> a -> b` into functions `f a -> f b` whose argument and return types use the type
 * constructor `f` to represent some computational context.
 *
 * Instances must satisfy the following laws:
 *
 * 1. Identity: `F.mapWithIndex((_i, a) => a) <-> fa`
 * 2. Composition: `F.mapWithIndex((_i, a) => bc(ab(a))) <-> flow(F.mapWithIndex((_i, a) => ab(a)), F.mapWithIndex((_i, b) => bc(b)))`
 *
 * @since 3.0.0
 */
import { pipe } from './function'
import type { ComposeF, HKT, Kind, Typeclass } from './HKT'

// -------------------------------------------------------------------------------------
// model
// -------------------------------------------------------------------------------------

/**
 * @category type classes
 * @since 3.0.0
 */
export interface FunctorWithIndex<F extends HKT, I> extends Typeclass<F> {
  readonly mapWithIndex: <A, B>(
    f: (i: I, a: A) => B
  ) => <S, R, W, E>(fa: Kind<F, S, R, W, E, A>) => Kind<F, S, R, W, E, B>
}
// -------------------------------------------------------------------------------------
// combinators
// -------------------------------------------------------------------------------------

/**
 * `mapWithIndex` composition.
 *
 * @category combinators
 * @since 3.0.0
 */
export function mapWithIndex<F extends HKT, I, G extends HKT, J>(
  F: FunctorWithIndex<F, I>,
  G: FunctorWithIndex<G, J>
): FunctorWithIndex<ComposeF<F, G>, [I, J]>['mapWithIndex'] {
  return (f) =>
    F.mapWithIndex((i, ga) =>
      pipe(
        ga,
        G.mapWithIndex((j, a) => f([i, j], a))
      )
    )
}
