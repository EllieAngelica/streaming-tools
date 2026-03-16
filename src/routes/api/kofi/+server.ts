import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import type { AlertEvent } from '$lib/types';
import { alertBus } from '$lib/server/eventBus';
import { env } from '$env/dynamic/private';

export const POST: RequestHandler = async ({ request }) => {
	const formData = await request.formData();
	const dataStr = formData.get('data');

	if (!dataStr || typeof dataStr !== 'string') {
		error(400, 'Missing data field');
	}

	let payload: Record<string, unknown>;
	try {
		payload = JSON.parse(dataStr);
	} catch {
		error(400, 'Invalid JSON in data field');
	}

	// Verify the Ko-fi token
	const token = env.KOFI_VERIFICATION_TOKEN;
	if (token && payload.verification_token !== token) {
		error(401, 'Invalid verification token');
	}

	// Map Ko-fi type to our alert type
	const typeMap: Record<string, AlertEvent['type']> = {
		Donation: 'tip',
		Subscription: 'sub',
		'Shop Order': 'merch'
	};

	const alertType = typeMap[payload.type as string] ?? 'tip';

	const alert: AlertEvent = {
		id: crypto.randomUUID(),
		type: alertType,
		source: 'kofi',
		username: (payload.from_name as string) || 'Anonymous',
		message: (payload.message as string) || undefined,
		amount: payload.amount ? parseFloat(payload.amount as string) : undefined,
		currency: (payload.currency as string) || 'USD',
		timestamp: Date.now()
	};

	alertBus.emit(alert);

	return json({ success: true });
};
