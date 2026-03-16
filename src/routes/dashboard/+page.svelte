<script lang="ts">
	import { pushAlert, createTestAlert, visibleAlerts, clearAlerts } from '$lib/stores/alerts';
	import type { AlertEvent } from '$lib/types';

	let recentEvents = $state<AlertEvent[]>([]);
	let selectedTestType = $state<AlertEvent['type']>('tip');

	function sendTest() {
		const alert = createTestAlert(selectedTestType);
		recentEvents = [alert, ...recentEvents].slice(0, 50);
		pushAlert(alert);
	}

	const typeColors: Record<string, string> = {
		follow: 'bg-blue-500/10 text-blue-400',
		sub: 'bg-yellow-500/10 text-yellow-400',
		tip: 'bg-purple-500/10 text-purple-400',
		merch: 'bg-green-500/10 text-green-400'
	};

	const sourceStatus = [
		{ name: 'StreamElements', icon: '🎭', status: 'disconnected' as const, description: 'Socket.IO real-time events' },
		{ name: 'Ko-fi', icon: '☕', status: 'disconnected' as const, description: 'Webhook endpoint at /api/kofi' },
		{ name: 'Kick', icon: '🟢', status: 'disconnected' as const, description: 'Pusher WebSocket (experimental)' }
	];

	const statusColors = {
		connected: 'bg-success',
		connecting: 'bg-warning',
		disconnected: 'bg-text-muted',
		error: 'bg-error'
	};
</script>

<svelte:head>
	<title>Dashboard — StreamTools</title>
</svelte:head>

<div class="space-y-8">
	<div>
		<h1 class="text-2xl font-bold">Dashboard</h1>
		<p class="text-text-secondary mt-1">Manage your streaming alert connections and test your overlay.</p>
	</div>

	<!-- Connection Cards -->
	<section>
		<h2 class="text-lg font-semibold mb-4">Connections</h2>
		<div class="grid md:grid-cols-3 gap-4">
			{#each sourceStatus as source}
				<div class="p-5 rounded-xl bg-bg-secondary border border-border">
					<div class="flex items-center justify-between mb-3">
						<div class="flex items-center gap-2">
							<span class="text-xl">{source.icon}</span>
							<span class="font-semibold">{source.name}</span>
						</div>
						<div class="flex items-center gap-2">
							<span class="w-2 h-2 rounded-full {statusColors[source.status]}"></span>
							<span class="text-xs text-text-muted capitalize">{source.status}</span>
						</div>
					</div>
					<p class="text-sm text-text-muted">{source.description}</p>
				</div>
			{/each}
		</div>
	</section>

	<!-- Test Alerts -->
	<section>
		<h2 class="text-lg font-semibold mb-4">Test Alerts</h2>
		<div class="p-5 rounded-xl bg-bg-secondary border border-border">
			<div class="flex items-center gap-3 flex-wrap">
				<select
					bind:value={selectedTestType}
					class="px-3 py-2 rounded-lg bg-bg-tertiary border border-border text-text-primary text-sm focus:outline-none focus:border-accent"
				>
					<option value="follow">Follow</option>
					<option value="sub">Subscription</option>
					<option value="tip">Tip</option>
				</select>
				<button
					onclick={sendTest}
					class="px-4 py-2 bg-accent hover:bg-accent-hover text-white font-medium rounded-lg text-sm transition-colors"
				>
					Send Test Alert
				</button>
				<button
					onclick={() => clearAlerts()}
					class="px-4 py-2 bg-bg-tertiary hover:bg-border text-text-secondary font-medium rounded-lg text-sm transition-colors"
				>
					Clear All
				</button>
			</div>
			<p class="text-xs text-text-muted mt-3">
				Test alerts appear in the overlay. Open <a href="/overlay?dev=true" target="_blank" class="text-accent hover:underline">/overlay?dev=true</a> in another tab to see them.
			</p>
		</div>
	</section>

	<!-- Recent Events -->
	<section>
		<h2 class="text-lg font-semibold mb-4">Recent Events</h2>
		<div class="rounded-xl bg-bg-secondary border border-border overflow-hidden">
			{#if recentEvents.length === 0}
				<div class="p-8 text-center text-text-muted text-sm">
					No events yet. Send a test alert or connect a source to see events here.
				</div>
			{:else}
				<div class="divide-y divide-border max-h-96 overflow-y-auto">
					{#each recentEvents as event}
						<div class="px-5 py-3 flex items-center gap-4">
							<span class="px-2 py-0.5 rounded text-xs font-medium {typeColors[event.type]}">{event.type}</span>
							<span class="font-medium text-sm">{event.username}</span>
							{#if event.amount}
								<span class="text-accent text-sm font-semibold">${event.amount}</span>
							{/if}
							{#if event.message}
								<span class="text-text-muted text-sm truncate flex-1">{event.message}</span>
							{/if}
							<span class="text-text-muted text-xs ml-auto shrink-0">
								{new Date(event.timestamp).toLocaleTimeString()}
							</span>
						</div>
					{/each}
				</div>
			{/if}
		</div>
	</section>
</div>
