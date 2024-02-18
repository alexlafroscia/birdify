import { createWorker, type Worker } from 'tesseract.js';

let worker: Worker | null = null;

interface IndicatorConfig {
	x: number;
	y: number;
	width: number;
	height: number;
}

async function initializeWorker(): Promise<Worker> {
	const worker = await createWorker('eng');

	worker.setParameters({
		// Provide the characters to look for
		tessedit_char_whitelist: [
			// Upper-case letters
			'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
			// Lower-case letters
			'abcdefghijklmnopqrstuvwxyz',
			// Whitespace
			' ',
			// Punctuation
			"'"
		].join('')
	});

	return worker;
}

export function populateCanvas(
	video: HTMLVideoElement,
	canvas: HTMLCanvasElement,
	indicator: IndicatorConfig
): void {
	canvas.height = indicator.height;
	canvas.width = indicator.width;

	const sx = indicator.x;
	const sy = indicator.y;
	const sWidth = indicator.width;
	const sHeight = indicator.height;

	// destination
	const dx = 0;
	const dy = 0;
	const dWidth = indicator.width;
	const dHeight = indicator.height;

	canvas.getContext('2d')?.drawImage(
		video,

		// Sub-image to actually draw
		sx,
		sy,
		sWidth,
		sHeight,

		// Destination image
		dx,
		dy,
		dWidth,
		dHeight
	);
}

export function getSnapshot(
	video: HTMLVideoElement,
	indicator: IndicatorConfig,
	canvas: HTMLCanvasElement = document.createElement('canvas')
) {
	populateCanvas(video, canvas, indicator);

	return canvas;
}

export async function ocr(
	video: HTMLVideoElement,
	indicator: IndicatorConfig,
	canvas?: HTMLCanvasElement
): Promise<string> {
	if (!worker) {
		worker = await initializeWorker();
	}

	const snapshot = getSnapshot(video, indicator, canvas);
	const {
		data: { text }
	} = await worker.recognize(snapshot);

	return text;
}
