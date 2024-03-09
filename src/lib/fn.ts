export function memoize<Arg, Result>(input: (arg: Arg) => Result): (arg: Arg) => Result {
	const RESULT_CACHE = new Map<Arg, Result>();

	return (arg: Arg) => {
		if (RESULT_CACHE.has(arg)) {
			return RESULT_CACHE.get(arg)!;
		}

		const result = input(arg);

		RESULT_CACHE.set(arg, result);

		return result;
	};
}
