import type { PlayerGames, TRNPlatform } from "$lib/types.js";
import { ls, readFile, writeFile } from "$lib/s3";
import { createError } from "$lib/api-error";
import { asJSON } from "$lib/headers.js";
import { checkAuthorisation, getAuthentication } from "$lib/auth.js";
import { ZPlayerGames } from "$lib/schemas.js";
import { json } from "@sveltejs/kit";

/** @type {import('./$types').RequestHandler} */
export async function GET({ params, setHeaders }) {
	const { platform, player: playerName } = params;
	const key = `${platform}/players/${playerName}/games.json`;
	setHeaders({ "Cache-Control": "public, max-age=3600" });
	try {
		const data = <ReadableStream<PlayerGames> | null>await readFile(key, { as: "stream" });
		if (!data) return createError(404, "No data");
		return asJSON(data);
	} catch (error) {
		if (error instanceof Error && error.name === "NoSuchKey")
			return createError(404, "Player not found");
		throw error;
	}
}

/** @type {import('./$types').RequestHandler} */
export async function PUT({ request, params }) {
	const { platform, player: playerName } = params;

	// only allow authorised users to write data
	const auth = await getAuthentication(request);
	if (!auth) return createError(401);
	const against = {
		type: "player" as const,
		id: playerName,
		platform: <TRNPlatform>params.platform
	};
	if (!(await checkAuthorisation(against, auth))) return createError(403);

	const parsed = ZPlayerGames.safeParse(await request.json());
	if (!parsed.success) return createError(400, parsed.error.issues);
	const data: PlayerGames = Object.assign(
		{
			// this could have been done with S3 Object LastModified and Metadata,
			// but this way makes decoupling from S3 easier
			// and allows readFile to abstract more
			$metadata: {
				lastUpdatedAt: new Date().toISOString(),
				lastUpdatedBy: auth.sub
			}
		},
		parsed.data
	);

	const { objects } = await ls(`${platform}/games/`);
	const allPlatformGames = objects.map(({ Key }) => Key?.split("/")[2].split("-")[1].split(".")[0]); // remove folders, prefix, extension

	data.reports = data.reports.sort((a, b) => b.timestamp - a.timestamp);
	const missing = data.reports
		.filter((report) => !allPlatformGames.includes(report.gameReportId))
		.map((report) => report.gameReportId);

	const key = `${platform}/players/${playerName}/games.json`;
	const file = await readFile(key, { as: "string" });
	
	// don't nuke existing data
	if (file) {
		const { reports }: PlayerGames = JSON.parse(<string>file);
		if (data.reports.length < reports.length) return createError(409);
	}

	await writeFile(key, JSON.stringify(data));

	return json({ missing });
}
