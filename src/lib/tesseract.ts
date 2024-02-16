import { createWorker } from 'tesseract.js';
import requestAnimationFrames from 'request-animation-frames';

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
	const { height: heightInPx, width: widthInPx } = window.getComputedStyle(video);

	const height = parseInt(heightInPx.replace('px', ''));
	const width = parseInt(widthInPx.replace('px', ''));

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

export function getSnapshot(video: HTMLVideoElement, indicator: IndicatorConfig) {
	const canvas = document.createElement('canvas');

	populateCanvas(video, canvas, indicator);

	return canvas;
}

export async function ocr(video: HTMLVideoElement, indicator: IndicatorConfig) {
	const worker = await createWorker('eng');

	for await (const _timestamp of requestAnimationFrames()) {
		const snapshot = getSnapshot(video, indicator);
		const {
			data: { text }
		} = await worker.recognize(snapshot);

		if (text) {
			console.log({ text });
		}
	}
}
