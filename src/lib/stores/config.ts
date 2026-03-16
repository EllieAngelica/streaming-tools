import { writable } from 'svelte/store';
import { browser } from '$app/environment';
import type { ThemeConfig } from '$lib/types';
import { DEFAULT_THEME_CONFIG } from '$lib/utils/defaults';

const STORAGE_KEY = 'streaming-tools-theme';

function loadFromStorage(): ThemeConfig {
	if (!browser) return DEFAULT_THEME_CONFIG;

	try {
		const stored = localStorage.getItem(STORAGE_KEY);
		if (stored) {
			return { ...DEFAULT_THEME_CONFIG, ...JSON.parse(stored) };
		}
	} catch {
		// Ignore parse errors, use defaults
	}

	return DEFAULT_THEME_CONFIG;
}

/** Load config from a base64-encoded URL parameter */
export function loadFromParam(param: string): ThemeConfig {
	try {
		const json = atob(param);
		return { ...DEFAULT_THEME_CONFIG, ...JSON.parse(json) };
	} catch {
		return DEFAULT_THEME_CONFIG;
	}
}

/** Encode the current config as a base64 URL parameter */
export function encodeConfig(config: ThemeConfig): string {
	return btoa(JSON.stringify(config));
}

export const configStore = writable<ThemeConfig>(loadFromStorage());

/** Save current config to localStorage */
export function saveConfig(config: ThemeConfig) {
	if (browser) {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
	}
	configStore.set(config);
}

/** Reset config to defaults */
export function resetConfig() {
	if (browser) {
		localStorage.removeItem(STORAGE_KEY);
	}
	configStore.set(DEFAULT_THEME_CONFIG);
}
