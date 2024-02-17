import { test, expect } from 'vitest';

import { closestBird } from './birds';

test('closestBird', () => {
	expect(closestBird('Abbots bby')).toBe("Abbott's Booby");
});
