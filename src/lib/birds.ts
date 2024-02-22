import { closestMatch } from 'closest-match';

import allBirds from '../data/bird-cards.json';

const birdNames = allBirds.map((bird) => bird.name);

export function closestBird(input: string): string {
	// We can safely assert this isn't null; that's only the case when the
	// input array is empty
	return closestMatch(input, birdNames)!;
}

export function urlFor(input: string): string {
	return `/` + encodeURIComponent(input);
}
