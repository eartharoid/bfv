import { z } from "zod";

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
