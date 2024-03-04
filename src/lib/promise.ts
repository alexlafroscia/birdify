interface Resolvers {
	promise: Promise<void>;
	resolve(): void;
	reject(error: any): void;
}

export function withResolvers(): Resolvers {
	let resolve, reject;

	const promise = new Promise<void>((resolveCb, rejectCb) => {
		resolve = resolveCb;
		reject = rejectCb;
	});

	return {
		promise,
		resolve() {
			resolve!();
		},
		reject(error: any) {
			reject!(error);
		}
	};
}
