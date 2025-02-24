// ---------------
// Special Numbers
// ---------------

type Zero = 0;
type One = 1;
type Two = 2;

// ---------------------
// Tuple of given length
// ---------------------

type EnsureNumber<A extends number> = A extends number ? A : never;

type Length<T extends any[]> = EnsureNumber<T['length']>;

type Tuple<N extends number, T, Accumulator extends T[] = []> = Length<Accumulator> extends N
	? Accumulator
	: Tuple<N, T, [...Accumulator, T]>;
[] satisfies Tuple<0, number>;
[0] satisfies Tuple<1, number>;
['a', 'b'] satisfies Tuple<2, string>;
['c', true, () => {}] satisfies Tuple<3, any>;

// @ts-expect-error
[1, 2, 3] satisfies Tuple<2, number>;
// @ts-expect-error
[1] satisfies Tuple<2, number>;
// @ts-expect-error
['ok'] satisfies Tuple<1, number>;

// ------------------
// Adding two numbers
// ------------------

type Add<A extends number, B extends number> = Length<[...Tuple<A, any>, ...Tuple<B, any>]>;

0 satisfies Add<0, 0>;
1 satisfies Add<0, 1>;
12 satisfies Add<5, 7>;
300 satisfies Add<120, 180>;

// @ts-expect-error
0 satisfies Add<1, 0>;
// @ts-expect-error
4 satisfies Add<2, 3>;

// ---------------------------
// The relation <= for numbers
// ---------------------------

type IsLessThanOrEqual<A extends number, B extends number> = Tuple<B, any> extends [
	...Tuple<A, any>,
	...infer _Rest,
]
	? true
	: false;

true satisfies IsLessThanOrEqual<0, 0>;
true satisfies IsLessThanOrEqual<0, 1>;
true satisfies IsLessThanOrEqual<4, 5>;

false satisfies IsLessThanOrEqual<1, 0>;
false satisfies IsLessThanOrEqual<3, 2>;
false satisfies IsLessThanOrEqual<10, 1>;

// -------------------------
// The < relation for numbers
// -------------------------

type IsLessThan<A extends number, B extends number> = IsLessThanOrEqual<Increment<A>, B>;

true satisfies IsLessThan<2, 5>;
true satisfies IsLessThan<2, 3>;
false satisfies IsLessThan<2, 2>;
false satisfies IsLessThan<2, 1>;

// -----------------------
// Subtracting two numbers
// -----------------------

type Subtract<A extends number, B extends number> = Tuple<A, any> extends [
	...Tuple<B, any>,
	...infer Rest,
]
	? Length<Rest>
	: never;

0 satisfies Subtract<0, 0>;
0 satisfies Subtract<1, 1>;
0 satisfies Subtract<2, 2>;
1 satisfies Subtract<2, 1>;
45 satisfies Subtract<50, 5>;

// @ts-expect-error
0 satisfies Subtract<1, 0>;
// @ts-expect-error
1 satisfies Subtract<0, 1>;
// @ts-expect-error
1 satisfies Subtract<1, 2>;

// ------------------
// Decrement a number
// ------------------

type Decrement<A extends number> = Subtract<A, One>;

0 satisfies Decrement<1>;
1 satisfies Decrement<2>;
2 satisfies Decrement<3>;

// @ts-expect-error
0 satisfies Decrement<0>;
// @ts-expect-error
1 satisfies Decrement<3>;

// ------------------
// Increment a number
// ------------------

type Increment<A extends number> = Add<A, One>;

1 satisfies Increment<0>;
2 satisfies Increment<1>;
3 satisfies Increment<2>;

// @ts-expect-error
1 satisfies Increment<1>;
// @ts-expect-error
0 satisfies Increment<0>;

// -----------------------
// Multiplying two numbers
// -----------------------

type Multiply<A extends number, B extends number> = B extends Zero
	? Zero
	: Add<Multiply<A, Decrement<B>>, A>;

0 satisfies Multiply<0, 0>;
0 satisfies Multiply<0, 1>;
2 satisfies Multiply<1, 2>;
6 satisfies Multiply<2, 3>;
6 satisfies Multiply<3, 2>;
120 satisfies Multiply<5, 24>;

// @ts-expect-error
0 satisfies Multiply<1, 1>;
// @ts-expect-error
0 satisfies Multiply<2, 2>;
// @ts-expect-error
35 satisfies Multiply<3, 5>;

// -----------------
// Powers of numbers
// -----------------

type Power<Base extends number, Exponent extends number> = Exponent extends Zero
	? One
	: Multiply<Base, Power<Base, Decrement<Exponent>>>;

1 satisfies Power<0, 0>;
1 satisfies Power<2, 0>;
2 satisfies Power<2, 1>;
4 satisfies Power<2, 2>;
8 satisfies Power<2, 3>;
27 satisfies Power<3, 3>;

// ------------------
// Quotient of numbers
// ------------------

type Quotient<A extends number, B extends number, C extends number = 0> = B extends Zero
	? never
	: B extends One
	? A
	: A extends Zero
	? Zero
	: A extends B
	? One
	: IsLessThan<A, C> extends true
	? never
	: Multiply<B, C> extends A
	? C
	: Quotient<A, B, Increment<C>>;

