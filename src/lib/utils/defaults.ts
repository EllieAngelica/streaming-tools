import type { ThemeConfig } from '$lib/types';

export const DEFAULT_THEME_CONFIG: ThemeConfig = {
	position: 'top-right',
	animation: {
		entrance: 'slideLeft',
		exit: 'fadeOut',
		duration: 400
	},
	display: {
		duration: 5000,
		maxVisible: 3,
		gap: 12
	},
	style: {
		backgroundColor: '#1e293b',
		textColor: '#f8fafc',
		accentColor: '#8b5cf6',
		fontFamily: 'Inter, system-ui, sans-serif',
		fontSize: 16,
		borderRadius: 12,
		padding: 16,
		showAvatar: true,
		opacity: 0.95
	},
	variants: {}
};
