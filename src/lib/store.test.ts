import '@ungap/with-resolvers';
import { expect, test, vi } from 'vitest';
import { get } from 'svelte/store';

function wait(ms: number = 0) {
	return new Promise((resolve) => {
		setTimeout(resolve, ms);
	});
}

import { fromStream, fromAsyncIterable, asyncDerrived } from './store';

test('fromStream', async () => {
	const store = fromStream(
		new ReadableStream({
			start(controller) {
				controller.enqueue(1);
				controller.enqueue(2);
			}
		})
	);

	const listener = vi.fn();
	const unsub = store.subscribe(listener);

	expect(listener).toHaveBeenCalledTimes(1);
	expect(listener).toHaveBeenCalledWith(undefined);

	await wait();

	expect(listener).toHaveBeenCalledTimes(3);
	expect(listener).toHaveBeenCalledWith(2);

	unsub();
});

test('fromAsyncIterable', async () => {
	const store = fromAsyncIterable({
		async *[Symbol.asyncIterator]() {
			yield 1;
			yield 2;
		}
	});

	const listener = vi.fn();
	const unsub = store.subscribe(listener);

	expect(listener).toHaveBeenCalledTimes(1);
	expect(listener).toHaveBeenCalledWith(undefined);

	await wait();

	expect(listener).toHaveBeenCalledTimes(3);
	expect(listener).toHaveBeenCalledWith(2);

	unsub();
});

test('asyncDerrived', async () => {
	const input = fromStream(
		new ReadableStream({
			start(controller) {
				controller.enqueue(1);
				controller.enqueue(2);
				controller.enqueue(3);
			}
		})
	);

	const { promise: promise1, resolve: resolve1 } = Promise.withResolvers();
	const { promise: promise2, resolve: resolve2 } = Promise.withResolvers();
	const { promise: promise3, resolve: resolve3 } = Promise.withResolvers();

	const store = asyncDerrived(input, (value) => {
		if (value === 1) {
			return promise1;
		}

		if (value === 2) {
			return promise2;
		}

		if (value === 3) {
			return promise3;
		}

		return Promise.resolve(value);
	});

	expect(get(store)).toEqual(undefined);

	await wait();

	expect(get(store)).toEqual(undefined);

	resolve3('three');
	await wait();

	expect(get(store)).toEqual('three');
});
