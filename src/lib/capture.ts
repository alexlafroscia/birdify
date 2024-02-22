import { closestBird } from './birds';

const SCAN_TIME_MS = 4_000;

export class Capture {
	private startTime: number | undefined;
	private results = new Map<string, number>();

	isComplete: boolean = false;

	addScan(scan: string, timestamp: number): void {
		if (!this.startTime) {
			this.startTime = timestamp;
		}

		const guess = closestBird(scan);
		const guessCount = this.results.get(guess) ?? 0;

		this.results.set(guess, guessCount + 1);

		this.isComplete = this.startTime + SCAN_TIME_MS < timestamp;
	}

	get result(): string {
		let highestGuessCount = 0;
		let bestGuess: string | undefined;

		for (const [key, value] of this.results) {
			if (value > highestGuessCount) {
				highestGuessCount = value;
				bestGuess = key;
			}
		}

		if (!bestGuess) {
			throw new Error('No result computed');
		}

		return bestGuess;
	}
}
