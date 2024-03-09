import { error } from '@sveltejs/kit';

import * as wiki from '$lib/wikipedia';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params }) => {
	try {
		const page = await wiki.page(params.bird);
		const summary = await wiki.summary(page);

		return {
			page,
			summary
		};
	} catch (e) {
		if (e && typeof e === 'object' && 'name' in e && e.name === 'pageError') {
			throw error(404, {
				message: 'Not found'
			});
		}

		throw e;
	}
};
