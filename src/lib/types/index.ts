/** Normalized alert event — all sources map into this shape */
export interface AlertEvent {
	id: string;
	type: 'follow' | 'sub' | 'tip' | 'merch';
	source: 'streamelements' | 'kofi' | 'kick';
	username: string;
	message?: string;
	amount?: number;
	currency?: string;
	tier?: string;
	timestamp: number;
}

/** Alert position on the OBS canvas */
export type AlertPosition =
	| 'top-left'
	| 'top-right'
	| 'bottom-left'
	| 'bottom-right'
	| 'center';

/** Available entrance animations */
export type EntranceAnimation =
	| 'fadeIn'
	| 'slideLeft'
	| 'slideRight'
	| 'slideUp'
	| 'bounceIn'
	| 'zoomIn';

/** Available exit animations */
export type ExitAnimation =
	| 'fadeOut'
	| 'slideLeft'
	| 'slideRight'
	| 'slideDown'
	| 'zoomOut';

/** Style properties for alert cards */
export interface AlertStyle {
	backgroundColor: string;
	textColor: string;
	accentColor: string;
	fontFamily: string;
	fontSize: number;
	borderRadius: number;
	padding: number;
	showAvatar: boolean;
	opacity: number;
}

/** Full theme configuration saved to localStorage */
export interface ThemeConfig {
	position: AlertPosition;
	animation: {
		entrance: EntranceAnimation;
		exit: ExitAnimation;
		duration: number;
	};
	display: {
		duration: number;
		maxVisible: number;
		gap: number;
	};
	style: AlertStyle;
	variants: {
		follow?: Partial<AlertStyle>;
		sub?: Partial<AlertStyle>;
		tip?: Partial<AlertStyle>;
	};
}

/** Connection credentials per source */
export interface SourceConfig {
	streamelements?: { jwtToken: string; enabled: boolean };
	kofi?: { verificationToken: string; enabled: boolean };
	kick?: { channelSlug: string; chatroomId: number; enabled: boolean };
}

/** Connection status for a source */
export type ConnectionStatus = 'disconnected' | 'connecting' | 'connected' | 'error';
