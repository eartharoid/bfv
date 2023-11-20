import { z } from "zod";

export const ZGameMode = z.object({
	description: z.nullable(z.string()),
	imageUrl: z.null(),
	key: z.string(),
	locale: z.literal("en-US"),
	name: z.string(),
	title: z.literal("bfv"),
	type: z.literal("mode")
});

export const ZMap = z.object({
	description: z.nullable(z.string()),
	imageUrl: z.nullable(z.string().url()),
	key: z.string(),
	locale: z.literal("en-US"),
	location: z.string(),
	name: z.string(),
	title: z.literal("bfv"),
	type: z.literal("map")
});

export const ZPlatoonSummary = z.object({
	id: z.string(),
	tag: z.string(),
	name: z.string(),
	description: z.nullable(z.string()),
	currentSize: z.number().int().positive(),
	canApplyToJoin: z.boolean(),
	canJoinWithoutApply: z.boolean(),
	emblem: z.string()
});

export const ZPlatoon = ZPlatoonSummary.extend({
	members: z.array(
		z.object({
			id: z.string(),
			name: z.string(),
			avatar: z.string(),
			role: z.enum(["General", "Colonel", "Lieutenant", "Private", "Unknown"])
		})
	),
	servers: z.array(z.never())
});

export const ZPlayerGames = z.object({
	reports: z
		.object({
			gameReportId: z.string(),
			timestamp: z.number(),
			mapKey: z.string(),
			modeKey: z.string(),
			serverName: z.string()
		})
		.array()
});

// :(
export const ZGameReport = z.object({
	id: z.string(),
	type: z.literal("bfv_gamereport"),
	children: z.array(
		z.object({
			id: z.string(),
			type: z.literal("team"),
			children: z.array(
				z.object({
					id: z.string(),
					type: z.literal("player-entry"),
					children: z.array(
						z.object({
							id: z.string(),
							type: z.string(),
							children: z.null(),
							metadata: z.object({
								name: z.string(),
								description: z.nullable(z.string()),
								imageUrl: z.nullable(z.string().url()),
								categoryKey: z.string(),
								categoryName: z.string()
							}),
							stats: z.array(
								z.object({
									metadata: z.object({
										key: z.string(),
										name: z.string(),
										description: z.nullable(z.string()),
										categoryKey: z.string(),
										categoryName: z.string(),
										isReversed: z.boolean(),
										iconUrl: z.nullable(z.string().url()),
										color: z.nullable(z.string()),
										value: z.nullable(z.union([z.string(), z.number()])),
										displayValue: z.nullable(z.union([z.string(), z.number()]))
									}),
									percentile: z.nullable(z.union([z.string(), z.number()])),
									rank: z.nullable(z.union([z.string(), z.number()])),
									displayPercentile: z.nullable(z.union([z.string(), z.number()])),
									displayRank: z.nullable(z.union([z.string(), z.number()])),
									description: z.nullable(z.string()),
									value: z.nullable(z.union([z.string(), z.number()])),
									displayValue: z.nullable(z.union([z.string(), z.number()]))
								})
							),
							expiryDate: z.string().datetime({ offset: true })
						})
					),
					metadata: z.object({
						name: z.string(),
						platformSlug: z.string(),
						platformId: z.number(),
						timePlayed: z.number()
					}),
					stats: z.array(
						z.object({
							metadata: z.object({
								key: z.string(),
								name: z.string(),
								description: z.nullable(z.string()),
								categoryKey: z.string(),
								categoryName: z.string(),
								isReversed: z.boolean(),
								iconUrl: z.nullable(z.string().url()),
								color: z.nullable(z.string()),
								value: z.nullable(z.union([z.string(), z.number()])),
								displayValue: z.nullable(z.union([z.string(), z.number()]))
							}),
							percentile: z.nullable(z.union([z.string(), z.number()])),
							rank: z.nullable(z.union([z.string(), z.number()])),
							displayPercentile: z.nullable(z.union([z.string(), z.number()])),
							displayRank: z.nullable(z.union([z.string(), z.number()])),
							description: z.nullable(z.string()),
							value: z.nullable(z.union([z.string(), z.number()])),
							displayValue: z.nullable(z.union([z.string(), z.number()]))
						})
					),
					expiryDate: z.string().datetime({ offset: true })
				})
			),
			metadata: z.object({
				name: z.string(),
				isWinner: z.boolean()
			}),
			stats: z.null(),
			expiryDate: z.string().datetime({ offset: true })
		})
	),
	metadata: z.object({
		timestamp: z.number().int().positive(),
		duration: z.number().positive(),
		mapKey: z.string(),
		map: z.object({
			title: z.string(),
			type: z.string(),
			key: z.string(),
			locale: z.literal("en-US"),
			name: z.string(),
			description: z.nullable(z.string()),
			imageUrl: z.nullable(z.string().url()),
			location: z.string()
		}),
		modeKey: z.string(),
		mode: z.object({
			title: z.string(),
			type: z.string(),
			key: z.string(),
			locale: z.literal("en-US"),
			name: z.string(),
			description: z.nullable(z.string()),
			imageUrl: z.nullable(z.string().url())
		}),
		serverName: z.string(),
		serverMod: z.string(),
		serverType: z.string(),
		serverMaxClientCount: z.number().int().positive(),
		isRanked: z.boolean()
	}),
	stats: z.null(),
	expiryDate: z.string().datetime({ offset: true })
});
