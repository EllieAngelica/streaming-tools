<script lang="ts">
	import type { Snippet } from 'svelte';
	import { page } from '$app/stores';

	interface Props {
		children: Snippet;
	}

	let { children }: Props = $props();

	const navItems = [
		{ href: '/dashboard', label: 'Dashboard', icon: '📊' },
		{ href: '/dashboard/editor', label: 'Theme Editor', icon: '🎨' }
	];
</script>

<div class="min-h-screen bg-bg-primary text-text-primary flex">
	<!-- Sidebar -->
	<aside class="w-64 bg-bg-secondary border-r border-border flex flex-col shrink-0">
		<div class="p-6 border-b border-border">
			<a href="/" class="flex items-center gap-2 text-lg font-bold">
				<span class="w-8 h-8 bg-accent rounded-lg flex items-center justify-center text-sm">ST</span>
				StreamTools
			</a>
		</div>
		<nav class="flex-1 p-4 flex flex-col gap-1">
			{#each navItems as item}
				<a
					href={item.href}
					class="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors {$page.url.pathname === item.href ? 'bg-accent/10 text-accent' : 'text-text-secondary hover:text-text-primary hover:bg-bg-tertiary/50'}"
				>
					<span>{item.icon}</span>
					{item.label}
				</a>
			{/each}
		</nav>
		<div class="p-4 border-t border-border">
			<a
				href="/overlay?dev=true"
				target="_blank"
				class="flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-text-muted hover:text-text-primary hover:bg-bg-tertiary/50 transition-colors"
			>
				<span>📺</span> Open Overlay
			</a>
		</div>
	</aside>

	<!-- Main content -->
	<main class="flex-1 overflow-auto">
		<div class="max-w-5xl mx-auto p-8">
			{@render children()}
		</div>
	</main>
</div>
