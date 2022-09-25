/**
 * @since 3.0.0
 */
import type { TypeLambda, Kind, TypeClass } from './HKT'

// -------------------------------------------------------------------------------------
// model
// -------------------------------------------------------------------------------------

/**
 * @category type classes
 * @since 3.0.0
 */
export interface Composable<F extends TypeLambda> extends TypeClass<F> {
  readonly compose: <S, B, W2, E2, C>(
    bc: Kind<F, S, B, W2, E2, C>
  ) => <A, W1, E1>(ab: Kind<F, S, A, W1, E1, B>) => Kind<F, S, A, W1 | W2, E1 | E2, C>
}
