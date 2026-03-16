import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import type { AlertEvent } from '$lib/types';
import { alertBus } from '$lib/server/eventBus';

export const POST: RequestHandler = async ({ request }) => {
	const body = await request.json();
	const type = body.type ?? 'tip';

	const validTypes = ['follow', 'sub', 'tip', 'merch'];
	if (!validTypes.includes(type)) {
		error(400, `Invalid alert type. Must be one of: ${validTypes.join(', ')}`);
	}

	const alert: AlertEvent = {
		id: crypto.randomUUID(),
		type,
		source: 'streamelements',
		username: body.username ?? 'TestUser',
		message: body.message ?? 'This is a test alert!',
		amount: type === 'tip' ? (body.amount ?? 5) : undefined,
		currency: type === 'tip' ? 'USD' : undefined,
		tier: type === 'sub' ? (body.tier ?? 'Tier 1') : undefined,
		timestamp: Date.now()
	};

	alertBus.emit(alert);

	return json({ success: true, alert });
};
