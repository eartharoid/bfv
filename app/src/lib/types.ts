import type { z } from "zod";
import type { ZGameReport, ZGameMode, ZMap } from "./schemas";
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

export interface PlatoonSummary {
	id: string;
	tag: string;
	name: string;
	description: string | null;
	currentSize: number;
	canApplyToJoin: boolean;
	canJoinWithoutApply: boolean;
	emblem: string;
}

export interface Platoon extends PlatoonSummary {
	$metadata: UserContentMetadata;
	members: PlatoonMember[];
	servers: unknown[];
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

type BaseGameReport = z.infer<typeof ZGameReport>;

export interface GameReport extends BaseGameReport {
	$metadata: UserContentMetadata;
}

type BaseGameMode = z.infer<typeof ZGameMode>;

export interface GameMode extends BaseGameMode {
	$metadata: UserContentMetadata;
}

export type GameModes = Record<string, GameMode>;

type BaseMap = z.infer<typeof ZMap>;

export interface Map extends BaseMap {
	$metadata: UserContentMetadata;
}

export type Maps = Record<string, Map>;

export type TRNPlatform = "xbl" | "psn" | "origin";

export type XYData = {
	x: number | string;
	y: number;
}[]
