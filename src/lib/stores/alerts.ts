import { writable, get } from 'svelte/store';
import type { AlertEvent } from '$lib/types';
import { configStore } from './config';

/** Currently visible alerts */
export const visibleAlerts = writable<AlertEvent[]>([]);

/** Backlog queue for alerts waiting to be shown */
const backlog: AlertEvent[] = [];

/** Active dismiss timers keyed by alert ID */
const timers = new Map<string, ReturnType<typeof setTimeout>>();

function showNext() {
	const config = get(configStore);
	const current = get(visibleAlerts);

	while (backlog.length > 0 && current.length < config.display.maxVisible) {
		const next = backlog.shift()!;
		current.push(next);
		scheduleDismiss(next.id, config.display.duration);
	}

	visibleAlerts.set([...current]);
}

function scheduleDismiss(id: string, duration: number) {
	const timer = setTimeout(() => {
		dismissAlert(id);
	}, duration);
	timers.set(id, timer);
}

/** Remove an alert from the visible list and show next from backlog */
export function dismissAlert(id: string) {
	const timer = timers.get(id);
	if (timer) {
		clearTimeout(timer);
		timers.delete(id);
	}

	visibleAlerts.update((alerts) => alerts.filter((a) => a.id !== id));

	// Show next from backlog after a brief gap
	setTimeout(showNext, 200);
}

/** Push a new alert into the system */
export function pushAlert(event: AlertEvent) {
	const config = get(configStore);
	const current = get(visibleAlerts);

	if (current.length >= config.display.maxVisible) {
		backlog.push(event);
	} else {
		visibleAlerts.update((alerts) => [...alerts, event]);
		scheduleDismiss(event.id, config.display.duration);
	}
}

/** Clear all alerts and backlog */
export function clearAlerts() {
	timers.forEach((timer) => clearTimeout(timer));
	timers.clear();
	backlog.length = 0;
	visibleAlerts.set([]);
}

/** Create a test alert for debugging */
export function createTestAlert(type: AlertEvent['type'] = 'tip'): AlertEvent {
	const names = ['StreamFan42', 'NightOwl', 'PixelHero', 'CozyViewer', 'ChatLurker'];
	const messages = ['Great stream!', 'Keep it up!', 'Love the content!', '', 'You rock!'];

	return {
		id: crypto.randomUUID(),
		type,
		source: type === 'tip' ? 'kofi' : 'streamelements',
		username: names[Math.floor(Math.random() * names.length)],
		message: messages[Math.floor(Math.random() * messages.length)] || undefined,
		amount: type === 'tip' ? Math.floor(Math.random() * 50) + 1 : undefined,
		currency: type === 'tip' ? 'USD' : undefined,
		tier: type === 'sub' ? ['Tier 1', 'Tier 2', 'Tier 3'][Math.floor(Math.random() * 3)] : undefined,
		timestamp: Date.now()
	};
}
