import type { RequestHandler } from './$types';
import { alertBus } from '$lib/server/eventBus';

export const GET: RequestHandler = async () => {
	const stream = new ReadableStream({
		start(controller) {
			const encoder = new TextEncoder();

			// Send initial keepalive
			controller.enqueue(encoder.encode(': connected\n\n'));

			// Subscribe to alert events
			const unsubscribe = alertBus.subscribe((event) => {
				try {
					const data = `data: ${JSON.stringify(event)}\n\n`;
					controller.enqueue(encoder.encode(data));
				} catch {
					// Client may have disconnected
				}
			});

			// Send keepalive every 30 seconds to prevent timeout
			const keepalive = setInterval(() => {
				try {
					controller.enqueue(encoder.encode(': keepalive\n\n'));
				} catch {
					clearInterval(keepalive);
					unsubscribe();
				}
			}, 30000);

			// Cleanup when stream is cancelled
			const originalCancel = controller.close.bind(controller);
			controller.close = () => {
				clearInterval(keepalive);
				unsubscribe();
				originalCancel();
			};
		}
	});

	return new Response(stream, {
		headers: {
			'Content-Type': 'text/event-stream',
			'Cache-Control': 'no-cache',
			Connection: 'keep-alive'
		}
	});
};
