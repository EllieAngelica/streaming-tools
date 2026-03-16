<script lang="ts">
	import type { AlertEvent, AlertStyle, ThemeConfig } from '$lib/types';

	interface Props {
		alert: AlertEvent;
		config: ThemeConfig;
	}

	let { alert, config }: Props = $props();

	const typeIcons: Record<AlertEvent['type'], string> = {
		follow: '👤',
		sub: '⭐',
		tip: '💜',
		merch: '🛍️'
	};

	const typeLabels: Record<AlertEvent['type'], string> = {
		follow: 'New Follower',
		sub: 'New Sub',
		tip: 'Tip',
		merch: 'Merch'
	};

	let style = $derived<AlertStyle>({
		...config.style,
		...(config.variants[alert.type] ?? {})
	});
</script>

<div
	class="alert-card"
	style:--bg={style.backgroundColor}
	style:--text={style.textColor}
	style:--accent={style.accentColor}
	style:--font={style.fontFamily}
	style:--font-size="{style.fontSize}px"
	style:--radius="{style.borderRadius}px"
	style:--padding="{style.padding}px"
	style:--opacity={style.opacity}
>
	<div class="alert-icon">{typeIcons[alert.type]}</div>
	<div class="alert-body">
		<div class="alert-header">
			<span class="alert-type">{typeLabels[alert.type]}</span>
			{#if alert.amount}
				<span class="alert-amount">
					{alert.currency === 'USD' ? '$' : ''}{alert.amount}
					{alert.currency && alert.currency !== 'USD' ? alert.currency : ''}
				</span>
			{/if}
			{#if alert.tier}
				<span class="alert-tier">{alert.tier}</span>
			{/if}
		</div>
		<div class="alert-username">{alert.username}</div>
		{#if alert.message}
			<div class="alert-message">{alert.message}</div>
		{/if}
	</div>
</div>

<style>
	.alert-card {
		display: flex;
		align-items: flex-start;
		gap: 12px;
		background: var(--bg);
		color: var(--text);
		font-family: var(--font);
		font-size: var(--font-size);
		border-radius: var(--radius);
		padding: var(--padding);
		opacity: var(--opacity);
		border-left: 3px solid var(--accent);
		box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
		backdrop-filter: blur(12px);
		min-width: 280px;
		max-width: 400px;
	}

	.alert-icon {
		font-size: 1.5em;
		flex-shrink: 0;
		line-height: 1;
	}

	.alert-body {
		flex: 1;
		min-width: 0;
	}

	.alert-header {
		display: flex;
		align-items: center;
		gap: 8px;
		margin-bottom: 2px;
	}

	.alert-type {
		font-size: 0.75em;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: var(--accent);
		font-weight: 600;
	}

	.alert-amount {
		font-size: 0.85em;
		font-weight: 700;
		color: var(--accent);
	}

	.alert-tier {
		font-size: 0.7em;
		background: var(--accent);
		color: var(--bg);
		padding: 1px 6px;
		border-radius: 4px;
		font-weight: 600;
	}

	.alert-username {
		font-weight: 700;
		font-size: 1.1em;
		line-height: 1.3;
	}

	.alert-message {
		font-size: 0.85em;
		opacity: 0.8;
		margin-top: 4px;
		line-height: 1.4;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
	}
</style>
