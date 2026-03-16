import type { EntranceAnimation, ExitAnimation } from '$lib/types';

export const entranceKeyframes: Record<EntranceAnimation, Keyframe[]> = {
	fadeIn: [
		{ opacity: 0 },
		{ opacity: 1 }
	],
	slideLeft: [
		{ transform: 'translateX(100%)', opacity: 0 },
		{ transform: 'translateX(0)', opacity: 1 }
	],
	slideRight: [
		{ transform: 'translateX(-100%)', opacity: 0 },
		{ transform: 'translateX(0)', opacity: 1 }
	],
	slideUp: [
		{ transform: 'translateY(100%)', opacity: 0 },
		{ transform: 'translateY(0)', opacity: 1 }
	],
	bounceIn: [
		{ transform: 'scale(0.3)', opacity: 0 },
		{ transform: 'scale(1.05)', opacity: 0.8 },
		{ transform: 'scale(0.95)', opacity: 0.9 },
		{ transform: 'scale(1)', opacity: 1 }
	],
	zoomIn: [
		{ transform: 'scale(0)', opacity: 0 },
		{ transform: 'scale(1)', opacity: 1 }
	]
};

export const exitKeyframes: Record<ExitAnimation, Keyframe[]> = {
	fadeOut: [
		{ opacity: 1 },
		{ opacity: 0 }
	],
	slideLeft: [
		{ transform: 'translateX(0)', opacity: 1 },
		{ transform: 'translateX(-100%)', opacity: 0 }
	],
	slideRight: [
		{ transform: 'translateX(0)', opacity: 1 },
		{ transform: 'translateX(100%)', opacity: 0 }
	],
	slideDown: [
		{ transform: 'translateY(0)', opacity: 1 },
		{ transform: 'translateY(100%)', opacity: 0 }
	],
	zoomOut: [
		{ transform: 'scale(1)', opacity: 1 },
		{ transform: 'scale(0)', opacity: 0 }
	]
};
