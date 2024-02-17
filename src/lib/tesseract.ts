import { createWorker } from 'tesseract.js';

const worker = await createWorker('eng');

interface IndicatorConfig {
	x: number;
	y: number;
	width: number;
	height: number;
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
	const snapshot = getSnapshot(video, indicator, canvas);
	const {
		data: { text }
	} = await worker.recognize(snapshot);

	return text;
}
