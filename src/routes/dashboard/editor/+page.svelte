<script lang="ts">
	import { configStore, saveConfig, resetConfig, encodeConfig } from '$lib/stores/config';
	import type { ThemeConfig, AlertPosition, EntranceAnimation, ExitAnimation } from '$lib/types';

	let config = $state<ThemeConfig>({ ...$configStore });

	// Sync store changes to local state
	$effect(() => {
		const unsub = configStore.subscribe((val) => {
			config = { ...val };
		});
		return unsub;
	});

	function handleSave() {
		saveConfig(config);
		saved = true;
		setTimeout(() => (saved = false), 2000);
	}

	function handleReset() {
		resetConfig();
	}

	function copyObsUrl() {
		const encoded = encodeConfig(config);
		const url = `${window.location.origin}/overlay?config=${encoded}`;
		navigator.clipboard.writeText(url);
		copied = true;
		setTimeout(() => (copied = false), 2000);
	}

	function exportJson() {
		const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = 'streamtools-theme.json';
		a.click();
		URL.revokeObjectURL(url);
	}

	let fileInput: HTMLInputElement;

	function importJson(event: Event) {
		const target = event.target as HTMLInputElement;
		const file = target.files?.[0];
		if (!file) return;
		const reader = new FileReader();
		reader.onload = () => {
			try {
				const imported = JSON.parse(reader.result as string);
				config = { ...config, ...imported };
				saveConfig(config);
			} catch {
				// Invalid JSON
			}
		};
		reader.readAsText(file);
	}

	let saved = $state(false);
	let copied = $state(false);

	const positions: AlertPosition[] = ['top-left', 'top-right', 'bottom-left', 'bottom-right', 'center'];
	const entranceAnimations: EntranceAnimation[] = ['fadeIn', 'slideLeft', 'slideRight', 'slideUp', 'bounceIn', 'zoomIn'];
	const exitAnimations: ExitAnimation[] = ['fadeOut', 'slideLeft', 'slideRight', 'slideDown', 'zoomOut'];

	let previewUrl = $derived(
		`/overlay?dev=true&config=${encodeConfig(config)}`
	);
</script>

<svelte:head>
	<title>Theme Editor — StreamTools</title>
</svelte:head>