0 satisfies Quotient<0, 2>;
1 satisfies Quotient<4, 4>;
2 satisfies Quotient<4, 2>;
3 satisfies Quotient<6, 2>;
7 satisfies Quotient<7, 1>;
4 satisfies Quotient<12, 3>;

// --------------------------------
// Divisibility relation of numbers
// --------------------------------

type Divides<A extends number, B extends number> = B extends Zero
	? true
	: A extends Zero
	? false
	: Quotient<B, A> extends never
	? false
	: true;

true satisfies Divides<1, 4>;
true satisfies Divides<0, 0>;
true satisfies Divides<2, 0>;
true satisfies Divides<2, 4>;
true satisfies Divides<5, 5>;
true satisfies Divides<11, 121>;

false satisfies Divides<0, 3>;
false satisfies Divides<2, 3>;
false satisfies Divides<2, 13>;
false satisfies Divides<4, 2>;

// -------------------------
// List of positive divisors
// -------------------------

type Divisors<A extends number, Result extends number[] = [], D extends number = 1> = IsLessThan<
	A,
	D
> extends true
	? Result
	: Divides<D, A> extends true
	? Divisors<A, [...Result, D], Increment<D>>
	: Divisors<A, Result, Increment<D>>;

[1, 2, 3, 6] satisfies Divisors<6>;
[1] satisfies Divisors<1>;
[1, 5] satisfies Divisors<5>;
[1, 2, 5, 10] satisfies Divisors<10>;

// -------------
// Prime numbers
// -------------

type IsPrimeNumber<A extends number> = A extends Zero
	? false
	: Length<Divisors<A>> extends Two
	? true
	: false;

true satisfies IsPrimeNumber<3>;
true satisfies IsPrimeNumber<5>;
true satisfies IsPrimeNumber<13>;
true satisfies IsPrimeNumber<31>;

false satisfies IsPrimeNumber<0>;
false satisfies IsPrimeNumber<1>;
false satisfies IsPrimeNumber<6>;

// ------------------
// Fibonacci sequence
// ------------------

type Fibonacci<N extends number> = N extends Zero
	? Zero
	: N extends One
	? One
	: Add<Fibonacci<Subtract<N, One>>, Fibonacci<Subtract<N, Two>>>;

0 satisfies Fibonacci<0>;
1 satisfies Fibonacci<1>;
1 satisfies Fibonacci<2>;
2 satisfies Fibonacci<3>;
3 satisfies Fibonacci<4>;
5 satisfies Fibonacci<5>;
8 satisfies Fibonacci<6>;
13 satisfies Fibonacci<7>;
21 satisfies Fibonacci<8>;

// ----------
// Factorials
// ----------

type Factorial<N extends number> = N extends Zero ? One : Multiply<N, Factorial<Decrement<N>>>;

1 satisfies Factorial<0>;
1 satisfies Factorial<1>;
2 satisfies Factorial<2>;
6 satisfies Factorial<3>;
24 satisfies Factorial<4>;
120 satisfies Factorial<5>;

// -----------------------
// Greatest common divisor
// -----------------------

type GCD<A extends number, B extends number> = IsLessThan<B, A> extends true
	? GCD<B, A>
	: A extends Zero
	? B
	: B extends A
	? A
	: GCD<A, Subtract<B, A>>;

4 satisfies GCD<0, 4>;
2 satisfies GCD<2, 6>;
1 satisfies GCD<5, 11>;
3 satisfies GCD<9, 6>;
3 satisfies GCD<102, 33>;

//
// ----------------------------------------------
//            Alternative Approaches
// ----------------------------------------------
//

// -----------------------------
// Flattening an array of arrays
// -----------------------------

type Flatten<Arr extends any[][]> = Arr extends [
	infer First extends any[],
	...infer Rest extends any[][],
]
	? [...First, ...Flatten<Rest>]
	: [];
[] satisfies Flatten<[]>;
[] satisfies Flatten<[[]]>;
[0, 1] satisfies Flatten<[[0, 1]]>;
[0, 1] satisfies Flatten<[[0, 1], []]>;
[0, 1, 2, 3] satisfies Flatten<[[0, 1], [2, 3]]>;
[0, 1, 2, 3] satisfies Flatten<[[0], [1], [2], [3]]>;

// @ts-expect-error
[] satisfies Flatten<[[0, 1]]>;
// @ts-expect-error
[0, 1] satisfies Flatten<[[0, 1], [2]]>;

// -----------------------------------
// Multiplying two numbers with arrays
// -----------------------------------

type MultiplyAlternative<A extends number, B extends number> = Length<
	Flatten<Tuple<A, Tuple<B, any>>>
>;

0 satisfies MultiplyAlternative<0, 0>;
0 satisfies MultiplyAlternative<0, 1>;
2 satisfies MultiplyAlternative<1, 2>;
6 satisfies MultiplyAlternative<2, 3>;
6 satisfies MultiplyAlternative<3, 2>;
120 satisfies MultiplyAlternative<5, 24>;

// @ts-expect-error
0 satisfies MultiplyAlternative<1, 1>;
// @ts-expect-error
0 satisfies MultiplyAlternative<2, 2>;
// @ts-expect-error
35 satisfies MultiplyAlternative<3, 5>;
