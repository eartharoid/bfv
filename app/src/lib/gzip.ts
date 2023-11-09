// use web standards rather than Node.js-specific APIs

// import type { Readable } from "stream";

// export function gzip(data: ReadableStream): ReadableStream {
// 	// @ts-ignore it exists
// 	return data.pipeThrough(new CompressionStream("gzip"));
// }

export function gunzip(data: ReadableStream): ReadableStream {
	// @ts-ignore it exists
	return data.pipeThrough(new DecompressionStream("gzip"));
}

// export function toStream(data: string): ReadableStream {
// 	return new ReadableStream({
// 		start(controller) {
// 			controller.enqueue(data);
// 			controller.close();
// 		}
// 	});
// }

// export function convertStream(stream: Readable): ReadableStream {
// 	return new ReadableStream({
// 		start(controller) {
// 			controller.enqueue(stream.read());
// 			controller.close();
// 		}
// 	});
// }
