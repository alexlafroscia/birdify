import wiki, { type Page, type imageResult, type wikiSummary } from 'wikipedia';

const PAGE_CACHE = new Map<string, Page>();
const IMAGES_CACHE = new WeakMap<Page, imageResult[]>();
const SUMMARY_CACHE = new WeakMap<Page, wikiSummary>();

export async function page(name: string): Promise<Page> {
	if (PAGE_CACHE.has(name)) {
		return PAGE_CACHE.get(name)!;
	}

	const result = await wiki.page(name);

	PAGE_CACHE.set(name, result);

	return result;
}

export async function images(page: Page): Promise<imageResult[]> {
	if (!page) {
		return [];
	}

	if (IMAGES_CACHE.has(page)) {
		return IMAGES_CACHE.get(page)!;
	}

	const results = await page.images();

	IMAGES_CACHE.set(page, results);

	return results;
}

export async function summary(page: Page): Promise<wikiSummary> {
	if (SUMMARY_CACHE.has(page)) {
		return SUMMARY_CACHE.get(page)!;
	}

	const result = await page.summary();

	SUMMARY_CACHE.set(page, result);

	return result;
}
