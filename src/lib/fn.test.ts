import { expect, test, vi } from 'vitest';
import { memoize } from './fn';

test('memoize', () => {
	const original = vi.fn((number: number) => number * number);
	const memoized = memoize(original);

	expect(original, 'Original value is not called on memoization').not.toBeCalled();

	expect(memoized(2), 'Memoized returns computed value').toBe(4);

	expect(original, 'Original function was called').toBeCalledTimes(1);

	expect(memoized(2), 'Memoized returns cached value').toBe(4);

	expect(original, 'Original function was still only called once').toBeCalledTimes(1);

	expect(memoized(3), 'A new value has result computed').toBe(9);

	expect(original, 'Original function was called a second time').toBeCalledTimes(2);

	expect(memoized(3), 'Memoized returns second cached value').toBe(9);

	expect(original, 'Original function still only called twice').toBeCalledTimes(2);
});
