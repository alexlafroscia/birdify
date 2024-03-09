import wiki, { type Page, type imageResult, type wikiSummary } from 'wikipedia';
import { memoize } from './fn';

export const page = memoize(function (name: string): Promise<Page> {
	return wiki.page(name);
});

export const images = memoize(function (page: Page): Promise<imageResult[]> {
	return page.images();
});

export const summary = memoize(function (page: Page): Promise<wikiSummary> {
	return page.summary();
});
