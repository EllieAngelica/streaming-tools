<script lang="ts">
	import { visibleAlerts } from '$lib/stores/alerts';
	import { configStore } from '$lib/stores/config';
	import { entranceKeyframes, exitKeyframes } from '$lib/utils/animations';
	import AlertCard from './AlertCard.svelte';

	const positionClasses: Record<string, string> = {
		'top-left': 'top-4 left-4 items-start',
		'top-right': 'top-4 right-4 items-end',
		'bottom-left': 'bottom-4 left-4 items-start',
		'bottom-right': 'bottom-4 right-4 items-end',
		center: 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 items-center'
	};

	function animateIn(node: HTMLElement) {
		const keyframes = entranceKeyframes[$configStore.animation.entrance];
		const duration = $configStore.animation.duration;
		node.animate(keyframes, { duration, easing: 'cubic-bezier(0.16, 1, 0.3, 1)', fill: 'forwards' });
	}

	function animateOut(node: HTMLElement): { duration: number; tick: (t: number) => void } {
		const keyframes = exitKeyframes[$configStore.animation.exit];
		const duration = $configStore.animation.duration;
		node.animate(keyframes, { duration, easing: 'ease-in', fill: 'forwards' });
		// Return Svelte transition contract
		return {
			duration,
			tick: () => {}
		};
	}
</script>

<div
	class="fixed flex flex-col pointer-events-none z-50 {positionClasses[$configStore.position]}"
	style:gap="{$configStore.display.gap}px"
>
	{#each $visibleAlerts as alert (alert.id)}
		<div
			class="pointer-events-auto"
			use:animateIn
			out:animateOut
		>
			<AlertCard {alert} config={$configStore} />
		</div>
	{/each}
</div>
