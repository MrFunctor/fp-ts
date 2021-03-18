import * as _ from '../../src/function'
import * as A from '../../src/ReadonlyArray'

//
// flip
//

// should handle generics
declare function snoc<A>(init: ReadonlyArray<A>, end: A): ReadonlyArray<A>
_.flip(snoc) // $ExpectType <A>(b: A, a: readonly A[]) => ReadonlyArray<A>

// $ExpectType <A>(init: readonly A[], end: A) => Option<A>
_.flow(snoc, A.head)

//
// tupled
//

_.tupled(A.insertAt)([0, 'a']) // $ExpectType (as: readonly string[]) => Option<ReadonlyNonEmptyArray<string>>

//
// untupled
//

_.untupled(_.tupled(A.insertAt)) // $ExpectType <A>(i: number, a: A) => (as: readonly A[]) => Option<ReadonlyNonEmptyArray<A>>
