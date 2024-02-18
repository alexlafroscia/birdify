import { error } from '@sveltejs/kit';

import * as wiki from '$lib/wikipedia';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params }) => {
	try {
		const page = await wiki.page(params.bird);
		const [images, summary] = await Promise.all([wiki.images(page), wiki.summary(page)]);

		return {
			page,
			summary,
			images
		};
	} catch (e) {
		if (e && typeof e === 'object' && 'name' in e && e.name === 'pageError') {
			throw error(404, {
				message: 'Not found'
			});
		}
	}
};