<div class="space-y-6">
	<div class="flex items-center justify-between">
		<div>
			<h1 class="text-2xl font-bold">Theme Editor</h1>
			<p class="text-text-secondary mt-1">Customize your alert overlay appearance.</p>
		</div>
		<div class="flex gap-2">
			<button onclick={handleReset} class="px-4 py-2 bg-bg-tertiary hover:bg-border text-text-secondary text-sm font-medium rounded-lg transition-colors">
				Reset
			</button>
			<button onclick={handleSave} class="px-4 py-2 bg-accent hover:bg-accent-hover text-white text-sm font-medium rounded-lg transition-colors">
				{saved ? 'Saved!' : 'Save'}
			</button>
		</div>
	</div>

	<div class="grid lg:grid-cols-2 gap-6">
		<!-- Controls -->
		<div class="space-y-6">
			<!-- Position -->
			<div class="p-5 rounded-xl bg-bg-secondary border border-border space-y-4">
				<h3 class="font-semibold">Position</h3>
				<div class="grid grid-cols-3 gap-2">
					{#each positions as pos}
						<button
							onclick={() => (config.position = pos)}
							class="px-3 py-2 rounded-lg text-sm font-medium transition-colors {config.position === pos ? 'bg-accent text-white' : 'bg-bg-tertiary text-text-secondary hover:text-text-primary'}"
						>
							{pos}
						</button>
					{/each}
				</div>
			</div>

			<!-- Animation -->
			<div class="p-5 rounded-xl bg-bg-secondary border border-border space-y-4">
				<h3 class="font-semibold">Animation</h3>
				<label class="block">
					<span class="text-sm text-text-secondary block mb-1">Entrance</span>
					<select bind:value={config.animation.entrance} class="w-full px-3 py-2 rounded-lg bg-bg-tertiary border border-border text-text-primary text-sm focus:outline-none focus:border-accent">
						{#each entranceAnimations as anim}
							<option value={anim}>{anim}</option>
						{/each}
					</select>
				</label>
				<label class="block">
					<span class="text-sm text-text-secondary block mb-1">Exit</span>
					<select bind:value={config.animation.exit} class="w-full px-3 py-2 rounded-lg bg-bg-tertiary border border-border text-text-primary text-sm focus:outline-none focus:border-accent">
						{#each exitAnimations as anim}
							<option value={anim}>{anim}</option>
						{/each}
					</select>
				</label>
				<label class="block">
					<span class="text-sm text-text-secondary block mb-1">Duration: {config.animation.duration}ms</span>
					<input type="range" min="100" max="1000" step="50" bind:value={config.animation.duration} class="w-full" />
				</label>
			</div>

			<!-- Display -->
			<div class="p-5 rounded-xl bg-bg-secondary border border-border space-y-4">
				<h3 class="font-semibold">Display</h3>
				<label class="block">
					<span class="text-sm text-text-secondary block mb-1">Show duration: {config.display.duration / 1000}s</span>
					<input type="range" min="2000" max="15000" step="500" bind:value={config.display.duration} class="w-full" />
				</label>
				<label class="block">
					<span class="text-sm text-text-secondary block mb-1">Max visible: {config.display.maxVisible}</span>
					<input type="range" min="1" max="8" step="1" bind:value={config.display.maxVisible} class="w-full" />
				</label>
				<label class="block">
					<span class="text-sm text-text-secondary block mb-1">Gap: {config.display.gap}px</span>
					<input type="range" min="4" max="32" step="2" bind:value={config.display.gap} class="w-full" />
				</label>
			</div>

			<!-- Style -->
			<div class="p-5 rounded-xl bg-bg-secondary border border-border space-y-4">
				<h3 class="font-semibold">Style</h3>
				<div class="grid grid-cols-3 gap-4">
					<label class="block">
						<span class="text-sm text-text-secondary block mb-1">Background</span>
						<input type="color" bind:value={config.style.backgroundColor} class="w-full h-10 rounded-lg cursor-pointer" />
					</label>
					<label class="block">
						<span class="text-sm text-text-secondary block mb-1">Text</span>
						<input type="color" bind:value={config.style.textColor} class="w-full h-10 rounded-lg cursor-pointer" />
					</label>
					<label class="block">
						<span class="text-sm text-text-secondary block mb-1">Accent</span>
						<input type="color" bind:value={config.style.accentColor} class="w-full h-10 rounded-lg cursor-pointer" />
					</label>
				</div>
				<label class="block">
					<span class="text-sm text-text-secondary block mb-1">Font size: {config.style.fontSize}px</span>
					<input type="range" min="12" max="24" step="1" bind:value={config.style.fontSize} class="w-full" />
				</label>
				<label class="block">
					<span class="text-sm text-text-secondary block mb-1">Border radius: {config.style.borderRadius}px</span>
					<input type="range" min="0" max="24" step="2" bind:value={config.style.borderRadius} class="w-full" />
				</label>
				<label class="block">
					<span class="text-sm text-text-secondary block mb-1">Opacity: {config.style.opacity}</span>
					<input type="range" min="0.5" max="1" step="0.05" bind:value={config.style.opacity} class="w-full" />
				</label>
			</div>

			<!-- Actions -->
			<div class="p-5 rounded-xl bg-bg-secondary border border-border space-y-3">
				<h3 class="font-semibold">Export / Import</h3>
				<div class="flex gap-2 flex-wrap">
					<button onclick={copyObsUrl} class="px-4 py-2 bg-accent/10 text-accent text-sm font-medium rounded-lg hover:bg-accent/20 transition-colors">
						{copied ? 'Copied!' : 'Copy OBS URL'}
					</button>
					<button onclick={exportJson} class="px-4 py-2 bg-bg-tertiary text-text-secondary text-sm font-medium rounded-lg hover:bg-border transition-colors">
						Export JSON
					</button>
					<button onclick={() => fileInput.click()} class="px-4 py-2 bg-bg-tertiary text-text-secondary text-sm font-medium rounded-lg hover:bg-border transition-colors">
						Import JSON
					</button>
					<input bind:this={fileInput} type="file" accept=".json" onchange={importJson} class="hidden" />
				</div>
			</div>
		</div>

		<!-- Live Preview -->
		<div class="lg:sticky lg:top-8 h-fit">
			<div class="rounded-xl border border-border overflow-hidden">
				<div class="px-4 py-2 bg-bg-secondary border-b border-border flex items-center justify-between">
					<span class="text-sm font-medium text-text-secondary">Live Preview</span>
					<a href={previewUrl} target="_blank" class="text-xs text-accent hover:underline">Open in tab</a>
				</div>
				<div class="relative bg-black aspect-video">
					<iframe
						src={previewUrl}
						title="Overlay Preview"
						class="w-full h-full border-0"
					></iframe>
				</div>
			</div>
			<p class="text-xs text-text-muted mt-3">
				The preview shows your overlay exactly as it will appear in OBS. Use the test buttons on the <a href="/dashboard" class="text-accent hover:underline">dashboard</a> to fire test alerts.
			</p>
		</div>
	</div>
</div>
