import { closestMatch } from 'closest-match';

import allBirds from '../data/bird-cards.json';

const birdNames = allBirds.map((bird) => bird.name);

export function closestBird(input: string): string {
	// @ts-expect-error
	return closestMatch(input, birdNames);
}
