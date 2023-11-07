export interface PlatoonMember {
	id: string;
	name: string;
	avatar: string;
	role: "General" | "Colonel" | "Lieutenant" | "Private" | "Unknown";
}

export interface Platoon {
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
