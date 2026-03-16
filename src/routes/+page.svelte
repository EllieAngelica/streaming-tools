<script lang="ts">
	import { pushAlert, createTestAlert, clearAlerts } from '$lib/stores/alerts';
	import type { AlertEvent } from '$lib/types';

	const features = [
		{
			icon: '⚡',
			title: 'Real-Time Alerts',
			description: 'Instant follow, sub, and tip notifications powered by WebSocket connections to StreamElements, Kick, and Ko-fi.'
		},
		{
			icon: '🎨',
			title: 'Theme Editor',
			description: 'Visual editor with live preview. Customize colors, fonts, animations, and layout — no code required.'
		},
		{
			icon: '📺',
			title: 'OBS Ready',
			description: 'Lightweight overlay page designed for OBS browser sources. Transparent background, minimal resource usage.'
		},
		{
			icon: '🔌',
			title: 'Multi-Source',
			description: 'Unified alert system pulling from StreamElements, Kick (Pusher), and Ko-fi webhooks into a single overlay.'
		},
		{
			icon: '🚀',
			title: 'Vercel Deploy',
			description: 'Deploy in seconds with Vercel. Serverless API routes handle webhooks, SSE streams events to your overlay.'
		},
		{
			icon: '🛠️',
			title: 'Open Source',
			description: 'Built with SvelteKit, Tailwind CSS, and TypeScript. Fork it, extend it, make it yours.'
		}
	];

	const techStack = [
		{ name: 'SvelteKit', color: '#ff3e00' },
		{ name: 'Svelte 5', color: '#ff3e00' },
		{ name: 'TypeScript', color: '#3178c6' },
		{ name: 'Tailwind CSS', color: '#06b6d4' },
		{ name: 'Vercel', color: '#ffffff' },
		{ name: 'Socket.IO', color: '#010101' },
		{ name: 'Pusher', color: '#300d4f' }
	];

	let demoRunning = $state(false);
	let demoInterval: ReturnType<typeof setInterval> | undefined;

	function startDemo() {
		if (demoRunning) {
			stopDemo();
			return;
		}
		demoRunning = true;
		const types: AlertEvent['type'][] = ['follow', 'sub', 'tip'];
		// Fire one immediately
		pushAlert(createTestAlert(types[Math.floor(Math.random() * types.length)]));
		demoInterval = setInterval(() => {
			pushAlert(createTestAlert(types[Math.floor(Math.random() * types.length)]));
		}, 3000);
	}

	function stopDemo() {
		demoRunning = false;
		if (demoInterval) {
			clearInterval(demoInterval);
			demoInterval = undefined;
		}
		clearAlerts();
	}
</script>

<svelte:head>
	<title>StreamTools — Real-Time Streaming Alerts & Overlays</title>
	<meta name="description" content="Open-source streaming alerts toolkit for Kick, StreamElements, and Ko-fi. Custom OBS overlays with a visual theme editor." />
	<meta property="og:title" content="StreamTools — Real-Time Streaming Alerts & Overlays" />
	<meta property="og:description" content="Open-source streaming alerts toolkit for Kick, StreamElements, and Ko-fi." />
	<meta property="og:type" content="website" />
</svelte:head>

<!-- Alert overlay for demo -->
{#await import('$lib/components/alerts/AlertContainer.svelte') then { default: AlertContainer }}
	<AlertContainer />
{/await}

<div class="min-h-screen bg-bg-primary text-text-primary">
	<!-- Nav -->
	<nav class="fixed top-0 w-full z-40 bg-bg-primary/80 backdrop-blur-lg border-b border-border">
		<div class="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
			<a href="/" class="flex items-center gap-2 text-lg font-bold">
				<span class="w-8 h-8 bg-accent rounded-lg flex items-center justify-center text-sm">ST</span>
				StreamTools
			</a>
			<div class="flex items-center gap-4">
				<a href="/dashboard" class="text-text-secondary hover:text-text-primary transition-colors text-sm font-medium">
					Dashboard
				</a>
				<a href="/overlay?dev=true" class="text-text-secondary hover:text-text-primary transition-colors text-sm font-medium">
					Overlay
				</a>
			</div>
		</div>
	</nav>

	<!-- Hero -->
	<section class="pt-32 pb-20 px-6">
		<div class="max-w-4xl mx-auto text-center">
			<div class="inline-block px-4 py-1.5 rounded-full bg-accent/10 text-accent text-sm font-medium mb-6">
				Open Source Streaming Toolkit
			</div>
			<h1 class="text-5xl md:text-6xl font-bold leading-tight mb-6">
				Real-Time Alerts<br />
				<span class="text-accent">for Your Stream</span>
			</h1>
			<p class="text-xl text-text-secondary max-w-2xl mx-auto mb-10 leading-relaxed">
				Custom OBS overlays powered by StreamElements, Kick, and Ko-fi.
				Visual theme editor, animated alerts, zero hassle.
			</p>
			<div class="flex items-center justify-center gap-4 flex-wrap">
				<button
					onclick={startDemo}
					class="px-6 py-3 bg-accent hover:bg-accent-hover text-white font-semibold rounded-xl transition-all hover:shadow-lg hover:shadow-accent-glow"
				>
					{demoRunning ? 'Stop Demo' : 'Live Demo'}
				</button>
				<a
					href="/dashboard"
					class="px-6 py-3 bg-bg-secondary hover:bg-bg-tertiary text-text-primary font-semibold rounded-xl border border-border transition-colors"
				>
					Open Dashboard
				</a>
			</div>
		</div>
	</section>

	<!-- Features -->
	<section class="py-20 px-6 border-t border-border">
		<div class="max-w-6xl mx-auto">
			<h2 class="text-3xl font-bold text-center mb-4">Everything You Need</h2>
			<p class="text-text-secondary text-center mb-12 max-w-xl mx-auto">
				A complete alert system that connects your streaming platforms to beautiful OBS overlays.
			</p>
			<div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
				{#each features as feature}
					<div class="p-6 rounded-2xl bg-bg-secondary border border-border hover:border-accent/30 transition-colors">
						<div class="text-2xl mb-3">{feature.icon}</div>
						<h3 class="text-lg font-semibold mb-2">{feature.title}</h3>
						<p class="text-text-secondary text-sm leading-relaxed">{feature.description}</p>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<!-- Tech Stack -->
	<section class="py-20 px-6 border-t border-border">
		<div class="max-w-4xl mx-auto text-center">
			<h2 class="text-3xl font-bold mb-4">Built With</h2>
			<p class="text-text-secondary mb-10">Modern stack, minimal dependencies, maximum performance.</p>
			<div class="flex flex-wrap items-center justify-center gap-3">
				{#each techStack as tech}
					<span
						class="px-4 py-2 rounded-lg bg-bg-secondary border border-border text-sm font-medium text-text-primary"
					>
						{tech.name}
					</span>
				{/each}
			</div>
		</div>
	</section>

	<!-- Footer -->
	<footer class="py-8 px-6 border-t border-border">
		<div class="max-w-6xl mx-auto flex items-center justify-between text-sm text-text-muted">
			<span>StreamTools</span>
			<span>Built for streamers, by a streamer.</span>
		</div>
	</footer>
</div>
