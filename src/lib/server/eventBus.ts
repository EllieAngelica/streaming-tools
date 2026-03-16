import type { AlertEvent } from '$lib/types';

type Listener = (event: AlertEvent) => void;

/** Simple in-memory event bus for server-side alert relay.
 *  Can be swapped for Redis pub/sub in production. */
class EventBus {
	private listeners = new Set<Listener>();

	subscribe(listener: Listener): () => void {
		this.listeners.add(listener);
		return () => this.listeners.delete(listener);
	}

	emit(event: AlertEvent) {
		for (const listener of this.listeners) {
			listener(event);
		}
	}
}

export const alertBus = new EventBus();
