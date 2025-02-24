# TypeScript Arithmetic

This repository showcases how to use TypeScript to define arithmetical operations on numbers, represented as literal number types.

Here is a selection of "unit tests" from `index.ts`.

```ts
12 satisfies Add<5, 7>;
true satisfies IsLessThanOrEqual<4, 5>;
45 satisfies Subtract<50, 5>;
120 satisfies Multiply<5, 24>;
27 satisfies Power<3, 3>;
3 satisfies Quotient<6, 2>;
[1, 2, 5, 10] satisfies Divisors<10>;
true satisfies IsPrimeNumber<31>;
24 satisfies Factorial<4>;
21 satisfies Fibonacci<8>;
3 satisfies GCD<9, 6>;
```
