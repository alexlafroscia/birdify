import { type Readable, readable, derived, writable } from 'svelte/store';

export function list<T>(): Readable<T[]> & { push(value: T): void } {
	const store = writable<T[]>([]);

	return {
		subscribe: store.subscribe,
		push(value) {
			store.update((current) => {
				current.push(value);
				return current;
			});
		}
	};
}

export function fromAsyncIterable<T>(iterable: AsyncIterable<T>): Readable<T> {
	const iterator = iterable[Symbol.asyncIterator]();
	const readbleStream = new ReadableStream({
		async pull(controller) {
			const { value, done } = await iterator.next();

			if (done) {
				controller.close();
			} else {
				controller.enqueue(value);
			}
		}
	});

	return fromStream(readbleStream);
}

export function fromStream<T>(stream: ReadableStream<T>): Readable<T> {
	const reader = stream.getReader();

	return readable<T>(undefined, (set) => {
		async function read() {
			const { done, value } = await reader.read();

			if (done) {
				reader.cancel();
				return;
			}

			set(value);

			read();
		}

		// Start reading
		read();
	});
}

export function asyncDerrived<T, U>(
	store: Readable<T>,
	map: (value: T) => Promise<U>
): Readable<U> {
	let pending = false;

	return derived(store, (value, set) => {
		if (!pending) {
			pending = true;

			map(value).then((result) => {
				set(result);
				pending = false;
			});
		}
	});
}
