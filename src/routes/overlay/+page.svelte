<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import AlertContainer from '$lib/components/alerts/AlertContainer.svelte';
	import { pushAlert, createTestAlert, clearAlerts } from '$lib/stores/alerts';
	import { configStore, loadFromParam } from '$lib/stores/config';
	import type { AlertEvent } from '$lib/types';

	let devMode = $derived($page.url.searchParams.get('dev') === 'true');

	onMount(() => {
		// Load config from URL param if provided (for OBS browser source)
		const configParam = $page.url.searchParams.get('config');
		if (configParam) {
			configStore.set(loadFromParam(configParam));
		}

		// Connect to SSE for server-side events (Ko-fi webhooks)
		const evtSource = new EventSource('/api/events');
		evtSource.onmessage = (event) => {
			try {
				const alert: AlertEvent = JSON.parse(event.data);
				pushAlert(alert);
			} catch {
				// Ignore malformed events
			}
		};

		return () => {
			evtSource.close();
		};
	});

	function sendTest(type: AlertEvent['type']) {
		pushAlert(createTestAlert(type));
	}
</script>

<svelte:head>
	<title>Stream Overlay</title>
	<style>
		html, body {
			background: transparent !important;
			overflow: hidden;
		}
	</style>
</svelte:head>

<AlertContainer />

{#if devMode}
	<div class="fixed bottom-4 left-4 flex gap-2 z-[100] opacity-80 hover:opacity-100 transition-opacity">
		<button
			onclick={() => sendTest('follow')}
			class="px-3 py-1.5 bg-bg-secondary text-text-primary rounded-lg text-sm font-medium border border-border hover:bg-bg-tertiary transition-colors"
		>
			Test Follow
		</button>
		<button
			onclick={() => sendTest('sub')}
			class="px-3 py-1.5 bg-bg-secondary text-text-primary rounded-lg text-sm font-medium border border-border hover:bg-bg-tertiary transition-colors"
		>
			Test Sub
		</button>
		<button
			onclick={() => sendTest('tip')}
			class="px-3 py-1.5 bg-bg-secondary text-text-primary rounded-lg text-sm font-medium border border-border hover:bg-bg-tertiary transition-colors"
		>
			Test Tip
		</button>
		<button
			onclick={() => clearAlerts()}
			class="px-3 py-1.5 bg-error/20 text-error rounded-lg text-sm font-medium border border-error/30 hover:bg-error/30 transition-colors"
		>
			Clear
		</button>
	</div>
{/if}
