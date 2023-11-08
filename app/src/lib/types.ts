export interface Auth {
	iat: number;
	sub: string;
	vpy?: string[];
	vpt?: string[];
}

export interface UserContentMetadata {
	lastUpdatedAt: string;
	lastUpdatedBy: string;
}

export interface PlatoonMember {
	id: string;
	name: string;
	avatar: string;
	role: "General" | "Colonel" | "Lieutenant" | "Private" | "Unknown";
}

export interface Platoon {
	$metadata: UserContentMetadata;
	id: string;
	tag: string;
	name: string;
	description: string;
	currentSize: number;
	canApplyToJoin: boolean;
	canJoinWithoutApply: boolean;
	emblem: string;
	members: PlatoonMember[];
	servers: unknown[];
}

export interface PlatoonsMap {
	[key: string]: Platoon;
}

export interface PlayerGames {
	$metadata: UserContentMetadata;
	reports: {
		gameReportId: string;
		timestamp: number;
		mapKey: string;
		modeKey: string;
		serverName: string;
	}[];
}

export type TRNPlatform = "xbl" | "psn" | "origin";
